import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/v3': {
        target: 'http://192.168.111.132:8082/processing',
        changeOrigin: true,
        rewrite: (path) => {
          // Handle image URLs specially
          if (path.includes('/images/board/')) {
            return path.replace('/api/v3/images/board/', '/ui/images/render/board/')
          }
          
          // Convert modern pagination params to legacy format for boards endpoint
          if (path.includes('/boards') && path.includes('?')) {
            path = path.replace(/[?&]page=(\d+)/g, (match, p1) => match.replace(`page=${p1}`, `pageNumber=${p1}`))
            path = path.replace(/[?&]limit=(\d+)/g, (match, p1) => match.replace(`limit=${p1}`, `pageSize=${p1}`))
          }
          
          // Map v3 endpoints to legacy endpoints
          const mappings = {
            '/api/v3/orders': '/batches',
            '/api/v3/boards': '/boards',
            '/api/v3/grades': '/grades',
            '/api/v3/species': '/species',
            '/api/v3/thickness': '/thicknessValues'
          }
          
          for (const [v3Path, legacyPath] of Object.entries(mappings)) {
            if (path.startsWith(v3Path)) {
              return path.replace(v3Path, legacyPath)
            }
          }
          
          // Default: strip /api/v3 prefix
          return path.replace(/^\/api\/v3/, '')
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('v3 proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('V3 API Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('V3 API Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/legacy': {
        target: 'http://192.168.111.132:8082/processing',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/legacy/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy for clean images from nginx (port 80)
      '/gateway': {
        target: 'http://192.168.111.132',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('gateway proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Gateway Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Gateway Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['lucide-vue-next', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          charts: ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})