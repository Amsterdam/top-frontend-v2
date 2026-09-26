import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAddressInvoerwaarden, useSaveGebruikersinvoer } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { mapFormValuesToPayload } from "./helpers/mapFormValuesToPayload"
import { mapInvoerwaardenToFormValues } from "./helpers/mapInvoerwaardenToFormValues"

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
  gemeenschappelijke_binnenruimtes: null,

  monument: false,
  monument_soort: null,
  zorgwoning: "false",
  voorzieningen_voor_mensen_met_handicap: "false",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
}

type Options = {
  /** Called once the backend has saved the invoer and returned the berekening. */
  onCalculated?: () => void
}

export function useGebruikersinvoerForm(
  bagId?: string,
  { onCalculated }: Options = {},
) {
  const {
    data: invoerwaarden,
    isPending,
    isError,
  } = useAddressInvoerwaarden(bagId)
  const saveGebruikersinvoer = useSaveGebruikersinvoer({ bagId })
  const { showToast } = useToast()

  const form = useForm<GebruikersinvoerFormValues>({
    mode: "onChange",
    defaultValues,
  })

  // Fill in the fields that overlap with the prefilled invoerwaarden (step 0) once they
  // arrive, without resetting wizard progress already filled in on other fields.
  useEffect(() => {
    if (!invoerwaarden) return

    const mapped = mapInvoerwaardenToFormValues(invoerwaarden)
    form.setValue("bouwjaar", mapped.bouwjaar)
    form.setValue("gebruiksoppervlakte", mapped.gebruiksoppervlakte)
    form.setValue("woz_waarde", mapped.woz_waarde)
    form.setValue("woz_peildatum_jaar", mapped.woz_peildatum_jaar)
    form.setValue("energie_type", mapped.energie_type)
    form.setValue("energielabel_klasse", mapped.energielabel_klasse)
    form.setValue("energie_index", mapped.energie_index)
  }, [invoerwaarden, form])

  const onSubmit = (values: GebruikersinvoerFormValues) => {
    saveGebruikersinvoer.mutate(mapFormValuesToPayload(values), {
      onSuccess: () => {
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
    resultaat: saveGebruikersinvoer.data,
  }
}
