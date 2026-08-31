/**
 * Field labels per Gebruikersinvoer-groep, gedeeld tussen de wizard-stappen (invoer) en
 * StepOverzicht (samenvatting), zodat labels maar op één plek onderhouden hoeven te worden.
 */

export const WONINGGEGEVENS_FIELDS = [
  { name: "gebruiksoppervlakte", label: "Gebruiksoppervlakte (m²)" },
  { name: "woz_waarde", label: "WOZ-waarde (€)" },
  { name: "woz_peildatum_jaar", label: "WOZ-peildatum (jaar)" },
  { name: "energielabel_klasse", label: "Energielabel" },
] as const

export const BADKAMER_FIELDS = [
  { name: "badkamer_aantal_adressen", label: "Aantal badkamers" },
  { name: "badkamer_toilet_hangend", label: "Hangend toilet" },
  { name: "badkamer_toilet_normaal", label: "Normaal toilet" },
  { name: "badkamer_wastafel", label: "Wastafel" },
  { name: "badkamer_meerpersoons_wastafel", label: "Meerpersoons wastafel" },
  { name: "badkamer_douche", label: "Douche" },
  { name: "badkamer_bad", label: "Bad" },
  { name: "badkamer_baddouche", label: "Bad/douche combinatie" },
  { name: "badkamer_bubbelfunctie_bad", label: "Bubbelfunctie bad" },
  {
    name: "badkamer_volledige_afscheiding_douche",
    label: "Volledige afscheiding douche",
  },
  { name: "badkamer_handdoekenradiator", label: "Handdoekenradiator" },
  { name: "badkamer_kast_bij_wastafel", label: "Kast bij wastafel" },
  { name: "badkamer_kastruimte", label: "Kastruimte" },
  { name: "badkamer_stopcontacten", label: "Stopcontacten" },
  { name: "badkamer_eenhandsmengkraan", label: "Eenhandsmengkraan" },
  {
    name: "badkamer_thermostatische_mengkraan",
    label: "Thermostatische mengkraan",
  },
] as const

export const APART_TOILET_FIELDS = [
  { name: "apart_toilet_staand", label: "Apart toilet, staand" },
  { name: "apart_toilet_hangend", label: "Apart toilet, hangend" },
] as const

export const KEUKEN_FIELDS = [
  { name: "keuken_aantal_adressen", label: "Aantal keukens" },
  {
    name: "keuken_aanrechtlengte_meters",
    label: "Aanrechtlengte (meter)",
    step: 0.01,
  },
  {
    name: "keuken_inbouw_afzuiginstallatie",
    label: "Inbouw afzuiginstallatie",
  },
  {
    name: "keuken_inbouw_kookplaat_inductie",
    label: "Inbouw kookplaat, inductie",
  },
  {
    name: "keuken_inbouw_kookplaat_keramisch",
    label: "Inbouw kookplaat, keramisch",
  },
  { name: "keuken_inbouw_kookplaat_gas", label: "Inbouw kookplaat, gas" },
  { name: "keuken_inbouw_koelkast", label: "Inbouw koelkast" },
  { name: "keuken_inbouw_vrieskast", label: "Inbouw vrieskast" },
  { name: "keuken_inbouw_oven_elektrisch", label: "Inbouw oven, elektrisch" },
  { name: "keuken_inbouw_oven_gas", label: "Inbouw oven, gas" },
  { name: "keuken_inbouw_magnetron", label: "Inbouw magnetron" },
  { name: "keuken_inbouw_vaatwasmachine", label: "Inbouw vaatwasmachine" },
  { name: "keuken_extra_kastruimte", label: "Extra kastruimte" },
  { name: "keuken_eenhandsmengkraan", label: "Eenhandsmengkraan" },
  {
    name: "keuken_thermostatische_mengkraan",
    label: "Thermostatische mengkraan",
  },
  { name: "keuken_kokendwaterfunctie", label: "Kokendwaterfunctie" },
] as const

export const VERTREKKEN_FIELDS = [
  {
    name: "vertrekken_oppervlakte",
    label: "Totale oppervlakte vertrekken (m²)",
    step: 0.01,
  },
  { name: "vertrekken_1", label: "Oppervlakte vertrek 1 (m²)", step: 0.01 },
  { name: "vertrekken_2", label: "Oppervlakte vertrek 2 (m²)", step: 0.01 },
  { name: "vertrekken_3", label: "Oppervlakte vertrek 3 (m²)", step: 0.01 },
  { name: "vertrekken_4", label: "Oppervlakte vertrek 4 (m²)", step: 0.01 },
  { name: "vertrekken_5", label: "Oppervlakte vertrek 5 (m²)", step: 0.01 },
  { name: "vertrekken_6", label: "Oppervlakte vertrek 6 (m²)", step: 0.01 },
] as const

export const OVERIGE_RUIMTE_FIELDS = [
  {
    name: "overige_ruimte_oppervlakte",
    label: "Totale oppervlakte overige ruimtes (m²)",
    step: 0.01,
  },
  {
    name: "overige_ruimte_1",
    label: "Oppervlakte overige ruimte 1 (m²)",
    step: 0.01,
  },
  {
    name: "overige_ruimte_2",
    label: "Oppervlakte overige ruimte 2 (m²)",
    step: 0.01,
  },
  {
    name: "overige_ruimte_3",
    label: "Oppervlakte overige ruimte 3 (m²)",
    step: 0.01,
  },
  {
    name: "overige_ruimte_4",
    label: "Oppervlakte overige ruimte 4 (m²)",
    step: 0.01,
  },
  {
    name: "overige_ruimte_5",
    label: "Oppervlakte overige ruimte 5 (m²)",
    step: 0.01,
  },
] as const

export const KLIMAAT_FIELDS = [
  {
    name: "verwarming_aantal_vertrekken",
    label: "Verwarming, aantal vertrekken",
  },
  {
    name: "verwarming_aantal_overige_ruimten",
    label: "Verwarming, aantal overige ruimtes",
  },
  {
    name: "verkoeling_aantal_vertrekken",
    label: "Verkoeling, aantal vertrekken",
  },
] as const

export const BUITEN_PARKEREN_FIELDS = [
  {
    name: "buitenruimte_prive_buitenruimte",
    label: "Privé buitenruimte",
  },
  {
    name: "buitenruimte_gemeenschappelijke_buitenruimte",
    label: "Gemeenschappelijke buitenruimte",
  },
  {
    name: "parkeerruimte_gesloten_garage_bij_complex",
    label: "Gesloten garage bij complex",
  },
  {
    name: "parkeerruimte_buiten_bij_complex_met_dak",
    label: "Parkeerruimte buiten bij complex, met dak",
  },
  {
    name: "parkeerruimte_buiten_bij_complex_zonder_dak",
    label: "Parkeerruimte buiten bij complex, zonder dak",
  },
] as const

export const BIJZONDERE_VOORZIENING_FIELDS = [
  {
    name: "bijzondere_voorziening_intercom_met_beeld",
    label: "Intercom met beeld",
  },
  { name: "bijzondere_voorziening_laadpaal", label: "Laadpaal" },
] as const
