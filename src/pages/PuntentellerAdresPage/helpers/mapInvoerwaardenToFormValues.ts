/** Sorts woz_waarden descending by peildatum (most recent first). */
export function sortWozWaardenByPeildatum(
  wozWaarden: WozWaarde[],
): WozWaarde[] {
  return [...wozWaarden].sort((a, b) => b.peildatum.localeCompare(a.peildatum))
}

/** The WOZ-waarde used as default as long as the user hasn't chosen a peildatum. */
export function selectDefaultWozWaarde(
  wozWaarden: WozWaarde[],
): WozWaarde | undefined {
  return sortWozWaardenByPeildatum(wozWaarden)[0]
}

export function peildatumToJaar(peildatum: string): number {
  return new Date(peildatum).getFullYear()
}

/**
 * Maps the prefilled invoerwaarden (step 0) onto the overlapping subset of
 * GebruikersinvoerFormValues fields, so form.reset()/setValue() can seed the wizard once the
 * invoerwaarden query resolves. Of the multiple WOZ-waarden (per peildatum), the most recent
 * one is chosen by default; the user can still adjust this in StepWoninggegevens.
 */
export function mapInvoerwaardenToFormValues(
  invoerwaarden: PuntentellerInvoerwaarden,
): Pick<
  GebruikersinvoerFormValues,
  | "bouwjaar"
  | "gebruiksoppervlakte"
  | "woz_waarde"
  | "woz_peildatum_jaar"
  | "energielabel_klasse"
> {
  const wozWaarde = selectDefaultWozWaarde(invoerwaarden.woz_waarden)

  return {
    bouwjaar: invoerwaarden.bouwjaar,
    gebruiksoppervlakte: invoerwaarden.gebruiksoppervlakte,
    woz_waarde: wozWaarde?.vastgestelde_waarde ?? 0,
    woz_peildatum_jaar: wozWaarde
      ? peildatumToJaar(wozWaarde.peildatum)
      : new Date().getFullYear(),
    energielabel_klasse: invoerwaarden.energielabel,
  }
}
