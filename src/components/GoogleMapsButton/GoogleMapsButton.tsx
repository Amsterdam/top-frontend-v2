import { Button } from "@amsterdam/design-system-react"
import { MapMarkerOnMapIcon } from "@amsterdam/design-system-react-icons"

export function GoogleMapsButton({ addresses }: { addresses: Address[] }) {
  const buildMapsUrl = () => {
    const uniqueAddresses = Array.from(
      new Set(addresses.map((a) => `${a.full_address}, Amsterdam`)),
    )

    const path = uniqueAddresses
      .map((address) => encodeURIComponent(address))
      .join("/")

    return `https://www.google.nl/maps/dir/${path}`
  }

  const handleClick = () => {
    window.open(buildMapsUrl(), "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      variant="secondary"
      iconBefore
      icon={MapMarkerOnMapIcon}
      disabled={addresses.length === 0}
      onClick={handleClick}
    >
      Google Maps
    </Button>
  )
}

export default GoogleMapsButton
