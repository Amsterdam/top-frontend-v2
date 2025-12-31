import { useEffect } from "react"
import {
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import dayjs from "dayjs"
import { AmsterdamCrossSpinner, Divider } from "@/components"
import { useItinerary, useItineraryChangeTeamMembers } from "@/api/hooks"
import { useCurrentUser, useUserOptions } from "@/hooks"
import { FormProvider } from "@amsterdam/ee-ads-rhf-lib"
import { TeamMembersFields } from "@/forms/components/TeamMembersFields"

type FormValues = {
  teamMembers: string[]
}

export default function ChangeTeamPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const navigate = useNavigate()
  const [itinerary, { isBusy, execGet }] = useItinerary(itineraryId, { lazy: true })
  const [, { execPut, isBusy: isUpdating }] =
    useItineraryChangeTeamMembers(itineraryId)
  const currentUser = useCurrentUser()
  const userOptions = useUserOptions()

  useEffect(() => {
    if (!itinerary && !isUpdating && itineraryId) {
      execGet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary, itineraryId])

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      teamMembers: itinerary?.team_members.map((member) => member.user.id),
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
    if (itinerary) {
      form.setValue(
        "teamMembers",
        itinerary?.team_members.map((member) => member.user.id),
      )
    }
  }, [form, itinerary])

  const onSubmit = async (values: FormValues) => {
    const payload = {
      team_members: values.teamMembers.map((id) => ({
        user: { id },
      })),
    }
    execPut(payload, {
      clearCacheKeys: ["/itineraries"],
    }).then(() => {
      navigate(`/lijst/${itineraryId}`)
    })
  }

  const { formState } = form

  if (isBusy || !itinerary || isUpdating) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <>
      <div>
        <Column gap="none">
          <Heading
            level={2}
            className="mb-3"
          >{`Wijzig teamleden looplijst ${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}</Heading>
          <Heading level={3}>
            {itinerary?.settings.day_settings.team_settings.name} –{" "}
            {itinerary?.settings.day_settings.name}
          </Heading>
          <Paragraph>
            {itinerary?.team_members
              .map((member) => member.user.full_name)
              .join(", ")}
          </Paragraph>
        </Column>
        <Divider />
        <FormProvider form={form} onSubmit={onSubmit}>
          <Grid paddingBottom="x-large" paddingTop="large">
            <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }}>
              <TeamMembersFields
                teamMembers={teamMembers}
                userOptions={userOptions}
                showCurrentUserWarning
                currentUserId={currentUser?.id}
              />

              <Row gap="x-large">
                <Button type="submit" disabled={!formState.isValid}>
                  Opslaan
                </Button>
                <Button variant="tertiary" onClick={() => navigate(-1)}>
                  Terug
                </Button>
              </Row>
            </Grid.Cell>
          </Grid>
        </FormProvider>
      </div>
    </>
  )
}
