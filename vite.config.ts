import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    // editor-vendor (TipTap + lowlight) is lazy-loaded only on the skill editor
    // route, so a >500kB chunk there does not hurt initial render.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@tiptap') || id.includes('lowlight') || id.includes('highlight.js')) {
            return 'editor-vendor';
          }
          if (id.includes('react-router')) return 'router-vendor';
          if (id.includes('@tanstack')) return 'query-vendor';
          if (id.includes('react-dom') || id.match(/[\\/]react[\\/]/)) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
