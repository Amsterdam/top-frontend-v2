import {
  Button,
  Column,
  Heading,
  IconButton,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  TrashBinIcon,
  ClipboardIcon,
  PersonsIcon,
  MapMarkerOnMapIcon,
} from "@amsterdam/design-system-react-icons"
import { useParams } from "react-router"
import dayjs from "dayjs"
import { useItineraryFromList } from "@/hooks"
import { ListItem } from "./ListItem/ListItem"
import type { Item } from "./ListItem/ListItem"

// import styles from "./ChooseThemePage.module.css"

export default function ChooseThemePage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const itinerary = useItineraryFromList(itineraryId)
  console.log("itinerary data:", itinerary)

  return (
    <>
      <Row align="between">
        <Column>
          <Heading
            level={2}
          >{`Looplijst ${dayjs(itinerary?.created_at).format("dddd D MMMM")}`}</Heading>
        </Column>
        <Column>
          <Row wrap align="end">
            <IconButton
              svg={ClipboardIcon}
              label="Kopieer naar klembord"
              title="Kopieer naar klembord"
              size="heading-1"
            />
            <IconButton
              svg={PersonsIcon}
              label="Wijzig teamleden"
              title="Wijzig teamleden"
              size="heading-1"
            />
            <IconButton
              svg={TrashBinIcon}
              label="Verwijder looplijst"
              title="Verwijder looplijst"
              size="heading-1"
            />
          </Row>
        </Column>
      </Row>
      <Column>
        <Heading level={3}>Kamerverhuur – Standaard</Heading>
        <Paragraph>
          {itinerary?.team_members
            .map((member) => member.user.full_name)
            .join(", ")}
        </Paragraph>
      </Column>
      <Row className="mt-3 mb-3">
        <Button variant="secondary" iconBefore icon={MapMarkerOnMapIcon}>
          Bekijk op Google Maps
        </Button>
      </Row>

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
