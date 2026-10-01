import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

export const useDaySetting = (daySettingId?: string | number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.daySettings.detail(daySettingId ?? ""),
    queryFn: () =>
      fetch<DaySettings>(
        makeApiUrl("day-settings", daySettingId, "?case-count=true"),
      ),
    enabled: daySettingId !== undefined,
  })
}

export const useDaySettings = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.daySettings.all,
    queryFn: () => fetch<DaySettings[]>(makeApiUrl("day-settings")),
  })
}

/**
 * Day settings are also served via team settings: the team settings page lists
 * them (day_settings_list) and the list create page offers them per weekday.
 * Invalidate every weekday: the form sends week_days as strings (so they don't
 * match the numeric key), and an edit may move a day setting to another day.
 */
const invalidateTeamDaySettings = (
  queryClient: QueryClient,
  teamId: string,
) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.daySettings.all,
    exact: true,
  })
  queryClient.invalidateQueries({
    queryKey: queryKeys.teamSettings.all(teamId),
    exact: true,
  })
  queryClient.invalidateQueries({
    queryKey: queryKeys.teamSettings.allOptions(teamId),
  })
}

type SaveDaySettingOptions = {
  daySettingId?: string | number
  teamId: string
}

export const useSaveDaySetting = ({
  daySettingId,
  teamId,
}: SaveDaySettingOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DaySettingsPayload) =>
      fetch<DaySettings>(
        makeApiUrl("day-settings", daySettingId, "?case-count=true"),
        {
          method: daySettingId ? "PUT" : "POST",
          data: payload,
        },
      ),
    onSuccess: (data) => {
      if (data?.id) {
        // Store the saved day setting (incl. fresh case_count) in the detail cache.
        // Route params are strings, so key by string id to match useDaySetting.
        queryClient.setQueryData(
          queryKeys.daySettings.detail(String(data.id)),
          data,
        )
      }
      invalidateTeamDaySettings(queryClient, teamId)
    },
  })
}

type DeleteDaySettingOptions = {
  daySettingId: number
  teamId: string
}

export const useDeleteDaySetting = ({
  daySettingId,
  teamId,
}: DeleteDaySettingOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetch<unknown>(makeApiUrl("day-settings", daySettingId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: queryKeys.daySettings.detail(String(daySettingId)),
      })
      invalidateTeamDaySettings(queryClient, teamId)
    },
  })
}
