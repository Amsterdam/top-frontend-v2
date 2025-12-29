import { useUsers } from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"

export type Option = { label: string; value: string }

export function useUserOptions() {
  const [usersData] = useUsers()

  const userOptions: Option[] = usersData
    ? mapToOptions("id", "full_name", usersData.results)
    : []

  return userOptions
}
