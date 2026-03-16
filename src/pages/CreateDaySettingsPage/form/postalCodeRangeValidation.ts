import { useEffect } from "react"
import { useWatch } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "./types"

/**
 * Defines the allowed postal code ranges that users are permitted to enter.
 * All entered postal code ranges must fall within one of these ranges.
 */
export const ALLOWED_POSTAL_CODE_RANGES = [
  { range_start: 1000, range_end: 1109 },
  { range_start: 1380, range_end: 1384 },
]

/**
 * React hook that performs live validation on postal code ranges inside the form.
 *
 * This hook watches the "postal_code_ranges" field and validates:
 * - Whether each range falls within the allowed postal code ranges
 * - Whether ranges overlap with each other
 *
 * If a validation issue is detected, an error is set on the corresponding row.
 * Errors are automatically cleared and recalculated whenever the ranges change.
 */
export function usePostalCodeValidation(form: UseFormReturn<FormValues>) {
  const watchedRanges = useWatch({
    control: form.control,
    name: "postal_code_ranges",
  })

  useEffect(() => {
    const ranges = watchedRanges || []

    form.clearErrors("postal_code_ranges")

    /**
     * Checks if two numeric ranges overlap.
     */
    const isOverlap = (
      aStart: number,
      aEnd: number,
      bStart: number,
      bEnd: number,
    ) => aStart <= bEnd && bStart <= aEnd

    for (let i = 0; i < ranges.length; i++) {
      const start = Number(ranges[i]?.range_start)
      const end = Number(ranges[i]?.range_end)

      if (isNaN(start) || isNaN(end)) continue

      const inAllowedRange = ALLOWED_POSTAL_CODE_RANGES.some(
        (allowed) => start >= allowed.range_start && end <= allowed.range_end,
      )

      if (!inAllowedRange) {
        form.setError(`postal_code_ranges.${i}`, {
          type: "out_of_bounds",
          message: "Postcode valt buiten de toegestane range.",
        })
      }

      for (let j = i + 1; j < ranges.length; j++) {
        const cStart = Number(ranges[j]?.range_start)
        const cEnd = Number(ranges[j]?.range_end)

        if (isNaN(cStart) || isNaN(cEnd)) continue

        if (isOverlap(start, end, cStart, cEnd)) {
          form.setError(`postal_code_ranges.${i}`, {
            type: "overlap",
            message: `Deze postcode overlapt met rij ${j + 1}.`,
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedRanges])
}

/**
 * Performs a synchronous validation check for postal code ranges.
 *
 * This function is typically used during form submission to ensure that
 * the ranges are valid before sending data to the API.
 *
 * It validates:
 * - The start of a range is not greater than the end
 * - The range falls within the allowed postal code ranges
 * - No ranges overlap with each other
 *
 * Returns true if any validation error is found.
 */
export function hasPostalCodeOverlap(
  ranges: FormValues["postal_code_ranges"] = [],
): boolean {
  const isOverlap = (
    aStart: number,
    aEnd: number,
    bStart: number,
    bEnd: number,
  ) => aStart <= bEnd && bStart <= aEnd

  for (let i = 0; i < ranges.length; i++) {
    const start = Number(ranges[i]?.range_start)
    const end = Number(ranges[i]?.range_end)

    if (isNaN(start) || isNaN(end)) continue

    // Ensure the start of the range is not greater than the end
    if (start > end) {
      return true
    }

    // Ensure the range falls within the allowed postal code ranges
    const inAllowedRange = ALLOWED_POSTAL_CODE_RANGES.some(
      (allowed) => start >= allowed.range_start && end <= allowed.range_end,
    )

    if (!inAllowedRange) {
      return true
    }

    // Check if ranges overlap with each other
    for (let j = i + 1; j < ranges.length; j++) {
      const cStart = Number(ranges[j]?.range_start)
      const cEnd = Number(ranges[j]?.range_end)

      if (isNaN(cStart) || isNaN(cEnd)) continue

      if (isOverlap(start, end, cStart, cEnd)) {
        return true
      }
    }
  }

  return false
}
