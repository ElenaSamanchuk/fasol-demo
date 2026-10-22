import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' — сайт открывается и с GitHub Pages (подпапка), и локально
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
