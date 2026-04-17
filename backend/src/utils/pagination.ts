const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export type PaginationParams = {
  page: number
  limit: number
  offset: number
}

export function parsePagination(query: Record<string, string>): PaginationParams {
  const rawPage = parseInt(query['page'] ?? '', 10)
  const rawLimit = parseInt(query['limit'] ?? '', 10)

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : DEFAULT_PAGE
  const limit = Number.isFinite(rawLimit) && rawLimit >= 1
    ? Math.min(rawLimit, MAX_LIMIT)
    : DEFAULT_LIMIT

  const offset = (page - 1) * limit

  return { page, limit, offset }
}
