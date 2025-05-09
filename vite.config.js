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
}); 