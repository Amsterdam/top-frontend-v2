import { useEffect } from "react"
import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import dayjs from "dayjs"
import { AmsterdamCrossSpinner } from "@/components"
import { useItinerary, useItineraryChangeTeamMembers } from "@/api/hooks"
import { useCurrentUser, useUserOptions } from "@/hooks"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { TeamMembersFields } from "@/forms/components/TeamMembersFields"

type FormValues = {
  teamMembers: string[]
}

export default function TeamMemberUpdatePage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const navigate = useNavigate()
  const [itinerary, { isBusy, execGet, updateCache }] = useItinerary(
    itineraryId,
    {
      lazy: true,
    },
  )
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
    // Check if current user is in team members
    // If not, clear itineraries cache to prevent access issues
    const isCurrentUserInTeam =
      !!currentUser?.id && values.teamMembers.includes(currentUser.id)

    const clearCacheKeys: string[] = isCurrentUserInTeam ? [] : ["/itineraries"]

    execPut(payload, {
      clearCacheKeys,
    }).then((resp) => {
      updateCache((cache) => {
        if (!cache || !resp?.team_members) return
        cache.team_members = resp.team_members
      })
      if (isCurrentUserInTeam) {
        navigate(`/lijst/${itineraryId}`)
      } else {
        navigate("/")
      }
    })
  }

  const { formState } = form

  if (isBusy || !itinerary) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading
          level={1}
        >{`Wijzig teamleden looplijst ${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}</Heading>
        <Paragraph size="large">
          {itinerary?.settings.day_settings.team_settings.name} –{" "}
          {itinerary?.settings.day_settings.name}
        </Paragraph>
      </Grid.Cell>
      <Grid.Cell span="all">
        <FormProvider form={form} onSubmit={onSubmit}>
          <TeamMembersFields
            teamMembers={teamMembers}
            userOptions={userOptions}
            showCurrentUserWarning
            currentUserId={currentUser?.id}
          />

          <ActionGroup className="mt-3">
            <Button type="submit" disabled={!formState.isValid || isUpdating}>
              {isUpdating ? "Opslaan…" : "Opslaan"}
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Annuleren
            </Button>
          </ActionGroup>
        </FormProvider>
      </Grid.Cell>
    </Grid>
  )
}
