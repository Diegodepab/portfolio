import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const contactEmail = 'diegodepablo.programa@gmail.com'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'http://localhost:5173'

  return {
    plugins: [
      react(),
      // Dev-only middleware: serve api/chat.ts as a local endpoint so
      // `npm run dev` works without `vercel dev`.
      {
        name: 'api-chat-proxy',
        configureServer(server) {
          // Inject .env vars into process.env so the serverless function
          // can read GROQ_API_KEY (Vite only exposes VITE_* by default)
          for (const [key, value] of Object.entries(env)) {
            if (!process.env[key]) process.env[key] = value
          }

          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            // Collect the request body
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const bodyText = Buffer.concat(chunks).toString('utf-8')

            try {
              // Dynamic import so vite transforms the TS on the fly
              const chatModule = await server.ssrLoadModule(
                path.resolve(fileURLToPath(import.meta.url), '..', 'api', 'chat.ts')
              )
              const handler = chatModule.default

              // Simulate VercelRequest — attach parsed body and minimal headers
              const fakeReq = Object.assign(req, {
                body: bodyText ? JSON.parse(bodyText) : {},
              })

              // Simulate VercelResponse — add .status() and .json() that
              // VercelResponse expects but Node's ServerResponse lacks.
              // Note: do NOT override flushHeaders — Node already has it.
              const fakeRes = Object.assign(res, {
                status(code: number) { res.statusCode = code; return fakeRes },
                json(data: unknown) {
                  if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(data))
                  }
                  return fakeRes
                },
              })

              await handler(fakeReq, fakeRes)
            } catch (err) {
              console.error('[api-chat-proxy]', err)
              if (!res.headersSent) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Internal dev proxy error' }))
              }
            }
          })
        },
      },
    ],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
                priority: 20,
              },
              {
                name: 'ui-vendor',
                test: /node_modules[\\/](motion|framer-motion|lucide-react|react-icons)[\\/]/,
                priority: 15,
              },
              {
                name: 'vendor',
                test: /node_modules/,
                priority: 10,
                maxSize: 300_000,
              },
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/contact': {
          target: 'https://formsubmit.co',
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: siteUrl,
            Referer: `${siteUrl.replace(/\/$/, '')}/`,
          },
          rewrite: () => `/ajax/${encodeURIComponent(contactEmail)}`,
        },
      },
    },
  }
})

