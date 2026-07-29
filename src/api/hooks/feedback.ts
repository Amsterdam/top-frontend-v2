import { useMutation } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type FeedbackPayload = {
  feedback: string
  url: string
  user_agent: string
  screen: string
}

export const useSendFeedback = () => {
  const fetch = useApiFetch()

  return useMutation({
    mutationFn: (feedback: string) =>
      fetch<unknown>(makeApiUrl("feedback"), {
        method: "POST",
        data: {
          feedback,
          url: window.location.href,
          user_agent: navigator.userAgent,
          screen: `${window.innerWidth}x${window.innerHeight}`,
        } satisfies FeedbackPayload,
      }),
  })
}
