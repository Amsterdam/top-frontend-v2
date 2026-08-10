import { StandaloneLink } from "@amsterdam/design-system-react"
import { Card, CardDescriptionSkeleton, Description } from "@/components"
import {
  LinkExternalIcon,
  MapMarkerIcon,
} from "@amsterdam/design-system-react-icons"
import { capitalize } from "@/shared"

type Props = {
  data: Case | undefined
  loading?: boolean
}

export default function BAGCard({ data, loading = false }: Props) {
  if (!data && !loading) return null

  const bag = data?.bag_data
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
          { label: "Type", value: woningTitle },
          { label: "Gebruiksdoel", value: capitalize(woningBestemming) },
          {
            label: "Soort object (feitelijk gebruik) volgens de WOZ",
            value: (
              <div className="break-word-anywhere">
                {wozSoortObjectOmschrijving}
              </div>
            ),
          },
          { label: "Status", value: capitalize(status) },
          {
            label: "Woonoppervlak",
            value: oppervlakte ? `${oppervlakte} m²` : undefined,
          },
          { label: "Aantal kamers", value: aantalKamers },
          { label: "Aantal bouwlagen", value: aantalBouwlagen },
          { label: "Verdieping toegang", value: verdiepingToegang },
          { label: "Toegang", value: toegang },
        ]
      : [{ label: "Status", value: capitalize(status) }]
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
    <Card
      title="BAG-gegevens"
      icon={MapMarkerIcon}
      actions={
        !loading && woningUrl ? (
          <StandaloneLink
            href={woningUrl}
            target="_blank"
            rel="noopener noreferrer"
            icon={<LinkExternalIcon />}
          >
            Bekijk op Data en informatie
          </StandaloneLink>
        ) : undefined
      }
      loading={loading}
      loadingLabel="BAG-gegevens"
      loadingBody={<CardDescriptionSkeleton rows={8} />}
    >
      <Description termsWidth="wide" data={dataFields} />
    </Card>
  )
}
