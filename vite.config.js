import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600, // Phaser ocupa ~1,5 MB por sí solo
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: 'index.html',
        game: 'taller3/index.html'
      }
    }
  }
});
