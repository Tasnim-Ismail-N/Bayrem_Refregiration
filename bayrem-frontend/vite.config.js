import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.tsx', '.js', '.ts', '.json'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
