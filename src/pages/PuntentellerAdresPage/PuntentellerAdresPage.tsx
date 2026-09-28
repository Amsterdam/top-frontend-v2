import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import {
  Breadcrumb,
  Grid,
  Heading,
  Paragraph,
  TabNavigation,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  ClipboardIcon,
  DocumentCheckMarkIcon,
  HouseIcon,
  ParkingIcon,
  StarIcon,
} from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useBagPdokAddress } from "@/api/hooks"
import { AmsterdamCrossSpinner } from "@/components"
import type { MissingField } from "./helpers/findMissingFields"
import { useGebruikersinvoerForm } from "./useGebruikersinvoerForm"
import { StepWoninggegevens } from "./StepWoninggegevens/StepWoninggegevens"
import { StepBinnenruimtes } from "./StepBinnenruimtes/StepBinnenruimtes"
import { StepBuitenruimtes } from "./StepBuitenruimtes/StepBuitenruimtes"
import { StepBijzonderheden } from "./StepBijzonderheden/StepBijzonderheden"
import { StepOverzicht } from "./StepOverzicht/StepOverzicht"
import { StepResultaat } from "./StepResultaat/StepResultaat"

const TAB_ITEMS = [
  { title: "Woning", firstStep: 0, lastStep: 0, icon: HouseIcon },
  {
    title: "Binnenruimtes",
    firstStep: 1,
    lastStep: 1,
    icon: BedIcon,
  },
  {
    title: "Buitenruimtes",
    firstStep: 2,
    lastStep: 2,
    icon: ParkingIcon,
  },
  {
    title: "Bijzonderheden",
    firstStep: 3,
    lastStep: 3,
    icon: StarIcon,
  },
  {
    title: "Overzicht",
    firstStep: 4,
    lastStep: 4,
    icon: ClipboardIcon,
  },
  {
    title: "Resultaat",
    firstStep: 5,
    lastStep: 5,
    icon: DocumentCheckMarkIcon,
  },
]

export default function PuntentellerAdresPage() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  // Not waited for: the page works without it, see adres below.
  const { data: pdokAddress } = useBagPdokAddress(bagId)
  const {
    form,
    invoerwaarden,
    isPending,
    isError,
    onSubmit,
    isSubmitting,
    resultaat,
  } = useGebruikersinvoerForm(bagId, {
    onCalculated: () => setCurrentStep(5),
    onMissingFields: () => invalidFormAlertRef.current?.focus(),
  })
  const currentTabIndex = TAB_ITEMS.findIndex(
    ({ firstStep, lastStep }) =>
      currentStep >= firstStep && currentStep <= lastStep,
  )

  // Renders the missing field's step right away, so its fields can show their errors and the
  // field can get focus. A field of a ruimte that isn't opened isn't rendered; then only the
  // step opens.
  const goToField = ({ step, name }: MissingField) => {
    flushSync(() => setCurrentStep(step))
    void form.trigger()
    document.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
  }

  if (isPending) return <AmsterdamCrossSpinner />

  // "Aalsmeerplein 1-H": the part of PDOK's weergavenaam before the postcode, as in the search.
  // Until PDOK has answered (or when it fails) the backend's "Aalsmeerplein 1", which lacks
  // the huisletter and huisnummertoevoeging; empty when it has neither straat nor huisnummer.
  const adres =
    pdokAddress?.weergavenaam.split(",")[0] ??
    [invoerwaarden?.straat, invoerwaarden?.huisnummer].filter(Boolean).join(" ")

  const steps = [
    <StepWoninggegevens
      key="step-0"
      invoerwaarden={invoerwaarden}
      onNextStep={() => setCurrentStep(1)}
    />,
    <StepBinnenruimtes key="step-1" onNextStep={() => setCurrentStep(2)} />,
    <StepBuitenruimtes key="step-2" onNextStep={() => setCurrentStep(3)} />,
    <StepBijzonderheden key="step-3" onNextStep={() => setCurrentStep(4)} />,
    <StepOverzicht
      key="step-4"
      invoerwaarden={invoerwaarden}
      isSubmitting={isSubmitting}
      onGoToField={goToField}
      invalidFormAlertRef={invalidFormAlertRef}
    />,
    <StepResultaat
      key="step-5"
      resultaat={resultaat}
      onPreviousStep={() => setCurrentStep(4)}
    />,
  ]

  // The form wraps the whole Grid rather than sitting in a Grid.Cell, so each step can render
  // its own Grid.Cells (white blocks, StepActions outside them) straight into this Grid.
  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Grid paddingBottom="x-large" paddingTop="large" gapVertical="large">
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
              {adres || "Gegevens woning"}
            </Breadcrumb.Link>
          </Breadcrumb>

          <Heading level={1}>Puntenteller {adres && `(${adres})`}</Heading>
        </Grid.Cell>

        {isError && (
          <Grid.Cell span="all">
            <Paragraph>
              Er is iets misgegaan bij het ophalen van de gegevens voor dit
              adres.
            </Paragraph>
          </Grid.Cell>
        )}

        <Grid.Cell appearance="flush" span="all">
          <TabNavigation accessibleName="Subnavigatie voor dit project">
            <TabNavigation.List>
              {TAB_ITEMS.map(({ title, firstStep, icon }, index) => (
                <TabNavigation.Link
                  aria-current={currentTabIndex === index ? "page" : undefined}
                  href="#"
                  icon={icon}
                  key={title}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentStep(firstStep)
                  }}
                >
                  {title}
                </TabNavigation.Link>
              ))}
            </TabNavigation.List>
          </TabNavigation>
        </Grid.Cell>

        {!isError && steps[currentStep]}
      </Grid>
    </FormProvider>
  )
}
