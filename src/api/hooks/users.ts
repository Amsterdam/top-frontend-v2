import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type UserResponse = components["schemas"]["PaginatedUserList"]

export const useUsers = () =>
  useApi<UserResponse>({
    url: makeApiUrl("users"),
  })
