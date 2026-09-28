import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, useWatch } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BinnenruimteFields } from "../StepBinnenruimtes/BinnenruimteFields"
import { emptyVoorzieningen } from "../StepBinnenruimtes/binnenruimteConfig"

const badkamer = (voorzieningen: BinnenruimteVoorzieningen): Binnenruimte => ({
  type: "Badkamer",
  lengte: null,
  breedte: null,
  oppervlakte: 6,
  verwarmd: "true",
  verkoeld: "false",
  aantal_adressen: 1,
  ...emptyVoorzieningen("Badkamer"),
  ...voorzieningen,
})

function Harness() {
  const form = useForm<GebruikersinvoerFormValues>({
    defaultValues: {
      binnenruimtes: [
        badkamer({ douche_bad: "douche", wastafel: "1" }),
        badkamer({}),
      ],
    },
  })
  // Exposes the live form values, so the test can check what's stored per room.
  const binnenruimtes = useWatch({
    control: form.control,
    name: "binnenruimtes",
  })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <output data-testid="binnenruimtes">
        {JSON.stringify(binnenruimtes)}
      </output>
      <BinnenruimteFields
        index={1}
        label="Badkamer 2"
        type="Badkamer"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    </FormProvider>
  )
}

describe("BinnenruimteFields", () => {
  afterEach(cleanup)

  it("keeps the voorzieningen of each room apart", () => {
    render(<Harness />)

    const wastafel = screen.getByRole<HTMLInputElement>("checkbox", {
      name: "Wastafel",
    })
    // Badkamer 1 has a wastafel, badkamer 2 (shown here) doesn't.
    expect(wastafel.checked).toBe(false)

    fireEvent.click(wastafel)

    const [badkamer1, badkamer2] = JSON.parse(
      screen.getByTestId("binnenruimtes").textContent ?? "[]",
    ) as Binnenruimte[]
    expect(badkamer2.wastafel).toBe("1")
    expect(badkamer2.douche_bad).toBe("")
    expect(badkamer1.wastafel).toBe("1")
    expect(badkamer1.douche_bad).toBe("douche")
  })

  it("asks the aantal adressen with a stepper, from 1", () => {
    render(<Harness />)

    const aantalAdressen = screen.getByLabelText<HTMLInputElement>(
      "Aantal adressen",
      { selector: "input" },
    )
    expect(aantalAdressen.value).toBe("1")
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Aantal adressen verlagen",
      }).disabled,
    ).toBe(true)

    fireEvent.click(
      screen.getByRole("button", { name: "Aantal adressen verhogen" }),
    )

    const [, badkamer2] = JSON.parse(
      screen.getByTestId("binnenruimtes").textContent ?? "[]",
    ) as Binnenruimte[]
    expect(badkamer2.aantal_adressen).toBe(2)
  })
})

describe("emptyVoorzieningen", () => {
  it("starts the counts at 0 and the required choices unanswered", () => {
    expect(emptyVoorzieningen("Keuken")).toEqual(
      expect.objectContaining({ aanrechtlengte: "", inbouw_koelkast: "0" }),
    )
  })

  it("gives a room without voorzieningen none", () => {
    expect(emptyVoorzieningen("Woonkamer")).toEqual({})
  })
})
