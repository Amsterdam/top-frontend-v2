import { useState } from "react"
import {
  Breadcrumb,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  BuildingIcon,
  DocumentCheckMarkIcon,
  ForkAndKnifeIcon,
  HouseIcon,
  ParkingIcon,
  StarIcon,
  WaterLadderIcon,
} from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import {
  AmsterdamCrossSpinner,
  StepProgress,
  type StepItem,
} from "@/components"
import { useGebruikersinvoerForm } from "./useGebruikersinvoerForm"
import { StepWoninggegevens } from "./StepWoninggegevens/StepWoninggegevens"
import { StepSanitair } from "./StepSanitair/StepSanitair"
import { StepKeuken } from "./StepKeuken/StepKeuken"
import { StepVertrekken } from "./StepVertrekken/StepVertrekken"
import { StepOverigeRuimtes } from "./StepOverigeRuimtes/StepOverigeRuimtes"
import { StepKlimaatBuitenParkeren } from "./StepKlimaatBuitenParkeren/StepKlimaatBuitenParkeren"
import { StepBijzonderheden } from "./StepBijzonderheden/StepBijzonderheden"
import { StepOverzicht } from "./StepOverzicht/StepOverzicht"

const STEP_ITEMS: StepItem[] = [
  { title: "Woninggegevens", icon: HouseIcon },
  { title: "Sanitair", icon: WaterLadderIcon },
  { title: "Keuken", icon: ForkAndKnifeIcon },
  { title: "Vertrekken", icon: BedIcon },
  { title: "Overige ruimtes", icon: BuildingIcon },
  { title: "Klimaat, buitenruimte & parkeren", icon: ParkingIcon },
  { title: "Bijzonderheden", icon: StarIcon },
  { title: "Overzicht", icon: DocumentCheckMarkIcon },
]

export default function PuntentellerAdresPage() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const { form, invoerwaarden, isPending, isError, onSubmit, isSubmitting } =
    useGebruikersinvoerForm(bagId)

  if (isPending) return <AmsterdamCrossSpinner />

  const steps = [
    <StepWoninggegevens
      key="step-0"
      invoerwaarden={invoerwaarden}
      onNextStep={() => setCurrentStep(1)}
    />,
    <StepSanitair key="step-1" onNextStep={() => setCurrentStep(2)} />,
    <StepKeuken key="step-2" onNextStep={() => setCurrentStep(3)} />,
    <StepVertrekken key="step-3" onNextStep={() => setCurrentStep(4)} />,
    <StepOverigeRuimtes key="step-4" onNextStep={() => setCurrentStep(5)} />,
    <StepKlimaatBuitenParkeren
      key="step-5"
      onNextStep={() => setCurrentStep(6)}
    />,
    <StepBijzonderheden key="step-6" onNextStep={() => setCurrentStep(7)} />,
    <StepOverzicht key="step-7" isSubmitting={isSubmitting} />,
  ]

  return (
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
            {invoerwaarden
              ? `${invoerwaarden.straat} ${invoerwaarden.huisnummer}`
              : "Gegevens woning"}
          </Breadcrumb.Link>
        </Breadcrumb>

        <Heading level={1}>
          Puntenteller{" "}
          {invoerwaarden
            ? `(${invoerwaarden.straat} ${invoerwaarden.huisnummer})`
            : ""}
        </Heading>
      </Grid.Cell>

      {isError && (
        <Grid.Cell span="all">
          <Paragraph>
            Er is iets misgegaan bij het ophalen van de gegevens voor dit adres.
          </Paragraph>
        </Grid.Cell>
      )}

      {!isError && (
        <>
          <Grid.Cell span="all">
            <StepProgress
              steps={STEP_ITEMS}
              currentStep={currentStep + 1}
              onPrevious={() => setCurrentStep((step) => Math.max(step - 1, 0))}
            />
            <FormProvider form={form} onSubmit={onSubmit}>
              {steps[currentStep]}
            </FormProvider>
          </Grid.Cell>
        </>
      )}
    </Grid>
  )
}
