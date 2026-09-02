import { Alert, Button, Paragraph } from "@amsterdam/design-system-react"
import { PlusIcon, SettingsIcon } from "@amsterdam/design-system-react-icons"
import type { AddToItinerary } from "./useAddToItinerary"

type AddToItineraryButtonProps = Pick<
  AddToItinerary,
  "canAdd" | "onAdd" | "status"
>

export function AddToItineraryButton({
  canAdd,
  onAdd,
  status,
}: AddToItineraryButtonProps) {
  if (!canAdd || status === "added") {
    return null
  }

  return (
    <Button
      disabled={status === "loading"}
      icon={status === "loading" ? SettingsIcon : PlusIcon}
      onClick={onAdd}
      title="Toevoegen aan looplijst"
      variant="secondary"
    >
      {status === "loading"
        ? "Toevoegen aan looplijst..."
        : "Toevoegen aan looplijst"}
    </Button>
  )
}

type AddToItineraryAlertProps = {
  addToItinerary: AddToItinerary
}

export function AddToItineraryAlert({
  addToItinerary,
}: AddToItineraryAlertProps) {
  const {
    caseData,
    caseThemeName,
    hasItineraries,
    hasItinerariesSummarySuccess,
    hasMatchingItinerary,
    status,
    targetItinerary,
  } = addToItinerary

  if (!caseData) {
    return null
  }

  if (status === "added") {
    return targetItinerary ? (
      <Alert
        closeable={false}
        heading="Toegevoegd aan looplijst"
        headingLevel={2}
        severity="success"
      >
        <Paragraph>
          Toegevoegd aan {targetItinerary.theme} –{" "}
          {targetItinerary.day_settings_name}
        </Paragraph>
      </Alert>
    ) : null
  }

  if (hasItinerariesSummarySuccess && !hasItineraries) {
    return (
      <Alert
        closeable={false}
        heading="Geen looplijst beschikbaar"
        headingLevel={2}
      >
        <Paragraph>
          Maak eerst een looplijst aan voordat je een zaak toevoegt.
        </Paragraph>
      </Alert>
    )
  }

  if (hasItinerariesSummarySuccess && !hasMatchingItinerary) {
    return (
      <Alert
        closeable={false}
        heading="Kan niet toevoegen aan looplijst"
        headingLevel={2}
        severity="error"
      >
        <Paragraph>
          {`Thema ${caseThemeName} kan niet aan deze looplijst worden toegevoegd.`}
        </Paragraph>
      </Alert>
    )
  }

  return (
    <>
      {caseData.teams && caseData.teams.length > 0 && (
        <Alert
          closeable={false}
          heading="In looplijst"
          headingLevel={2}
          severity="success"
        >
          <Paragraph>
            {`In looplijst van ${caseData.teams[0]
              .map((teamMember) => teamMember.user.full_name)
              .join(", ")}`}
          </Paragraph>
        </Alert>
      )}
      {status === "error" && (
        <Alert
          closeable={false}
          heading="Toevoegen mislukt"
          headingLevel={2}
          severity="error"
        >
          <Paragraph>Probeer het opnieuw.</Paragraph>
        </Alert>
      )}
    </>
  )
}
