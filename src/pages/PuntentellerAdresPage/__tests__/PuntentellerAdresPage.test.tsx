import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { useState, type ReactNode } from "react"
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
const mockMaakDefinitief = vi.fn()
const mockShowToast = vi.fn()
const mockFindMissingFields = vi.fn()
const mockUseBagPdokAddress = vi.fn()
const mockUseAddressInvoerwaarden = vi.fn()
const mockUseAddressPuntentellingen = vi.fn()
const mockUseInitialValues = vi.fn()

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
  monument: false,
  monument_soort: null,
}

// Only what the page reads of a saved puntentelling; its invoer goes through the (mocked)
// useInitialValues.
const DUMMY_PUNTENTELLING = {
  id: 1,
  author: null,
  // Saving always makes a concept.
  completed: false,
  created: "2026-01-15T10:00:00Z",
  updated: "2026-01-15T10:00:00Z",
  punten: 142,
  punten_resultaat: {
    totaal_punten: 142,
    rubrieken: [],
    opslagen: [],
    huurprijsopslagen: [],
    huurprijsopslag_procent: 0,
    maximale_huurprijs: null,
  },
} as unknown as PuntentellingDetail

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  }
})

vi.mock("@/api/hooks", () => ({
  useAddressInvoerwaarden: () => mockUseAddressInvoerwaarden(),
  useAddressPuntentellingen: () => mockUseAddressPuntentellingen(),
  useBagPdokAddress: (bagId?: string) => mockUseBagPdokAddress(bagId),
  useSavePuntentelling: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useMaakPuntentellingDefinitief: () => ({
    mutate: mockMaakDefinitief,
    isPending: false,
  }),
}))

