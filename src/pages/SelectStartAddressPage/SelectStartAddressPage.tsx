import { useLocation, useNavigate, useParams } from "react-router"
import { useTheme } from "@/api/hooks"
import { ItineraryListItemVariant, SearchAddressView } from "@/components"

export function SelectStartAddressPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const { data: theme } = useTheme(themeId)
  const navigate = useNavigate()
  const location = useLocation()
  const currentFormValues = location.state?.formValues

  const onAddCase = (caseData: Case) => {
    navigate(`/lijst/nieuw/${themeId}`, {
      replace: true,
      state: {
        formValues: { ...currentFormValues, startCase: caseData },
      },
    })
  }

  const onCancel = () => {
    navigate(`/lijst/nieuw/${themeId}`, {
      state: { formValues: currentFormValues },
    })
  }

  return (
    <SearchAddressView
      title="Startadres zoeken"
      themeName={theme?.name}
      variant={ItineraryListItemVariant.AddStartAddress}
      onAdd={onAddCase}
      onCancel={onCancel}
    />
  )
}

export default SelectStartAddressPage
