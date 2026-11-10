/**
 * "12,5": punten the Dutch way, with up to 2 decimals. With a real minus sign (U+2212) instead
 * of the hyphen Intl gives: it reads better next to the digits, and screen readers read it as
 * "min".
 */
export const formatPunten = (punten: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 })
    .format(punten)
    .replace("-", "\u2212")
