// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Đảm bảo có dòng này
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Đảm bảo có dòng này
  ],

  server: {
    allowedHosts: [
    ]
    
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <-- Đảm bảo có alias này
    },
  },
})