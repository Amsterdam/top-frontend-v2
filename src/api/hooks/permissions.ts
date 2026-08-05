import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/api/queryKeys"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type PermissionsResponse = {
  permissions: string[]
}

export const usePermissions = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.permissions.all,
    queryFn: () => fetch<PermissionsResponse>(makeApiUrl("permissions")),
    select: (response) => response.permissions,
  })
}