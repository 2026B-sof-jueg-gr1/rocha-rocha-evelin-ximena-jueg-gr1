import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: 'index.html',
        game: 'taller3/index.html'
      }
    }
  }
});
