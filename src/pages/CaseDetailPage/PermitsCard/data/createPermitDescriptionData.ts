import { formatDate } from "@/shared"

export function createPermitDescriptionData(permit: Permit) {
  return [
    {
      label: "Resultaat",
      value: permit.resultaat ?? "-",
    },
    {
      label: "Omschrijving",
      value: permit.omschrijvinG_KORT ?? "-",
    },
    {
      label: "Status",
      value: permit.status ?? "-",
    },
    {
      label: "Kenmerk",
      value: permit.kenmerk ?? "-",
    },
    {
      label: "Aangevraagd door",
      value: permit.initator ?? "-",
    },
    {
      label: "Aangevraagd op",
      value: formatDate(permit.startdatum, "DD-MM-YYYY", "-"),
    },
    {
      label: "Vergunninghouder",
      value: permit.vergunninghouder ?? "-",
    },
    {
      label: "Verleend per",
      value: formatDate(permit.einddatum, "DD-MM-YYYY", "-"),
    },
    {
      label: "Geldig tot en met",
      value: formatDate(permit.datuM_TOT, "DD-MM-YYYY", "-"),
    },
  ]
}
