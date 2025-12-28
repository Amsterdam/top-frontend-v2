import { useState } from "react"
import { IconButton } from "@amsterdam/design-system-react"
import {
  ClipboardIcon,
  CheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import itineraryToClipboardText from "./itineraryToClipboardText"

type Itinerary = components["schemas"]["Itinerary"]

export function CopyToClipboardButton({ itinerary }: { itinerary: Itinerary }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const text = itinerary.items
        .map((item) => itineraryToClipboardText(item.case.data as Case))
        .join("\n")
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Kopiëren mislukt", error)
    }
  }

  return (
    <IconButton
      svg={copied ? CheckMarkIcon : ClipboardIcon}
      label="Kopieer naar klembord"
      title={copied ? "Gekopieerd!" : "Kopieer naar klembord"}
      size="heading-1"
      onClick={handleCopy}
      style={{
        color: copied ? "#00a03c" : undefined,
        transition: "color 300ms ease",
      }}
    />
  )
}

export default CopyToClipboardButton
