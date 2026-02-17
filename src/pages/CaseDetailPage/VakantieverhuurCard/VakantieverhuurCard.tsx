import dayjs from "dayjs"
import { SunbedParasolIcon } from "@amsterdam/design-system-react-icons"
import { Card, HeadingWithIcon } from "@/components"
import { useMeldingen, useRegistrations } from "@/api/hooks"
import Meldingen from "./Meldingen/Meldingen"
import Registrations from "./Registrations/Registrations"

type Props = {
  bagId?: string
}

export default function VakantieverhuurCard({ bagId }: Props) {
  const [registrationsData, { isBusy: isBusyRegistrations }] =
    useRegistrations(bagId)
  const startDate = dayjs().subtract(1, "year").startOf("year").format()
  const [meldingenData, { isBusy: isBusyMeldingen }] = useMeldingen(
    bagId,
    startDate,
  )

  if (!bagId || isBusyRegistrations || isBusyMeldingen) return null

  const registrations = registrationsData || []
  const meldingen = (meldingenData?.data || []) as Melding[]

  return (
    <Card
      title={
        <HeadingWithIcon
          label="Vakantieverhuur"
          svg={SunbedParasolIcon}
          highlightIcon
        />
      }
      collapsible
      className="animate-scale-in-center"
    >
      <Registrations registrations={registrations} />
      <Meldingen meldingen={meldingen} />
    </Card>
  )
}
