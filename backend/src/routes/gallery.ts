import { Router, type Request, type Response, type NextFunction } from 'express'
import { getFeaturedArtwork, getJustAddedArtwork } from '../services/directus.js'
import { getGallery, getFinishedArtwork, ValidationError } from '../services/artwork.js'
import { parsePagination } from '../utils/pagination.js'
import type { GalleryFilters } from '../services/artwork.js'

const router = Router()

// GET /api/gallery/featured
router.get('/featured', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const artwork = await getFeaturedArtwork()
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.json({ success: true, data: artwork })
  } catch (err) {
    next(err)
  }
})

// GET /api/gallery/just-added
router.get('/just-added', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const artwork = await getJustAddedArtwork()
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.json({ success: true, data: artwork })
  } catch (err) {
    next(err)
  }
})

// GET /api/gallery/finished
router.get('/finished', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as Record<string, string>
    const { page, limit } = parsePagination(query)
    const { items, total } = await getFinishedArtwork({
      category: query['category'],
      sort: query['sort'],
      page: query['page'],
      limit: query['limit'],
    })

    res.setHeader('Cache-Control', 'public, max-age=300')
    res.json({
      success: true,
      data: items,
      meta: {
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/gallery
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as Record<string, string>
    const { page, limit } = parsePagination(query)

    const filters: GalleryFilters = {
      category: query['category'],
      ageGroup: query['ageGroup'],
      artworkType: query['artworkType'],
      isFree: query['isFree'],
      isPremium: query['isPremium'],
      search: query['search'],
      sort: query['sort'],
      page: query['page'],
      limit: query['limit'],
    }

    const { items, total } = await getGallery(filters)

    res.json({
      success: true,
      data: items,
      meta: {
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      })
      return
    }
    next(err)
  }
})

export default router
