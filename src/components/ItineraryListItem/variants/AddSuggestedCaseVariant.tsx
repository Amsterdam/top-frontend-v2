import { useEffect } from "react"
import {
  Column,
  Button,
  Row,
  Icon,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  ErrorIcon,
  PlusIcon,
  SettingsIcon,
} from "@amsterdam/design-system-react-icons"
import { Distance } from "@/components/Distance/Distance"
import { useVisitWrapperNotification } from "../visit"

type Props = {
  item: ItineraryItem
  onAdd?: (caseData: Case) => void
  status?: "idle" | "loading" | "added" | "error"
}

export function AddSuggestedCaseVariant({ item, onAdd, status }: Props) {
  const caseData = item.case
  const visitWrapperNotification = useVisitWrapperNotification()

  useEffect(() => {
    if (!visitWrapperNotification) {
      return
    }

    if (status === "added") {
      visitWrapperNotification.pushNotification({
        tone: "success",
        label: "Toegevoegd",
        icon: CheckMarkIcon,
      })
      return
    }

    if (status === "error") {
      visitWrapperNotification.pushNotification({
        tone: "error",
        label: "Toevoegen mislukt, probeer het opnieuw.",
        icon: ErrorIcon,
      })
      return
    }

    visitWrapperNotification.clearNotification()
  }, [status, visitWrapperNotification])

  useEffect(() => {
    if (!visitWrapperNotification) {
      return
    }

    return () => {
      visitWrapperNotification.clearNotification()
    }
  }, [visitWrapperNotification])

  return (
    <Column alignHorizontal="end" align="between">
      {status === "added" ? (
        visitWrapperNotification ? null : (
          <Row
            align="center"
            gap="x-small"
            style={{ color: "var(--ams-color-feedback-success)" }}
          >
            <Icon svg={CheckMarkIcon} />
            <Paragraph style={{ color: "inherit" }}>Toegevoegd</Paragraph>
          </Row>
        )
      ) : (
        <Button
          icon={status === "loading" ? SettingsIcon : PlusIcon}
          variant="secondary"
          title="Toevoegen"
          onClick={() => status === "idle" && onAdd?.(caseData!)}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Toevoegen..." : "Toevoegen"}
        </Button>
      )}
      {status === "error" && !visitWrapperNotification && (
        <Paragraph style={{ color: "var(--ams-color-feedback-error)" }}>
          Toevoegen mislukt, probeer het opnieuw.
        </Paragraph>
      )}
      <Distance distance={caseData?.distance} />
    </Column>
  )
}
