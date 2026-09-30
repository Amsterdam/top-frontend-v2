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
    onSuccess: (data) => {
      if (data?.id) {
        // Store the saved day setting (incl. fresh case_count) in the detail cache.
        // Route params are strings, so key by string id to match useDaySetting.
        queryClient.setQueryData(
          queryKeys.daySettings.detail(String(data.id)),
          data,
        )
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.daySettings.all,
        exact: true,
      })
      // Invalidate the options of every weekday: the form sends week_days as
      // strings (so they don't match the numeric key), and an edit may have
      // moved the day setting away from its previous weekday.
      queryClient.invalidateQueries({
        queryKey: queryKeys.teamSettings.allOptions(teamId),
      })
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
