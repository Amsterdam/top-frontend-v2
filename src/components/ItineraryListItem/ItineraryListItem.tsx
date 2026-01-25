import {
  Button,
  Column,
  Heading,
  Icon,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  PlusIcon,
  SettingsIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { StatusTag, PriorityTag, Note, Tag, Distance } from "@/components"
import DeleteItineraryItemButton from "@/pages/ListPage/components/DeleteItineraryItemButton/DeleteItineraryItemButton"
import CompleteVisitButton from "@/pages/ListPage/components/CompleteVisitButton/CompleteVisitButton"
import { getMostRecentVisit, getVisitState } from "./helpers/visit"

type Props = {
  item: ItineraryItem
  type?: "default" | "addStartAddress" | "addSuggestedCase"
  onAdd?: (caseData: Case) => void
  status?: "idle" | "loading" | "added" | "error"
}

export function ItineraryListItem({
  item,
  type = "default",
  onAdd,
  status,
}: Props) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const navigate = useNavigate()
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)

  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)
  const notes = mostRecentVisit?.personal_notes

  return (
    <Column style={{ padding: "16px 0" }} gap="small">
      <Row align="between">
        <Column gap="x-small" alignHorizontal="start">
          <Heading level={3}>{formatAddress(address)}</Heading>
          <Paragraph>{address?.postal_code}</Paragraph>
          <Paragraph>{caseData?.reason?.name}</Paragraph>
          <Paragraph>{caseData?.project?.name}</Paragraph>
        </Column>
        {type === "default" && (
          <Column alignHorizontal="end">
            {visitState === "pendingVisit" && (
              <>
                <Button
                  onClick={() =>
                    navigate(`/bezoek/${itineraryId}/${caseData?.id}`)
                  }
                >
                  Bezoek
                </Button>
                <DeleteItineraryItemButton itineraryItemId={item.id} />
              </>
            )}
            {visitState === "visitInProgress" && (
              <>
                <CompleteVisitButton visitId={mostRecentVisit?.id} itineraryItemId={item.id}/>
                <Row>
                  <Button
                    icon={PencilIcon}
                    iconBefore
                    title="Bezoek bewerken"
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/bezoek/${itineraryId}/${caseData?.id}/${mostRecentVisit?.id}`,
                      )
                    }
                  />

                  <DeleteItineraryItemButton itineraryItemId={item.id} />
                </Row>
              </>
            )}
            {visitState === "visitCompleted" && (
              <Paragraph style={{ color: "var(--ams-color-feedback-success)" }}>
                Bezoek voltooid
              </Paragraph>
            )}
          </Column>
        )}
        {type === "addStartAddress" && (
          <Column alignHorizontal="end">
            <Button
              icon={PlusIcon}
              iconBefore
              variant="secondary"
              title="Adres toevoegen aan looplijst"
              onClick={() => onAdd?.(caseData!)}
            >
              Toevoegen
            </Button>
          </Column>
        )}
        {type === "addSuggestedCase" && (
          <Column alignHorizontal="end" align="between">
            {status === "added" ? (
              <Row
                align="center"
                gap="x-small"
                style={{ color: "var(--ams-color-feedback-success)" }}
              >
                <Icon svg={CheckMarkIcon} />
                <Paragraph style={{ color: "inherit" }}>Toegevoegd</Paragraph>
              </Row>
            ) : (
              <Button
                icon={status === "loading" ? SettingsIcon : PlusIcon}
                iconBefore
                variant="secondary"
                title="Zaak toevoegen aan looplijst"
                onClick={() => status === "idle" && onAdd?.(caseData!)}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Toevoegen..." : "Toevoegen"}
              </Button>
            )}
            <Distance distance={caseData?.distance} />
          </Column>
        )}
      </Row>
      <Row>
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />
        {caseData?.tags?.map((tag) => (
          <Tag key={`${caseData.id}-${tag.id}`} color="green" name={tag.name} />
        ))}
      </Row>
      <Note note={notes} />
    </Column>
  )
}

export default ItineraryListItem
