import { useMemo } from "react"
import { useTokenPayload } from "@/hooks/useTokenPayload"
import { useUsers } from "@/api/hooks"

export const useCurrentUser = () => {
  const decodedToken = useTokenPayload()
  const { data } = useUsers()

  return useMemo(
    () =>
      data?.find(
        (_) =>
          _.username.toLowerCase() === decodedToken?.unique_name.toLowerCase(),
      ),
    [data, decodedToken?.unique_name],
  )
}
