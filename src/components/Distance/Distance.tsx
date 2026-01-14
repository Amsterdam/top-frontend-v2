import { Heading } from "@amsterdam/design-system-react"

type Props = {
  distance?: number
}

export function Distance({ distance }: Props) {
  if (distance === undefined || distance === null) return null

  const formattedDistance =
    distance < 1000
      ? `${Math.round(distance)} m`
      : `${(distance / 1000).toFixed(1)} km`

  return <Heading level={3}>{formattedDistance}</Heading>
}
