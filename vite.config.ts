import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: 'localhost',  // Ensure the dev server is accessible
    strictPort: true,
    port: 5173,  // Change if needed
  },
})
