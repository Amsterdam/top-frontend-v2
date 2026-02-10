import { Row } from "@amsterdam/design-system-react"
import {
  Card,
  Description,
  GoogleMapsButton,
  HeadingWithIcon,
  PriorityTag,
  Tag,
} from "@/components"

import { getSchedulePriority } from "@/shared"
import { useCorporationName } from "@/api/hooks"
import { InfoIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  data?: Case
}

export default function CaseInfoCard({ data }: Props) {
  const housingCorporationName = useCorporationName(
    data?.address?.housing_corporation,
  )
  const priority = getSchedulePriority(data?.schedules)

  return (
    <Card
      title={
        <Row align="between" wrap>
          <HeadingWithIcon
            label="Zaakinformatie"
            svg={InfoIcon}
            highlightIcon
          />
          <GoogleMapsButton
            title="Bekijk op Google Maps"
            addresses={[data?.address] as Address[]}
            as="link"
          />
        </Row>
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
            value: data?.tags?.length
              ? data.tags.map((tag) => (
                  <Tag
                    key={`${data.id}-${tag.id}`}
                    color="greyDark"
                    name={tag.name}
                  />
                ))
              : undefined,
          },
        ]}
      />
    </Card>
  )
}
