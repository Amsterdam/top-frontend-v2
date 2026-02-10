import { formatDate } from "@/shared"
import { getTimeFromNow, capitalizeFirstLetter } from "./formatting"
import type { Resident } from "../types"

export function getResidentPersonalDetails(resident: Resident) {
  const geboorte = resident?.geboorte
  const geboorteDatum = geboorte?.datum?.datum
  const geboorteplaats = geboorte?.plaats?.omschrijving
  const geboorteland = geboorte?.land?.omschrijving
  const overlijdenDatum = resident?.overlijden?.datum?.langFormaat
  const datumVan = resident?.verblijfplaats?.datumVan?.datum

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
      value: formatDate(geboorteDatum),
    },
    {
      label: "Geboorteplaats",
      value:
        [geboorteplaats, geboorteland].filter(Boolean).join(", ") || undefined,
    },
    {
      label: "Nationaliteit",
      value: resident?.nationaliteiten
        ?.map((n) => n?.nationaliteit?.omschrijving)
        .join(", "),
    },
    {
      label: "Overleden †",
      value: overlijdenDatum ? (
        <>
          {capitalizeFirstLetter(overlijdenDatum)}
          <strong> ({getTimeFromNow(overlijdenDatum)} geleden)</strong>
        </>
      ) : undefined,
    },
    {
      label: "Ingeschreven sinds",
      value: datumVan ? (
        <>
          {formatDate(datumVan)}
          <strong> ({getTimeFromNow(datumVan)})</strong>
        </>
      ) : undefined,
    },
  ].filter((item) => item.value !== undefined)
}
