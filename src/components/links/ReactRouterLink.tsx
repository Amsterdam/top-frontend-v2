import { Link, Paragraph } from "@amsterdam/design-system-react"
import { useHref, useLinkClickHandler, type To } from "react-router"

type Props = {
  to: To
  state?: Record<string, unknown> // hier geef je de formValues of andere data door
} & React.ComponentProps<typeof Link>

export function ReactRouterLink({ to, state, ...restProps }: Props) {
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to, { state })

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
