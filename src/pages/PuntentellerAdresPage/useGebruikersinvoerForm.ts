import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useAddressInvoerwaarden, useSaveGebruikersinvoer } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { findMissingFields } from "./helpers/findMissingFields"
import { mapFormValuesToPayload } from "./helpers/mapFormValuesToPayload"
import { mapInvoerwaardenToFormValues } from "./helpers/mapInvoerwaardenToFormValues"
import { useInitialValues } from "./helpers/useInitialValues"
import { GEEN_MONUMENT } from "./fieldDefinitions"

const defaultValues: GebruikersinvoerFormValues = {
  binnenruimtes: [],
  buitenruimtes: [],

  bouwjaar: null,
  energie_type: "bouwjaar",
  energielabel_klasse: "",
  energie_index: null,
  gebruiksoppervlakte: 0,
  woz_waarde: 0,
  woz_peildatum_jaar: new Date().getFullYear(),
  type_woning: null,
  huidige_huurprijs: null,

  monument: false,
  monument_soort: GEEN_MONUMENT,
  zorgwoning: "false",
  woonvoorziening_handicap: "false",
  woonvoorziening_handicap_netto_investering: "",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
}

type Options = {
  /** Called once the backend has saved the invoer and returned the berekening. */
  onCalculated?: () => void
  /** Called instead of saving while required fields are missing (see findMissingFields). */
  onMissingFields?: () => void
}

export function useGebruikersinvoerForm(
  bagId?: string,
  { onCalculated, onMissingFields }: Options = {},
) {
  const {
    data: invoerwaarden,
    isPending: isInvoerwaardenPending,
    isError,
  } = useAddressInvoerwaarden(bagId)
  const initialValues = useInitialValues()
  const isPending = isInvoerwaardenPending || initialValues.isPending
  const saveGebruikersinvoer = useSaveGebruikersinvoer({ bagId })
  const { showToast } = useToast()
  // The last successful save: its payload (as JSON) to tell whether the form has changed
  // since, and its resultaat, which stays when saving again fails.
  const [lastSave, setLastSave] = useState<{
    payload: string
    resultaat: PuntentellerResultaat
  }>()

  const form = useForm<GebruikersinvoerFormValues>({
    mode: "onChange",
    defaultValues,
  })

  // Fills the form once per address, as soon as everything it starts from has loaded. Each
  // layer wins over the one before: the defaults, the prefilled invoerwaarden (step 0), the
  // initial values (dummydata, later a saved puntentelling). Only once, so a refetch of the
  // invoerwaarden doesn't undo what the user has filled in since.
  const filledInForBagId = useRef<string>(undefined)
  useEffect(() => {
    if (isPending || filledInForBagId.current === bagId) return
    filledInForBagId.current = bagId

    form.reset({
      ...defaultValues,
      ...(invoerwaarden && mapInvoerwaardenToFormValues(invoerwaarden)),
      ...initialValues.values,
    })
  }, [bagId, isPending, invoerwaarden, initialValues.values, form])

  const onSubmit = (values: GebruikersinvoerFormValues) => {
    // handleSubmit only validates the fields of the current step (the resultaat has none).
    if (findMissingFields(values, invoerwaarden).length > 0) {
      onMissingFields?.()
      return
    }

    const payload = mapFormValuesToPayload(values)
    saveGebruikersinvoer.mutate(payload, {
      onSuccess: (resultaat) => {
        setLastSave({ payload: JSON.stringify(payload), resultaat })
        showToast({
          title: "Puntenteller opgeslagen!",
          description: "De invoer is opgeslagen en de punten zijn berekend.",
          severity: "success",
        })
        onCalculated?.()
      },
      onError: () => {
        showToast({
          title: "Opslaan mislukt",
          description:
            "Er is iets misgegaan bij het opslaan en berekenen. Probeer het opnieuw.",
          severity: "error",
        })
      },
    })
  }

  return {
    form,
    invoerwaarden,
    isPending,
    isError,
    onSubmit,
    isSubmitting: saveGebruikersinvoer.isPending,
    resultaat: lastSave?.resultaat,
    savedPayload: lastSave?.payload,
  }
}
