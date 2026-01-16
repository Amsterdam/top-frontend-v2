import { Outlet } from "react-router"
import { LinkList, Page, PageHeader } from "@amsterdam/design-system-react"
import { LogOutIcon, SearchIcon } from "@amsterdam/design-system-react-icons"
import { useAuth } from "react-oidc-context"

import { env } from "@/config/env"
import { useRedirectFromState } from "@/hooks/useRedirectFromState"
import { useRedirectItinerary } from "@/hooks"
import { usePageHeaderOverlay } from "./usePageHeaderOverlay"

import styles from "./DefaultLayout.module.css"

type HeaderAction = {
  key: string
  label: string
  icon: React.ComponentType
  onClick?: (e: React.MouseEvent) => void
}

export function DefaultLayout() {
  useRedirectFromState()
  useRedirectItinerary()
  const auth = useAuth()
  const { menuOpen, closeMenu } = usePageHeaderOverlay()

  const headerActions: HeaderAction[] = [
    {
      key: "zoeken",
      label: "Zoeken",
      icon: SearchIcon,
    },
    {
      key: "uitloggen",
      label: "Uitloggen",
      icon: LogOutIcon,
      onClick: (e) => {
        e.preventDefault()
        auth.signoutRedirect()
      },
    },
  ]

  return (
    <Page>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        menuItems={headerActions.map((action) => (
          <PageHeader.MenuLink
            key={action.key}
            href="#"
            icon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </PageHeader.MenuLink>
        ))}
        noMenuButtonOnWideWindow
        className={styles.PageHeader}
      >
        <LinkList>
          {headerActions.map((action) => (
            <LinkList.Link
              key={action.key}
              href="/zoeken"
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </LinkList.Link>
          ))}
        </LinkList>
      </PageHeader>
      {menuOpen && (
        <div
          className={`${styles.MainMenuOverlay} animate-fade-in`}
          onClick={closeMenu}
        />
      )}

      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </Page>
  )
}

export default DefaultLayout
