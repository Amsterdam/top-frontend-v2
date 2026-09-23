import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { QuantityCheckbox } from "../components/QuantityCheckbox"

/** Holds the aantal in state like a form would, and reports every change. */
function Harness({
  onChange,
  max,
}: {
  onChange: (value: number) => void
  max?: number
}) {
  const [value, setValue] = useState(0)

  return (
    <QuantityCheckbox
      id="keuken_eenhandsmengkraan"
      label="Eénhandsmengkraan"
      value={value}
      max={max}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

const getCheckbox = () =>
  screen.getByRole<HTMLInputElement>("checkbox", { name: "Eénhandsmengkraan" })
const queryInput = () =>
  screen.queryByRole<HTMLInputElement>("textbox", {
    name: "Aantal Eénhandsmengkraan",
  })
const getInput = () => queryInput()!
const getVerlagen = () =>
  screen.getByRole<HTMLButtonElement>("button", {
    name: "Aantal Eénhandsmengkraan verlagen",
  })
const getVerhogen = () =>
  screen.getByRole<HTMLButtonElement>("button", {
    name: "Aantal Eénhandsmengkraan verhogen",
  })

function renderChecked(max?: number) {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} max={max} />)
  fireEvent.click(getCheckbox())
  return onChange
}

describe("QuantityCheckbox", () => {
  afterEach(cleanup)

  it("starts unchecked without a stepper", () => {
    render(<Harness onChange={vi.fn()} />)

    expect(getCheckbox().checked).toBe(false)
    expect(queryInput()).toBeNull()
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })

  it("sets the aantal to 1 and shows the stepper when checked, without moving focus", () => {
    const onChange = renderChecked()

    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(getCheckbox().checked).toBe(true)
    expect(getInput().value).toBe("1")
    expect(getInput().inputMode).toBe("numeric")
    expect(document.activeElement).not.toBe(getInput())
  })

  it("places the stepper after the checkbox in DOM order: checkbox, −, input, +", () => {
    renderChecked()

    const order = [getCheckbox(), getVerlagen(), getInput(), getVerhogen()]
    order.slice(1).forEach((element, index) => {
      expect(
        order[index].compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })
  })

  it("increases the aantal with +", () => {
    const onChange = renderChecked()

    fireEvent.click(getVerhogen())

    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(getInput().value).toBe("2")
  })

  it("disables − at 1", () => {
    renderChecked()

    expect(getVerlagen().disabled).toBe(true)
    expect(getVerhogen().disabled).toBe(false)
  })

  it("disables + at max", () => {
    const onChange = renderChecked(2)

    fireEvent.click(getVerhogen())

    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(getVerhogen().disabled).toBe(true)
    expect(getVerlagen().disabled).toBe(false)
  })

  it("takes over a typed number within the bounds", () => {
    const onChange = renderChecked()

    fireEvent.change(getInput(), { target: { value: "4" } })

    expect(onChange).toHaveBeenLastCalledWith(4)
    expect(getInput().value).toBe("4")
  })

  it("clamps a typed number above max to max on blur", () => {
    const onChange = renderChecked()

    fireEvent.change(getInput(), { target: { value: "9" } })
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.blur(getInput())

    expect(onChange).toHaveBeenLastCalledWith(5)
    expect(getInput().value).toBe("5")
  })

  it("clamps a typed 0 to 1 on blur", () => {
    const onChange = renderChecked()

    fireEvent.change(getInput(), { target: { value: "3" } })
    fireEvent.change(getInput(), { target: { value: "0" } })
    fireEvent.blur(getInput())

    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(getInput().value).toBe("1")
  })

  it("resets an emptied or non-numeric input to the current aantal on blur", () => {
    const onChange = renderChecked()

    fireEvent.change(getInput(), { target: { value: "3" } })
    fireEvent.change(getInput(), { target: { value: "abc" } })
    expect(getInput().value).toBe("")
    fireEvent.blur(getInput())

    expect(onChange).toHaveBeenLastCalledWith(3)
    expect(getInput().value).toBe("3")
  })

  it("resets the aantal to 0 and hides the stepper when unchecked, and restarts at 1", () => {
    const onChange = renderChecked()

    fireEvent.click(getVerhogen())
    fireEvent.click(getCheckbox())

    expect(onChange).toHaveBeenLastCalledWith(0)
    expect(queryInput()).toBeNull()
    expect(screen.queryAllByRole("button")).toHaveLength(0)

    fireEvent.click(getCheckbox())

    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(getInput().value).toBe("1")
  })
})
