import { Link, Row } from "@amsterdam/design-system-react"
import { Card, Description } from "@/components"

type Props = {
  data: Case | undefined
}

export default function ResidenceCard({ data }: Props) {
  if (!data) return null

  const bag = data.bag_data
  const hasBagData = bag && !("error" in bag)
  const isWoonboot = hasBagData && Boolean(bag?.ligplaatsIdentificatie)
  const isWoning = !isWoonboot

  const woningTitle = isWoning ? "Woning" : "Ligplaats"

  const woningBestemming = bag?.gebruiksdoelOmschrijvingen?.length
    ? bag.gebruiksdoelOmschrijvingen.join(", ")
    : undefined

  const wozSoortObjectOmschrijving = bag?.wozSoortObjectOmschrijving
  const status = isWoning
    ? bag?.verblijfsobjectStatusOmschrijving
    : bag?.ligplaatsStatusOmschrijving
  const toegang = bag?.toegangOmschrijvingen?.length
    ? bag.toegangOmschrijvingen.join(", ")
    : undefined
  const verdiepingToegang = bag?.verblijfsobjectVerdiepingToegang
  const aantalKamers = bag?.verblijfsobjectAantalKamers
  const oppervlakte = bag?.verblijfsobjectOppervlakte
  const aantalBouwlagen = bag?.verblijfsobjectAantalBouwlagen

  const dataFields = hasBagData
    ? isWoning
      ? [
          { label: "Gebruiksdoel", value: woningBestemming },
          {
            label: "Soort object (feitelijk gebruik) volgens de WOZ",
            value: (
              <div className="breakWordAnywhere">
                {wozSoortObjectOmschrijving}
              </div>
            ),
          },
          { label: "Status", value: status },
          {
            label: "Woonoppervlak",
            value: oppervlakte ? `${oppervlakte} m²` : undefined,
          },
          { label: "Aantal kamers", value: aantalKamers },
          { label: "Aantal bouwlagen", value: aantalBouwlagen },
          { label: "Verdieping toegang", value: verdiepingToegang },
          { label: "Toegang", value: toegang },
        ]
      : [{ label: "Status", value: status }]
    : [
        {
          label: "Foutmelding",
          value: "Er is iets fout gegaan bij het ophalen van de BAG-gegevens.",
        },
      ]

  const woningUrl = bag?.identificatie
    ? `https://data.amsterdam.nl/adressen/${bag.identificatie}/`
    : undefined

  return (
    <Card title={woningTitle}>
      <Description termsWidth="wide" data={dataFields} />
      {woningUrl && (
        <Row align="center" className="mt-3">
          <Link href={woningUrl} target="_blank" rel="noopener noreferrer">
            Bekijk op Data en informatie
          </Link>
        </Row>
      )}
    </Card>
  )
}
