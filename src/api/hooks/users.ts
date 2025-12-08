import { useApi } from "../useApi"

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

export const useUsers = () => useApi<UserResponse>("users")
