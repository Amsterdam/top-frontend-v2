import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import type { ReactNode } from "react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BuitenruimteFields } from "../StepBuitenruimtes/BuitenruimteFields"

function Harness({ children }: { children: ReactNode }) {
  const form = useForm<GebruikersinvoerFormValues>({
    mode: "onChange",
    defaultValues: {
      buitenruimtes: [
        {
          type: "Parkeerruimte",
          lengte: null,
          breedte: null,
          oppervlakte: null,
          aantal_adressen: 1,
          parkeerplekken_afgesloten_parkeergarage: "0",
          parkeerplekken_buiten_met_dak: "0",
          parkeerplekken_buiten_zonder_dak: "0",
          laadpaal: "0",
        },
      ],
    },
  })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      {children}
    </FormProvider>
  )
}

function renderFields(type: BuitenruimteType, onSave: () => void = vi.fn()) {
  render(
    <Harness>
      <BuitenruimteFields
        index={0}
        label={type}
        type={type}
        onSave={onSave}
        onCancel={vi.fn()}
      />
    </Harness>,
  )
}

const getStepperInput = () =>
  screen.getByLabelText<HTMLInputElement>(
    "Hoeveel adressen kunnen gebruik maken van de parkeerruimte(s)?",
  )

describe("BuitenruimteFields", () => {
  afterEach(cleanup)

  it("shows an error for a non-integer aantal adressen and clears it once it's an integer", async () => {
    renderFields("Balkon")
    const aantalAdressen = screen.getByLabelText("Aantal adressen")

    fireEvent.change(aantalAdressen, { target: { value: "1.5" } })
    // Shown both below the field and in the InvalidFormAlert.
    expect(await screen.findAllByText("Vul een heel getal in.")).toHaveLength(2)

    fireEvent.change(aantalAdressen, { target: { value: "2" } })
    await waitFor(() =>
      expect(screen.queryAllByText("Vul een heel getal in.")).toHaveLength(0),
    )
  })

  it("asks the aantal adressen of a parkeerruimte with a stepper, from 1", () => {
    renderFields("Parkeerruimte")

    expect(getStepperInput().value).toBe("1")
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Aantal adressen verlagen",
      }).disabled,
    ).toBe(true)

    fireEvent.click(
      screen.getByRole("button", { name: "Aantal adressen verhogen" }),
    )
    expect(getStepperInput().value).toBe("2")
  })

  it("saves a parkeerruimte with the stepped aantal adressen", async () => {
    const onSave = vi.fn()
    renderFields("Parkeerruimte", onSave)

    fireEvent.change(getStepperInput(), { target: { value: "3" } })
    fireEvent.click(
      screen.getByLabelText("Buiten met dak behorend bij het complex"),
    )
    fireEvent.click(screen.getByRole("button", { name: /toevoegen/ }))

    await waitFor(() => expect(onSave).toHaveBeenCalled())
    expect(getStepperInput().value).toBe("3")
  })

  it("requires at least one type parkeerplek, of any type", async () => {
    const onSave = vi.fn()
    renderFields("Parkeerruimte", onSave)

    fireEvent.click(screen.getByRole("button", { name: /toevoegen/ }))
    // Shown both above the parkeerplekken and in the InvalidFormAlert.
    expect(
      await screen.findAllByText("Kies minimaal 1 type parkeerplek."),
    ).toHaveLength(2)
    expect(onSave).not.toHaveBeenCalled()

    // Not the first type, which holds the rule: the others revalidate it.
    fireEvent.click(
      screen.getByLabelText("Buiten zonder dak behorend tot het complex"),
    )
    await waitFor(() =>
      expect(
        screen.queryAllByText("Kies minimaal 1 type parkeerplek."),
      ).toHaveLength(0),
    )

    fireEvent.click(screen.getByRole("button", { name: /toevoegen/ }))
    await waitFor(() => expect(onSave).toHaveBeenCalled())
  })
})
