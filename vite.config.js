import { defineConfig } from 'vite';

export default defineConfig({
  base: '/PKPD_simulator/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Produce a single index.html (JS + CSS inlined / bundled)
    rollupOptions: {
      input: 'index.html'
    }
  }
});
