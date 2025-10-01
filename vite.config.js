import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        host: true,             // Exposes Vite on 0.0.0.0 (Docker accessible)
        port: 5173,             // Match docker-compose
        strictPort: true,
        hmr: {
            host: 'localhost',  // Used by Laravel to connect via WebSocket
        },
    },
    plugins: [
       react({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }), 
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
    ],
});
