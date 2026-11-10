import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import dayjs from "dayjs"
import "dayjs/locale/nl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import PuntentellingenPage from "../PuntentellingenPage"

// The app sets the Dutch locale in App.tsx, which these tests don't render.
dayjs.locale("nl")

// jsdom has no dialog methods; the delete button opens and closes the ConfirmDialog.
const mockShowModal = vi.fn()
const mockClose = vi.fn()
HTMLDialogElement.prototype.showModal = mockShowModal
HTMLDialogElement.prototype.close = mockClose

const mockNavigate = vi.fn()
const mockUseBagPdokAddress = vi.fn()
const mockUseAddressPuntentellingen = vi.fn()
const mockDeleteMutateAsync = vi.fn()
const mockLocation = { search: "" }
const mockShowToast = vi.fn()

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ bagId: "abc123" }),
    useLocation: () => mockLocation,
    // Outside a router, so the redirect is recorded instead.
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
      mockNavigate(to, { replace })
      return null
    },
  }
})

vi.mock("@/api/hooks", () => ({
  useBagPdokAddress: (bagId?: string) => mockUseBagPdokAddress(bagId),
  useAddressPuntentellingen: (bagId?: string) =>
    mockUseAddressPuntentellingen(bagId),
  useDeletePuntentelling: () => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  }),
}))

vi.mock("@/components/toasts/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock("@/components", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components")>()

  return {
    ...actual,
    AmsterdamCrossSpinner: () => <div>Laden...</div>,
  }
})

const resultaat = (totaal_punten: number): PuntentellerResultaat => ({
  totaal_punten,
  rubrieken: [],
  opslagen: [],
  huurprijsopslagen: [],
  huurprijsopslag_procent: 0,
  maximale_huurprijs: null,
})

const AUTHOR: PuntentellingAuthor = {
  id: "c0ffee",
  email: "t.toezicht@amsterdam.nl",
  username: "t.toezicht",
  first_name: "T.",
  last_name: "Toezicht",
  full_name: "T. Toezicht",
}

const PUNTENTELLINGEN: Puntentelling[] = [
  {
    id: 2,
    author: AUTHOR,
    completed: false,
    created: "2026-03-04T09:30:00",
    updated: "2026-03-05T14:05:00",
    punten: 151.25,
    punten_resultaat: resultaat(151.25),
  },
  {
    id: 1,
    author: null,
    completed: true,
    created: "2026-01-15T10:00:00",
    updated: "2026-01-15T10:00:00",
    punten: 142,
    punten_resultaat: resultaat(142),
  },
]

