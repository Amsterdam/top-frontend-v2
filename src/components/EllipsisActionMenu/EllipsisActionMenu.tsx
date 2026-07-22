import {
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import {
  Button,
  IconButton,
  type IconProps,
} from "@amsterdam/design-system-react"
import { EllipsisIcon } from "@amsterdam/design-system-react-icons"
import styles from "./EllipsisActionMenu.module.css"

type Action = {
  label: string
  onClick: () => void
  icon: IconProps["svg"]
}

type EllipsisActionMenuProps = {
  actions: Action[]
}

export function EllipsisActionMenu({ actions }: EllipsisActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const anchorName = `--ellipsis-action-menu-${useId().replace(/:/g, "")}`
  const supportsAnchorPositioning =
    typeof CSS !== "undefined" &&
    CSS.supports("anchor-name: --anchor") &&
    CSS.supports("position-anchor: --anchor") &&
    CSS.supports("position-area: block-end span-inline-end")

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  function toggle() {
    setOpen((prev) => !prev)
  }

  function close() {
    setOpen(false)
  }

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || supportsAnchorPositioning) return

    const rect = buttonRef.current.getBoundingClientRect()

    setPosition({
      top: rect.bottom + 4,
      left: rect.right,
    })
  }, [open, supportsAnchorPositioning])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        close()
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close()
        buttonRef.current?.focus()
      }
    }

    function handleScroll() {
      close()
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKey)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKey)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open])

  return (
    <>
      <IconButton
        ref={buttonRef}
        svg={EllipsisIcon}
        size="heading-3"
        label="Meer acties"
        title="Meer acties"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
        style={{ anchorName }}
        className={styles.contextMenuButton}
      />

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={styles.menu}
            style={
              {
                positionAnchor: anchorName,
                "--menu-top": `${position.top}px`,
                "--menu-left": `${position.left}px`,
              } as CSSProperties
            }
          >
            {actions.map((action) => (
              <Button
                key={action.label}
                role="menuitem"
                className={styles.menuItem}
                onClick={() => {
                  action.onClick()
                  close()
                }}
                variant="tertiary"
                icon={action.icon}
                iconBefore
              >
                {action.label}
              </Button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
