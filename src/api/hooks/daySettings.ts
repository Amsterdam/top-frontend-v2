import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "../types/apiOptions"

export const useDaySetting = (
  daySettingId?: string | number,
  options?: ApiOptions,
) =>
  useApi<DaySettings, DaySettingsPayload>({
    url: makeApiUrl("day-settings", daySettingId, "?case-count=true"),
    lazy: options?.lazy ?? !daySettingId,
  })

export const useDaySettings = (options?: ApiOptions) =>
  useApi<DaySettings[]>({
    ...options,
    url: makeApiUrl("day-settings"),
  })
