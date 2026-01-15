import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  optimizeDeps: {
    include: [
      'recharts',
      'jspdf',
      'jspdf-autotable',
      'lucide-react'
    ]
  }
})