import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import PuntentellerAdresPage from "../PuntentellerAdresPage"

const mockParams = { bagId: "abc123" }
const mockNavigate = vi.fn()
const mockMutate = vi.fn()
const mockShowToast = vi.fn()
const mockFindMissingFields = vi.fn()
const mockUseBagPdokAddress = vi.fn()

const DUMMY_INVOERWAARDEN: PuntentellerInvoerwaarden = {
  straat: "Tjasker",
  huisnummer: "59",
  bouwjaar: 1970,
  gebruiksoppervlakte: 90,
  woz_waarden: [
    { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
    { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
  ],
  wozobjectnummer: 36300297723,
  energie: {
    energielabel: "C",
    energieindex: null,
    registratiedatum: null,
    opnamedatum: null,
    meting_geldig_tot: null,
  },
}

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  }
})

vi.mock("@/api/hooks", () => ({
  useAddressInvoerwaarden: () => ({
    data: DUMMY_INVOERWAARDEN,
    isPending: false,
    isError: false,
  }),
  useBagPdokAddress: (bagId?: string) => mockUseBagPdokAddress(bagId),
  useSaveGebruikersinvoer: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

vi.mock("@/components", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components")>()

  return {
    ...actual,
    AmsterdamCrossSpinner: () => <div>Laden...</div>,
  }
})

// The steps are placeholders here, so no field can be filled in; findMissingFields has its
// own tests.
vi.mock("../helpers/findMissingFields", () => ({
  findMissingFields: (...args: unknown[]) => mockFindMissingFields(...args),
}))

vi.mock("@/components/toasts/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock("@amsterdam/ee-ads-rhf", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@amsterdam/ee-ads-rhf")>()

  return {
    ...actual,
    FormProvider: ({
      children,
      form,
      onSubmit,
    }: {
      children: ReactNode
      form: { handleSubmit: (fn: (values: unknown) => void) => () => void }
      onSubmit: (values: unknown) => void
    }) => <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>,
  }
})

const { stepPlaceholder } = vi.hoisted(() => ({
  stepPlaceholder: (label: string, isLastStep = false) =>
    function StepPlaceholder({ onNextStep }: { onNextStep?: () => void }) {
      return (
        <div>
          <p>{label}</p>
          {isLastStep ? (
            <button type="submit">Sla op en bereken</button>
          ) : (
            <button type="button" onClick={onNextStep}>
              Volgende stap
            </button>
          )}
        </div>
      )
    },
}))

vi.mock("../StepWoninggegevens/StepWoninggegevens", () => ({
  StepWoninggegevens: stepPlaceholder("Stap woninggegevens"),
}))
vi.mock("../StepBinnenruimtes/StepBinnenruimtes", () => ({
  StepBinnenruimtes: stepPlaceholder("Stap binnenruimtes"),
}))
vi.mock("../StepBuitenruimtes/StepBuitenruimtes", () => ({
  StepBuitenruimtes: stepPlaceholder("Stap buitenruimtes"),
}))
vi.mock("../StepBijzonderheden/StepBijzonderheden", () => ({
  StepBijzonderheden: stepPlaceholder("Stap bijzonderheden"),
}))
vi.mock("../StepOverzicht/StepOverzicht", () => ({
  StepOverzicht: stepPlaceholder("Stap overzicht", true),
}))
vi.mock("../StepResultaat/StepResultaat", () => ({
  StepResultaat: () => <p>Stap resultaat</p>,
}))

describe("PuntentellerAdresPage", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockFindMissingFields.mockReturnValue([])
    mockUseBagPdokAddress.mockReturnValue({ data: undefined })
  })

  afterEach(() => {
    cleanup()
  })

  it("shows the backend's straat and huisnummer in the heading until PDOK has answered", async () => {
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByRole("heading", { name: "Puntenteller (Tjasker 59)" }),
    ).toBeDefined()
  })

  it("shows PDOK's weergavenaam of the bagId, without postcode and woonplaats", async () => {
    mockUseBagPdokAddress.mockReturnValue({
      data: { weergavenaam: "Tjasker 59-H, 1035CS Amsterdam" },
    })
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByRole("heading", {
        name: "Puntenteller (Tjasker 59-H)",
      }),
    ).toBeDefined()
    expect(mockUseBagPdokAddress).toHaveBeenCalledWith("abc123")
  })

  it("walks through the steps and submits on the overzicht-stap", async () => {
    render(<PuntentellerAdresPage />)

    await screen.findByText("Stap woninggegevens")

    for (const label of [
      "Stap binnenruimtes",
      "Stap buitenruimtes",
      "Stap bijzonderheden",
      "Stap overzicht",
    ]) {
      fireEvent.click(screen.getByRole("button", { name: "Volgende stap" }))
      expect(await screen.findByText(label)).toBeDefined()
    }

    fireEvent.click(screen.getByRole("button", { name: "Sla op en bereken" }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })
  })

  it("doesn't save while required fields are missing", async () => {
    mockFindMissingFields.mockReturnValue([
      { step: 0, name: "woz_waarde", message: "WOZ-waarde is verplicht" },
    ])
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Overzicht" }))
    fireEvent.click(
      await screen.findByRole("button", { name: "Sla op en bereken" }),
    )

    await waitFor(() => {
      expect(mockFindMissingFields).toHaveBeenCalled()
    })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it("shows the resultaat-stap once the berekening has succeeded", async () => {
    mockMutate.mockImplementation(
      (_values: unknown, { onSuccess }: { onSuccess: () => void }) =>
        onSuccess(),
    )
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Overzicht" }))
    fireEvent.click(
      await screen.findByRole("button", { name: "Sla op en bereken" }),
    )

    expect(await screen.findByText("Stap resultaat")).toBeDefined()
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" }),
    )
  })

  it("shows an error toast and stays on the overzicht-stap when the berekening fails", async () => {
    mockMutate.mockImplementation(
      (_values: unknown, { onError }: { onError: () => void }) => onError(),
    )
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Overzicht" }))
    fireEvent.click(
      await screen.findByRole("button", { name: "Sla op en bereken" }),
    )

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({ severity: "error" }),
      )
    })
    expect(screen.getByText("Stap overzicht")).toBeDefined()
  })
})
