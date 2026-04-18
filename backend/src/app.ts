import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { publicRateLimiter } from './middleware/rateLimiter.js'
import settingsRouter from './routes/settings.js'
import artistRouter from './routes/artist.js'
import galleryRouter from './routes/gallery.js'
import homepageRouter from './routes/homepage.js'

const app = express()

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

const rawOrigins = process.env['CORS_ORIGIN'] ?? 'http://localhost:3000'
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean)

app.use(cors({
  origin: (requestOrigin, callback) => {
    // Allow server-to-server requests (no Origin header) and matched origins
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${requestOrigin} not allowed`))
    }
  },
  optionsSuccessStatus: 200,
}))

app.use(express.json())
app.use(requestLogger)
app.use(publicRateLimiter)

// ---------------------------------------------------------------------------
// Health check — no auth, no rate limit recorded separately
// ---------------------------------------------------------------------------

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  })
})

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.use('/api/settings', settingsRouter)
app.use('/api/artist', artistRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/homepage', homepageRouter)

// ---------------------------------------------------------------------------
// Error handler — must be last
// ---------------------------------------------------------------------------

app.use(errorHandler)

export default app
