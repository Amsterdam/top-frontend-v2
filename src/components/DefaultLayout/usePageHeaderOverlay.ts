import { useEffect, useState } from "react"

const MENU_BUTTON_SELECTOR = '[aria-controls="ams-page-header-mega-menu"]'

export function usePageHeaderOverlay() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const menuButton = target.closest(MENU_BUTTON_SELECTOR)

      if (menuButton) {
        setMenuOpen((prev) => !prev)
        return
      }

      setMenuOpen(false)
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  const closeMenu = () => {
    const menuButton = document.querySelector(
      '[aria-controls="ams-page-header-mega-menu"]',
    ) as HTMLElement | null

    if (menuButton) {
      menuButton.click()
    }
  }

  return {
    menuOpen,
    closeMenu,
  }
}
