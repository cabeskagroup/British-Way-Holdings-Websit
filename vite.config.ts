import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Sub-folder the site is served from, e.g. "/British-Way-Holdings-Websit/" on
// GitHub Pages. Defaults to the domain root for local dev and Vercel.
const base = process.env.BASE_PATH || '/'

// Public images are referenced as "/logos/..." throughout src. When the site is
// served from a sub-folder, prefix those paths so they still resolve.
function publicPathBase() {
  return {
    name: 'public-path-base',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (base === '/' || !/\/src\/.*\.tsx?$/.test(id.split('?')[0])) return
      return code.replace(/(["'`])\/logos\//g, `$1${base}logos/`)
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    figmaAssetResolver(),
    publicPathBase(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Polling avoids ETIMEDOUT read errors when the project lives on iCloud Desktop.
  server: {
    host: 'localhost',
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
  },
})
