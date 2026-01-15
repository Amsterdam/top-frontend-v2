export type ApiError = {
  status?: number
  message: string
  title?: string
  severity?: "error" | "warning" | "info"
}
