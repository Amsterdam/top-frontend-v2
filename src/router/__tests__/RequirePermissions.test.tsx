import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import RequirePermissions from "../RequirePermissions"

const mockUsePermissions = vi.fn()

vi.mock("@/api/hooks", () => ({
  usePermissions: () => mockUsePermissions(),
}))

vi.mock("@/components", () => ({
  AmsterdamCrossSpinner: () => <div>Laden...</div>,
}))

const renderWithRouter = () => {
  const router = createMemoryRouter(
    [
      { path: "/", element: <div>Home</div> },
      {
        element: (
          <RequirePermissions requiredPermissions="planner.manage_settings" />
        ),
        children: [
          { path: "/team-instellingen", element: <div>Instellingen</div> },
        ],
      },
    ],
    { initialEntries: ["/team-instellingen"] },
  )

  return render(<RouterProvider router={router} />)
}

describe("RequirePermissions", () => {
  beforeEach(() => {
    mockUsePermissions.mockReset()
  })

  it("shows a spinner while permissions are pending", () => {
    mockUsePermissions.mockReturnValue({ data: undefined, isPending: true })

    renderWithRouter()

    expect(screen.getByText("Laden...")).toBeDefined()
    expect(screen.queryByText("Instellingen")).toBeNull()
  })

  it("redirects to / when the required permission is missing", async () => {
    mockUsePermissions.mockReturnValue({
      data: ["planner.some_other_permission"],
      isPending: false,
    })

    renderWithRouter()

    expect(await screen.findByText("Home")).toBeDefined()
    expect(screen.queryByText("Instellingen")).toBeNull()
  })

  it("renders the outlet when the required permission is present", async () => {
    mockUsePermissions.mockReturnValue({
      data: ["planner.manage_settings"],
      isPending: false,
    })

    renderWithRouter()

    expect(await screen.findByText("Instellingen")).toBeDefined()
  })
})
