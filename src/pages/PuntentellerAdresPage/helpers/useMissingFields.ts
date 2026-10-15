import { useFormContext, useWatch } from "react-hook-form"
import { findMissingFields } from "./findMissingFields"

/** The required fields still missing across all steps, kept up to date as the form changes. */
export function useMissingFields(invoerwaarden?: PuntentellerInvoerwaarden) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const values = useWatch({ control }) as GebruikersinvoerFormValues

  return findMissingFields(values, invoerwaarden)
}
