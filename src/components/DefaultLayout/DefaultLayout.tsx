import { Outlet } from "react-router"
import {
  Menu,
  Page,
  PageFooter,
  PageHeader,
} from "@amsterdam/design-system-react"
import {
  HouseCanalIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
} from "@amsterdam/design-system-react-icons"
import { useAuth } from "react-oidc-context"

import { env } from "@/config/env"
import { useRedirectFromState } from "@/hooks/useRedirectFromState"
import { useRedirectItinerary } from "@/hooks"

// type HeaderAction = {
//   key: string
//   label: string
//   icon: React.ComponentType
//   onClick?: (e: React.MouseEvent) => void
// }

export function DefaultLayout() {
  useRedirectFromState()
  useRedirectItinerary()
  const auth = useAuth()

  // const headerActions: HeaderAction[] = [
  //   {
  //     key: "zoeken",
  //     label: "Zoeken",
  //     icon: SearchIcon,
  //   },
  //   {
  //     key: "uitloggen",
  //     label: "Uitloggen",
  //     icon: LogOutIcon,
  //     onClick: (e) => {
  //       e.preventDefault()
  //       auth.signoutRedirect()
  //     },
  //   },
  // ]

  return (
    <Page withMenu>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        brandNameShort={`TOP  ${env.VITE_ENVIRONMENT_SHORT}`}
        // menuItems={headerActions.map((action) => (
        //   <PageHeader.MenuLink
        //     key={action.key}
        //     href="#"
        //     icon={action.icon}
        //     onClick={action.onClick}
        //   >
        //     {action.label}
        //   </PageHeader.MenuLink>
        // ))}
        noMenuButtonOnWideWindow
        className="ams-page__area--header"
      >
        <Menu>
          <Menu.Link href="/" icon={HouseCanalIcon}>
            Home
          </Menu.Link>
          <Menu.Link href="/zoeken" icon={SearchIcon}>
            Zoeken
          </Menu.Link>
          <Menu.Link href="/team-instellingen" icon={SettingsIcon}>
            Instellingen
          </Menu.Link>
          <Menu.Link
            href="#"
            icon={LogOutIcon}
            onClick={(e) => {
              e.preventDefault()
              auth.signoutRedirect()
            }}
          >
            Uitloggen
          </Menu.Link>
        </Menu>
      </PageHeader>

      <Menu className="ams-page__area--menu" inWideWindow>
        <Menu.Link href="/" icon={HouseCanalIcon}>
          Home
        </Menu.Link>
        <Menu.Link href="/zoeken" icon={SearchIcon}>
          Zoeken
        </Menu.Link>
        <Menu.Link href="/team-instellingen" icon={SettingsIcon}>
          Instellingen
        </Menu.Link>
        <Menu.Link
          href="#"
          icon={LogOutIcon}
          onClick={(e) => {
            e.preventDefault()
            auth.signoutRedirect()
          }}
        >
          Uitloggen
        </Menu.Link>
      </Menu>

      <main className="ams-page__area--body" id="main">
        <Outlet />
      </main>

      <PageFooter className="ams-page-footer ams-page__area--footer">
        <PageFooter.Menu data-testid="app-footer-navigation">
          <PageFooter.MenuLink
            href="/support"
            data-testid="app-footer-navigation-link-support"
          >
            Ondersteuning
          </PageFooter.MenuLink>
        </PageFooter.Menu>
      </PageFooter>
    </Page>
  )
}

export default DefaultLayout
