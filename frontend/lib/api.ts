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
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const url = `${base}${path}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    next: { revalidate: 300, ...options?.next },
    ...options,
  })

  const json = await res.json()

  if (!json.success) {
    throw new ApiError(
      json.error?.code ?? 'UNKNOWN_ERROR',
      json.error?.message ?? 'An unexpected error occurred',
      res.status
    )
  }

  return json.data as T
}
