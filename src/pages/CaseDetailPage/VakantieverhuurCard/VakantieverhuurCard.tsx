import { SunbedParasolIcon } from "@amsterdam/design-system-react-icons"

import { Card, CardListSkeleton } from "@/components"

import Registrations from "./Registrations/Registrations"
import { dummyRegistrationsResponse } from "./data/dummyRegistrationsResponse"

type Props = {
  registrations?: Registration[]
  showDummyData?: boolean
  loading?: boolean
}

export default function VakantieverhuurCard({
  registrations,
  showDummyData = false,
  loading = false,
}: Props) {
  const registrationsToUse = showDummyData
    ? dummyRegistrationsResponse
    : registrations

  return (
    <Card
      title={`Vakantieverhuur (${registrationsToUse?.length})`}
      icon={SunbedParasolIcon}
      loading={loading}
      loadingLabel="Vakantieverhuur"
      loadingBody={<CardListSkeleton items={3} linesPerItem={2} />}
    >
      <Registrations registrations={registrationsToUse} />
    </Card>
  )
}
