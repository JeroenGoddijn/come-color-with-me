import type { Request, Response, NextFunction } from 'express'

// Express error-handling middleware must have exactly 4 parameters.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error & { status?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status ?? 500
  const code = err.code ?? 'INTERNAL_ERROR'
  const isProduction = process.env['NODE_ENV'] === 'production'

  // Never expose stack traces in production
  const detail = err?.stack ?? err?.message ?? (typeof err === 'object' ? JSON.stringify(err) : String(err))
  console.error('[Error]', detail)

  res.status(status).json({
    success: false,
    error: {
      code,
      message: err.message ?? 'An unexpected error occurred',
    },
  })
}
