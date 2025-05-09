import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@shopify/polaris/build/esm/styles.css',
        '@shopify/polaris/build/styles.css'
      ],
      output: {
        manualChunks: {
          'polaris': ['@shopify/polaris']
        }
      }
    }
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