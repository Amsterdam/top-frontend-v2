/**
 * Huursegmenten of the Wet betaalbare huur, by puntentotaal.
 * TODO(puntenteller): check these grenzen with the backend/beleidsboek before relying on them.
 */
export const HUURSEGMENTEN = [
  { name: "Sociale huur", from: 0, to: 143 },
  { name: "Middenhuur", from: 144, to: 186 },
  { name: "Vrije sector", from: 187, to: Infinity },
] as const

export type Huursegment = (typeof HUURSEGMENTEN)[number]

/**
 * The huursegment of a puntentotaal. The total is rounded to whole punten first (assumed,
 * like the WWS does), so 143,4 still counts as sociale huur.
 */
export function huursegment(punten: number): Huursegment {
  const rounded = Math.round(punten)
  return (
    HUURSEGMENTEN.find(({ to }) => rounded <= to) ??
    HUURSEGMENTEN[HUURSEGMENTEN.length - 1]
  )
}

type Correctie = {
  label: string
  /** How the correction works, e.g. "× 1,35" or "maximaal 33%"; shown next to the label. */
  note?: string
  /** The effect on the total in punten; negative lowers it. */
  punten: number
}

const factor = (value: number) =>
  `× ${new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 2 }).format(value)}`

const MONUMENT_LABEL: Record<string, string> = {
  rijksmonument: "Rijksmonument",
  gemeentelijk_monument: "Gemeentelijk monument",
  provinciaal_monument: "Provinciaal monument",
  beschermd_stads_of_dorpsgezicht: "Beschermd stads- of dorpsgezicht",
}

/**
 * The corrections the backend applied after adding up the rubrieken, in its own order: WOZ-cap,
 * zorgwoning, monument, nieuwbouw. The response only has their factors and the end result, so
 * each one's effect in punten is worked back from totaal_punten_na_caps.
 */
export function correcties(resultaat: PuntentellerResultaat): Correctie[] {
  const c = resultaat.correcties
  const numberOf = (key: string) => (typeof c[key] === "number" ? c[key] : 0)
  const list: Correctie[] = []

  // WOZ, beleidsboek 2.11.7: the WOZ-punten may make up at most 33% of the total (the
  // 33%-regel). totaal_zonder_woz + woz_na_cap is the total after that cap.
  const naCap =
    "totaal_zonder_woz" in c
      ? numberOf("totaal_zonder_woz") + numberOf("woz_na_cap")
      : resultaat.totaal_punten_bruto
  const capEffect = naCap - resultaat.totaal_punten_bruto
  if (Math.abs(capEffect) >= 0.005) {
    list.push({
      label: "WOZ-punten boven 33%",
      note: "WOZ telt voor maximaal 33% van het totaal mee",
      punten: capEffect,
    })
  }

  // A woning at 187 punten or more before the cap that drops below 187 by it is set to 186.
  const naWoz = c.woz_minimale_waardering_186_toegepast ? 186 : naCap
  if (c.woz_minimale_waardering_186_toegepast) {
    list.push({
      label: "Minimaal 186 punten",
      note: "Door de 33%-regel zakt de woning niet verder dan 186 punten",
      punten: naWoz - naCap,
    })
  }

  // Work back from the end result: first undo nieuwbouw, then monument.
  const nieuwbouwFactor = c.nieuwbouw_toegepast
    ? numberOf("nieuwbouw_huurprijsopslag_factor") || 1
    : 1
  const voorNieuwbouw = resultaat.totaal_punten_na_caps / nieuwbouwFactor

  let voorMonument = voorNieuwbouw
  let monument: Correctie | undefined
  if (c.monument_toegepast) {
    const kind =
      MONUMENT_LABEL[String(c.monument_soort)] ?? String(c.monument_soort)
    if (c.monument_correctie_type === "extra_punten") {
      const extra = numberOf("monument_extra_punten")
      voorMonument = voorNieuwbouw - extra
      monument = { label: kind, note: "Extra punten", punten: extra }
    } else {
      const monumentFactor = numberOf("monument_huurprijsopslag_factor") || 1
      voorMonument = voorNieuwbouw / monumentFactor
      monument = {
        label: kind,
        note: factor(monumentFactor),
        punten: voorNieuwbouw - voorMonument,
      }
    }
  }

  if (c.zorgwoning_toegepast) {
    list.push({ label: "Zorgwoning", punten: voorMonument - naWoz })
  }
  if (monument) list.push(monument)
  if (c.nieuwbouw_toegepast) {
    list.push({
      label: "Nieuwbouw",
      note: factor(nieuwbouwFactor),
      punten: resultaat.totaal_punten_na_caps - voorNieuwbouw,
    })
  }

  return list
}

/** Labels for the rubrieken the backend returns, keyed by its field name. */
const RUBRIEK_LABELS: Record<string, string> = {
  badkamer: "Badkamer",
  sanitair_extra_voorzieningen: "Extra sanitaire voorzieningen",
  toilet: "Toilet",
  sanitair_overig: "Overig sanitair",
  woonvoorzieningen_handicap: "Woonvoorzieningen voor mensen met een handicap",
  keuken: "Keuken",
  vertrekken: "Vertrekken",
  overige_ruimten: "Overige ruimten",
  verwarming: "Verwarming",
  verkoeling: "Verkoeling",
  energieprestatie: "Energieprestatie",
  buitenruimte: "Buitenruimte",
  parkeren: "Parkeren",
  woz: "WOZ-waarde",
  bijzondere_voorzieningen: "Bijzondere voorzieningen",
}

type Rubriek = {
  /** The backend's field name, e.g. "sanitair_extra_voorzieningen". */
  name: string
  label: string
  punten: number
}

/**
 * The rubrieken with punten, each with its label, in alphabetical order of that label. Rubrieken
 * that round to 0 punten add nothing to the sum and are left out. A rubriek without a label
 * (e.g. one the backend added later) keeps its field name as label, so it still shows up.
 */
export function rubrieken(resultaat: PuntentellerResultaat): Rubriek[] {
  return Object.entries(resultaat.rubrieken)
    .filter(([, punten]) => Math.abs(punten) >= 0.005)
    .map(([name, punten]) => ({
      name,
      label: RUBRIEK_LABELS[name] ?? name,
      punten,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "nl", { sensitivity: "base" }),
    )
}
