import { Outlet } from "react-router"
import { PageHeader } from "@amsterdam/design-system-react"
import { LogOutIcon, SearchIcon } from "@amsterdam/design-system-react-icons"
import { env } from "@/config/env"
import { useRedirectFromState } from "@/hooks/useRedirectFromState"
import styles from "./DefaultLayout.module.css"
import { useAuth } from "react-oidc-context"

export function DefaultLayout() {
  useRedirectFromState()
  const auth = useAuth()
  return (
    <>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        menuItems={[
          <PageHeader.MenuLink key="zoeken" fixed href="#" icon={SearchIcon}>
            Zoeken
          </PageHeader.MenuLink>,
          <PageHeader.MenuLink
            key="uitloggen"
            fixed
            href="#"
            icon={LogOutIcon}
            onClick={(e) => {
              e.preventDefault()
              auth.signoutRedirect()
            }}
          >
            Uitloggen
          </PageHeader.MenuLink>,
        ]}
      />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}

export default DefaultLayout
