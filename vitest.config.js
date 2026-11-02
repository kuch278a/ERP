import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        'src/test/**',
        'src/main.jsx',
        'src/data/**',
        // Views, the App shell, and integration wiring are exercised by Playwright E2E.
        'src/views/**',
        'src/App.jsx',
        'src/components/ViewRouter.jsx',
        'src/components/ModalRouter.jsx',
        'src/components/Sidebar.jsx',
        'src/components/Topbar.jsx',
        'src/components/ProjectDetailModal.jsx',
        'src/components/PrintableInvoiceModal.jsx',
        'src/components/DocTypeInspectorModal.jsx',
        'src/hooks/useEstate.js',
        'src/hooks/useUiState.js',
        'src/hooks/useOverlayState.js',
      ],
      // Floor for the unit-tested layers; ratchet toward the 80% target (docs/PLAN.md §L5).
      thresholds: {
        statements: 70,
        branches: 50,
        functions: 62,
        lines: 72,
      },
    },
  },
});
