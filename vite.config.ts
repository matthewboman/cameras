import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
// import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
    // tailwindcss()
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Ignore deprecation warnings from Bootstrap
        // https://github.com/twbs/bootstrap/issues/40962
        silenceDeprecations: ['color-functions', 'global-builtin', 'import']
      },
    }
  },
  // build: {
  //   manifest: true,
  //   outDir: 'public/vite',
  //   rollupOptions: {
  //     input: 'app/frontend/entrypoints/application.tsx'
  //   }
  // }
})
