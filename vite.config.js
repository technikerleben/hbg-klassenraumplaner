import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon.svg'],
            manifest: {
                name: 'Klassenraumplaner',
                short_name: 'Raumplaner',
                description: 'Maßstäbliche Planung von Klassenräumen',
                theme_color: '#2C3D4C',
                background_color: '#F5F4F1',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
                ]
            }
        })
    ]
});
