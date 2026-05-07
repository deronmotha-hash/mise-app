import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mise-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mise',
        short_name: 'Mise',
        description: 'Meal planner & grocery app',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/mise-app/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/mise-app/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})