import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Havok/WASM necesita COEP+COOP en el documento de /babylonPortfolio.
 * Esos headers en TODAS las rutas bloquean iframes de YouTube en /projects (ERR_BLOCKED_BY_RESPONSE).
 */
function isolationHeadersForBabylonOnly(): Plugin {
  return {
    name: 'isolation-headers-babylon-only',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const r = req as { url?: string; headers: { accept?: string } }
        const path = (r.url ?? '').split('?')[0]
        const accept = r.headers.accept ?? ''
        const isDocument =
          accept.includes('text/html') ||
          path === '/' ||
          path.endsWith('.html')

        const isBabylonDocument =
          isDocument && path.includes('babylonPortfolio')

        if (isBabylonDocument) {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), isolationHeadersForBabylonOnly()],
  optimizeDeps: {
    exclude: ['@babylonjs/havok']
  },
  assetsInclude: ['**/*.wasm'],
})
