# Stage 1: use your PHP app image as a source of /var/www/public
FROM dtcarrabis/laravel-app:1.0.4 AS app

# Stage 2: real nginx image
FROM nginx:stable

# nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# copy the built site (public/*) from the app image into nginx
COPY --from=app /var/www/public /var/www/public
