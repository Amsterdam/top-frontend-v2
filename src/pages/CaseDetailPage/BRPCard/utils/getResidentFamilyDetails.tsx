import {
  HeartBrokenIcon,
  HeartIcon,
  PersonIcon,
} from "@amsterdam/design-system-react-icons"
import { Icon, Row } from "@amsterdam/design-system-react"
import { formatDate } from "@/shared"
import { BabyIcon } from "@/icons"
import { MobileOnlyWrapper } from "@/components"
import { formatName, getTimeFromNow } from "./formatting"
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
          const birthDate =
            member?.geboorte?.datum?.datum || member?.geboorte?.datum?.jaar

          if (!name) return null

          return (
            <Row key={index} gap="small" alignVertical="center">
              <MobileOnlyWrapper>
                {isChild ? (
                  <BabyIcon width={16} height={16} />
                ) : (
                  <Icon svg={PersonIcon} />
                )}
              </MobileOnlyWrapper>
              {name}
              {birthDate &&
                ` (${isChild ? getTimeFromNow(birthDate) : formatDate(birthDate, "YYYY")})`}
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
        const isEx = Boolean(
          partner?.ontbindingHuwelijkPartnerschap?.datum?.datum,
        )

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
