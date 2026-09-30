// src/pages/DaySettingsPage/useDaySettingsForm.tsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"
import { useDaySetting, useSaveDaySetting, useTheme } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { NO_OPENING_DATE } from "@/shared/constants/daySettings"
import {
  hasPostalCodeOverlap,
  ALLOWED_POSTAL_CODE_RANGES,
} from "./form/postalCodeRangeValidation"
import type { FormValues } from "./types"

type Options = {
  themeId: string
  dayOfWeek?: string
  daySettingsId?: string
  onSuccess?: (id: number) => void
}

export function useDaySettingsForm({
  themeId,
  dayOfWeek,
  daySettingsId,
  onSuccess,
}: Options) {
  const { data: theme } = useTheme(themeId)
  const { data: daySetting } = useDaySetting(daySettingsId)
  const saveDaySetting = useSaveDaySetting({
    daySettingId: daySettingsId,
    teamId: themeId,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      team_settings: themeId,
      opening_date: "",
      postal_code_ranges: ALLOWED_POSTAL_CODE_RANGES,
      postal_codes_type: "stadsdeel",
      week_days: dayOfWeek ? [dayOfWeek] : [],
      name: "",
      reasons: [],
      project_ids: [],
      subjects: [],
      tags: [],
      state_types: [],
      day_segments: [],
      week_segments: [],
      priorities: [],
      districts: [],
    },
  })

  // If editing, populate form with existing data
  useEffect(() => {
    if (!daySetting) return

    const toStringArray = (arr?: number[] | null) => (arr ?? []).map(String)
    const hasDistricts = daySetting.districts && daySetting.districts.length > 0
    const isHousingCorporationTheme = daySetting.team_settings?.id === 5

    const openingDate = daySetting.opening_date
      ? dayjs(daySetting.opening_date).format("YYYY-MM-DD")
      : ""

    form.reset({
      opening_date: openingDate === NO_OPENING_DATE ? "" : openingDate,
      postal_codes_type: hasDistricts ? "stadsdeel" : "postcode",
      ...(hasDistricts
        ? { districts: toStringArray(daySetting.districts) }
        : {
            postal_code_ranges:
              daySetting.postal_code_ranges ?? ALLOWED_POSTAL_CODE_RANGES,
          }),
      week_days: daySetting.week_days ? [String(daySetting.week_days[0])] : [],
      name: daySetting.name ?? "",
      reasons: toStringArray(daySetting.reasons),
      project_ids: toStringArray(daySetting.project_ids),
      subjects: toStringArray(daySetting.subjects),
      tags: toStringArray(daySetting.tags),
      state_types: toStringArray(daySetting.state_types),
      day_segments: toStringArray(daySetting.day_segments),
      week_segments: toStringArray(daySetting.week_segments),
      priorities: toStringArray(daySetting.priorities),
      ...(isHousingCorporationTheme && {
        housing_corporations: toStringArray(
          daySetting.housing_corporations ?? [],
        ),
        housing_corporation_combiteam:
          daySetting.housing_corporation_combiteam === true
            ? "true"
            : daySetting.housing_corporation_combiteam === false
              ? "false"
              : "",
      }),
    })
  }, [daySetting, form])

  const onSubmit = async (values: FormValues) => {
    if (hasPostalCodeOverlap(values.postal_code_ranges)) return

    setIsLoading(true)
    const payload = { ...values } as unknown as DaySettingsPayload
    payload.opening_date = values.opening_date || NO_OPENING_DATE
    if (values.housing_corporation_combiteam === "true") {
      payload.housing_corporation_combiteam = true
    } else if (values.housing_corporation_combiteam === "false") {
      payload.housing_corporation_combiteam = false
    } else {
      payload.housing_corporation_combiteam = null
    }
    if (values.postal_codes_type === "stadsdeel") {
      payload.postal_code_ranges = []
    } else {
      payload.districts = []
    }

    saveDaySetting.mutate(payload, {
      onSuccess: (res) => {
        if (res?.id) {
          const count = res.case_count?.count
          const action = daySettingsId ? "bijgewerkt" : "aangemaakt"

          let countText: React.ReactNode = null
          if (count !== undefined) {
            if (count === 0) {
              countText = " Er zijn geen bezoeken beschikbaar."
            } else {
              const noun = count === 1 ? "bezoek" : "bezoeken"
              const verb = count === 1 ? "is" : "zijn"
              countText = (
                <>
                  {` Er ${verb} `}
                  <strong>
                    {count} {noun}
                  </strong>{" "}
                  beschikbaar.
                </>
              )
            }
          }

          showToast({
            title: "Daginstelling opgeslagen!",
            description: (
              <>
                De daginstelling is succesvol {action}.{countText}
              </>
            ),
            severity: "success",
          })
          onSuccess?.(res.id)
        }
      },
      onError: () => {
        showToast({
          title: "Opslaan mislukt",
          description:
            "De daginstelling kon niet worden opgeslagen. Probeer het opnieuw.",
          severity: "error",
        })
      },
      onSettled: () => {
        setTimeout(() => setIsLoading(false), 350)
      },
    })
  }

  return {
    form,
    theme,
    daySetting,
    onSubmit,
    isLoading: isLoading || saveDaySetting.isPending,
  }
}
