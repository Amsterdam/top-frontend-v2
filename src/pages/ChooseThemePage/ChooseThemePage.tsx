import { ChooseThemeBase } from "@/components"

export default function ChooseThemePage() {
  return (
    <ChooseThemeBase
      title="Genereer looplijst"
      description="Welke zaken wil je vandaag in je looplijst?"
      onThemeClick={(themeId) => `/lijst/nieuw/${themeId}`}
    />
  )
}
