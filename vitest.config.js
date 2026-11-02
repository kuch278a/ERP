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
        'src/**/*.{test,spec}.{js,jsx}',
        'src/test/**',
        'src/main.jsx',
        'src/data/**',
        // Views and the App shell are exercised by Playwright E2E, not unit tests.
        'src/views/**',
        'src/App.jsx',
      ],
      // Floor for the tested layers; ratchet toward the 80% target (docs/PLAN.md §L5).
      thresholds: {
        statements: 58,
        branches: 32,
        functions: 48,
        lines: 60,
      },
    },
  },
});
