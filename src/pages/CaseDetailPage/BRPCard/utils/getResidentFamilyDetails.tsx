import {
  HeartBrokenIcon,
  HeartIcon,
  PersonIcon,
} from "@amsterdam/design-system-react-icons"
import { Icon, Row } from "@amsterdam/design-system-react"
import { BabyIcon } from "@/icons"
import { MobileOnlyWrapper } from "@/components"
import { formatName, getTimeFromNow } from "./formatting"
import { toIsoDate } from "./residentDatum"
import type { Resident, ResidentDatum, ResidentNaam } from "../types"

const getFamilyNames = (
  family?: { naam?: ResidentNaam; geboorte?: { datum?: ResidentDatum } }[],
  isChild = false,
) => {
  if (!Array.isArray(family) || family.length === 0) return null

  return (
    <>
      {family
        .map((member, index) => {
          const name = formatName(member?.naam)
          // Kinderen met hun leeftijd, ouders met hun geboortejaar.
          const birthDate = toIsoDate(member?.geboorte?.datum)
          const birthText =
            birthDate &&
            (isChild ? getTimeFromNow(birthDate) : birthDate.slice(0, 4))

          if (!name) return null

          return (
            <Row key={index} gap="small" alignVertical="center">
              <MobileOnlyWrapper>
                {isChild ? <BabyIcon size={16} /> : <Icon svg={PersonIcon} />}
              </MobileOnlyWrapper>
              {name}
              {birthText && ` (${birthText})`}
            </Row>
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
        // Ook een ontbinding met een onbekende datum is een ontbinding.
        const isEx = Boolean(partner?.ontbindingHuwelijkPartnerschap)

        return (
          <Row key={index} gap="small">
            <MobileOnlyWrapper>
              <Icon svg={isEx ? HeartBrokenIcon : HeartIcon} />
            </MobileOnlyWrapper>
            {name} {verbintenis && `- ${verbintenis}`} {isEx && "(beëindigd)"}
          </Row>
        )
      })}
    </>
  )
}

export function getResidentFamilyDetails(resident: Resident) {
  return [
    {
      label: "Ouders",
      value: getFamilyNames(resident?.ouders, false),
    },
    {
      label: "Partner(s)",
      value: getPartners(resident?.partners),
    },
    {
      label: "Kinderen",
      value: getFamilyNames(resident?.kinderen, true),
    },
  ].filter((item) => item.value !== undefined && item.value !== null)
}
