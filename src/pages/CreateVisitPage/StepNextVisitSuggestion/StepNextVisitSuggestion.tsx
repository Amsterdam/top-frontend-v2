import { Button, ActionGroup } from "@amsterdam/design-system-react"
import {
  ChevronBackwardIcon,
  ChevronForwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"
import { useParams } from "react-router"
import { RadioControl, TextAreaControl } from "@amsterdam/ee-ads-rhf-lib"
import { useFormContext, useWatch } from "react-hook-form"
import { type FormValuesVisit } from "../FormValuesVisit"
import { useItinerary } from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"

type Props = {
  onPrevStep: () => void
  onNextStep: () => void
}

export const StepNextVisitSuggestion = ({ onPrevStep, onNextStep }: Props) => {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [itinerary] = useItinerary(itineraryId)

  const items =
    itinerary?.settings?.day_settings?.team_settings
      ?.suggest_next_visit_choices || []
  const options = mapToOptions("value", "verbose", items, false)

  const { control } = useFormContext<FormValuesVisit>()
  const suggestNextVisit = useWatch({
    control,
    name: "suggest_next_visit",
  })

  const suggestNextVisitDescription = useWatch({
    control,
    name: "suggest_next_visit_description",
  })

  const disabled =
    !suggestNextVisit ||
    (suggestNextVisit === "unknown" && !suggestNextVisitDescription)

  return (
    <>
      <RadioControl<FormValuesVisit>
        label="Suggestie voor nieuw bezoekmoment?"
        name="suggest_next_visit"
        description="Geef aan wanneer een vervolgbezoek wenselijk is."
        options={options}
        registerOptions={{
          required: "Suggestie is verplicht",
        }}
        wrapperProps={{
          className: "ams-mb-l",
        }}
      />

      <TextAreaControl<FormValuesVisit>
        label="Toelichting"
        name="suggest_next_visit_description"
        placeholder="Geef hier een toelichting waarom het vervolgbezoek niet door kan gaan."
        wrapperProps={{
          className: "ams-mb-l",
        }}
        registerOptions={{
          required: "Deze vraag is verplicht",
        }}
        shouldShow={(watch) => watch("suggest_next_visit") == "unknown"}
        rows={5}
      />

      <ActionGroup>
        <Button
          onClick={onPrevStep}
          variant="secondary"
          iconBefore
          icon={ChevronBackwardIcon}
        >
          Vorige vraag
        </Button>
        {suggestNextVisit === "unknown" ? (
          <Button
            icon={SaveIcon}
            iconBefore
            disabled={disabled}
            type="submit"
          >
            Opslaan
          </Button>
        ) : (
          <Button
            onClick={onNextStep}
            icon={ChevronForwardIcon}
            disabled={disabled}
          >
            Volgende vraag
          </Button>
        )}
      </ActionGroup>
    </>
  )
}

export default StepNextVisitSuggestion
