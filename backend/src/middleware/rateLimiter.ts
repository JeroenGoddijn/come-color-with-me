import rateLimit from 'express-rate-limit'
import type { Request, Response } from 'express'

export const publicRateLimiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '60000', 10),
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    })
  },
})
