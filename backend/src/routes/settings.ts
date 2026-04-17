import { Router, type Request, type Response } from 'express'
import type { FeatureFlags } from '../types/featureFlags.js'

const router = Router()

function parseBoolEnv(key: string): boolean {
  return process.env[key] === 'true'
}

router.get('/', (_req: Request, res: Response) => {
  const flags: FeatureFlags = {
    ENABLE_PREMIUM_PRINTS: parseBoolEnv('ENABLE_PREMIUM_PRINTS'),
    ENABLE_COLORING_CLUB: parseBoolEnv('ENABLE_COLORING_CLUB'),
    ENABLE_ACCOUNT_DOWNLOADS: parseBoolEnv('ENABLE_ACCOUNT_DOWNLOADS'),
    ENABLE_NEWSLETTER: parseBoolEnv('ENABLE_NEWSLETTER'),
    ENABLE_WATERMARKS: parseBoolEnv('ENABLE_WATERMARKS'),
    ENABLE_CART: parseBoolEnv('ENABLE_CART'),
    ENABLE_CHECKOUT: parseBoolEnv('ENABLE_CHECKOUT'),
    ENABLE_ARTIST_UPLOADS: parseBoolEnv('ENABLE_ARTIST_UPLOADS'),
    ENABLE_GAMIFICATION: parseBoolEnv('ENABLE_GAMIFICATION'),
    ENABLE_THEME_PLAYFUL: parseBoolEnv('ENABLE_THEME_PLAYFUL'),
    ENABLE_THEME_WHIMSICAL: parseBoolEnv('ENABLE_THEME_WHIMSICAL'),
  }

  res.setHeader('Cache-Control', 'public, max-age=60')
  res.json({ success: true, data: flags })
})

export default router
