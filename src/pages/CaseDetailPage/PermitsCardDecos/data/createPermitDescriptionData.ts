import { formatDate } from "@/shared"

export function createPermitDescriptionData(permit: PermitDecos) {
  const { permit_granted, permit_type, details } = permit

  const isGranted = permit_granted === "GRANTED"
  const permitIsForBAndB = permit_type?.startsWith("B&B")

  const endDateBAndB = details?.DATE_VALID_UNTIL ?? details?.DATE_VALID_TO
  const endDate = details?.DATE_VALID_TO ?? details?.DATE_VALID_UNTIL

  const data = [
    {
      label: "Resultaat",
      value: details?.RESULT ?? "-",
    },
    {
      label: "Omschrijving zaak",
      value: details?.SUBJECT ?? "-",
    },
    {
      label: "Soort vergunning",
      value: details?.PERMIT_NAME ?? "-",
    },
    {
      label: "Aangevraagd door",
      value: details?.APPLICANT ?? "-",
    },
    {
      label: "Aangevraagd op",
      value: formatDate(details?.REQUEST_DATE, "DD-MM-YYYY", "-"),
    },
    {
      label: "Locatie",
      value: details?.ADDRESS ?? "-",
    },
  ]

  if (permitIsForBAndB) {
    data.push({
      label: "Vergunninghouder",
      value: details?.HOLDER ?? "-",
    })
  }

  if (isGranted) {
    data.push({
      label: "Verleend per",
      value: formatDate(details?.DATE_VALID_FROM, "DD-MM-YYYY", "-"),
    })
  }

  if (isGranted && permitIsForBAndB && endDateBAndB) {
    data.push({
      label: "Geldig tot en met",
      value: formatDate(endDateBAndB, "DD-MM-YYYY", "-"),
    })
  } else {
    data.push({
      label: "Geldig tot",
      value: formatDate(endDate, "DD-MM-YYYY", "-"),
    })
  }

  return data
}
