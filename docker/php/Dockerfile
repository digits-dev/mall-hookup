# ========= BASE PHP (extensions + SQLSRV) =========
FROM php:8.1-fpm AS php-base

# System deps
RUN apt-get update && apt-get install -y \
    gnupg2 gpg curl unzip git zip \
    apt-transport-https lsb-release ca-certificates \
    libpng-dev libonig-dev libxml2-dev libzip-dev \
    libjpeg-dev libfreetype6-dev libssl-dev \
    unixodbc-dev \
 && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-configure zip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo pdo_mysql zip exif pcntl gd

# SQLSRV (Microsoft ODBC + PHP drivers)
RUN mkdir -p /etc/apt/keyrings \
 && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
 | gpg --dearmor -o /etc/apt/keyrings/microsoft.gpg \
 && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" \
 > /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
 && pecl install pdo_sqlsrv sqlsrv \
 && docker-php-ext-enable pdo_sqlsrv sqlsrv \
 && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www

# ========= PHP DEPENDENCIES (cached, no scripts/autoload) =========
FROM php-base AS composer-deps
WORKDIR /var/www

# Copy only composer manifests for better cache hits
COPY composer.json composer.lock ./

# Install vendors but do NOT run scripts or build autoload yet
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader

# ========= NODE/VITE BUILD =========
FROM node:18 AS node-build
WORKDIR /app

# Install JS deps using the lockfile if present
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i; fi

# Copy the rest and build production assets
COPY . .
RUN npm run build

# ========= FINAL APP IMAGE (PHP-FPM only) =========
FROM php-base AS app
WORKDIR /var/www

# 1) Bring in vendor/ from composer stage
COPY --from=composer-deps /var/www/vendor /var/www/vendor

# 2) Bring in compiled Vite assets (default: public/build)
COPY --from=node-build /app/public/build /var/www/public/build

# 3) Copy the full application source
COPY . .

RUN rm -f public/hot

# 4) Copy your existing .env into the image
#    NOTE: this will only work if .env is NOT excluded by .dockerignore (see note below).
COPY .env .env

# Minimal non-secret defaults (keep your real values in .env)
ARG APP_ENV=production
ARG APP_DEBUG=false
ARG APP_URL=http://localhost
ENV APP_ENV=${APP_ENV} \
    APP_DEBUG=${APP_DEBUG} \
    APP_URL=${APP_URL}

# Build autoload & optimize Laravel
# - Don't overwrite APP_KEY if it's already present/non-empty in .env
RUN composer dump-autoload -o \
 && if grep -q '^APP_KEY=' .env && [ -n "$(grep '^APP_KEY=' .env | cut -d= -f2-)" ]; then \
      echo 'APP_KEY present; skipping key:generate'; \
    else \
      php artisan key:generate --force; \
    fi \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache \
 && chown -R www-data:www-data /var/www \
 && chmod -R 755 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
