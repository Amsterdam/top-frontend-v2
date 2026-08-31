import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAddressInvoerwaarden, useSaveGebruikersinvoer } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { mapInvoerwaardenToFormValues } from "./helpers/mapInvoerwaardenToFormValues"

const defaultValues: GebruikersinvoerFormValues = {
  badkamer_aantal_adressen: 0,
  badkamer_toilet_hangend: 0,
  badkamer_toilet_normaal: 0,
  badkamer_wastafel: 0,
  badkamer_meerpersoons_wastafel: 0,
  badkamer_douche: 0,
  badkamer_bad: 0,
  badkamer_baddouche: 0,
  badkamer_bubbelfunctie_bad: 0,
  badkamer_volledige_afscheiding_douche: 0,
  badkamer_handdoekenradiator: 0,
  badkamer_kast_bij_wastafel: 0,
  badkamer_kastruimte: 0,
  badkamer_stopcontacten: 0,
  badkamer_eenhandsmengkraan: 0,
  badkamer_thermostatische_mengkraan: 0,
  apart_toilet_staand: 0,
  apart_toilet_hangend: 0,

  keuken_aantal_adressen: 0,
  keuken_aanrechtlengte_meters: null,
  keuken_inbouw_afzuiginstallatie: 0,
  keuken_inbouw_kookplaat_inductie: 0,
  keuken_inbouw_kookplaat_keramisch: 0,
  keuken_inbouw_kookplaat_gas: 0,
  keuken_inbouw_koelkast: 0,
  keuken_inbouw_vrieskast: 0,
  keuken_inbouw_oven_elektrisch: 0,
  keuken_inbouw_oven_gas: 0,
  keuken_inbouw_magnetron: 0,
  keuken_inbouw_vaatwasmachine: 0,
  keuken_extra_kastruimte: 0,
  keuken_eenhandsmengkraan: 0,
  keuken_thermostatische_mengkraan: 0,
  keuken_kokendwaterfunctie: 0,

  vertrekken_oppervlakte: null,
  vertrekken_1: 0,
  vertrekken_2: 0,
  vertrekken_3: 0,
  vertrekken_4: 0,
  vertrekken_5: 0,
  vertrekken_6: 0,

  overige_ruimte_oppervlakte: null,
  overige_ruimte_1: 0,
  overige_ruimte_2: 0,
  overige_ruimte_3: 0,
  overige_ruimte_4: 0,
  overige_ruimte_5: 0,

  verwarming_aantal_vertrekken: 0,
  verwarming_aantal_overige_ruimten: 0,
  verkoeling_aantal_vertrekken: 0,

  buitenruimte_prive_buitenruimte: 0,
  buitenruimte_gemeenschappelijke_buitenruimte: 0,
  parkeerruimte_gesloten_garage_bij_complex: 0,
  parkeerruimte_buiten_bij_complex_met_dak: 0,
  parkeerruimte_buiten_bij_complex_zonder_dak: 0,

  energielabel_klasse: "",
  gebruiksoppervlakte: 0,
  woz_waarde: 0,
  woz_peildatum_jaar: new Date().getFullYear(),

  monument: false,
  monument_soort: null,
  bijzondere_voorziening_intercom_met_beeld: 0,
  bijzondere_voorziening_laadpaal: 0,
}

export function useGebruikersinvoerForm(bagId?: string) {
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

  // Vul de velden die overlappen met de vooraf ingevulde invoerwaarden (stap 0) zodra
  // die binnen zijn, zonder al ingevulde wizard-voortgang op andere velden te resetten.
  useEffect(() => {
    if (!invoerwaarden) return

    const mapped = mapInvoerwaardenToFormValues(invoerwaarden)
    form.setValue("gebruiksoppervlakte", mapped.gebruiksoppervlakte)
    form.setValue("woz_waarde", mapped.woz_waarde)
    form.setValue("woz_peildatum_jaar", mapped.woz_peildatum_jaar)
    form.setValue("energielabel_klasse", mapped.energielabel_klasse)
  }, [invoerwaarden, form])

  const onSubmit = (values: GebruikersinvoerFormValues) => {
    saveGebruikersinvoer.mutate(values, {
      onSuccess: () => {
        showToast({
          title: "Puntenteller opgeslagen!",
          description: "De invoer voor dit adres is succesvol opgeslagen.",
          severity: "success",
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
  }
}
