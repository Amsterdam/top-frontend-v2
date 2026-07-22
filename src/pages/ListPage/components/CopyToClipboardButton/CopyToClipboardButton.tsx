import { useState } from "react"
import { Button } from "@amsterdam/design-system-react"
import {
  ClipboardIcon,
  CheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import itineraryToClipboardText from "./itineraryToClipboardText"

export function CopyToClipboardButton({ itinerary }: { itinerary: Itinerary }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const text = itinerary.items
        .map((item) => itineraryToClipboardText(item?.case))
        .join("\n")
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Kopiëren mislukt", error)
    }
  }

  return (
    <Button
      icon={copied ? CheckMarkIcon : ClipboardIcon}
      onClick={handleCopy}
      variant="secondary"
    >
      {copied ? "Gekopieerd!" : "Kopieer naar klembord"}
    </Button>
  )
}

export default CopyToClipboardButton
