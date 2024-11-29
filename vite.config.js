import { defineConfig } from 'vite';

export default defineConfig({
  root: './dev',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: '../src/index.js',
      formats: ['es'],
      name: 'BinaryWindow',
      fileName: 'bwin',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css') return 'bwin.css';
          return assetInfo.name;
        },
      },
    },
  },
});
