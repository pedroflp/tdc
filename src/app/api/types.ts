export type ApiError<T> = T & {
  error?: string,
  success?: boolean,
}