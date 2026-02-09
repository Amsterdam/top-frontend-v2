import {
  Button,
  LinkList,
  type ButtonProps,
} from "@amsterdam/design-system-react"
import {
  LinkExternalIcon,
  MapMarkerOnMapIcon,
} from "@amsterdam/design-system-react-icons"

type Props = {
  addresses?: Address[]
  variant?: ButtonProps["variant"]
  title?: string
  as?: "button" | "link"
}

export function GoogleMapsButton({
  addresses,
  variant = "secondary",
  title = "Google Maps",
  as = "button",
}: Props) {
  const buildMapsUrl = () => {
    const uniqueAddresses = Array.from(
      new Set(addresses?.map((a) => `${a?.full_address}, Amsterdam`)),
    )

    if (!uniqueAddresses.length) {
      return ""
    }

    if (uniqueAddresses.length === 1) {
      const place = encodeURIComponent(uniqueAddresses[0])
      return `https://www.google.nl/maps/place/${place}`
    }

    const path = uniqueAddresses
      .map((address) => encodeURIComponent(address))
      .join("/")

    return `https://www.google.nl/maps/dir/${path}`
  }

  const url = buildMapsUrl()
  const disabled = !addresses || addresses.length === 0

  if (as === "link") {
    return (
      <LinkList>
        <LinkList.Link
          href={url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
          icon={<LinkExternalIcon />}
        >
          {title}
        </LinkList.Link>
      </LinkList>
    )
  }

  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Button
      variant={variant}
      iconBefore
      icon={MapMarkerOnMapIcon}
      disabled={disabled}
      onClick={handleClick}
    >
      {title}
    </Button>
  )
}

export default GoogleMapsButton
