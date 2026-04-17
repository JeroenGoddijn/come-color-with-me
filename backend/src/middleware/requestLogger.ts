import type { Request, Response, NextFunction } from 'express'

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  if (process.env['NODE_ENV'] === 'test') {
    next()
    return
  }

  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const method = req.method.padEnd(6)
    const path = req.originalUrl
    const status = res.statusCode
    console.log(`[${method}] ${path} → ${status} (${duration}ms)`)
  })

  next()
}
