import { Column, StandaloneLink } from "@amsterdam/design-system-react"
import { LinkExternalIcon } from "@amsterdam/design-system-react-icons"

export function formatCurrencyEUR(value: unknown) {
  if (typeof value !== "number") return value

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value)
}

const PERSON_ROLE_MAP: Record<string, string> = {
  PERSON_ROLE_OWNER: "Eigenaar",
  PERSON_ROLE_RESIDENT: "Bewoner",
  PERSON_ROLE_MIDDLEMAN: "Tussenpersoon",
  PERSON_ROLE_PLATFORM: "Platform",
  PERSON_ROLE_HEIR: "Erfgenaam",
  PERSON_ROLE_LANDLORD: "Verhuurder",
}

export function formatPersons(value: unknown) {
  if (!Array.isArray(value)) return value

  return value
    .map((person) => {
      if (typeof person !== "object" || person === null) return ""

      const {
        first_name,
        preposition,
        last_name,
        person_role,
        entity_name,
        function: roleFunction,
      } = person as Record<string, string | null>

      // Bouw naam of gebruik entity_name als naam leeg is
      const nameParts = [first_name, preposition, last_name].filter(Boolean)
      const name =
        nameParts.length > 0 ? nameParts.join(" ") : (entity_name ?? "")

      // Voeg function toe aan het begin indien aanwezig
      const nameWithFunction = roleFunction ? `${roleFunction}, ${name}` : name

      // Vertaal de rol
      const role = person_role
        ? (PERSON_ROLE_MAP[person_role] ?? person_role)
        : ""

      return role ? `${nameWithFunction} (${role})` : nameWithFunction
    })
    .filter(Boolean)
    .join(" en ")
}

function getLinkLabel(url: string, index: number) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return `Advertentie ${index + 1}`
  }
}

export function formatLinklist(value: unknown) {
  const urls = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []

  if (urls.length === 0) return undefined

  return (
    <Column gap="x-small">
      {urls.map((url, index) => (
        <StandaloneLink
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          icon={<LinkExternalIcon />}
        >
          {getLinkLabel(url, index)}
        </StandaloneLink>
      ))}
    </Column>
  )
}
