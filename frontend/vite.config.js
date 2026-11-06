import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const projectDir = fileURLToPath(new URL('.', import.meta.url))
const certFile = (name) => fileURLToPath(new URL(`./certs/${name}`, import.meta.url))

// Optional dev HTTPS: phones/other PCs only get camera + mic on https:// origins.
// Create the files with the command in README ("Testing on other devices").
const loadDevHttps = () => {
  const key = certFile('dev-key.pem')
  const cert = certFile('dev-cert.pem')
  if (!existsSync(key) || !existsSync(cert)) return undefined
  return { key: readFileSync(key), cert: readFileSync(cert) }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectDir, '')
  const backend = env.DEV_BACKEND_URL || 'http://localhost:5001'

  return {
    plugins: [react()],
    server: {
      https: loadDevHttps(),
      // Same-origin API in dev: works from any device and avoids https→http mixed content.
      // Regex keys keep the client-side /auth page served by Vite.
      proxy: {
        '^/users/.+': backend,
        '^/auth/.+': backend,
        '/socket.io': { target: backend, ws: true },
      },
    },
  }
})
