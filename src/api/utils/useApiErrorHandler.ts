import { useAlert, type Severity } from "@/components/alerts/useAlert"
import type { ApiError } from "@/api/types/apiError"

const severityMap: Record<string, Severity> = {
  error: "error",
  success: "success",
  warning: "warning"
}

export function mapToSeverity(input: string): Severity | undefined {
  return severityMap[input.toLowerCase()]
}

export const useApiErrorHandler = () => {
  const { showAlert } = useAlert()

    return (error: ApiError) => {
    const severity = mapToSeverity(error.severity ?? "error")
    switch (error.status) {
      case 403:
        showAlert({
          title: "Toegang gewijgerd 🚫",
          description:
            "Helaas, je hebt geen toestemming voor deze actie. Neem contact op als je denkt dat dit onterecht is!",
          severity,
        })
        return

      case 404:
        showAlert({
          title: error.title ?? "Niet gevonden 🔍",
          description:
            error?.message ?? "Deze pagina of gegevens bestaan (niet meer). Misschien is het verplaatst of verwijderd?",
          severity,
        })
        return

      default:
        showAlert({
          title: "Oeps, iets ging mis! 😕",
          description:
            "Er is een onverwachte fout opgetreden. Probeer het later opnieuw of neem contact met ons op.",
          severity,
        })
    }
  }
}
