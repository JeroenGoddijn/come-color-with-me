export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export type PaginatedMeta = {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type PaginatedResponse<T> = {
  success: true
  data: T[]
  meta: PaginatedMeta
}
