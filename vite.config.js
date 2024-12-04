import { defineConfig } from 'vite';

export default defineConfig({
  root: './dev',
  envDir: '../',
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
