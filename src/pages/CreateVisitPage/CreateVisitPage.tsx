import { useEffect, useState } from "react"
import { Grid, Heading, StandaloneLink } from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import { FormProvider } from "@amsterdam/ee-ads-rhf-lib"
import { useForm, useWatch } from "react-hook-form"
import {
  ChevronBackwardIcon,
  HouseIcon,
} from "@amsterdam/design-system-react-icons"
import { useItinerary, useVisit, useVisits } from "@/api/hooks"
import { formatAddress } from "@/shared"
import { AmsterdamCrossSpinner, Divider, PageHeading } from "@/components"
import { type FormValuesVisit } from "./FormValuesVisit"
import StepSituation from "./StepSituation/StepSituation"
import StepObservations from "./StepObservation/StepObservations"
import StepNextVisitSuggestion from "./StepNextVisitSuggestion/StepNextVisitSuggestion"
import StepCanNextVisitGoAhead from "./StepCanNextVisitGoAhead/StepCanNextVisitGoAhead"
import StepNotesAndDescription from "./StepNotesAndDescription/StepNotesAndDescription"
import { mapValues } from "./helpers/mapValues"
import { mapVisitToFormValues } from "./helpers/mapVisitToFormValues"
import { useCurrentUser, useMoveItineraryItemToBottom } from "@/hooks"
import { useAlert } from "@/components/alerts/useAlert"

export default function CreateVisitPage() {
  const { itineraryId, caseId, visitId } = useParams<{
    itineraryId: string
    caseId: string
    visitId?: string
  }>()
  const [isLoading, setIsLoading] = useState(false)
  const [, { execPost }] = useVisits({ lazy: true })
  const [visit, { execPut, execGet }] = useVisit(visitId, { lazy: true })
  const [itinerary] = useItinerary(itineraryId, { lazy: true })
  const currentUser = useCurrentUser()
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  const itineraryItem = itinerary?.items.find(
    (item) => item?.case.id === Number(caseId),
  )
  const { moveItineraryItemToBottom } = useMoveItineraryItemToBottom(
    itineraryId,
    itineraryItem?.id,
  )

  useEffect(() => {
    // Navigation is taking time. Prevent automatic refetch after creating or updating a visit
    if (!visit && !isLoading && visitId) {
      execGet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visit, visitId, isLoading])

  useEffect(() => {
    // Navigation is taking time. Prevent automatic refetch after creating or updating a visit
    if (!itinerary && !isLoading && itineraryId) {
      execGet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary, itineraryId, isLoading])

  const form = useForm<FormValuesVisit>({
    mode: "onChange",
    defaultValues: {
      start_time: "",
      start_time_other: "",
      situation: "",
      observations: [],
      suggest_next_visit: "",
      suggest_next_visit_description: "",
      can_next_visit_go_ahead: "",
      can_next_visit_go_ahead_description_yes: "",
      can_next_visit_go_ahead_description_no: "",
      personal_notes: "",
      description: "",
    },
  })

  useEffect(() => {
    if (!visit) return

    form.reset(mapVisitToFormValues({ visit }))
  }, [visit, form])

  const onSubmit = async (values: FormValuesVisit) => {
    if (!currentUser?.id || !caseId || !itineraryItem?.id) return

    const execRequest = visitId ? execPut : execPost

    setIsLoading(true)

    const initialValues = {
      author: currentUser?.id,
      case_id: caseId,
      itinerary_item: itineraryItem?.id,
    }
    const payload = mapValues({ ...values, ...initialValues })

    execRequest(payload, {
      clearCacheKeys: [`/itineraries/${itineraryId}`],
    })
      .then(async () => {
        await moveItineraryItemToBottom()
        navigate(`/lijst/${itineraryId}`)
        showAlert({
          title: "Bezoek succesvol verwerkt!",
          description:
            "Het bezoek is verwerkt en opgeslagen. Je wordt nu teruggestuurd naar de looplijst.",
          severity: "success",
        })
      })
      .finally(() => {
        // Add slight delay to improve UX by preventing flicker. Navigation takes more time.
        setTimeout(() => {
          setIsLoading(false)
        }, 350)
      })
  }

  const situation = useWatch({
    control: form.control,
    name: "situation",
  })

  const steps = [
    <StepSituation
      onNextStep={() => setCurrentStep(situation === "access_granted" ? 4 : 1)}
      key="step-0"
    />,
    <StepObservations
      onPrevStep={() => setCurrentStep(0)}
      onNextStep={() => setCurrentStep(2)}
      key="step-1"
    />,
    <StepNextVisitSuggestion
      onPrevStep={() => setCurrentStep(1)}
      onNextStep={() => setCurrentStep(3)}
      key="step-2"
    />,
    <StepCanNextVisitGoAhead
      onPrevStep={() => setCurrentStep(2)}
      key="step-3"
    />,
    <StepNotesAndDescription
      onPrevStep={() => setCurrentStep(0)}
      key="step-4"
    />,
  ]

  if (isLoading) {
    return <AmsterdamCrossSpinner />
  }
  return (
    <>
      <PageHeading icon={HouseIcon} label="Verwerk bezoek" />
      <Heading level={3}>
        {formatAddress(itineraryItem?.case?.address, true)}
      </Heading>

      <Divider />

      <StandaloneLink
        href="#"
        icon={ChevronBackwardIcon}
        onClick={() => navigate(`/lijst/${itineraryId}`)}
      >
        Terug naar looplijst
      </StandaloneLink>

      <FormProvider form={form} onSubmit={onSubmit}>
        <Grid paddingBottom="x-large" paddingTop="large">
          <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }}>
            {steps[currentStep]}
          </Grid.Cell>
        </Grid>
      </FormProvider>
    </>
  )
}
