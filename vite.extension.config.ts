import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/apps/extension'),
  publicDir: path.resolve(__dirname, 'public/extension'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-extension'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/apps/extension/popup.html'),
    },
  },
})
