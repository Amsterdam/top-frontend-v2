import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import {
  useAddressInvoerwaarden,
  useMaakPuntentellingDefinitief,
  useSavePuntentelling,
} from "@/api/hooks"
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
  const savePuntentelling = useSavePuntentelling(bagId)
  const maakDefinitief = useMaakPuntentellingDefinitief(bagId)
  const navigate = useNavigate()
  const { showToast } = useToast()
  // The last successful save: its payload (as JSON) to tell whether the form has changed
  // since, and its resultaat, which stays when saving again fails.
  const [lastSave, setLastSave] = useState<{
    payload: string
    resultaat: PuntentellerResultaat
  }>()
  // The puntentelling the form saves to: the reopened one, or the one the first save made. Each
  // save after that changes it rather than adding another.
  const [savedId, setSavedId] = useState<number>()
  const puntentellingId = savedId ?? initialValues.puntentelling?.id
  // Whether the saved puntentelling is definitief, as the backend last returned it: saving
  // makes it a concept, "Maak definitief" definitief. None until there's a saved one.
  const [savedCompleted, setSavedCompleted] = useState<boolean>()
  const completed = savedCompleted ?? initialValues.puntentelling?.completed

  const form = useForm<GebruikersinvoerFormValues>({
    mode: "onChange",
    defaultValues,
  })

  // Fills the form once per address, as soon as everything it starts from has loaded. Each
  // layer wins over the one before: the defaults, the prefilled invoerwaarden (step 0), the
  // initial values (dummydata or a saved puntentelling). A saved puntentelling skips the
  // invoerwaarden: it starts from what was saved, not from what the address's data says now.
  // Only once, so a refetch of the invoerwaarden doesn't undo what the user has filled in
  // since, nor does the url changing to the puntentelling after its first save.
  const { puntentelling } = initialValues
  const startValues = useMemo(
    () => ({
      ...defaultValues,
      ...(invoerwaarden &&
        !puntentelling &&
        mapInvoerwaardenToFormValues(invoerwaarden)),
      ...initialValues.values,
    }),
    [invoerwaarden, puntentelling, initialValues.values],
  )
  // During render rather than in an effect, so the steps never render with the defaults:
  // StepWoninggegevens would take the reset's WOZ-peildatum for one the user picked, and
  // overwrite the (saved) WOZ-waarde with the invoerwaarden's.
  const [filledInForBagId, setFilledInForBagId] = useState<string>()
  const isFilledIn = filledInForBagId === bagId
  if (!isPending && !isFilledIn) {
    setFilledInForBagId(bagId)
    form.reset(startValues)
  }

  // A reopened puntentelling starts out saved as it stands, berekening and all, until it's
  // saved again. Its payload is taken from the values the form starts from, so what doesn't
  // make it through the round trip doesn't count as a change.
  const reopenedSave = useMemo(
    () =>
      puntentelling && {
        payload: JSON.stringify(mapFormValuesToPayload(startValues)),
        resultaat: puntentelling.punten_resultaat,
      },
    [puntentelling, startValues],
  )
  const currentSave = lastSave ?? reopenedSave

  const onSubmit = (values: GebruikersinvoerFormValues) => {
    // handleSubmit only validates the fields of the current step (the resultaat has none).
    if (findMissingFields(values, invoerwaarden).length > 0) {
      onMissingFields?.()
      return
    }

    const payload = mapFormValuesToPayload(values)
    savePuntentelling.mutate(
      { id: puntentellingId, payload },
      {
        onSuccess: (puntentelling) => {
          setLastSave({
            payload: JSON.stringify(payload),
            resultaat: puntentelling.punten_resultaat,
          })
          setSavedCompleted(puntentelling.completed)
          if (puntentellingId === undefined) {
            setSavedId(puntentelling.id)
            // The url now names the new puntentelling, so reloading reopens it. `replace`, so
            // going back doesn't land on an empty new one.
            navigate(`/puntenteller/${bagId}/${puntentelling.id}`, {
              replace: true,
            })
          }
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
      },
    )
  }

  const onMaakDefinitief = () => {
    if (puntentellingId === undefined) return

    maakDefinitief.mutate(puntentellingId, {
      onSuccess: ({ completed }) => {
        setSavedCompleted(completed)
        showToast({
          title: "Puntentelling definitief gemaakt",
          description: "De puntentelling is niet langer een concept.",
          severity: "success",
        })
      },
      onError: () => {
        showToast({
          title: "Definitief maken mislukt",
          description:
            "Er is iets misgegaan bij het definitief maken. Probeer het opnieuw.",
          severity: "error",
        })
      },
    })
  }

  return {
    form,
    invoerwaarden,
    /** Whether the form is still waiting for its start values. */
    isPending: isPending || !isFilledIn,
    isError,
    /** Whether the saved puntentelling in the url couldn't be fetched. */
    isPuntentellingError: Boolean(initialValues.isError),
    /** The saved puntentelling the form changes; none for a new one until it's saved. */
    puntentellingId,
    /** Whether the saved puntentelling is definitief; none for a new one until it's saved. */
    completed,
    onSubmit,
    isSubmitting: savePuntentelling.isPending,
    onMaakDefinitief,
    isMakingDefinitief: maakDefinitief.isPending,
    resultaat: currentSave?.resultaat,
    savedPayload: currentSave?.payload,
  }
}
