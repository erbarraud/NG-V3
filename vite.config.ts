import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  define: {
    global: 'globalThis',
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk - third party libraries
          vendor: ['vue', 'vue-router', 'pinia'],
          
          // UI components chunk
          ui: ['lucide-vue-next', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          
          // Charts chunk - large library
          charts: ['chart.js', 'vue-chartjs'],
          
          // Fabric.js chunk - large library  
          fabric: ['fabric']
        },
        
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? []
          let extType = info[info.length - 1]
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) {
            extType = 'images'
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) {
            extType = 'fonts'
          }
          
          return `assets/${extType}/[name]-[hash][extname]`
        },
        
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  
  // Performance optimizations
  esbuild: {
    drop: ['console', 'debugger'], // Remove console logs in production
  },
  
  plugins: [
    vue(), 
    tailwindcss()
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Development server optimizations
  server: {
    fs: {
      strict: true
    }
  },
  
  // Dependency pre-bundling optimizations
  optimizeDeps: {
    include: [
      'vue',
      'vue-router', 
      'pinia',
      'lucide-vue-next',
      'chart.js',
      'vue-chartjs'
    ],
    exclude: ['fabric'] // Exclude large libraries that don't benefit from pre-bundling
  }
})