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
  energielabel: "C",
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
            <button type="submit">Opslaan</button>
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
vi.mock("../StepSanitair/StepSanitair", () => ({
  StepSanitair: stepPlaceholder("Stap sanitair"),
}))
vi.mock("../StepKeuken/StepKeuken", () => ({
  StepKeuken: stepPlaceholder("Stap keuken"),
}))
vi.mock("../StepVertrekken/StepVertrekken", () => ({
  StepVertrekken: stepPlaceholder("Stap vertrekken"),
}))
vi.mock("../StepOverigeRuimtes/StepOverigeRuimtes", () => ({
  StepOverigeRuimtes: stepPlaceholder("Stap overige ruimtes"),
}))
vi.mock("../StepKlimaatBuitenParkeren/StepKlimaatBuitenParkeren", () => ({
  StepKlimaatBuitenParkeren: stepPlaceholder("Stap klimaat"),
}))
vi.mock("../StepBijzonderheden/StepBijzonderheden", () => ({
  StepBijzonderheden: stepPlaceholder("Stap bijzonderheden"),
}))
vi.mock("../StepOverzicht/StepOverzicht", () => ({
  StepOverzicht: stepPlaceholder("Stap overzicht", true),
}))

describe("PuntentellerAdresPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it("shows the address in the heading once the invoerwaarden are loaded", async () => {
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByRole("heading", { name: /Tjasker 59/ }),
    ).toBeDefined()
  })

  it("walks through all 8 steps and submits on the overzicht-stap", async () => {
    render(<PuntentellerAdresPage />)

    await screen.findByText("Stap woninggegevens")

    for (const label of [
      "Stap sanitair",
      "Stap keuken",
      "Stap vertrekken",
      "Stap overige ruimtes",
      "Stap klimaat",
      "Stap bijzonderheden",
      "Stap overzicht",
    ]) {
      fireEvent.click(screen.getByRole("button", { name: "Volgende stap" }))
      expect(await screen.findByText(label)).toBeDefined()
    }

    fireEvent.click(screen.getByRole("button", { name: "Opslaan" }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })
  })
})
