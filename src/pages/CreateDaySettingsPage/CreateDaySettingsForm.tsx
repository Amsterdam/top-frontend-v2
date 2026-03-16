import { FormProvider } from "@amsterdam/ee-ads-rhf"
import {
  ActionGroup,
  Button,
  Heading,
  Paragraph,
  Row,
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
import { AnimatedName } from "@/animations"
import { DAY_OF_WEEK_MAP } from "@/shared/constants/dayOfWeeks"
import type { FormValues } from "./types"

type Props = {
  form: ReturnType<typeof useForm<FormValues>>
  themeName?: string
  themeId: string
  dayOfWeek?: string
  caseCount?: number
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

export default function CreateDaySettingsForm({
  form,
  themeName,
  themeId,
  dayOfWeek,
  caseCount,
  onSubmit,
  onCancel,
}: Props) {
  const nameDayOfWeek = DAY_OF_WEEK_MAP[Number(dayOfWeek)]
  const isThemeOnderhuur = themeName === "Onderhuur"

  const { formState } = form
  const ranges = useWatch({
    control: form.control,
    name: "postal_code_ranges",
  })
  const hasInvalidPostalRanges = hasPostalCodeOverlap(ranges)

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Row align="between" wrap>
        {themeName && (
          <Heading level={2}>
            <AnimatedName text={`${themeName} - ${nameDayOfWeek ?? "?"}`} />
          </Heading>
        )}

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {caseCount !== undefined && (
            <Paragraph>Aantal mogelijke bezoeken: {caseCount}</Paragraph>
          )}
          <Button
            type="submit"
            disabled={!formState.isValid || hasInvalidPostalRanges}
            icon={SaveIcon}
            iconBefore
          >
            Bereken en bewaar
          </Button>
        </div>
      </Row>

      <GeneralSettingsSection />
      <LocationSection />
      {isThemeOnderhuur && <CorporationsSection />}
      <ReasonsProjectsSection themeId={themeId} />
      <SubjectsTagsSection themeId={themeId} />
      <PlanningPrioritySection themeId={themeId} />

      <ActionGroup className="mt-5 mb-5">
        <Button
          type="submit"
          icon={SaveIcon}
          iconBefore
          disabled={!formState.isValid || hasInvalidPostalRanges}
        >
          Bereken en bewaar
        </Button>

        <Button variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
      </ActionGroup>
    </FormProvider>
  )
}
