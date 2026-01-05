import { Link, Paragraph } from "@amsterdam/design-system-react"
import { useHref, useLinkClickHandler } from "react-router"

export function ReactRouterLink({
  to,
  ...restProps
}: { to: string } & React.ComponentProps<typeof Link>) {
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to)

  return (
    <Paragraph>
      <Link
        href={href}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          handleClick(event)
        }}
        {...restProps}
      />
    </Paragraph>
  )
}
