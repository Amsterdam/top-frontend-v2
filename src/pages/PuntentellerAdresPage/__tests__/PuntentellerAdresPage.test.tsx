import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import type { ReactNode } from "react"
import {
  FormProvider as RhfFormProvider,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form"
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
  gebruiksoppervlakte: 90,
  woz_waarden: [
    { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
    { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
  ],
  wozobjectnummer: 36300297723,
  energie: {
    bouwjaar: 1970,
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
      form: UseFormReturn<GebruikersinvoerFormValues>
      onSubmit: (values: GebruikersinvoerFormValues) => void
    }) => (
      <RhfFormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </RhfFormProvider>
    ),
  }
})

const { stepPlaceholder } = vi.hoisted(() => ({
  stepPlaceholder: (label: string, isLastStep = false) =>
    function StepPlaceholder({ onNextStep }: { onNextStep?: () => void }) {
      const { setValue } = useFormContext<GebruikersinvoerFormValues>()
      return (
        <div>
          <p>{label}</p>
          {[1970, 1990].map((bouwjaar) => (
            <button
              key={bouwjaar}
              type="button"
              onClick={() => setValue("bouwjaar", bouwjaar)}
            >
              Bouwjaar {bouwjaar}
            </button>
          ))}
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
  StepResultaat: () => (
    <div>
      <p>Stap resultaat</p>
      <button type="submit">Opnieuw opslaan</button>
    </div>
  ),
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

  describe("niet-opgeslagen wijzigingen", () => {
    const save = async () => {
      fireEvent.click(await screen.findByRole("link", { name: "Overzicht" }))
      fireEvent.click(
        await screen.findByRole("button", { name: "Sla op en bereken" }),
      )
    }
    const changeBouwjaar = (bouwjaar: number) =>
      fireEvent.click(
        screen.getByRole("button", { name: `Bouwjaar ${bouwjaar}` }),
      )

    beforeEach(() => {
      mockMutate.mockImplementation(
        (_values: unknown, { onSuccess }: { onSuccess: () => void }) =>
          onSuccess(),
      )
    })

    it("doesn't warn before the first save", async () => {
      render(<PuntentellerAdresPage />)

      await screen.findByText("Stap woninggegevens")
      changeBouwjaar(1990)

      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))

      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
    })

    it("marks the Resultaat tab as niet actueel while a change is unsaved", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")
      expect(screen.getByRole("link", { name: "Resultaat" })).toBeDefined()

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)

      expect(
        await screen.findByRole("link", {
          name: /^Resultaat ?, niet actueel$/,
        }),
      ).toBeDefined()

      changeBouwjaar(1970)

      expect(
        await screen.findByRole("link", { name: "Resultaat" }),
      ).toBeDefined()
    })

    it("doesn't warn on the steps with fields, nor once the change is undone", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)

      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()

      changeBouwjaar(1970)
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))

      expect(await screen.findByText("Stap resultaat")).toBeDefined()
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
    })

    it("warns on the resultaat-stap that the resultaat isn't up to date, and links to the overzicht", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))

      expect(
        await screen.findByRole("heading", {
          name: "Dit resultaat is niet actueel",
        }),
      ).toBeDefined()

      fireEvent.click(screen.getByRole("link", { name: "overzicht" }))

      expect(await screen.findByText("Stap overzicht")).toBeDefined()
    })

    it("saves and shows the resultaat-stap again when submitting from the resultaat-stap", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))
      fireEvent.click(
        await screen.findByRole("button", { name: "Opnieuw opslaan" }),
      )

      expect(await screen.findByText("Stap resultaat")).toBeDefined()
      expect(mockMutate).toHaveBeenCalledTimes(2)
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
    })

    it("opens the overzicht-stap when saving from the resultaat-stap is blocked by missing fields", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      mockFindMissingFields.mockReturnValue([
        { step: 0, name: "woz_waarde", message: "WOZ-waarde is verplicht" },
      ])
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))
      fireEvent.click(
        await screen.findByRole("button", { name: "Opnieuw opslaan" }),
      )

      expect(await screen.findByText("Stap overzicht")).toBeDefined()
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })

    it("stops warning once the changes are saved", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      await save()

      expect(await screen.findByText("Stap resultaat")).toBeDefined()
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
    })
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
