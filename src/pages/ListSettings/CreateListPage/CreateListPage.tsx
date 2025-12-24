import { useEffect } from "react"
import { Button, Grid, Heading, Row } from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import {
  FormProvider,
  SelectControl,
  TextInputControl,
  RadioControl,
} from "@amsterdam/ee-ads-rhf-lib"
import { useForm, useWatch } from "react-hook-form"
import {
  useItinerary,
  useTeamSettingsOptions,
  useTheme,
  useUsers,
} from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { useCurrentUser } from "@/hooks"
import { AmsterdamTicTacToeLoader } from "@/components"

type FormValues = {
  teamMembers: string[]
  daySettingsId: string
  numAddresses: number
  startAddress?: Record<string, unknown>
}

const TEAM_LABELS = ["Toezichthouder 1", "Toezichthouder 2", "Handhaver"]

export default function CreateListPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const navigate = useNavigate()

  const [theme] = useTheme(themeId!)
  const [usersData] = useUsers()
  const currentUser = useCurrentUser()

  const weekday = (new Date().getDay() + 6) % 7
  const [teamSettingsDayOptionsData] = useTeamSettingsOptions(themeId, weekday)
  const [, { execPost, isBusy }] = useItinerary()

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      teamMembers: ["", "", ""],
      numAddresses: 8,
    },
  })

  const teamMembers = useWatch({
    control: form.control,
    name: "teamMembers",
  })

  useEffect(() => {
    // Set the current user as the first team member once it has been loaded.
    // Default values are only applied on initial mount, so async data
    // must be set explicitly after the form is initialized.
    if (currentUser?.id && !teamMembers[0]) {
      form.setValue("teamMembers.0", currentUser.id)
    }
  }, [currentUser?.id, teamMembers, form])

  const users = usersData ? usersData.results : []
  const userOptions = mapToOptions("id", "full_name", users)

  const filteredUserOptions = (excludeIds: (string | undefined)[]) =>
    userOptions.filter(
      (option) => !excludeIds.includes(option.value) || option.value === "",
    )

  const teamSettingsDayOptions = mapToOptions(
    "id",
    "name",
    teamSettingsDayOptionsData,
    false,
  )

  const onSubmit = async (values: FormValues) => {
    const createdAt = new Date().toISOString().split("T")[0]
    const payload = {
      created_at: createdAt,
      team_members: values.teamMembers.map((id) => ({
        user: { id },
      })),
      day_settings_id: Number(values.daySettingsId),
      target_length: values.numAddresses,
      start_case: values.startAddress ?? {},
    }
    const response = await execPost(payload, {
      clearCacheKeys: ["/itineraries"],
    })

    if (response?.id) {
      navigate(`/lijst/${response.id}`)
    }
  }

  const { formState } = form

  if (isBusy) return <AmsterdamTicTacToeLoader />

  return (
    <>
      <Heading level={1}>Genereer looplijst</Heading>
      <Heading level={2}>{theme?.name}</Heading>

      <FormProvider form={form} onSubmit={onSubmit}>
        <Grid paddingBottom="x-large" paddingTop="x-large">
          <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }}>
            {TEAM_LABELS.map((label, index) => (
              <SelectControl<FormValues>
                key={label}
                label={label}
                name={`teamMembers.${index}`}
                options={filteredUserOptions(
                  teamMembers?.filter((_, i) => i !== index),
                )}
                registerOptions={{
                  required: `${label} is verplicht`,
                }}
                className="ams-mb-xl"
              />
            ))}

            <RadioControl<FormValues>
              label="Wat voor looplijst wil je maken?"
              name="daySettingsId"
              options={teamSettingsDayOptions}
              registerOptions={{
                required: "Daginstelling is verplicht",
              }}
              className="ams-mb-xl"
            />

            <TextInputControl<FormValues>
              label="Hoeveel zaken wil je in je looplijst? (Max. 20)"
              name="numAddresses"
              inputMode="numeric"
              size={2}
              registerOptions={{
                required: "Aantal adressen is verplicht",
                min: {
                  value: 1,
                  message: "Minimaal 1 adres",
                },
                max: {
                  value: 20,
                  message: "Maximaal 20 adressen",
                },
              }}
              className="ams-mb-xl"
            />

            <Row gap="x-large">
              <Button type="submit" disabled={!formState.isValid}>
                Genereer looplijst
              </Button>
              <Button
                variant="tertiary"
                onClick={() => navigate("/lijst-instellingen")}
              >
                Terug
              </Button>
            </Row>
          </Grid.Cell>
        </Grid>
      </FormProvider>
    </>
  )
}
