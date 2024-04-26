export type ApiResponse<T> = T & {
  error?: string,
  success?: boolean,
}