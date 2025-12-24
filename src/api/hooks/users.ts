import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type UserResponse = components["schemas"]["PaginatedUserList"]

export const useUsers = () =>
  useApi<UserResponse>({
    url: makeApiUrl("users"),
  })
