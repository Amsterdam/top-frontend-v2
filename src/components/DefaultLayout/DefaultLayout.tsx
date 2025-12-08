import { Outlet } from "react-router"
import { PageHeader } from "@amsterdam/design-system-react"
import { LogOutIcon, SearchIcon } from "@amsterdam/design-system-react-icons"
import { env } from "@/config/env"
import { useRedirectFromState } from "@/hooks/useRedirectFromState"
import styles from "./DefaultLayout.module.css"

export const DefaultLayout: React.FC = () => {
  useRedirectFromState()

  return (
    <>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        menuItems={[
          <PageHeader.MenuLink key="2" fixed href="#" icon={SearchIcon}>
            Zoeken
          </PageHeader.MenuLink>,
          <PageHeader.MenuLink fixed href="#" icon={LogOutIcon}>
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
