import { defineConfig } from 'vite';

// Build exclusivo para itch.io: solo el juego, con su index.html en la raíz
// de la carpeta, que es lo que itch.io exige para juegos HTML5.
export default defineConfig({
  root: 'taller3',
  base: './',
  publicDir: false,
  build: {
    outDir: '../dist-itch',
    chunkSizeWarningLimit: 1600,
    emptyOutDir: true
  }
});
