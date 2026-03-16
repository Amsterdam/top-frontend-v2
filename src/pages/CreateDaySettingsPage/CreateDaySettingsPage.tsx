import { useState } from "react"
import {
  Button,
  Grid,
  ActionGroup,
  Heading,
  Row,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon, SettingsIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import dayjs from "dayjs"
import {
  FormProvider,
  TextInputControl,
  CheckboxControlGroup,
  DateControl,
  RadioControl,
  SelectControl,
} from "@amsterdam/ee-ads-rhf"
import { useForm, useWatch } from "react-hook-form"
import {
  useCorporations,
  useDaySetting,
  useDaySettingCasesCount,
  useDistricts,
  useTeamSettingsCaseProjects,
  useTeamSettingsReasons,
  useTeamSettingsScheduleTypes,
  useTeamSettingsStateTypes,
  useTeamSettingsSubjects,
  useTeamSettingsTags,
  useTheme,
} from "@/api/hooks"
import { AmsterdamCrossSpinner, Card, PageHeading } from "@/components"
import { AnimatedName } from "@/animations"
import { DAY_OF_WEEK_MAP } from "@/shared/constants/dayOfWeeks"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { BREAKPOINTS, useMediaQuery } from "@/hooks/useMediaQuery"
import type { FormValues } from "./form/types"
import { PostalCodeRanges } from "./form/PostalCodeRanges"
import {
  ALLOWED_POSTAL_CODE_RANGES,
  hasPostalCodeOverlap,
} from "./form/postalCodeRangeValidation"

const DEFAULT_REQUIRED_MESSAGE = "Dit veld is verplicht!"

export default function CreateDaySettingsPage() {
  const { themeId, dayOfWeek } = useParams<{
    themeId: string
    dayOfWeek: string
  }>()
  const navigate = useNavigate()
  const [theme] = useTheme(themeId!)
  const [districts] = useDistricts()
  const [reasons] = useTeamSettingsReasons(themeId!)
  const [scheduleTypes] = useTeamSettingsScheduleTypes(themeId!)
  const [stateTypes] = useTeamSettingsStateTypes(themeId!)
  const [caseProjects] = useTeamSettingsCaseProjects(themeId!)
  const [subjects] = useTeamSettingsSubjects(themeId!)
  const [tags] = useTeamSettingsTags(themeId!)
  const [corporations] = useCorporations()
  const isMobile = useMediaQuery(BREAKPOINTS.sm)
  const [daySettingsId, setDaySettingsId] = useState<number | undefined>(
    undefined,
  )

  const [, { execPost }] = useDaySetting(undefined, { lazy: true })
  const [daySetting] = useDaySettingCasesCount(daySettingsId) // Get number of available cases for this daysetting.

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      team_settings: themeId,
      opening_date: dayjs().format("YYYY-MM-DD"),
      postal_code_ranges: ALLOWED_POSTAL_CODE_RANGES,
      postal_codes_type: "stadsdeel",
      week_days: [dayOfWeek],
      name: "",
      reasons: [],
      project_ids: [],
      subjects: [],
      tags: [],
      state_types: [],
      day_segments: [],
      week_segments: [],
      priorities: [],
      districts: [],
    },
  })

  const postalCodesType = useWatch({
    control: form.control,
    name: "postal_codes_type",
  })
  const isPostalCode = postalCodesType === "postcode"

  const onSubmit = async (values: FormValues) => {
    console.log("Form values to submit:", values)
    if (hasPostalCodeOverlap(values.postal_code_ranges)) {
      return
    }
    setIsLoading(true)
    const payload = {
      ...values,
    } as DaySettingsPayload
    /*
     ** Now the default option in the back-end for combiteam is false. It does not matter if we send false or omit the field.
     ** This should be changed because Onderhuur wants to add the third option "Alle opties" which should not be interpreted as false. Until then, we will omit the field when the value is "".
     */
    if (
      values.housing_corporation_combiteam === "" ||
      values.housing_corporation_combiteam === undefined
    ) {
      delete payload.housing_corporation_combiteam
    }
    console.log("Payload before cleanup:", payload)

    execPost(payload, {})
      .then((response) => {
        console.log("API response:", response)
        setDaySettingsId(response?.id)

        // navigate(`/lijst/${response?.id}`)
      })
      .finally(() => {
        // Add slight delay to improve UX by preventing flicker. Navigation takes more time.
        setTimeout(() => {
          setIsLoading(false)
        }, 350)
      })
  }

  const { formState } = form

  const nameDayOfWeek = DAY_OF_WEEK_MAP[Number(dayOfWeek)]
  const isThemeOnderhuur = theme?.name === "Onderhuur"
  const ranges = useWatch({
    control: form.control,
    name: "postal_code_ranges",
  })
  const hasInvalidPostalRanges = hasPostalCodeOverlap(ranges)

  if (isLoading) return <AmsterdamCrossSpinner />
  return (
    <>
      <PageHeading
        icon={SettingsIcon}
        label="Toevoegen daginstelling"
        backLinkLabel="Terug"
      />
      <FormProvider form={form} onSubmit={onSubmit}>
        <Row align="between" wrap>
          {theme?.name && (
            <Heading level={2}>
              <AnimatedName text={`${theme.name} - ${nameDayOfWeek ?? "?"}`} />
            </Heading>
          )}

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {daySetting?.case_count && (
              <Paragraph>
                Aantal mogelijke bezoeken: {daySetting?.case_count?.count}
              </Paragraph>
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
        <Card title="Algemene instellingen" className="mt-3">
          <Grid gapVertical="large">
            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 6 }}>
              <TextInputControl<FormValues>
                label="Naam van de daginstelling"
                name="name"
                registerOptions={{
                  required: "Naam is verplicht",
                }}
              />
            </Grid.Cell>
            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 6 }}>
              <DateControl<FormValues>
                label="Begindatum"
                name="opening_date"
                registerOptions={{
                  required: "Begindatum is verplicht",
                }}
              />
            </Grid.Cell>
          </Grid>
        </Card>

        <Card title="Locatie & Stadsdelen" className="mt-3">
          <Grid gapVertical="large">
            <Grid.Cell span={{ narrow: 4, medium: 5, wide: 4 }}>
              <RadioControl<FormValues>
                label="Selecteer postcodes of stadsdelen"
                name="postal_codes_type"
                options={[
                  { label: "Stadsdelen", value: "stadsdeel" },
                  { label: "Postcodes", value: "postcode" },
                ]}
                registerOptions={{
                  required: DEFAULT_REQUIRED_MESSAGE,
                }}
                columns={isMobile ? 1 : 2}
              />
            </Grid.Cell>
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 9 }}>
              {isPostalCode ? (
                <PostalCodeRanges name="postal_code_ranges" />
              ) : (
                <CheckboxControlGroup<FormValues>
                  label="Stadsdelen"
                  name="districts"
                  options={mapToOptions("id", "name", districts)}
                  registerOptions={{
                    required: "Stadsdeel is verplicht",
                  }}
                  columns={isMobile ? 1 : 3}
                />
              )}
            </Grid.Cell>
          </Grid>
        </Card>

        {/* ONDERHUUR */}
        {isThemeOnderhuur && (
          <Card title="Corporaties" className="mt-3">
            <Grid gapVertical="large">
              <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
                <SelectControl<FormValues>
                  name="housing_corporation_combiteam"
                  label="Wil je deze looplijst samenlopen met een corporatie?"
                  options={[
                    { label: "Alle opties", value: "" },
                    { label: "Ja", value: "true" },
                    { label: "Nee", value: "false" },
                  ]}
                />
              </Grid.Cell>
              <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
                <CheckboxControlGroup<FormValues>
                  label="Met welke corporaties wil je dat de looplijsten gegenereerd worden?"
                  name="housing_corporations"
                  options={mapToOptions("id", "name", corporations)}
                  columns={isMobile ? 1 : 2}
                />
              </Grid.Cell>
            </Grid>
          </Card>
        )}
        {/* END ONDERHUUR */}

        <Card title="Openingsredenen & Projecten" className="mt-3">
          <Grid gapVertical="large">
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
              <CheckboxControlGroup<FormValues>
                label="Met welke openingsredenen wil je dat de looplijsten gegenereerd worden?"
                name="reasons"
                options={mapToOptions("id", "name", reasons)}
                registerOptions={{
                  required: "Minimaal één openingsreden is verplicht",
                }}
              />
            </Grid.Cell>
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
              <CheckboxControlGroup<FormValues>
                label="Met welke projecten wil je dat de looplijsten gegenereerd worden?"
                name="project_ids"
                options={mapToOptions("id", "name", caseProjects)}
              />
            </Grid.Cell>
          </Grid>
        </Card>

        <Card title="Onderwerpen & Tags" className="mt-3">
          <Grid gapVertical="large">
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
              <CheckboxControlGroup<FormValues>
                label="Met welke onderwerpen wil je dat de looplijsten gegenereerd worden?"
                name="subjects"
                options={mapToOptions("id", "name", subjects)}
              />
            </Grid.Cell>
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
              <CheckboxControlGroup<FormValues>
                label="Met welke tags wil je dat de looplijsten gegenereerd worden?"
                name="tags"
                options={mapToOptions("id", "name", tags)}
              />
            </Grid.Cell>
          </Grid>
        </Card>

        <Card title="Planning & Prioriteit" className="mt-3">
          <Grid gapVertical="large">
            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 12 }}>
              <CheckboxControlGroup<FormValues>
                label="Met welke status wil je dat de looplijsten gegenereerd worden?"
                name="state_types"
                options={mapToOptions("id", "name", stateTypes)}
                registerOptions={{
                  required: "Minimaal één status is verplicht",
                }}
              />
            </Grid.Cell>

            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
              <CheckboxControlGroup<FormValues>
                label="Welke dagdelen?"
                name="day_segments"
                options={mapToOptions(
                  "id",
                  "name",
                  scheduleTypes?.day_segments,
                )}
                registerOptions={{
                  required: "Minimaal één dagdeel is verplicht",
                }}
              />
            </Grid.Cell>

            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
              <CheckboxControlGroup<FormValues>
                label="Welke weekdelen?"
                name="week_segments"
                options={mapToOptions(
                  "id",
                  "name",
                  scheduleTypes?.week_segments,
                )}
                registerOptions={{
                  required: "Minimaal één weekdeel is verplicht",
                }}
              />
            </Grid.Cell>
            <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
              <CheckboxControlGroup<FormValues>
                label="Prioriteiten"
                name="priorities"
                options={mapToOptions("id", "name", scheduleTypes?.priorities)}
                registerOptions={{
                  required: "Minimaal één prioriteit is verplicht",
                }}
              />
            </Grid.Cell>
          </Grid>
        </Card>

        <ActionGroup className="mt-5 mb-5">
          <Button
            type="submit"
            disabled={!formState.isValid}
            icon={SaveIcon}
            iconBefore
          >
            Bereken en bewaar
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`/team-settings/${themeId}`)}
          >
            Annuleren
          </Button>
        </ActionGroup>
      </FormProvider>
    </>
  )
}
