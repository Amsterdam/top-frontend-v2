import { useFormContext } from "react-hook-form"
import { Grid, InvalidFormAlert } from "@amsterdam/design-system-react"
import { mapErrorsToAlert } from "@amsterdam/ee-ads-rhf"
import type { TopLevelFieldName } from "../fieldDefinitions"

type Props = {
  /** The step's fields in page order, so the errors are listed in that order too. */
  fieldNames: readonly TopLevelFieldName[]
}

/**
 * The InvalidFormAlert at the top of a step with the errors of its own fields; errors of
 * fields on other steps (kept by react-hook-form while they aren't rendered) are left out.
 * It doesn't take focus itself: StepActions focuses it when "Volgende stap" is blocked, also
 * on a second try.
 */
export function StepInvalidFormAlert({ fieldNames }: Props) {
  const {
    formState: { errors },
  } = useFormContext<GebruikersinvoerFormValues>()

  const alertErrors = mapErrorsToAlert(
    Object.fromEntries(
      fieldNames
        .filter((name) => errors[name])
        .map((name) => [name, errors[name]]),
    ),
  )
  if (alertErrors.length === 0) return null

  return (
    <Grid.Cell span="all" appearance="transparent">
      <InvalidFormAlert
        errors={alertErrors}
        focusOnRender={false}
        headingLevel={2}
      />
    </Grid.Cell>
  )
}
