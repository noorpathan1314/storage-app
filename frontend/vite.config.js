import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // 👈 React JSX transform ke liye
    tailwindcss(),  // 👈 Tailwind CSS ke liye
  ],
})