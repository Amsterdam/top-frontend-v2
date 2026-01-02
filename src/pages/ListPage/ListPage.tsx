import { useMemo } from "react"
import dayjs from "dayjs"
import {
  Button,
  Column,
  Heading,
  IconButton,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { PersonsIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { AmsterdamCrossSpinner, GoogleMapsButton, Divider } from "@/components"
import { useItinerary } from "@/api/hooks"
import {
  CopyToClipboardButton,
  DeleteItineraryButton,
  SortableItineraryItemList,
} from "./components"

export default function ListPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [itinerary, { isBusy }] = useItinerary(itineraryId)
  const navigate = useNavigate()

  const addresses = useMemo(() => {
    return (itinerary?.items?.map((item) => item?.case?.address) ??
      []) as Address[]
  }, [itinerary?.items])

  if (isBusy || !itinerary) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <>
      <div className="animate-scale-in-center">
        <Row align="between" className="mb-3">
          <Column>
            <Heading
              level={2}
            >{`Looplijst ${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}</Heading>
          </Column>
          <Column>
            <Row wrap align="end">
              <CopyToClipboardButton itinerary={itinerary} />
              <IconButton
                svg={PersonsIcon}
                label="Wijzig teamleden"
                title="Wijzig teamleden"
                size="heading-1"
                onClick={() => navigate("wijzig-team")}
              />
              <DeleteItineraryButton itineraryId={itineraryId!} />
            </Row>
          </Column>
        </Row>
        <Column gap="none">
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
        <Row align="between" className="mt-3">
          <GoogleMapsButton addresses={addresses} />
          <Button variant="secondary" iconBefore icon={PlusIcon}>
            Voeg zaak toe
          </Button>
        </Row>
        <Divider />
      </div>

      <SortableItineraryItemList itineraryId={itineraryId!} />
    </>
  )
}
