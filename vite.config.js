import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Allows `import { api } from '@/lib/apiClient'` anywhere in src/
      '@': resolve(import.meta.dirname, 'src'),
    },
  },

  server: {
    port: 5180,
    // Proxy /api/* → Laravel dev server so the SPA avoids CORS in dev
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Warn above 500 kB per chunk (code-split keeps main well below this)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Vendor chunk isolation (rolldown/Vite 8: manualChunks must be a function)
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          if (id.includes('node_modules/@tanstack/')) {
            return 'query';
          }
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform/') ||
            id.includes('node_modules/zod/')
          ) {
            return 'forms';
          }
        },
      },
    },
  },
});
