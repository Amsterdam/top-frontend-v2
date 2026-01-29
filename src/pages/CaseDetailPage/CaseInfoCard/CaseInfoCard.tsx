import { Column, Heading, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  Card,
  Description,
  GoogleMapsButton,
  PriorityTag,
  Tag,
} from "@/components"

import { formatAddress } from "@/shared/formatAddress"
import { getSchedulePriority, getWorkflowName } from "@/shared"
import { useCorporationName } from "@/api/hooks"

type Props = {
  data: Case | undefined
}

export default function CaseInfoCard({ data }: Props) {
  const housingCorporationName = useCorporationName(
    data?.address?.housing_corporation,
  )
  const priority = getSchedulePriority(data?.schedules)
  const statusName = getWorkflowName(data?.workflows)
  return (
    <Card
      title={
        <Column>
          <Heading level={3}>{formatAddress(data?.address)}</Heading>
          <Paragraph>
            {data?.address?.postal_code} - {statusName}
          </Paragraph>
        </Column>
      }
    >
      <Description
        termsWidth="narrow"
        data={[
          {
            label: "Zaak ID",
            value: data?.id || "-",
          },
          {
            label: "Aanleiding",
            value: data?.reason?.name,
          },
          {
            label: "Project",
            value: data?.project?.name,
          },
          {
            label: "Onderwerpen",
            value:
              data?.subjects?.map((subject) => subject.name).join(", ") ||
              undefined,
          },

          {
            label: "Woningcorporatie",
            value: housingCorporationName,
          },
          {
            label: "Prioriteit",
            value:
              priority?.weight && priority?.weight >= 0.5 ? (
                <PriorityTag priority={priority} />
              ) : undefined,
          },
          {
            label: "Tags",
            value: (
              <>
                {data?.tags?.map((tag) => (
                  <Tag
                    key={`${data.id}-${tag.id}`}
                    color="greyDark"
                    name={tag.name}
                  />
                ))}
              </>
            ),
          },
        ]}
      />
      <Row align="center" className="mt-3">
        <GoogleMapsButton
          title="Bekijk op Google Maps"
          addresses={[data?.address] as Address[]}
          variant="tertiary"
          as="link"
        />
      </Row>
    </Card>
  )
}
