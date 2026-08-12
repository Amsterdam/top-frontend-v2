import { FormProvider } from "@amsterdam/ee-ads-rhf"
import {
  ActionGroup,
  Button,
  Paragraph,
  Row,
  Column,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { useForm, useWatch } from "react-hook-form"

import { GeneralSettingsSection } from "./sections/GeneralSettingsSection"
import { LocationSection } from "./sections/LocationSection"
import { CorporationsSection } from "./sections/CorporationsSection"
import { ReasonsProjectsSection } from "./sections/ReasonsProjectsSection"
import { SubjectsTagsSection } from "./sections/SubjectsTagsSection"
import { PlanningPrioritySection } from "./sections/PlanningPrioritySection"
import { hasPostalCodeOverlap } from "./form/postalCodeRangeValidation"
import type { FormValues } from "./types"

type Props = {
  form: ReturnType<typeof useForm<FormValues>>
  themeName?: string
  themeId: string
  dayOfWeek?: string | number
  caseCount?: number
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

export default function DaySettingsForm({
  form,
  themeName,
  themeId,
  caseCount,
  onSubmit,
  onCancel,
}: Props) {
  const isThemeOnderhuur = themeName === "Onderhuur"

  const { formState } = form
  const ranges = useWatch({
    control: form.control,
    name: "postal_code_ranges",
  })
  const hasInvalidPostalRanges = hasPostalCodeOverlap(ranges)

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Column gap="large">
        <GeneralSettingsSection />
        <LocationSection />
        {isThemeOnderhuur && <CorporationsSection />}
        <ReasonsProjectsSection themeId={themeId} />
        <SubjectsTagsSection themeId={themeId} />
        <PlanningPrioritySection themeId={themeId} />
        <Row wrap>
          <ActionGroup>
            <Button
              type="submit"
              disabled={!formState.isValid || hasInvalidPostalRanges}
              icon={SaveIcon}
              iconBefore
            >
              Bereken en bewaar
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Annuleren
            </Button>
          </ActionGroup>
          {caseCount !== undefined && (
            <Paragraph>Aantal mogelijke bezoeken: {caseCount}</Paragraph>
          )}
        </Row>
      </Column>
    </FormProvider>
  )
}
