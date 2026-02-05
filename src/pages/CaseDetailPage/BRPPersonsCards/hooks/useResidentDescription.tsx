import { formatDate } from "@/shared"
import {
  formatName,
  getTimeFromNow,
  capitalizeFirstLetter,
} from "../utils/personFormatting"
import type { Resident, ResidentDatum, ResidentNaam } from "../types"

const getFamilyNames = (
  family?: { naam?: ResidentNaam; geboorte?: { datum?: ResidentDatum } }[],
  showAge = false,
) => {
  if (!Array.isArray(family) || family.length === 0) return null

  return (
    <>
      {family
        .map((member, index) => {
          const name = formatName(member?.naam)
          const birthDate =
            member?.geboorte?.datum?.datum || member?.geboorte?.datum?.jaar

          if (!name) return null

          return (
            <div key={index}>
              {name}
              {birthDate &&
                ` (${showAge ? getTimeFromNow(birthDate) : formatDate(birthDate, "YYYY")})`}
            </div>
          )
        })
        .filter(Boolean)}
    </>
  )
}

const getPartners = (
  partners?: {
    naam?: ResidentNaam
    geboorte?: { datum?: ResidentDatum }
    aangaanHuwelijkPartnerschap?: { datum?: ResidentDatum }
    ontbindingHuwelijkPartnerschap?: { datum?: ResidentDatum }
    soortVerbintenis?: { omschrijving?: string }
  }[],
) => {
  if (!Array.isArray(partners) || partners.length === 0) return null

  return (
    <>
      {partners.map((partner, index) => {
        const name = formatName(partner?.naam)
        if (!name) return null

        const verbintenis = partner?.soortVerbintenis?.omschrijving
        const isEx = Boolean(
          partner?.ontbindingHuwelijkPartnerschap?.datum?.datum,
        )

        return (
          <div key={index}>
            {name} {verbintenis && `- ${verbintenis}`} {isEx && "(beëindigd)"}
          </div>
        )
      })}
    </>
  )
}

export function useResidentDescription(resident: Resident) {
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
      label: "Initialen",
      value: resident.naam?.voorletters,
    },
    {
      label: "Voorvoegsel",
      value: resident.naam?.voorvoegsel || undefined,
    },
    {
      label: "Achternaam",
      value: resident.naam?.geslachtsnaam,
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
    {
      label: "Kinderen",
      value: getFamilyNames(resident?.kinderen, true),
    },
    {
      label: "Ouders",
      value: getFamilyNames(resident?.ouders, false),
    },
    {
      label: "Partner(s)",
      value: getPartners(resident?.partners),
    },
  ].filter((item) => item.value !== undefined)
}
