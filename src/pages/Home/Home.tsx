import { PageHeader, Paragraph } from "@amsterdam/design-system-react"
import { env } from "@/config/env"

export default function Home() {
  return (
    <>
      <PageHeader brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`} />
      <Paragraph>
        De oorsprong van Lorem Ipsum gaat terug tot de 16e eeuw, toen een
        onbekende drukker een galerij van type specimen boeken samenstelde voor
        de overleving van het lettertype en deze verzameling Lorem Ipsum
        passages gebruikte als voorbeeld. In de loop der tijd is het Lorem Ipsum
        gebruikt als een standaard tekst in de grafische en webontwerpindustrie,
        omdat het een neutrale tekst is die geen afleiding geeft van de inhoud
        van de pagina of het document waarin het wordt gebruikt.
      </Paragraph>
    </>
  )
}
