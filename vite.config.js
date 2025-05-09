import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shopify/polaris': path.resolve(__dirname, 'node_modules/@shopify/polaris')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'polaris': ['@shopify/polaris']
        }
      }
    },
    cssMinify: false // Disable CSS minification
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-calc')({
          preserve: true,
          warnWhenCannotResolve: true,
          mediaQueries: true,
          selectors: true
        }),
        require('postcss-custom-properties')({
          preserve: true
        }),
        require('autoprefixer')(),
        require('postcss-nested')()
      ]
    }
  }
}); 


