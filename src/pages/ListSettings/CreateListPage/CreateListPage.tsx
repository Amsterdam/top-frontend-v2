import { useEffect, useState } from "react"
import {
  Button,
  Grid,
  Label,
  Row,
  Column,
} from "@amsterdam/design-system-react"
import { useLocation, useNavigate, useParams } from "react-router"
import {
  FormProvider,
  TextInputControl,
  RadioControl,
} from "@amsterdam/ee-ads-rhf-lib"
import { useForm, useWatch } from "react-hook-form"
import { useItinerary, useTeamSettingsOptions, useTheme } from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { useCurrentUser, useUserOptions } from "@/hooks"
import {
  AmsterdamCrossSpinner,
  PageHeading,
  ReactRouterLink,
  SmallCaseCard,
} from "@/components"
import { TeamMembersFields } from "@/forms/components/TeamMembersFields"
import { FootprintsIcon } from "@/icons/FootprintsIcon"

type FormValues = {
  teamMembers: string[]
  daySettingsId: string
  numAddresses: number
  startCase?: Case
}

export default function CreateListPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [theme] = useTheme(themeId!)
  const currentUser = useCurrentUser()
  const userOptions = useUserOptions()

  const weekday = (new Date().getDay() + 6) % 7
  const [teamSettingsDayOptionsData] = useTeamSettingsOptions(themeId, weekday)
  const [, { execPost }] = useItinerary()
  const [isLoading, setIsLoading] = useState(false)

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

  // Watch numAddresses to pass it to the search page in the state.
  // Otherwise TextinputControl is not passing the updated value on navigation.
  const numAddresses = useWatch({
    control: form.control,
    name: "numAddresses",
  })

  const startCase = useWatch({
    control: form.control,
    name: "startCase",
  })

  useEffect(() => {
    // Set the current user as the first team member once it has been loaded.
    // Default values are only applied on initial mount, so async data
    // must be set explicitly after the form is initialized.
    if (currentUser?.id && !teamMembers?.[0]) {
      form.setValue("teamMembers.0", currentUser.id)
    }
  }, [currentUser?.id, teamMembers, form])

  const teamSettingsDayOptions = mapToOptions(
    "id",
    "name",
    teamSettingsDayOptionsData,
    false,
  )

  useEffect(() => {
    if (
      teamSettingsDayOptionsData &&
      teamSettingsDayOptionsData.length > 0 &&
      !form.getValues("daySettingsId")
    ) {
      form.setValue("daySettingsId", String(teamSettingsDayOptionsData[0].id), {
        shouldValidate: true,
      })
    }
  }, [teamSettingsDayOptionsData, form])

  useEffect(() => {
    // Set form values from location state if available
    const formValues = location.state?.formValues

    if (formValues) {
      // Reset het formulier met alle bestaande values
      form.reset(formValues)

      // Indien startAddress aanwezig, zet het als startAddress
      if (formValues.startAddress) {
        form.setValue("startCase", formValues.startCase)
      }
    }
  }, [location.state, form])

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    const createdAt = new Date().toISOString().split("T")[0]
    const payload = {
      created_at: createdAt,
      team_members: values.teamMembers.map((id) => ({
        user: { id },
      })),
      day_settings_id: Number(values.daySettingsId),
      target_length: values.numAddresses,
      start_case: values.startCase ? { id: values.startCase.id } : {},
    }
    execPost(payload, {
      clearCacheKeys: ["/itineraries"],
    })
      .then((response) => {
        navigate(`/lijst/${response?.id}`)
      })
      .catch(() => {
        console.log("Error creating itinerary")
      })
      .finally(() => {
        // Add slight delay to improve UX by preventing flicker. Navigation takes more time.
        setTimeout(() => {
          setIsLoading(false)
        }, 350)
      })
  }

  const { formState } = form

  if (isLoading) return <AmsterdamCrossSpinner />

  return (
    <>
      <PageHeading
        icon={FootprintsIcon}
        label={`Genereer looplijst (${theme?.name})`}
      />

      <FormProvider form={form} onSubmit={onSubmit}>
        <Grid paddingBottom="x-large" paddingTop="large">
          <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }}>
            <TeamMembersFields
              teamMembers={teamMembers}
              userOptions={userOptions}
            />

            <RadioControl<FormValues>
              label="Wat voor looplijst wil je maken?"
              name="daySettingsId"
              options={teamSettingsDayOptions}
              registerOptions={{
                required: "Daginstelling is verplicht",
              }}
              className="ams-mb-l"
            />

            <TextInputControl<FormValues>
              label="Hoeveel zaken wil je in je looplijst? (Max. 20)"
              name="numAddresses"
              inputMode="numeric"
              size={2}
              registerOptions={{
                valueAsNumber: true,
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
              className="ams-mb-l"
            />

            <Column>
              <Label optional>Startadres</Label>
              {startCase ? (
                <SmallCaseCard
                  caseData={startCase}
                  onRemove={() => form.setValue("startCase", undefined)}
                />
              ) : (
                <ReactRouterLink
                  to="zoeken"
                  state={{
                    formValues: {
                      ...form.getValues(),
                      numAddresses,
                    },
                  }}
                >
                  Kies een startadres
                </ReactRouterLink>
              )}
            </Column>
            <Row gap="x-large" className="mt-6">
              <Button
                type="submit"
                disabled={!formState.isValid}
                icon={FootprintsIcon}
                iconBefore
              >
                Genereer looplijst
              </Button>
              <Button
                variant="tertiary"
                onClick={() => navigate("/lijst-instellingen")}
              >
                Annuleer
              </Button>
            </Row>
          </Grid.Cell>
        </Grid>
      </FormProvider>
    </>
  )
}
