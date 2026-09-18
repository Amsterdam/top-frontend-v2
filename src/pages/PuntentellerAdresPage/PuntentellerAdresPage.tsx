import { useState } from "react"
import {
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
import { AmsterdamCrossSpinner } from "@/components"
import { useGebruikersinvoerForm } from "./useGebruikersinvoerForm"
import { StepWoninggegevens } from "./StepWoninggegevens/StepWoninggegevens"
import { StepBinnenruimtes } from "./StepBinnenruimtes/StepBinnenruimtes"
import { StepBuitenruimtes } from "./StepBuitenruimtes/StepBuitenruimtes"
import { StepBijzonderheden } from "./StepBijzonderheden/StepBijzonderheden"
import { StepOverzicht } from "./StepOverzicht/StepOverzicht"

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
    title: "Resultaat",
    firstStep: 4,
    lastStep: 4,
    icon: DocumentCheckMarkIcon,
  },
]

export default function PuntentellerAdresPage() {
  const { bagId } = useParams<{ bagId: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const { form, invoerwaarden, isPending, isError, onSubmit, isSubmitting } =
    useGebruikersinvoerForm(bagId)
  const currentTabIndex = TAB_ITEMS.findIndex(
    ({ firstStep, lastStep }) =>
      currentStep >= firstStep && currentStep <= lastStep,
  )

  if (isPending) return <AmsterdamCrossSpinner />

  const steps = [
    <StepWoninggegevens
      key="step-0"
      invoerwaarden={invoerwaarden}
      onNextStep={() => setCurrentStep(1)}
    />,
    <StepBinnenruimtes key="step-1" onNextStep={() => setCurrentStep(2)} />,
    <StepBuitenruimtes key="step-2" onNextStep={() => setCurrentStep(3)} />,
    <StepBijzonderheden key="step-3" onNextStep={() => setCurrentStep(4)} />,
    <StepOverzicht key="step-4" isSubmitting={isSubmitting} />,
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

      {!isError && (
        <>
          <Grid.Cell span="all">
            <FormProvider form={form} onSubmit={onSubmit}>
              {steps[currentStep]}
            </FormProvider>
          </Grid.Cell>
        </>
      )}
    </Grid>
  )
}
