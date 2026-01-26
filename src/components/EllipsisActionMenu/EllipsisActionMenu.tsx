import { useEffect, useRef, useState } from "react"
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
  icon?: IconProps["svg"]
}

type EllipsisActionMenuProps = {
  actions: Action[]
}

export function EllipsisActionMenu({ actions }: EllipsisActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen((prev) => !prev)
  }

  function close() {
    setOpen(false)
  }

  useEffect(() => {
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

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  return (
    <div className={styles.wrapper}>
      <IconButton
        ref={buttonRef}
        svg={EllipsisIcon}
        size="heading-1"
        label="Meer acties"
        title="Meer acties"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
      />

      {open && (
        <div ref={menuRef} role="menu" className={styles.menu}>
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
        </div>
      )}
    </div>
  )
}
