import type { Request, Response, NextFunction } from 'express'

// Augment Express Request to carry an authenticated user stub
declare global {
  namespace Express {
    interface Request {
      user?: { id: string }
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required. Please provide a valid Bearer token.',
      },
    })
    return
  }

  const token = authHeader.slice(7) // strip "Bearer "

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication token is missing.',
      },
    })
    return
  }

  // TODO: verify JWT with Supabase in Sprint 2
  // const { data, error } = await supabase.auth.getUser(token)
  console.warn('TODO: verify JWT token with Supabase — using stub auth for Sprint 1')

  req.user = { id: 'stub' }
  next()
}
