import { Button, ActionGroup } from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {
  ChevronBackwardIcon,
  ChevronForwardIcon,
} from "@amsterdam/design-system-react-icons"
import { CheckboxControlGroup } from "@amsterdam/ee-ads-rhf"
import { type FormValuesVisit } from "../FormValuesVisit"
import { useItinerary } from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"

type Props = {
  onPrevStep: () => void
  onNextStep: () => void
}

export const StepObservations = ({ onPrevStep, onNextStep }: Props) => {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [itinerary] = useItinerary(itineraryId)

  const items =
    itinerary?.settings?.day_settings?.team_settings?.observation_choices || []
  const options = mapToOptions("value", "verbose", items, false)

  return (
    <>
      <CheckboxControlGroup<FormValuesVisit>
        label="Waren er opvallende zaken?"
        name="observations"
        description="Ondanks dat je niet binnen bent geweest. Vielen er nog andere dingen op?"
        options={options}
        wrapperProps={{
          className: "ams-mb-l",
        }}
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
        <Button onClick={onNextStep} icon={ChevronForwardIcon}>
          Volgende vraag
        </Button>
      </ActionGroup>
    </>
  )
}

export default StepObservations
