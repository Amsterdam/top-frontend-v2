import { getTimeFromNow, capitalizeFirstLetter } from "./formatting"
import { formatResidentDatum, toIsoDate } from "./residentDatum"
import type { Resident, ResidentDatum } from "../types"

/** "04-03-2001 (25 jaar)", "2001 (25 jaar)"; undefined als de datum onbekend is. */
const formatDateWithAge = (datum?: ResidentDatum, suffix = "") => {
  const formatted = formatResidentDatum(datum)
  if (!formatted) return undefined
  return `${formatted} (${getTimeFromNow(toIsoDate(datum))}${suffix})`
}

export function getResidentPersonalDetails(resident: Resident) {
  const geboorte = resident?.geboorte
  const geboorteplaats = geboorte?.plaats?.omschrijving
  const geboorteland = geboorte?.land?.omschrijving
  const overlijden = resident?.overlijden

  return [
    {
      label: "Voornamen",
      value: resident.naam?.voornamen,
    },
    {
      label: "Geslacht",
      value: capitalizeFirstLetter(resident.geslacht?.omschrijving),
    },
    {
      label: "Geboren",
      value: formatDateWithAge(geboorte?.datum),
    },
    {
      label: "Geboorteplaats",
      value:
        [geboorteplaats, geboorteland].filter(Boolean).join(", ") || undefined,
    },
    {
      label: "Nationaliteit",
      // Zonder omschrijving geen lege plek in de lijst, en zonder enige
      // omschrijving geen lege regel.
      value:
        resident?.nationaliteiten
          ?.map((n) => n?.nationaliteit?.omschrijving)
          .filter(Boolean)
          .join(", ") || undefined,
    },
    {
      label: "Overleden †",
      value: overlijden
        ? (formatDateWithAge(overlijden.datum, " geleden") ?? "Datum onbekend")
        : undefined,
    },
    {
      label: "Ingeschreven sinds",
      value: formatDateWithAge(resident?.verblijfplaats?.datumVan),
    },
  ].filter((item) => item.value !== undefined)
}
