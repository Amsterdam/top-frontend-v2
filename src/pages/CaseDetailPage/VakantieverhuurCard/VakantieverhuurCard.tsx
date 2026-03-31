import dayjs from "dayjs"
import { SunbedParasolIcon } from "@amsterdam/design-system-react-icons"
import { Card, HeadingWithIcon } from "@/components"
import { useMeldingen, useRegistrations } from "@/api/hooks"
import Meldingen from "./Meldingen/Meldingen"
import Registrations from "./Registrations/Registrations"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { dummyRegistrationsResponse } from "./data/dummyRegistrationsResponse"
import { dummyMeldingenResponse } from "./data/dummyMeldingenResponse"

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

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData =
    isDevOrAcc && !registrations?.length && !meldingen?.length

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
      <Registrations
        registrations={
          showDummyData ? dummyRegistrationsResponse : registrations
        }
      />
      <Meldingen
        meldingen={showDummyData ? dummyMeldingenResponse : meldingen}
      />
    </Card>
  )
}
