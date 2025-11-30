import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://prime-cherida-fieldzz-17996b20.koyeb.app',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'https://prime-cherida-fieldzz-17996b20.koyeb.app',
        changeOrigin: true,
      },

    }
  }
})
