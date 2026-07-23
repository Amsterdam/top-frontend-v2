import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

type UserResponse = components["schemas"]["PaginatedUserList"]

export const useUsers = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => fetch<UserResponse>(makeApiUrl("users")),
  })
}
