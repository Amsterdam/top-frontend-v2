import { AmsterdamCrossSpinner, ChooseThemeBase } from "@/components"
import { useRedirectToExistingItinerary } from "@/hooks"

export default function ChooseThemePage() {
  const { isPending, hasExistingItinerary } = useRedirectToExistingItinerary()

  if (isPending || hasExistingItinerary) return <AmsterdamCrossSpinner />

  return (
    <ChooseThemeBase
      title="Genereer looplijst"
      description="Welke zaken wil je vandaag in je looplijst?"
      onThemeClick={(themeId) => `/looplijsten/nieuw/${themeId}`}
    />
  )
}
