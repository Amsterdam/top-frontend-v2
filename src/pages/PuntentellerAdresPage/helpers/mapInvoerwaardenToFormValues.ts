/** Sorteert woz_waarden aflopend op peildatum (meest recente eerst). */
export function sortWozWaardenByPeildatum(
  wozWaarden: WozWaarde[],
): WozWaarde[] {
  return [...wozWaarden].sort((a, b) => b.peildatum.localeCompare(a.peildatum))
}

/** De WOZ-waarde die als default gebruikt wordt zolang de gebruiker geen peildatum kiest. */
export function selectDefaultWozWaarde(
  wozWaarden: WozWaarde[],
): WozWaarde | undefined {
  return sortWozWaardenByPeildatum(wozWaarden)[0]
}

export function peildatumToJaar(peildatum: string): number {
  return new Date(peildatum).getFullYear()
}

/**
 * Maps de prefilled invoerwaarden (stap 0) onto the overlapping subset of
 * GebruikersinvoerFormValues fields, so form.reset()/setValue() can seed the wizard once the
 * invoerwaarden query resolves. Van de meerdere WOZ-waarden (per peildatum) wordt standaard de
 * meest recente gekozen; de gebruiker kan dit in StepWoninggegevens nog aanpassen.
 */
export function mapInvoerwaardenToFormValues(
  invoerwaarden: PuntentellerInvoerwaarden,
): Pick<
  GebruikersinvoerFormValues,
  | "gebruiksoppervlakte"
  | "woz_waarde"
  | "woz_peildatum_jaar"
  | "energielabel_klasse"
> {
  const wozWaarde = selectDefaultWozWaarde(invoerwaarden.woz_waarden)

  return {
    gebruiksoppervlakte: invoerwaarden.gebruiksoppervlakte,
    woz_waarde: wozWaarde?.vastgestelde_waarde ?? 0,
    woz_peildatum_jaar: wozWaarde
      ? peildatumToJaar(wozWaarde.peildatum)
      : new Date().getFullYear(),
    energielabel_klasse: invoerwaarden.energielabel,
  }
}
