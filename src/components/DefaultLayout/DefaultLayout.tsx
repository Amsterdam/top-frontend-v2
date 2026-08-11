import { type MouseEvent } from "react"
import { Outlet, useNavigate } from "react-router"
import { Menu, Page, PageHeader } from "@amsterdam/design-system-react"
import {
  AwardRibbonIcon,
  HouseCanalIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
} from "@amsterdam/design-system-react-icons"
import { useAuth } from "react-oidc-context"

import { usePermissions } from "@/api/hooks"
import { env } from "@/config/env"
import { useRedirectFromState } from "@/hooks/useRedirectFromState"
import {
  APP_PERMISSIONS,
  hasRequiredPermissions,
  type PermissionRequirement,
} from "@/shared/permissions"
import { Footer } from "./Footer"

type MenuItem = {
  href: string
  icon: typeof HouseCanalIcon
  label: string
  requiredPermissions?: PermissionRequirement
}

const menuItems: MenuItem[] = [
  {
    href: "/",
    icon: HouseCanalIcon,
    label: "Looplijst",
  },
  {
    href: "/zoeken",
    icon: SearchIcon,
    label: "Zoeken",
  },
  {
    href: "/puntenteller",
    icon: AwardRibbonIcon,
    label: "Puntenteller",
  },
  {
    href: "/team-instellingen",
    icon: SettingsIcon,
    label: "Instellingen",
    requiredPermissions: APP_PERMISSIONS.manageSettings,
  },
]

export function DefaultLayout() {
  useRedirectFromState()
  const auth = useAuth()
  const navigate = useNavigate()
  const { data: permissions } = usePermissions()

  const navigateTo = (path: string) => (event: MouseEvent) => {
    event.preventDefault()
    navigate(path)
  }

  const visibleMenuItems = menuItems.filter((item) =>
    hasRequiredPermissions(permissions, item.requiredPermissions),
  )

  return (
    <Page withMenu>
      <PageHeader
        brandName={`${env.VITE_APP_TITLE} ${env.VITE_ENVIRONMENT_SHORT}`}
        brandNameShort={`TOP  ${env.VITE_ENVIRONMENT_SHORT}`}
        noMenuButtonOnWideWindow
        className="ams-page__area--header"
      >
        <Menu>
          {visibleMenuItems.map((item) => (
            <Menu.Link
              key={item.href}
              href={item.href}
              icon={item.icon}
              onClick={navigateTo(item.href)}
            >
              {item.label}
            </Menu.Link>
          ))}
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
        {visibleMenuItems.map((item) => (
          <Menu.Link
            key={item.href}
            href={item.href}
            icon={item.icon}
            onClick={navigateTo(item.href)}
          >
            {item.label}
          </Menu.Link>
        ))}
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

      <Footer />
    </Page>
  )
}

export default DefaultLayout
