import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), nodePolyfills({ include: ['buffer', 'crypto', 'stream', 'util'] })],
    base:'/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // The ThruBox relay serves no CORS headers, so the browser cannot reach
        // it cross-origin: the preflight for POST /api/messages is rejected and
        // GET responses carry no Access-Control-Allow-Origin. Proxying keeps dev
        // requests same-origin. Production is expected to reach the relay
        // through a reverse proxy that supplies CORS.
        '/relay': {
          target: env.VITE_RELAY_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/relay/, ''),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500
    }
  }
})
