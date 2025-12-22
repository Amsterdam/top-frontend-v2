import { useNavigate } from "react-router"
import { useAlert } from "@/components/alerts/useAlert"
import type { ApiError } from "@/api/types/apiError"

export const useApiErrorHandler = () => {
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  return (error: ApiError) => {
    switch (error.status) {
      case 401:
        showAlert({
          title: "Je bent uitgelogd 🔒",
          description: "Log opnieuw in om verder te gaan.",
          severity: "error",
        })
        navigate("/login")
        return

      case 403:
        showAlert({
          title: "Toegang gewijgerd 🚫",
          description:
            "Helaas, je hebt geen toestemming voor deze actie. Neem contact op als je denkt dat dit onterecht is!",
          severity: "error",
        })
        return

      case 404:
        showAlert({
          title: "Niet gevonden 🔍",
          description:
            "Deze pagina of gegevens bestaan (niet meer). Misschien is het verplaatst of verwijderd?",
          severity: "error",
        })
        return

      default:
        showAlert({
          title: "Oeps, iets ging mis! 😕",
          description:
            "Er is een onverwachte fout opgetreden. Probeer het later opnieuw of neem contact met ons op.",
          severity: "error",
        })
        navigate("/error")
    }
  }
}
