import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://vital-nana-fieldz-11e3f995.koyeb.app',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'https://vital-nana-fieldz-11e3f995.koyeb.app',
        changeOrigin: true,
      },
      
    }
  }
})