vi.mock("../helpers/useInitialValues", () => ({
  useInitialValues: () => mockUseInitialValues(),
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

const { stepPlaceholder, mockStepMounted } = vi.hoisted(() => ({
  // Called with the form's values when a step mounts.
  mockStepMounted: vi.fn(),
  stepPlaceholder: (label: string, isLastStep = false) =>
    function StepPlaceholder({ onNextStep }: { onNextStep?: () => void }) {
      const { setValue, getValues } =
        useFormContext<GebruikersinvoerFormValues>()
      useState(() => mockStepMounted(getValues()))
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
            <button type="submit">Sla op als concept en bereken</button>
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
  StepBijzonderheden: stepPlaceholder("Stap bijzonderheden", true),
}))
vi.mock("../StepResultaat/StepResultaat", () => ({
  StepResultaat: ({ resultaat }: { resultaat?: PuntentellerResultaat }) => (
    <>
      <p>Stap resultaat</p>
      {resultaat && <p>{resultaat.totaal_punten} punten</p>}
    </>
  ),
}))

describe("PuntentellerAdresPage", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockUseAddressInvoerwaarden.mockReturnValue({
      data: DUMMY_INVOERWAARDEN,
      isPending: false,
      isError: false,
    })
    mockFindMissingFields.mockReturnValue([])
    mockUseBagPdokAddress.mockReturnValue({ data: undefined })
    mockUseAddressPuntentellingen.mockReturnValue({ data: [] })
    mockUseInitialValues.mockReturnValue({ isPending: false })
  })

  afterEach(() => {
    cleanup()
  })

  it("shows the backend's straat and huisnummer in the heading until PDOK has answered", async () => {
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByRole("heading", {
        name: "Puntentelling (Tjasker 59)",
      }),
    ).toBeDefined()
  })

  it("shows PDOK's weergavenaam of the bagId, without postcode and woonplaats", async () => {
    mockUseBagPdokAddress.mockReturnValue({
      data: { weergavenaam: "Tjasker 59-H, 1035CS Amsterdam" },
    })
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByRole("heading", {
        name: "Puntentelling (Tjasker 59-H)",
      }),
    ).toBeDefined()
    expect(mockUseBagPdokAddress).toHaveBeenCalledWith("abc123")
  })

  it("links back to the puntentellingen of the address in the kruimelpad", async () => {
    mockUseBagPdokAddress.mockReturnValue({
      data: { weergavenaam: "Tjasker 59-H, 1035CS Amsterdam" },
    })
    mockUseAddressPuntentellingen.mockReturnValue({
      data: [DUMMY_PUNTENTELLING],
    })
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Tjasker 59-H" }))

    expect(mockNavigate).toHaveBeenCalledWith("/puntenteller/abc123")
  })

  it("doesn't link to the address without puntentellingen, which would send straight back", async () => {
    mockUseBagPdokAddress.mockReturnValue({
      data: { weergavenaam: "Tjasker 59-H, 1035CS Amsterdam" },
    })
    render(<PuntentellerAdresPage />)

    await screen.findByText("Stap woninggegevens")
    expect(screen.queryByRole("link", { name: "Tjasker 59-H" })).toBeNull()
  })

  it("fills the form with the invoerwaarden, with the initial values winning", async () => {
    mockUseInitialValues.mockReturnValue({
      values: { woz_waarde: 215000, energielabel_klasse: "F" },
      isPending: false,
    })
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Bijzonderheden" }))
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Sla op als concept en bereken",
      }),
    )

    await waitFor(() => {
      expect(mockFindMissingFields).toHaveBeenCalledWith(
        expect.objectContaining({
          // From the initial values, instead of the invoerwaarden's 374000 and "C".
          woz_waarde: 215000,
          energielabel_klasse: "F",
          // From the invoerwaarden.
          gebruiksoppervlakte: 90,
          woz_peildatum_jaar: 2025,
        }),
        DUMMY_INVOERWAARDEN,
      )
    })
  })

  it("waits for the initial values before showing the form", () => {
    mockUseInitialValues.mockReturnValue({ isPending: true })
    render(<PuntentellerAdresPage />)

    expect(screen.getByText("Laden...")).toBeDefined()
    expect(screen.queryByText("Stap woninggegevens")).toBeNull()
  })

  it("keeps the form available when the address data request fails", async () => {
    mockUseAddressInvoerwaarden.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    })
    render(<PuntentellerAdresPage />)

    expect(
      await screen.findByText(
        "De gegevens voor dit adres konden niet worden opgehaald. Je kunt de puntentelling wel maken door de ontbrekende gegevens zelf in te vullen.",
      ),
    ).toBeDefined()
    expect(screen.getByText("Stap woninggegevens")).toBeDefined()
    expect(screen.getByRole("link", { name: "Binnenruimtes" })).toBeDefined()
  })

  it("walks through the steps and submits on the bijzonderheden-stap", async () => {
    render(<PuntentellerAdresPage />)

    await screen.findByText("Stap woninggegevens")

    for (const label of [
      "Stap binnenruimtes",
      "Stap buitenruimtes",
      "Stap bijzonderheden",
    ]) {
      fireEvent.click(screen.getByRole("button", { name: "Volgende stap" }))
      expect(await screen.findByText(label)).toBeDefined()
    }

    fireEvent.click(
      screen.getByRole("button", { name: "Sla op als concept en bereken" }),
    )

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })
  })

  it("doesn't save while required fields are missing, and opens the resultaat-stap that lists them", async () => {
    mockFindMissingFields.mockReturnValue([
      { step: 0, name: "woz_waarde", message: "WOZ-waarde is verplicht" },
    ])
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Bijzonderheden" }))
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Sla op als concept en bereken",
      }),
    )

    expect(await screen.findByText("Stap resultaat")).toBeDefined()
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it("shows the resultaat-stap once the berekening has succeeded", async () => {
    mockMutate.mockImplementation(
      (
        _values: unknown,
        { onSuccess }: { onSuccess: (data: PuntentellingDetail) => void },
      ) => onSuccess(DUMMY_PUNTENTELLING),
    )
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Bijzonderheden" }))
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Sla op als concept en bereken",
      }),
    )

    // The resultaat-stap gets the punten_resultaat of the saved puntentelling.
    expect(await screen.findByText("Stap resultaat")).toBeDefined()
    expect(screen.getByText("142 punten")).toBeDefined()
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "success" }),
    )
  })

  describe("niet-opgeslagen wijzigingen", () => {
    const save = async () => {
      fireEvent.click(
        await screen.findByRole("link", { name: "Bijzonderheden" }),
      )
      fireEvent.click(
        await screen.findByRole("button", {
          name: "Sla op als concept en bereken",
        }),
      )
    }
    const changeBouwjaar = (bouwjaar: number) =>
      fireEvent.click(
        screen.getByRole("button", { name: `Bouwjaar ${bouwjaar}` }),
      )

    beforeEach(() => {
      mockMutate.mockImplementation(
        (
          _values: unknown,
          { onSuccess }: { onSuccess: (data: PuntentellingDetail) => void },
        ) => onSuccess(DUMMY_PUNTENTELLING),
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

    it("warns on the resultaat-stap that the resultaat isn't up to date", async () => {
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
    })

    it("doesn't warn on the resultaat-stap when required fields are still missing", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      mockFindMissingFields.mockReturnValue([
        { step: 0, name: "woz_waarde", message: "WOZ-waarde is verplicht" },
      ])
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))

      expect(await screen.findByText("Stap resultaat")).toBeDefined()
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
    })

    it("saves and shows the resultaat-stap again when submitting from the resultaat-stap", async () => {
      render(<PuntentellerAdresPage />)
      await save()
      await screen.findByText("Stap resultaat")

      fireEvent.click(screen.getByRole("link", { name: "Woning" }))
      changeBouwjaar(1990)
      fireEvent.click(screen.getByRole("link", { name: /^Resultaat/ }))
      fireEvent.click(
        await screen.findByRole("button", {
          name: "Opslaan als concept en herberekenen",
        }),
      )

      expect(await screen.findByText("Stap resultaat")).toBeDefined()
      expect(mockMutate).toHaveBeenCalledTimes(2)
      expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
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

  describe("opslaan", () => {
    const save = async () => {
      fireEvent.click(
        await screen.findByRole("link", { name: "Bijzonderheden" }),
      )
      fireEvent.click(
        await screen.findByRole("button", {
          name: "Sla op als concept en bereken",
        }),
      )
    }

    beforeEach(() => {
      mockMutate.mockImplementation(
        (
          _variables: unknown,
          { onSuccess }: { onSuccess: (data: PuntentellingDetail) => void },
        ) => onSuccess(DUMMY_PUNTENTELLING),
      )
    })

    it("makes a new puntentelling on the first save and changes it on the next", async () => {
      render(<PuntentellerAdresPage />)

      await save()
      await screen.findByText("Stap resultaat")
      expect(mockMutate).toHaveBeenLastCalledWith(
        { id: undefined, payload: expect.any(Object) },
        expect.any(Object),
      )
      // The url names the new puntentelling, so reloading reopens it.
      expect(mockNavigate).toHaveBeenCalledWith("/puntenteller/abc123/1", {
        replace: true,
      })

      await save()
      await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(2))
      expect(mockMutate).toHaveBeenLastCalledWith(
        { id: 1, payload: expect.any(Object) },
        expect.any(Object),
      )
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    describe("een opgeslagen puntentelling", () => {
      beforeEach(() => {
        mockUseAddressPuntentellingen.mockReturnValue({
          data: [DUMMY_PUNTENTELLING],
        })
        mockUseInitialValues.mockReturnValue({
          values: { woz_waarde: 215000 },
          puntentelling: DUMMY_PUNTENTELLING,
          isPending: false,
          isError: false,
        })
      })

      it("only shows the steps once the form holds the saved values", async () => {
        // StepWoninggegevens takes a change of the WOZ-peildatum for the user's, and then
        // fills in the invoerwaarden's WOZ-waarde for it.
        mockUseInitialValues.mockReturnValue({
          values: { woz_waarde: 215000, woz_peildatum_jaar: 2024 },
          puntentelling: DUMMY_PUNTENTELLING,
          isPending: false,
          isError: false,
        })
        render(<PuntentellerAdresPage />)

        await screen.findByText("Stap woninggegevens")

        expect(mockStepMounted).toHaveBeenCalledTimes(1)
        expect(mockStepMounted).toHaveBeenCalledWith(
          expect.objectContaining({
            woz_waarde: 215000,
            woz_peildatum_jaar: 2024,
          }),
        )
      })

      it("isn't prefilled with the invoerwaarden", async () => {
        render(<PuntentellerAdresPage />)

        await save()

        await waitFor(() => {
          expect(mockMutate).toHaveBeenCalledWith(
            {
              id: 1,
              payload: expect.objectContaining({
                woz_waarde: 215000,
                // The defaults, instead of the invoerwaarden's 90 and 2025.
                gebruiksoppervlakte: 0,
                woz_peildatum_jaar: new Date().getFullYear(),
              }),
            },
            expect.any(Object),
          )
        })
      })

      it("says it's being changed in the kruimelpad", async () => {
        render(<PuntentellerAdresPage />)

        expect(await screen.findByText("Puntentelling bewerken")).toBeDefined()
        expect(screen.queryByText("Nieuwe puntentelling")).toBeNull()
      })

      it("shows its resultaat right away, as up to date", async () => {
        render(<PuntentellerAdresPage />)

        fireEvent.click(await screen.findByRole("link", { name: "Resultaat" }))

        expect(await screen.findByText("142 punten")).toBeDefined()
        expect(screen.queryByText("Dit resultaat is niet actueel")).toBeNull()
      })

      it("saves the changes to it", async () => {
        render(<PuntentellerAdresPage />)

        await save()

        await waitFor(() => {
          expect(mockMutate).toHaveBeenCalledWith(
            {
              id: 1,
              payload: expect.objectContaining({ woz_waarde: 215000 }),
            },
            expect.any(Object),
          )
        })
        expect(mockNavigate).not.toHaveBeenCalled()
      })
    })

    describe("concept en definitief", () => {
      const DEFINITIEF = { ...DUMMY_PUNTENTELLING, completed: true }
      const maakDefinitiefButton = () =>
        screen.queryByRole("button", { name: "Maak definitief" })

      it("shows no status for a new puntentelling until it's saved", async () => {
        render(<PuntentellerAdresPage />)

        await screen.findByText("Stap woninggegevens")
        expect(screen.queryByText("Concept")).toBeNull()
        expect(maakDefinitiefButton()).toBeNull()

        await save()

        expect(await screen.findByText("Concept")).toBeDefined()
        expect(maakDefinitiefButton()).not.toBeNull()
      })

      it("only offers Maak definitief while the form is as it was saved", async () => {
        render(<PuntentellerAdresPage />)
        await save()
        await screen.findByText("Stap resultaat")

        fireEvent.click(screen.getByRole("link", { name: "Woning" }))
        fireEvent.click(screen.getByRole("button", { name: "Bouwjaar 1990" }))

        await waitFor(() => expect(maakDefinitiefButton()).toBeNull())
        expect(screen.getByText("Concept")).toBeDefined()
      })

      it("makes the concept definitief", async () => {
        mockMaakDefinitief.mockImplementation(
          (
            _id: number,
            { onSuccess }: { onSuccess: (data: PuntentellingDetail) => void },
          ) => onSuccess(DEFINITIEF),
        )
        render(<PuntentellerAdresPage />)
        await save()

        fireEvent.click(
          await screen.findByRole("button", { name: "Maak definitief" }),
        )

        expect(mockMaakDefinitief).toHaveBeenCalledWith(1, expect.any(Object))
        await waitFor(() => expect(screen.queryByText("Concept")).toBeNull())
        expect(maakDefinitiefButton()).toBeNull()
        expect(mockShowToast).toHaveBeenLastCalledWith(
          expect.objectContaining({
            title: "Puntentelling definitief gemaakt",
            severity: "success",
          }),
        )
      })

      it("stays a concept when making it definitief fails", async () => {
        mockMaakDefinitief.mockImplementation(
          (_id: number, { onError }: { onError: () => void }) => onError(),
        )
        render(<PuntentellerAdresPage />)
        await save()

        fireEvent.click(
          await screen.findByRole("button", { name: "Maak definitief" }),
        )

        expect(mockShowToast).toHaveBeenLastCalledWith(
          expect.objectContaining({ severity: "error" }),
        )
        expect(screen.getByText("Concept")).toBeDefined()
        expect(maakDefinitiefButton()).not.toBeNull()
      })

      it("makes a reopened definitieve puntentelling a concept again once it's saved", async () => {
        mockUseInitialValues.mockReturnValue({
          values: {},
          puntentelling: DEFINITIEF,
          isPending: false,
          isError: false,
        })
        render(<PuntentellerAdresPage />)

        await screen.findByText("Stap woninggegevens")
        expect(screen.queryByText("Concept")).toBeNull()
        expect(maakDefinitiefButton()).toBeNull()

        await save()

        expect(await screen.findByText("Concept")).toBeDefined()
        expect(maakDefinitiefButton()).not.toBeNull()
      })
    })

    it("says so when the puntentelling in the url can't be fetched", async () => {
      mockUseInitialValues.mockReturnValue({ isPending: false, isError: true })
      render(<PuntentellerAdresPage />)

      expect(
        await screen.findByRole("heading", {
          name: "Puntentelling niet gevonden",
        }),
      ).toBeDefined()
      expect(screen.queryByText("Stap woninggegevens")).toBeNull()

      fireEvent.click(
        screen.getByRole("link", {
          name: "Naar de puntentellingen van dit adres",
        }),
      )
      expect(mockNavigate).toHaveBeenCalledWith("/puntenteller/abc123")
    })
  })

  it("shows an error toast and stays on the bijzonderheden-stap when the berekening fails", async () => {
    mockMutate.mockImplementation(
      (_values: unknown, { onError }: { onError: () => void }) => onError(),
    )
    render(<PuntentellerAdresPage />)

    fireEvent.click(await screen.findByRole("link", { name: "Bijzonderheden" }))
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Sla op als concept en bereken",
      }),
    )

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({ severity: "error" }),
      )
    })
    expect(screen.getByText("Stap bijzonderheden")).toBeDefined()
  })
})
