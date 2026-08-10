import {
  Card,
  CardDescriptionSkeleton,
  Description,
  GoogleMapsButton,
  PriorityBadge,
  Tag,
} from "@/components"

import { getSchedulePriority } from "@/shared"
import { useCorporationName } from "@/api/hooks"
import { SuitcaseIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  data?: Case
  loading?: boolean
}

export default function CaseInfoCard({ data, loading = false }: Props) {
  const housingCorporationName = useCorporationName(
    data?.address?.housing_corporation,
  )
  const priority = getSchedulePriority(data?.schedules)

  if (!data && !loading) return null

  return (
    <Card
      title="Zaakinformatie"
      icon={SuitcaseIcon}
      actions={
        !loading && data ? (
          <GoogleMapsButton
            title="Bekijk op Google Maps"
            addresses={[data.address] as Address[]}
            as="link"
          />
        ) : undefined
      }
      loading={loading}
      loadingLabel="Zaakinformatie"
      loadingBody={<CardDescriptionSkeleton rows={7} />}
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
                <PriorityBadge priority={priority} />
              ) : undefined,
          },
          {
            label: "Tags",
            value: data?.tags?.length
              ? data.tags.map((tag) => (
                  <Tag key={`${data.id}-${tag.id}`} label={tag.name} />
                ))
              : undefined,
          },
        ]}
      />
    </Card>
  )
}
