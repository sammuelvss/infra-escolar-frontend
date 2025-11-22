import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite do aviso para 1600kB (o ECharts tem cerca de 1400kB)
    chunkSizeWarningLimit: 1600,
  }
})