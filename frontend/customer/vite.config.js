import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import fs from 'fs'

const spaHtmlCopy = () => ({
  name: 'spa-html-copy',
  closeBundle() {
    const distPath = path.resolve(__dirname, 'dist')
    const indexHtml = path.join(distPath, 'index.html')
    if (!fs.existsSync(indexHtml)) return

    // 1. Always create a 404.html fallback identical to index.html for Vercel SPA routing
    fs.copyFileSync(indexHtml, path.join(distPath, '404.html'))

    // 2. Pre-create exact directories for all known routes to ensure 200 OK from any CDN
    const routes = [
      'admin',
      'login',
      'register',
      'app',
      'customer',
      'features',
      'solutions',
      'pricing',
      'about',
      'contact',
      'careers',
      'partners',
      'demo',
      'resources',
      'security',
      'enterprise-security',
      'privacy',
      'terms',
      'ai-disclaimer',
      'cookie-policy',
      'super-admin',
      'ai-legal-research',
      'judgment-search',
      'document-intelligence',
      'legal-drafting',
      'contract-review',
      'matter-management',
    ]

    routes.forEach((route) => {
      const targetDir = path.join(distPath, route)
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.copyFileSync(indexHtml, path.join(targetDir, 'index.html'))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaHtmlCopy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
    },
  },
})


