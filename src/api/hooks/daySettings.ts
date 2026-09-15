import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
    onSuccess: (_data, variables) => {
      const weekday = variables.week_days?.[0]
      if (weekday !== undefined) {
        // Invalidate the query for the specific team and weekday to ensure fresh data is fetched
        queryClient.invalidateQueries({
          queryKey: queryKeys.teamSettings.options(teamId, weekday),
        })
      }
    },
  })
}

type DeleteDaySettingOptions = {
  daySettingId: number
  teamId: string
  weekday?: number
}

export const useDeleteDaySetting = ({
  daySettingId,
  teamId,
  weekday,
}: DeleteDaySettingOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetch<unknown>(makeApiUrl("day-settings", daySettingId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      if (weekday !== undefined) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.teamSettings.options(teamId, weekday),
        })
      }
    },
  })
}
