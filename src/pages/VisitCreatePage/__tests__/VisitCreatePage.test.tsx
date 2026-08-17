import { fireEvent, render, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import VisitCreatePage from "../VisitCreatePage"

const mockParams: { itineraryId: string; caseId: string; visitId?: string } = {
  itineraryId: "1000",
  caseId: "6711",
}
const mockNavigate = vi.fn()
const mockRefetchVisit = vi.fn()
const mockRefetchItinerary = vi.fn()
const mockMutate = vi.fn()
const mockMoveItineraryItemToBottom = vi.fn()
const mockShowToast = vi.fn()
const mockUseVisit = vi.fn()
const mockUseItinerary = vi.fn()
const mockUseCurrentUser = vi.fn()
const mockUseTokenPayload = vi.fn()

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  }
})

vi.mock("@/api/hooks", () => ({
  useVisit: (...args: unknown[]) => mockUseVisit(...args),
  useItinerary: (...args: unknown[]) => mockUseItinerary(...args),
  useSaveVisit: () => ({ mutate: mockMutate }),
}))

vi.mock("@/hooks", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
  useTokenPayload: () => mockUseTokenPayload(),
  useMoveItineraryItemToBottom: () => ({
    moveItineraryItemToBottom: mockMoveItineraryItemToBottom,
  }),
}))

vi.mock("@/components", () => ({
  AmsterdamCrossSpinner: () => <div>Laden...</div>,
}))

vi.mock("@/components/toasts/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock("@amsterdam/ee-ads-rhf", () => ({
  FormProvider: ({
    children,
    onSubmit,
  }: {
    children: ReactNode
    onSubmit: (values: Record<string, unknown>) => void
  }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
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
        })
      }}
    >
      <button type="submit">Opslaan</button>
      {children}
    </form>
  ),
}))

vi.mock("../StepSituation/StepSituation", () => ({
  default: () => <div>Stap situatie</div>,
}))

vi.mock("../StepObservation/StepObservations", () => ({
  default: () => <div>Stap observaties</div>,
}))

vi.mock("../StepNextVisitSuggestion/StepNextVisitSuggestion", () => ({
  default: () => <div>Stap volgend bezoek</div>,
}))

vi.mock("../StepCanNextVisitGoAhead/StepCanNextVisitGoAhead", () => ({
  default: () => <div>Stap vervolgstap</div>,
}))

vi.mock("../StepNotesAndDescription/StepNotesAndDescription", () => ({
  default: () => <div>Stap notities</div>,
}))

describe("VisitCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockParams.itineraryId = "1000"
    mockParams.caseId = "6711"
    delete mockParams.visitId

    mockUseVisit.mockReturnValue({
      data: undefined,
      refetch: mockRefetchVisit,
    })
    mockUseItinerary.mockReturnValue({
      data: undefined,
      refetch: mockRefetchItinerary,
    })
    mockUseCurrentUser.mockReturnValue({ id: "user-1" })
    mockUseTokenPayload.mockReturnValue(undefined)
    mockMoveItineraryItemToBottom.mockResolvedValue(undefined)
  })

  it("refetches the itinerary when the cached itinerary is missing", async () => {
    render(<VisitCreatePage />)

    await waitFor(() => {
      expect(mockRefetchItinerary).toHaveBeenCalledTimes(1)
    })

    expect(mockRefetchVisit).not.toHaveBeenCalled()
  })

  it("refetches the visit and itinerary once each on the edit route", async () => {
    mockParams.visitId = "456"

    render(<VisitCreatePage />)

    await waitFor(() => {
      expect(mockRefetchVisit).toHaveBeenCalledTimes(1)
      expect(mockRefetchItinerary).toHaveBeenCalledTimes(1)
    })
  })

  it("uses token user id fallback when saving offline without a loaded current user", async () => {
    mockUseCurrentUser.mockReturnValue(undefined)
    mockUseTokenPayload.mockReturnValue({ oid: "token-user-id" })
    mockUseItinerary.mockReturnValue({
      data: {
        items: [{ id: 123, case: { id: Number(mockParams.caseId) }, visits: [] }],
      },
      refetch: mockRefetchItinerary,
    })
    mockMutate.mockImplementation(
      (_payload: unknown, options: { onSuccess: (value: { queued: boolean }) => void }) => {
        options.onSuccess({ queued: true })
      },
    )

    const { getAllByRole } = render(<VisitCreatePage />)

    const submitButtons = getAllByRole("button", { name: "Opslaan" })
    fireEvent.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          author: "token-user-id",
          case_id: mockParams.caseId,
          itinerary_item: 123,
        }),
        expect.any(Object),
      )
    })

    expect(mockNavigate).toHaveBeenCalledWith("/looplijsten/1000")
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Bezoek offline opgeslagen",
      }),
    )
  })
})
