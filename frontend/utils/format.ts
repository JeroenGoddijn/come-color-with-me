/**
 * Formats a price in cents to a USD string.
 * e.g. 1200 → "$12.00"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Formats an ISO 8601 date string to a locale date string.
 * e.g. "2026-04-14T00:00:00Z" → "April 14, 2026"
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}
