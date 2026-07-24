import type { ApiError } from "@/api/types/apiError"

export const normalizeApiError = (error: unknown): ApiError =>
  (error as ApiError)?.status
    ? (error as ApiError)
    : {
        status: 500,
        message:
          (error as Error)?.message || "Er is een onverwachte fout opgetreden.",
        ...(typeof error === "object" && error !== null ? error : {}),
      }
