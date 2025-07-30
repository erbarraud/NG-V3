import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    vue(), 
    tailwindcss(),
    {
      name: 'force-exit-on-build-complete',
      closeBundle() {
        if (!process.env.ROLLUP_WATCH) {
          // Force exit after a short delay to ensure all processes complete
          setTimeout(() => {
            console.log('Build complete. Exiting...')
            process.exit(0)
          }, 100)
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})