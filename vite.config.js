import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base public path when served in development or production
  base: './',

  // Build configuration
  build: {
    // Output directory for production build
    outDir: 'dist',

    // Generate sourcemaps for production debugging
    sourcemap: true,

    // Rollup options for advanced bundling
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          // Separate React vendor bundle
          'react-vendor': ['react', 'react-dom'],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2/.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Chunk size warning limit (500 KB)
    chunkSizeWarningLimit: 500,
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    open: true, // Auto-open browser on dev server start
    host: true, // Listen on all addresses
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    open: true,
  },

  // CSS configuration
  css: {
    modules: {
      // CSS Modules naming pattern
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
