import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import {
  Alert,
  Breadcrumb,
  Grid,
  Heading,
  Paragraph,
  TabNavigation,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
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
import { UnsavedChangesAlert } from "./components/UnsavedChangesAlert"
import { UnsavedChangesMarker } from "./components/UnsavedChangesMarker"
import { StepWoninggegevens } from "./StepWoninggegevens/StepWoninggegevens"
import { StepBinnenruimtes } from "./StepBinnenruimtes/StepBinnenruimtes"
import { StepBuitenruimtes } from "./StepBuitenruimtes/StepBuitenruimtes"
import { StepBijzonderheden } from "./StepBijzonderheden/StepBijzonderheden"
import { StepResultaat } from "./StepResultaat/StepResultaat"

// One tab per step, in step order: a tab's index is its step.
const TAB_ITEMS = [
  { title: "Woning", icon: HouseIcon },
  { title: "Binnenruimtes", icon: BedIcon },
  { title: "Buitenruimtes", icon: ParkingIcon },
  { title: "Bijzonderheden", icon: StarIcon },
  { title: "Resultaat", icon: DocumentCheckMarkIcon },
]
const RESULTAAT_STEP = TAB_ITEMS.length - 1

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
    savedPayload,
  } = useGebruikersinvoerForm(bagId, {
    onCalculated: () => setCurrentStep(RESULTAAT_STEP),
    // Saving is tried from the bijzonderheden-stap or the resultaat-stap; the missing fields
    // are listed on the resultaat-stap.
    onMissingFields: () => {
      flushSync(() => setCurrentStep(RESULTAAT_STEP))
      invalidFormAlertRef.current?.focus()
    },
  })

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
    <StepBijzonderheden
      key="step-3"
      savedPayload={savedPayload}
      isSubmitting={isSubmitting}
    />,
    <StepResultaat
      key="step-4"
      resultaat={resultaat}
      isSubmitting={isSubmitting}
      invoerwaarden={invoerwaarden}
      onGoToField={goToField}
      invalidFormAlertRef={invalidFormAlertRef}
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
          <Grid.Cell span="all" appearance="transparent">
            <Alert
              heading="Woninggegevens niet automatisch opgehaald"
              headingLevel={2}
              severity="warning"
            >
              <Paragraph>
                De gegevens voor dit adres konden niet worden opgehaald. Je
                kunt de puntentelling wel maken door de ontbrekende gegevens
                zelf in te vullen.
              </Paragraph>
            </Alert>
          </Grid.Cell>
        )}

        <Grid.Cell appearance="flush" span="all">
          <TabNavigation accessibleName="Subnavigatie voor dit project">
            <TabNavigation.List>
              {TAB_ITEMS.map(({ title, icon }, step) => (
                <TabNavigation.Link
                  aria-current={currentStep === step ? "page" : undefined}
                  href="#"
                  icon={icon}
                  key={title}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentStep(step)
                  }}
                >
                  {title}
                  {step === RESULTAAT_STEP && (
                    <UnsavedChangesMarker savedPayload={savedPayload} />
                  )}
                </TabNavigation.Link>
              ))}
            </TabNavigation.List>
          </TabNavigation>
        </Grid.Cell>

        {/* Only where the punten are shown; the bijzonderheden-stap says it in its submit
            button. */}
        {currentStep === RESULTAAT_STEP && (
          <UnsavedChangesAlert
            savedPayload={savedPayload}
            isSubmitting={isSubmitting}
            invoerwaarden={invoerwaarden}
          />
        )}

        {steps[currentStep]}
      </Grid>
    </FormProvider>
  )
}
