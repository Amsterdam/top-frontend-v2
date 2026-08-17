import { useEffect, useState } from "react"
import {
  Grid,
  Heading,
  Paragraph,
  Row,
  StandaloneLink,
} from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, useWatch } from "react-hook-form"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { useItinerary, useSaveVisit, useVisit } from "@/api/hooks"
import { formatAddress } from "@/shared"
import { AmsterdamCrossSpinner } from "@/components"
import { type FormValuesVisit } from "./FormValuesVisit"
import StepSituation from "./StepSituation/StepSituation"
import StepObservations from "./StepObservation/StepObservations"
import StepNextVisitSuggestion from "./StepNextVisitSuggestion/StepNextVisitSuggestion"
import StepCanNextVisitGoAhead from "./StepCanNextVisitGoAhead/StepCanNextVisitGoAhead"
import StepNotesAndDescription from "./StepNotesAndDescription/StepNotesAndDescription"
import { mapValues } from "./helpers/mapValues"
import { mapVisitToFormValues } from "./helpers/mapVisitToFormValues"
import { useCurrentUser, useMoveItineraryItemToBottom } from "@/hooks"
import { useToast } from "@/components/toasts/useToast"

export default function CreateVisitPage() {
  const { itineraryId, caseId, visitId } = useParams<{
    itineraryId: string
    caseId: string
    visitId?: string
  }>()
  const [isLoading, setIsLoading] = useState(false)
  const { data: visit, refetch: execGet } = useVisit(visitId, {
    enabled: false,
  })
  const saveVisit = useSaveVisit({ visitId, itineraryId })
  const { data: itinerary } = useItinerary(itineraryId, { enabled: false })
  const currentUser = useCurrentUser()
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const { showToast } = useToast()

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

    setIsLoading(true)

    const initialValues = {
      author: currentUser?.id,
      case_id: caseId,
      itinerary_item: itineraryItem?.id,
    }
    const payload = mapValues({ ...values, ...initialValues })

    saveVisit.mutate(payload, {
      onSuccess: async ({ queued }) => {
        await moveItineraryItemToBottom()
        navigate(`/looplijsten/${itineraryId}`)
        showToast({
          title: queued
            ? "Bezoek offline opgeslagen"
            : "Bezoek succesvol verwerkt!",
          description: queued
            ? "Het bezoek is lokaal opgeslagen en wordt automatisch gesynchroniseerd zodra je weer online bent."
            : "Het bezoek is verwerkt en opgeslagen. Je wordt nu teruggestuurd naar de looplijst.",
          severity: "success",
        })
      },
      onSettled: () => {
        // Add slight delay to improve UX by preventing flicker. Navigation takes more time.
        setTimeout(() => {
          setIsLoading(false)
        }, 350)
      },
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
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Row align="between" wrap>
          <div>
            <Heading level={1}>Verwerk bezoek</Heading>
            <Paragraph size="large">
              {formatAddress(itineraryItem?.case?.address, true)}
            </Paragraph>
          </div>
          <StandaloneLink
            href="#"
            icon={ChevronBackwardIcon}
            onClick={() => navigate(`/looplijsten/${itineraryId}`)}
          >
            Terug naar looplijst
          </StandaloneLink>
        </Row>
      </Grid.Cell>
      <Grid.Cell span="all">
        <FormProvider form={form} onSubmit={onSubmit}>
          {steps[currentStep]}
        </FormProvider>
      </Grid.Cell>
    </Grid>
  )
}
