import type { ApiError } from "@/api/types/apiError"
import type { AlertMessage, Severity } from "@/components/alerts/types"

const severityMap: Record<string, Severity> = {
  error: "error",
  success: "success",
  warning: "warning",
}

export function mapToSeverity(input: string): Severity | undefined {
  return severityMap[input.toLowerCase()]
}

export function mapApiErrorToAlert(error: ApiError): Omit<AlertMessage, "id"> {
  const severity = mapToSeverity(error.severity ?? "error")

  switch (error.status) {
    case 403:
      return {
        title: "Toegang gewijgerd 🚫",
        description:
          "Helaas, je hebt geen toestemming voor deze actie. Neem contact op als je denkt dat dit onterecht is!",
        severity,
      }

    case 404:
      return {
        title: error.title ?? "Niet gevonden 🔍",
        description:
          error?.message ??
          "Deze pagina of gegevens bestaan (niet meer). Misschien is het verplaatst of verwijderd?",
        severity,
      }

    default:
      return {
        title: "Oeps, iets ging mis! 😕",
        description:
          "Er is een onverwachte fout opgetreden. Probeer het later opnieuw of neem contact met ons op.",
        severity,
      }
  }
}
