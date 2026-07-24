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
import { useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { AmsterdamCrossSpinner } from "@/components"
import { useChangeTeamMembers, useItinerary } from "@/api/hooks"
import { queryKeys } from "@/api/queryKeys"
import { useCurrentUser, useUserOptions } from "@/hooks"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { TeamMembersFields } from "@/forms/components/TeamMembersFields"

type FormValues = {
  teamMembers: string[]
}

export default function TeamMemberUpdatePage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: itinerary, isPending } = useItinerary(itineraryId)
  const changeTeamMembers = useChangeTeamMembers(itineraryId)
  const currentUser = useCurrentUser()
  const userOptions = useUserOptions()

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

    changeTeamMembers.mutate(payload, {
      onSuccess: () => {
        if (!isCurrentUserInTeam) {
          queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all })
        }
        if (isCurrentUserInTeam) {
          navigate(`/lijst/${itineraryId}`)
        } else {
          navigate("/")
        }
      },
    })
  }

  const { formState } = form
  const isUpdating = changeTeamMembers.isPending

  if (isPending || !itinerary) {
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
