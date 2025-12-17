import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type User = {
  id: string
  name: string
  username: string
  first_name: string
  last_name: string
  email: string
  full_name: string
  team_settings: string[]
}

type UserResponse = {
  results: User[]
}

export const useUsers = () => {
  console.log("Using useUsers hook", makeApiUrl("users"))
  return useApi<UserResponse>({
    url: makeApiUrl("users"),
    lazy: false,
    isProtected: true,
  })
}
