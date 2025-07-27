// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Make sure to import 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps '@' to the 'src' directory inside your client folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  // You might also need this if your index.html is directly in 'client/'
  // and main.tsx is in 'client/src'. Vite typically handles it,
  // but if you run into issues later, check base.
  // base: './',
});
