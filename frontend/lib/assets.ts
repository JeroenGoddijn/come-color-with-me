export const ASSETS = {
  logo: '/assets/logo-primary.svg',
  logoWhite: '/assets/logo-white.svg',
  heroBg: '/assets/hero-background.svg',
  artistAvatar: '/assets/artist-avatar.svg',
  watermark: '/assets/watermark.svg',
} as const

/**
 * Returns the path for an artwork thumbnail image.
 * Thumbnails are stored in /public/assets/artwork/[slug]-thumb.jpg
 */
export function artworkThumb(slug: string): string {
  return `/assets/artwork/${slug}-thumb.jpg`
}
