import { Router, type Request, type Response, type NextFunction } from 'express'
import { getArtist } from '../services/directus.js'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const artist = await getArtist()

    if (!artist) {
      res.status(404).json({
        success: false,
        error: {
          code: 'ARTIST_NOT_FOUND',
          message: 'No artist record found. Please seed the CMS.',
        },
      })
      return
    }

    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.json({ success: true, data: artist })
  } catch (err) {
    next(err)
  }
})

export default router
