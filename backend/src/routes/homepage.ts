import { Router, type Request, type Response, type NextFunction } from 'express'
import {
  getHomepageSettings,
  getFeaturedArtwork,
  getJustAddedArtwork,
  getArtist,
} from '../services/directus.js'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [settings, featuredArtwork, justAddedArtwork, artist] = await Promise.all([
      getHomepageSettings(),
      getFeaturedArtwork(),
      getJustAddedArtwork(),
      getArtist(),
    ])

    const directusUrl = process.env['DIRECTUS_URL'] ?? 'http://localhost:8055'
    const heroBackgroundImage = settings.hero_background_image
      ? `${directusUrl}/assets/${settings.hero_background_image}`
      : '/assets/hero-background.svg'

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    res.json({
      success: true,
      data: {
        heroHeadline: settings.hero_headline,
        heroSubheadline: settings.hero_subheadline,
        heroBackgroundImage,
        primaryCTA: {
          label: settings.primary_cta_label,
          href: settings.primary_cta_href,
        },
        secondaryCTA: {
          label: settings.secondary_cta_label,
          href: settings.secondary_cta_href,
        },
        featuredArtwork,
        justAddedArtwork,
        activeTheme: settings.active_theme,
        artist,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
