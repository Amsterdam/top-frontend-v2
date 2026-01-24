import { ActionGroup, Button } from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import dayjs from "dayjs"
import { RadioControl, TimeControl } from "@amsterdam/ee-ads-rhf-lib"
import type { FormValuesVisit } from "../FormValuesVisit"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  onNextStep: () => void
}

function StepSituation({ onNextStep }: Props) {
  const { control } = useFormContext<FormValuesVisit>()
  const startTimeValue = useWatch({
    control,
    name: "start_time",
  })

  const otherStartTimeValue = useWatch({
    control,
    name: "start_time_other",
  })

  const situation = useWatch({
    control,
    name: "situation",
  })

  const disabled =
    !situation ||
    !startTimeValue ||
    (startTimeValue === "other" && !otherStartTimeValue)

  const now = dayjs().format("HH:mm")

  return (
    <>
      <RadioControl<FormValuesVisit>
        label="Starttijd onderzoek"
        name="start_time"
        options={[
          { label: `Nu (${now})`, value: now },
          { label: "Anders...", value: "other" },
        ]}
        registerOptions={{
          required: "Starttijd is verplicht",
        }}
        wrapperProps={{
          className: "ams-mb-l",
        }}
      />

      <TimeControl<FormValuesVisit>
        label=""
        name="start_time_other"
        inputMode="text"
        registerOptions={{
          required: "Starttijd is verplicht",
        }}
        className="ams-mb-l"
        shouldShow={(watch) => watch("start_time") === "other"}
      />

      <RadioControl<FormValuesVisit>
        label="Welke situatie is van toepassing?"
        name="situation"
        options={[
          { label: "Niemand aanwezig", value: "nobody_present" },
          { label: "Geen medewerking", value: "no_cooperation" },
          { label: "Toegang verleend", value: "access_granted" },
        ]}
        registerOptions={{
          required: "Situatie is verplicht",
        }}
        wrapperProps={{
          className: "ams-mb-l",
        }}
      />
      <ActionGroup>
        <Button
          onClick={onNextStep}
          icon={ChevronForwardIcon}
          disabled={disabled}
        >
          Volgende vraag
        </Button>
      </ActionGroup>
    </>
  )
}

export default StepSituation
