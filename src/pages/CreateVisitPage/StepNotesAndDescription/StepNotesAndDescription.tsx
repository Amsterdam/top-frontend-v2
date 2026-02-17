import { Button, ActionGroup } from "@amsterdam/design-system-react"
import { TextAreaControl } from "@amsterdam/ee-ads-rhf"
import {
  ChevronBackwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"
import { type FormValuesVisit } from "../FormValuesVisit"

type Props = {
  onPrevStep: () => void
}

export const StepNotesAndDescription = ({ onPrevStep }: Props) => {
  return (
    <>
      <TextAreaControl<FormValuesVisit>
        label="Eigen notitie voor rapportage"
        name="personal_notes"
        placeholder="Eigen notities voor rapportage en debrief (alleen zichtbaar voor je team, niet in logboek of zaakhistorie AZA)."
        className="ams-mb-l"
        rows={5}
      />

      <TextAreaControl<FormValuesVisit>
        label="Korte samenvatting voor logboek"
        name="description"
        placeholder="Deze korte toelichting van je bezoek is voor iedereen zichtbaar in AZA."
        className="ams-mb-l"
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
        <Button icon={SaveIcon} iconBefore type="submit">
          Opslaan
        </Button>
      </ActionGroup>
    </>
  )
}

export default StepNotesAndDescription
