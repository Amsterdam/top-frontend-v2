import { useMemo } from "react"
import dayjs from "dayjs"
import {
  ActionGroup,
  Breadcrumb,
  Button,
  Column,
  Grid,
  Heading,
  Row,
} from "@amsterdam/design-system-react"
import { PersonsIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import {
  AmsterdamCrossSpinner,
  GoogleMapsButton,
  ItineraryTeamSummary,
} from "@/components"
import { useItinerariesSummary, useItinerary } from "@/api/hooks"
import {
  CopyToClipboardButton,
  DeleteItineraryButton,
  SortableItineraryItemList,
} from "./components"

export default function ListPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const { data: itinerary, isPending } = useItinerary(itineraryId)
  const { data: itineraries } = useItinerariesSummary()
  const navigate = useNavigate()

  const addresses = useMemo(() => {
    return (itinerary?.items?.map((item) => item?.case?.address) ??
      []) as Address[]
  }, [itinerary?.items])

  if (isPending || !itinerary) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        {itineraries && itineraries.length > 1 && (
          <Breadcrumb accessibleName="Kruimelpad">
            <Breadcrumb.Link
              href="/looplijsten"
              onClick={(e) => {
                e.preventDefault()
                navigate("/looplijsten")
              }}
            >
              Alle looplijsten
            </Breadcrumb.Link>
            <Breadcrumb.Link aria-current="location">
              {`Looplijst ${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}
            </Breadcrumb.Link>
          </Breadcrumb>
        )}

        <Row align="between" wrap>
          <Heading
            level={1}
          >{`Looplijst 67${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}</Heading>

          <ActionGroup>
            <GoogleMapsButton addresses={addresses} />
            <Button
              variant="primary"
              iconBefore
              icon={PlusIcon}
              onClick={() => navigate("suggesties")}
            >
              Voeg zaak toe
            </Button>
          </ActionGroup>
        </Row>
      </Grid.Cell>
      <Grid.Cell as="aside" span={{ narrow: 4, medium: 8, wide: 4 }}>
        <Column gap="none" className="ams-mb-xl">
          <Heading level={3}>
            {itinerary?.settings?.day_settings?.team_settings?.name} –{" "}
            {itinerary?.settings?.day_settings?.name}
          </Heading>
          <ItineraryTeamSummary
            teamMembers={
              itinerary?.team_members.map((member) => member.user.full_name) ??
              []
            }
            caseCount={itinerary?.items?.length ?? 0}
          />
        </Column>
        <ActionGroup>
          <CopyToClipboardButton itinerary={itinerary} />
          <Button
            variant="secondary"
            icon={PersonsIcon}
            onClick={() => navigate("team")}
          >
            Wijzig teamleden
          </Button>
          <DeleteItineraryButton itineraryId={itineraryId!} />
        </ActionGroup>
      </Grid.Cell>

      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 8 }}
        appearance="transparent"
      >
        <SortableItineraryItemList itineraryId={itineraryId!} />
      </Grid.Cell>
    </Grid>
  )
}
