import { useAuth, hasAuthParams } from "react-oidc-context"
import { PageHeader, Paragraph } from "@amsterdam/design-system-react";
import { env } from "./config/env";
import { useEffect, useRef } from "react";

function App() {
  const auth = useAuth()
  const hasTriedSignin = useRef(false)

  // automatically sign-in
useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedSignin.current
    ) {
      const currentUrl = new URL(window.location.href)
      const fullPathWithQuery = currentUrl.pathname + currentUrl.search

      void auth.signinRedirect({
        url_state: fullPathWithQuery
      })

      hasTriedSignin.current = true
    }
  }, [auth])

  if (auth.isLoading) {
    return <Paragraph>Loading...</Paragraph>
  }

  if (!auth.isAuthenticated) {
    return <Paragraph>Logging in failed. Please try again.</Paragraph>
  }

  return (
    <>
      <PageHeader
         brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`}
      />
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
  );
}

export default App;
