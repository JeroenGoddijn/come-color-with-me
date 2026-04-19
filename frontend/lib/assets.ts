export const ASSETS = {
  logo: '/assets/logo-primary.svg',
  logoIcon: '/assets/logo-icon.svg',
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

/** Full portrait preview for the detail page */
export function artworkPreview(slug: string): string {
  return `/assets/artwork/${slug}-preview.jpg`
}

/** Zoomed detail crop */
export function artworkZoom(slug: string): string {
  return `/assets/artwork/${slug}-zoom.jpg`
}

/** Framed wall mockup */
export function artworkWall(slug: string): string {
  return `/assets/artwork/${slug}-wall.jpg`
}

/**
 * Child-coloring lifestyle photo — requires a photography session.
 * Uncomment slot 4 in app/artwork/[slug]/page.tsx once images are shot and added.
 */
export function artworkColoring(slug: string): string {
  return `/assets/artwork/${slug}-coloring.jpg`
}
