import { Button, Paragraph, ActionGroup } from "@amsterdam/design-system-react"
import { RadioControl, TextAreaControl } from "@amsterdam/ee-ads-rhf"
import { useFormContext, useWatch } from "react-hook-form"
import {
  ChevronBackwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"
import { type FormValuesVisit } from "../FormValuesVisit"

type Props = {
  onPrevStep: () => void
}

export const StepCanNextVisitGoAhead = ({ onPrevStep }: Props) => {
  const options = [
    { value: "yes", label: "Ja, doorlaten" },
    { value: "no", label: "Nee, tegenhouden" },
  ]

  const { control } = useFormContext<FormValuesVisit>()
  const canGoAheadValue = useWatch({
    control,
    name: "can_next_visit_go_ahead",
  })

  const canNextVisitGoAheadDescriptionNo = useWatch({
    control,
    name: "can_next_visit_go_ahead_description_no",
  })

  const disabled =
    !canGoAheadValue ||
    (canGoAheadValue === "no" && !canNextVisitGoAheadDescriptionNo)

  return (
    <>
      <RadioControl<FormValuesVisit>
        label="Wat is de juiste vervolgstap voor deze zaak?"
        name="can_next_visit_go_ahead"
        description={
          <Paragraph className="ams-mb-l">
            Kies of de zaak direct kan worden uitgezet of eerst moet worden
            tegengehouden. <strong>Doorlaten</strong> betekent dat de zaak
            zonder tussenkomst weer in een looplijst terechtkomt.{" "}
            <strong>Tegenhouden</strong> betekent dat de zaak niet direct kan
            worden uitgezet, bijvoorbeeld omdat een machtiging vereist is.
          </Paragraph>
        }
        options={options}
        registerOptions={{
          required: "Deze vraag is verplicht",
        }}
        wrapperProps={{
          className: "ams-mb-l",
        }}
      />

      <TextAreaControl<FormValuesVisit>
        label="Aanvullende informatie"
        name="can_next_visit_go_ahead_description_yes"
        placeholder="Zijn er nog noemenswaardigheden? Geef die hier aan."
        className="ams-mb-l"
        shouldShow={(watch) => watch("can_next_visit_go_ahead") === "yes"}
        rows={5}
      />

      <TextAreaControl<FormValuesVisit>
        label="Toelichting"
        name="can_next_visit_go_ahead_description_no"
        placeholder="Geef hier een toelichting waarom het vervolgbezoek niet door kan gaan."
        registerOptions={{
          required: "Toelichting is verplicht",
        }}
        className="ams-mb-l"
        shouldShow={(watch) => watch("can_next_visit_go_ahead") === "no"}
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
        <Button type="submit" disabled={disabled} icon={SaveIcon} iconBefore>
          Opslaan
        </Button>
      </ActionGroup>
    </>
  )
}

export default StepCanNextVisitGoAhead
