import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // exceljs is inherently ~941KB; it loads lazily on export only
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["motion"],
          "vendor-pdf": ["jspdf", "jspdf-autotable"],
          "vendor-excel": ["exceljs", "file-saver"],
        },
      },
    },
  },
})
