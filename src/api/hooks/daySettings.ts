import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "../types/apiOptions"

export const useDaySettings = (daySettingId?: number, options?: ApiOptions) =>
  useApi<DaySettings>({
    url: makeApiUrl("day-settings", daySettingId),
    lazy: options?.lazy ?? !daySettingId,
  })
