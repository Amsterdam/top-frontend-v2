import { useFormContext, useWatch } from "react-hook-form"
import { mapFormValuesToPayload } from "./mapFormValuesToPayload"

/**
 * Whether the form differs from what was last saved, so the resultaat isn't based on it.
 * Compares the payload rather than the form values: that's what the backend calculates with,
 * and a change that's undone counts as saved again. Before the first save (no savedPayload)
 * there is no resultaat to be mistaken about, so that's false too.
 */
export function useHasUnsavedChanges(savedPayload?: string) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const values = useWatch({ control }) as GebruikersinvoerFormValues

  return (
    savedPayload !== undefined &&
    JSON.stringify(mapFormValuesToPayload(values)) !== savedPayload
  )
}
