import { SunbedParasolIcon } from "@amsterdam/design-system-react-icons"

import { Card } from "@/components"

import Registrations from "./Registrations/Registrations"
import { dummyRegistrationsResponse } from "./data/dummyRegistrationsResponse"

type Props = {
  registrations?: Registration[]
  showDummyData?: boolean
}

export default function VakantieverhuurCard({
  registrations,
  showDummyData = false,
}: Props) {
  const registrationsToUse = showDummyData
    ? dummyRegistrationsResponse
    : registrations

  return (
    <Card title="Vakantieverhuur" icon={SunbedParasolIcon}>
      <Registrations registrations={registrationsToUse} />
    </Card>
  )
}
