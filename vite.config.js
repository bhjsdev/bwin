import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: './dev',
  envDir: '../',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: '../src/index.js',
      formats: ['es'],
      name: 'BinaryWindow',
      fileName: 'bwin',
    },
  },
});
