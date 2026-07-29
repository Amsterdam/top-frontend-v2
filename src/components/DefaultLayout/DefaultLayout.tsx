import { type MouseEvent } from "react"
import { Outlet, useNavigate } from "react-router"
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

export function DefaultLayout() {
  useRedirectFromState()
  useRedirectItinerary()
  const auth = useAuth()
  const navigate = useNavigate()

  const navigateTo = (path: string) => (event: MouseEvent) => {
    event.preventDefault()
    navigate(path)
  }

  return (
    <Page withMenu>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        brandNameShort={`TOP  ${env.VITE_ENVIRONMENT_SHORT}`}
        noMenuButtonOnWideWindow
        className="ams-page__area--header"
      >
        <Menu>
          <Menu.Link href="/" icon={HouseCanalIcon} onClick={navigateTo("/")}>
            Looplijst
          </Menu.Link>
          <Menu.Link
            href="/zoeken"
            icon={SearchIcon}
            onClick={navigateTo("/zoeken")}
          >
            Zoeken
          </Menu.Link>
          <Menu.Link
            href="/team-instellingen"
            icon={SettingsIcon}
            onClick={navigateTo("/team-instellingen")}
          >
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
        <Menu.Link href="/" icon={HouseCanalIcon} onClick={navigateTo("/")}>
          Looplijst
        </Menu.Link>
        <Menu.Link
          href="/zoeken"
          icon={SearchIcon}
          onClick={navigateTo("/zoeken")}
        >
          Zoeken
        </Menu.Link>
        <Menu.Link
          href="/team-instellingen"
          icon={SettingsIcon}
          onClick={navigateTo("/team-instellingen")}
        >
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
            onClick={navigateTo("/support")}
          >
            Ondersteuning
          </PageFooter.MenuLink>
        </PageFooter.Menu>
      </PageFooter>
    </Page>
  )
}

export default DefaultLayout
