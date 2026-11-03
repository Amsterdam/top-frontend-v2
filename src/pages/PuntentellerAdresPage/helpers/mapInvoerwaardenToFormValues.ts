import { GEEN_MONUMENT } from "../fieldDefinitions"
import { parseEnergieIndex, selectEnergieGrondslag } from "./energieGrondslag"

/** Sorts woz_waarden descending by peildatum (most recent first); none when there are none. */
export function sortWozWaardenByPeildatum(
  wozWaarden: WozWaarde[] | null,
): WozWaarde[] {
  return [...(wozWaarden ?? [])].sort((a, b) =>
    b.peildatum.localeCompare(a.peildatum),
  )
}

/** The WOZ-waarde used as default as long as the user hasn't chosen a peildatum. */
export function selectDefaultWozWaarde(
  wozWaarden: WozWaarde[] | null,
): WozWaarde | undefined {
  return sortWozWaardenByPeildatum(wozWaarden)[0]
}

export function peildatumToJaar(peildatum: string): number {
  return new Date(peildatum).getFullYear()
}

/**
 * The monument_soort option for the monumentenregister's status. The contractdatum of a
 * rijksmonument isn't known, so it defaults to a contract after 1 July 2024; the user can
 * still change it.
 */
function selectMonumentSoort(invoerwaarden: PuntentellerInvoerwaarden): string {
  if (invoerwaarden.monument_soort === "rijksmonument") {
    return "rijksmonument_contract_na_1_juli_2024"
  }
  if (invoerwaarden.monument_soort === "gemeentelijk_monument") {
    return "gemeentelijk_of_provinciaal_monument"
  }
  return GEEN_MONUMENT
}

/**
 * Maps the prefilled invoerwaarden (step 0) onto the overlapping subset of
 * GebruikersinvoerFormValues fields, so form.reset()/setValue() can seed the wizard once the
 * invoerwaarden query resolves. Of the multiple WOZ-waarden (per peildatum), the most recent
 * one is chosen by default; the user can still adjust this in StepWoninggegevens.
 * energie_type follows selectEnergieGrondslag; the label and index from EP-Online are filled in
 * regardless, so they're there when the user picks another energie_type.
 */
export function mapInvoerwaardenToFormValues(
  invoerwaarden: PuntentellerInvoerwaarden,
  today?: string,
): Pick<
  GebruikersinvoerFormValues,
  | "bouwjaar"
  | "gebruiksoppervlakte"
  | "woz_waarde"
  | "woz_peildatum_jaar"
  | "energie_type"
  | "energielabel_klasse"
  | "energie_index"
  | "monument_soort"
> {
  const wozWaarde = selectDefaultWozWaarde(invoerwaarden.woz_waarden)

  return {
    bouwjaar: invoerwaarden.energie?.bouwjaar ?? null,
    gebruiksoppervlakte: invoerwaarden.gebruiksoppervlakte ?? 0,
    woz_waarde: wozWaarde?.vastgestelde_waarde ?? 0,
    woz_peildatum_jaar: wozWaarde
      ? peildatumToJaar(wozWaarde.peildatum)
      : new Date().getFullYear(),
    energie_type: selectEnergieGrondslag(invoerwaarden.energie, today).type,
    energielabel_klasse: invoerwaarden.energie?.energielabel ?? "",
    energie_index: parseEnergieIndex(invoerwaarden.energie?.energieindex),
    monument_soort: selectMonumentSoort(invoerwaarden),
  }
}
