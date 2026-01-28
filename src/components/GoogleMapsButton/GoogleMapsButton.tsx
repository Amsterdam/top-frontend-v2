import { Button, type ButtonProps } from "@amsterdam/design-system-react"
import { MapMarkerOnMapIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  addresses?: Address[]
  variant?: ButtonProps["variant"]
  title?: string
}

export function GoogleMapsButton({
  addresses,
  variant = "secondary",
  title = "Google Maps",
}: Props) {
  const buildMapsUrl = () => {
    const uniqueAddresses = Array.from(
      new Set(addresses?.map((a) => `${a.full_address}, Amsterdam`)),
    )

    if (uniqueAddresses.length === 0) {
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

  const handleClick = () => {
    const url = buildMapsUrl()
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Button
      variant={variant}
      iconBefore
      icon={MapMarkerOnMapIcon}
      disabled={!addresses || addresses.length === 0}
      onClick={handleClick}
    >
      {title}
    </Button>
  )
}

export default GoogleMapsButton
