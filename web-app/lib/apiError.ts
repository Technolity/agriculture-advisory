import axios from 'axios'

type ApiErrorDetail = {
  field?: string
  message?: string
}

type ApiErrorResponse = {
  error?: {
    message?: string
    details?: ApiErrorDetail[]
  }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback
  }

  const details = error.response?.data?.error?.details
  const detailMessage = details?.find((detail) => detail.message)?.message

  if (detailMessage) {
    return detailMessage
  }

  const message = error.response?.data?.error?.message
  if (message) {
    return message
  }

  return fallback
}
