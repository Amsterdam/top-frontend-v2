import { useMemo } from "react"
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
  PlusIcon,
} from "@amsterdam/design-system-react-icons"
import { useParams } from "react-router"
import dayjs from "dayjs"
import { useItineraryFromList } from "@/hooks"
import { ListItem } from "./ListItem/ListItem"
import type { Item } from "./ListItem/ListItem"
import { AmsterdamCrossSpinner, GoogleMapsButton, Divider } from "@/components"
import DeleteItineraryButton from "./components/DeleteItineraryButton/DeleteItineraryButton"

export default function ListPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [itinerary, { isBusy }] = useItineraryFromList(itineraryId)

  const addresses = useMemo(() => {
    return (itinerary?.items?.map((item) => item.case.data.address) ??
      []) as Address[]
  }, [itinerary])

  if (isBusy) {
    return <AmsterdamCrossSpinner />
  }
  return (
    <>
      <div className="animate-scale-in-center">
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
              <DeleteItineraryButton itineraryId={itineraryId!} />
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
