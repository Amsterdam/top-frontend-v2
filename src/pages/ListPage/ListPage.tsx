import { useMemo } from "react"
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
import dayjs from "dayjs"
import { ListItem } from "./ListItem/ListItem"
import type { Item } from "./ListItem/ListItem"
import { AmsterdamCrossSpinner, GoogleMapsButton, Divider } from "@/components"
import { CopyToClipboardButton, DeleteItineraryButton } from "./components"
import { useItinerary } from "@/api/hooks"

export default function ListPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [itinerary, { isBusy }] = useItinerary(itineraryId)
  const navigate = useNavigate()

  const addresses = useMemo(() => {
    return (itinerary?.items?.map((item) => item.case.data.address) ??
      []) as Address[]
  }, [itinerary])

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

      <Column>
        {itinerary?.items.map((item, index) => (
          <div
            className="animate-fade-slide-in-bottom"
            style={{ animationDelay: `${index * 0.1}s` }}
            key={item.id}
          >
            <ListItem key={item.id} item={item as Item} />
          </div>
        ))}
      </Column>
    </>
  )
}
