import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // any fetch/axios call starting with /api hits http://localhost:4000
      '/api': 'http://localhost:4000'
    }
  },
  build: { outDir: 'dist' }
});
