import { StandaloneLink, type IconProps } from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { useHref, useLinkClickHandler } from "react-router"

type Props = {
  to: string
  icon?: IconProps["svg"]
  children: React.ReactNode
}

export function IconLink({
  to,
  icon = ChevronBackwardIcon,
  children,
}: Props & React.ComponentProps<typeof StandaloneLink>) {
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to)

  return (
    <StandaloneLink
      href={href}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        handleClick(event)
      }}
      icon={icon}
    >
      {children}
    </StandaloneLink>
  )
}