describe("PuntentellingenPage", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockLocation.search = ""
    mockUseBagPdokAddress.mockReturnValue({
      data: { weergavenaam: "Tjasker 59-H, 1035CS Amsterdam" },
    })
    mockUseAddressPuntentellingen.mockReturnValue({
      data: PUNTENTELLINGEN,
      isPending: false,
      isFetching: false,
      isError: false,
    })
  })

  afterEach(() => {
    cleanup()
  })

  it("shows the address in the heading and the kruimelpad", () => {
    render(<PuntentellingenPage />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Puntentellingen (Tjasker 59-H)",
      }),
    ).toBeDefined()
    expect(screen.getByText("Tjasker 59-H")).toBeDefined()
    expect(mockUseBagPdokAddress).toHaveBeenCalledWith("abc123")
    expect(mockUseAddressPuntentellingen).toHaveBeenCalledWith("abc123")
  })

  it("shows the heading without the address until PDOK has answered", () => {
    mockUseBagPdokAddress.mockReturnValue({ data: undefined })
    render(<PuntentellingenPage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Puntentellingen" }),
    ).toBeDefined()
  })

  it("lists the puntentellingen with their dates, toezichthouder and punten", () => {
    render(<PuntentellingenPage />)

    // Without the last cell, the actions.
    const rows = screen
      .getAllByRole("row")
      .slice(1)
      .map((row) =>
        within(row)
          .getAllByRole("cell")
          .slice(0, 4)
          .map((cell) => cell.textContent),
      )
    expect(rows).toEqual([
      [
        "151,25Concept",
        "T. Toezicht",
        "4 mrt 2026, 09:30",
        "5 mrt 2026, 14:05",
      ],
      ["142", "Onbekend", "15 jan 2026, 10:00", "15 jan 2026, 10:00"],
    ])
  })

  it("only marks a concept", () => {
    render(<PuntentellingenPage />)

    const [concept, afgerond] = screen.getAllByRole("row").slice(1)
    expect(within(concept).getByText("Concept")).toBeDefined()
    expect(within(afgerond).queryByText("Concept")).toBeNull()
    expect(screen.queryByText("Afgerond")).toBeNull()
  })

  describe("verwijderen", () => {
    // Opens the dialog from the delete button in the row of the given puntentelling.
    const openDeleteDialog = (rowIndex: number) => {
      const row = screen.getAllByRole("row").slice(1)[rowIndex]
      fireEvent.click(within(row).getByRole("button", { name: "Verwijderen" }))
      return screen.getByRole("dialog", { hidden: true })
    }
    const confirm = (dialog: HTMLElement) =>
      fireEvent.click(
        within(dialog).getByRole("button", {
          name: "Verwijderen",
          hidden: true,
        }),
      )

    it("has one dialog for the whole table, outside the rows", () => {
      render(<PuntentellingenPage />)

      expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(1)
      for (const row of screen.getAllByRole("row")) {
        expect(within(row).queryByRole("dialog", { hidden: true })).toBeNull()
      }
    })

    it("names the puntentelling of the row that opened the dialog", () => {
      render(<PuntentellingenPage />)

      const dialog = openDeleteDialog(0)
      expect(mockShowModal).toHaveBeenCalled()
      expect(dialog.textContent).toContain(
        "Weet je zeker dat je de puntentelling van T. Toezicht (151,25 punten) wilt verwijderen?",
      )

      // Without an author, only the punten.
      openDeleteDialog(1)
      expect(dialog.textContent).toContain(
        "Weet je zeker dat je de puntentelling van 142 punten wilt verwijderen?",
      )
    })

    it("deletes the puntentelling after confirming, then closes the dialog", async () => {
      mockDeleteMutateAsync.mockResolvedValue(undefined)
      render(<PuntentellingenPage />)

      confirm(openDeleteDialog(0))

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(2)
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          expect.objectContaining({ severity: "success" }),
        )
      })
      expect(mockClose).toHaveBeenCalled()
    })

    it("says so when deleting fails, and keeps the dialog open", async () => {
      mockDeleteMutateAsync.mockRejectedValue(new Error("500"))
      render(<PuntentellingenPage />)

      confirm(openDeleteDialog(0))

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          expect.objectContaining({ severity: "error" }),
        )
      })
      expect(mockClose).not.toHaveBeenCalled()
    })
  })

  it("starts a new puntentelling", () => {
    render(<PuntentellingenPage />)

    fireEvent.click(
      screen.getByRole("button", { name: "Nieuwe puntentelling" }),
    )

    expect(mockNavigate).toHaveBeenCalledWith("/puntenteller/abc123/nieuw")
  })

  it("passes the query on to the wizard, e.g. ?dummydata", () => {
    mockLocation.search = "?dummydata=socialehuur"
    render(<PuntentellingenPage />)

    fireEvent.click(
      screen.getByRole("button", { name: "Nieuwe puntentelling" }),
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      "/puntenteller/abc123/nieuw?dummydata=socialehuur",
    )
  })

  it("goes straight on to a new puntentelling when the address has none yet", () => {
    mockUseAddressPuntentellingen.mockReturnValue({
      data: [],
      isPending: false,
      isFetching: false,
      isError: false,
    })
    render(<PuntentellingenPage />)

    expect(mockNavigate).toHaveBeenCalledWith("/puntenteller/abc123/nieuw", {
      replace: true,
    })
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull()
  })

  it("passes the query on when going straight on to a new puntentelling", () => {
    mockLocation.search = "?dummydata=socialehuur"
    mockUseAddressPuntentellingen.mockReturnValue({
      data: [],
      isPending: false,
      isFetching: false,
      isError: false,
    })
    render(<PuntentellingenPage />)

    expect(mockNavigate).toHaveBeenCalledWith(
      "/puntenteller/abc123/nieuw?dummydata=socialehuur",
      { replace: true },
    )
  })

  it("waits for the refetch before going on, as an empty list from the cache may be stale", () => {
    mockUseAddressPuntentellingen.mockReturnValue({
      data: [],
      isPending: false,
      isFetching: true,
      isError: false,
    })
    render(<PuntentellingenPage />)

    expect(screen.getByText("Laden...")).toBeDefined()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("shows a spinner while loading", () => {
    mockUseAddressPuntentellingen.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    })
    render(<PuntentellingenPage />)

    expect(screen.getByText("Laden...")).toBeDefined()
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull()
    expect(
      screen.queryByRole("button", { name: "Nieuwe puntentelling" }),
    ).toBeNull()
  })

  it("shows an error when the puntentellingen can't be fetched", () => {
    mockUseAddressPuntentellingen.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    })
    render(<PuntentellingenPage />)

    expect(
      screen.getByRole("heading", { name: "Puntentellingen niet opgehaald" }),
    ).toBeDefined()
  })
})
