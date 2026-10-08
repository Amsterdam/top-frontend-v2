import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useFocusOpenRoom } from "../useFocusOpenRoom"

function Harness({
  openRoomId,
  withOppervlakte = true,
}: {
  openRoomId?: string
  withOppervlakte?: boolean
}) {
  const ref = useFocusOpenRoom(openRoomId)
  return (
    <div ref={ref} data-testid="room">
      <input name="ruimtes.0.naam" />
      {withOppervlakte && <input name="ruimtes.0.oppervlakte" />}
    </div>
  )
}

const mockReducedMotion = (matches: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches })),
  )

describe("useFocusOpenRoom", () => {
  // jsdom doesn't implement scrollIntoView.
  const scrollIntoView = vi.fn()
  Element.prototype.scrollIntoView = scrollIntoView

  afterEach(() => {
    cleanup()
    scrollIntoView.mockClear()
    vi.unstubAllGlobals()
  })

  it("scrolls smoothly to the room's form once it opens", () => {
    const { getByTestId } = render(<Harness openRoomId="a" />)

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    })
    expect(scrollIntoView.mock.instances[0]).toBe(getByTestId("room"))
  })

  it("scrolls without animation when the user asked for reduced motion", () => {
    mockReducedMotion(true)
    render(<Harness openRoomId="a" />)

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    })
  })

  it("focuses the first field when the room has no oppervlakte", () => {
    render(<Harness openRoomId="a" withOppervlakte={false} />)

    expect(document.activeElement?.getAttribute("name")).toBe("ruimtes.0.naam")
  })

  it("doesn't scroll or focus while no room is open", () => {
    render(<Harness />)

    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(document.body)
  })

  it("scrolls again when another room opens", () => {
    const { rerender } = render(<Harness openRoomId="a" />)
    rerender(<Harness openRoomId="a" />)
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    rerender(<Harness openRoomId="b" />)

    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })
})
