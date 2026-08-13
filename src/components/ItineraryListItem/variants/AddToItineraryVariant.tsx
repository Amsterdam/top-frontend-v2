import { useState } from "react"
import {
  Button,
  Column,
  Icon,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  PlusIcon,
  SettingsIcon,
} from "@amsterdam/design-system-react-icons"
import {
  useCreateItineraryItem,
  useItinerariesSummary,
  useItinerary,
} from "@/api/hooks"
import { getTopPosition } from "@/shared"

type Props =
  | {
      item: ItineraryItem
      caseData?: never
    }
  | {
      item?: never
      caseData: Case
    }

export function AddToItineraryVariant(props: Props) {
  const caseData = "caseData" in props ? props.caseData : props.item.case
  const { data: itineraries } = useItinerariesSummary()
  const createItineraryItem = useCreateItineraryItem()
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
    "idle",
  )

  const caseThemeName = caseData?.theme?.name

  const matchingItineraries = (itineraries ?? []).filter(
    (itinerary) => itinerary.theme === caseThemeName,
  )

  const targetItinerary = matchingItineraries[0]

  const { data: targetItineraryDetail } = useItinerary(
    targetItinerary ? String(targetItinerary.id) : undefined,
  )

  if (!caseData) {
    return null
  }

  // Case ids come back as numeric strings from some endpoints and numbers
  // from others (despite the shared Case type claiming number), so compare
  // as strings rather than risk a Number()/string mismatch that's always false.
  const isAlreadyInTargetItinerary = targetItineraryDetail?.items?.some(
    (i) => String(i.case.id) === String(caseData.id),
  )

  const onAdd = async () => {
    if (!targetItinerary || isAlreadyInTargetItinerary) return

    setStatus("loading")
    try {
      await createItineraryItem.mutateAsync({
        itinerary: targetItinerary.id,
        id: caseData.id,
        position: getTopPosition(targetItineraryDetail?.items),
        case: caseData,
      })
      setStatus("added")
    } catch {
      setStatus("error")
    }
  }

  if (status === "added" && targetItinerary) {
    return (
      <Row
        align="center"
        gap="x-small"
        style={{ color: "var(--ams-color-feedback-success)" }}
      >
        <Icon svg={CheckMarkIcon} />
        <Paragraph style={{ color: "inherit" }}>
          Toegevoegd aan {targetItinerary.theme} –{" "}
          {targetItinerary.day_settings_name}
        </Paragraph>
      </Row>
    )
  }

  return (
    <Column alignHorizontal="end" gap="small">
      {matchingItineraries.length > 0 && (
        <>
          {caseData.teams && caseData.teams.length > 0 ? (
            <Row
              align="center"
              gap="x-small"
              style={{ color: "var(--ams-color-interactive)" }}
            >
              <Icon svg={CheckMarkIcon} />
              <Paragraph style={{ color: "inherit" }}>
                {`In looplijst van ${caseData.teams[0]
                  .map((t) => t.user.full_name)
                  .join(", ")}`}
              </Paragraph>
            </Row>
          ) : (
            <Button
              icon={status === "loading" ? SettingsIcon : PlusIcon}
              title="Toevoegen aan looplijst"
              onClick={onAdd}
              disabled={status === "loading"}
              variant="secondary"
            >
              {status === "loading"
                ? "Toevoegen aan looplijst..."
                : "Toevoegen aan looplijst"}
            </Button>
          )}
          {status === "error" && (
            <Paragraph style={{ color: "var(--ams-color-feedback-error)" }}>
              Toevoegen mislukt, probeer het opnieuw.
            </Paragraph>
          )}
        </>
      )}
    </Column>
  )
}
