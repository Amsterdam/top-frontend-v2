import { useEffect, useRef } from "react"
import { useAuth, hasAuthParams } from "react-oidc-context"
import { Paragraph } from "@amsterdam/design-system-react"
import { RouterProvider } from "react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import dayjs from "dayjs"
import { router } from "@/router"
import { queryClient } from "@/api/queryClient"
import { ToastProvider, AmsterdamCrossSpinner } from "@/components"
import { usePwaUpdatePrompt, useOfflineVisitSync } from "@/hooks"
import "dayjs/locale/nl"

dayjs.locale("nl")

function PwaUpdatePrompt() {
  usePwaUpdatePrompt()
  return null
}

function App() {
  const auth = useAuth()
  const hasTriedSignin = useRef(false)

  useOfflineVisitSync()

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
      <ToastProvider>
        <PwaUpdatePrompt />
        <RouterProvider router={router} />
      </ToastProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default App
