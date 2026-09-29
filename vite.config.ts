import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs allow the production bundle to run from a repository
  // subpath (for example GitHub Pages) instead of assuming the domain root.
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
