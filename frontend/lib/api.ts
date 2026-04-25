export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Fetches data from the backend API.
 * Prepends NEXT_PUBLIC_API_URL to the path.
 * Throws ApiError if the response is not successful.
 *
 * Uses Next.js ISR revalidation (300s) by default for server-side calls.
 * Pass `cache: 'no-store'` in options to bypass for dynamic routes.
 *
 * One automatic retry after 5s on transient failures (network error or 5xx).
 * Render's free tier sleeps after 15 min idle; a Vercel build that lands during
 * a keepalive gap would otherwise bake empty arrays into the static homepage
 * for the 300s ISR window.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const url = `${base}${path}`

  async function attempt(): Promise<{ json: ApiResponse; status: number }> {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      next: { revalidate: 300, ...options?.next },
      ...options,
    })
    return { json: (await res.json()) as ApiResponse, status: res.status }
  }

  let result: { json: ApiResponse; status: number }
  try {
    result = await attempt()
    if (!result.json.success && result.status >= 500) throw new Error('5xx')
  } catch {
    await new Promise((r) => setTimeout(r, 5000))
    result = await attempt()
  }

  if (!result.json.success) {
    throw new ApiError(
      result.json.error?.code ?? 'UNKNOWN_ERROR',
      result.json.error?.message ?? 'An unexpected error occurred',
      result.status
    )
  }

  return result.json.data as T
}

type ApiResponse = {
  success: boolean
  data?: unknown
  error?: { code?: string; message?: string }
}
