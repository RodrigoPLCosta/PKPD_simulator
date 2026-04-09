import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/PKPD_simulator/',
  root: '.',
  publicDir: 'public',
  plugins: [
    VitePWA({
      injectRegister: false,
      manifest: false,
      includeAssets: ['manifest.json', 'icons/*.png'],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}']
      }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Single-page build consumed by GitHub Pages and the generated service worker.
    rollupOptions: {
      input: 'index.html'
    }
  }
});
