import { useEffect, useRef } from "react"
import { useAuth, hasAuthParams } from "react-oidc-context"
import { Paragraph } from "@amsterdam/design-system-react"
import { RouterProvider } from "react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import dayjs from "dayjs"
import { router } from "@/router"
import { queryClient } from "@/api/queryClient"
import { AlertProvider, AmsterdamCrossSpinner } from "@/components"
import "dayjs/locale/nl"

dayjs.locale("nl")

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
    return <AmsterdamCrossSpinner />
  }

  if (!auth.isAuthenticated) {
    return <Paragraph>Logging in failed. Please try again.</Paragraph>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default App
