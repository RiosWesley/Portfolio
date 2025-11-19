import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multi-page build configuration
const htmlFiles = {
  index: resolve(__dirname, 'index.html'),
  'landing-pages': resolve(__dirname, 'landing-pages.html'),
  'creative-studio': resolve(__dirname, 'creative-studio.html'),
  'luxury-restaurant': resolve(__dirname, 'luxury-restaurant.html'),
};

export default defineConfig({
  publicDir: 'public',
  server: {
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: htmlFiles,
      output: {
        manualChunks: {
          'three': ['three'],
          'lenis': ['@studio-freight/lenis'],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

