import { useEffect, useRef } from "react"
import { useAuth, hasAuthParams } from "react-oidc-context"
import { Paragraph } from "@amsterdam/design-system-react"
import { RouterProvider } from "react-router"
import { router } from "@/router"

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
        url_state: fullPathWithQuery,
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

  return <RouterProvider router={router} />
}

export default App
