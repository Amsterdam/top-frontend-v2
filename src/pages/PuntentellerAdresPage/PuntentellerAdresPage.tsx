import {
  Breadcrumb,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import { useAddressInvoerwaarden } from "@/api/hooks"
import { AmsterdamCrossSpinner, Description } from "@/components"

const formatEuro = (value: number) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)

export default function PuntentellerAdresPage() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  const {
    data: invoerwaarden,
    isPending,
    isError,
  } = useAddressInvoerwaarden(bagId)

  const dataFields = invoerwaarden && [
    { label: "Bouwjaar", value: invoerwaarden.bouwjaar },
    { label: "Oppervlakte", value: `${invoerwaarden.oppervlakte} m²` },
    {
      label: "WOZ-waarde",
      value: `${formatEuro(invoerwaarden.woz)} (peildatum ${invoerwaarden.woz_jaar})`,
    },
    { label: "WOZ-objectnummer", value: invoerwaarden.wozobjectnummer },
    { label: "Energielabel", value: invoerwaarden.energielabel },
  ]

  if (isPending) return <AmsterdamCrossSpinner />

  return (
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Breadcrumb accessibleName="Kruimelpad">
          <Breadcrumb.Link
            href="/puntenteller"
            onClick={(e) => {
              e.preventDefault()
              navigate("/puntenteller")
            }}
          >
            Puntenteller
          </Breadcrumb.Link>
          <Breadcrumb.Link aria-current="location">
            {invoerwaarden
              ? `${invoerwaarden.straat} ${invoerwaarden.huisnummer}`
              : "Gegevens woning"}
          </Breadcrumb.Link>
        </Breadcrumb>

        <Heading level={1}>
          Gegevens van de woning{" "}
          {invoerwaarden
            ? `(${invoerwaarden.straat} ${invoerwaarden.huisnummer})`
            : ""}
        </Heading>
      </Grid.Cell>

      <Grid.Cell span="all">
        {isError && (
          <Paragraph>
            Er is iets misgegaan bij het ophalen van de gegevens voor dit adres.
          </Paragraph>
        )}
        {!isError && dataFields && (
          <Description termsWidth="wide" data={dataFields} />
        )}
      </Grid.Cell>
    </Grid>
  )
}
