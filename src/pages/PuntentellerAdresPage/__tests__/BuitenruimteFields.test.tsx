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

const getAantalAdressen = () =>
  screen.getByLabelText<HTMLInputElement>(
    "Hoeveel adressen kunnen gebruik maken van de parkeerruimte?",
  )

describe("BuitenruimteFields", () => {
  afterEach(cleanup)

  it("shows an error for a non-integer aantal adressen and clears it once it's an integer", async () => {
    render(
      <Harness>
        <BuitenruimteFields
          index={0}
          label="Parkeerruimte"
          type="Parkeerruimte"
          onSave={vi.fn()}
        />
      </Harness>,
    )

    fireEvent.change(getAantalAdressen(), { target: { value: "1.5" } })
    // Shown both below the field and in the InvalidFormAlert.
    expect(await screen.findAllByText("Vul een heel getal in.")).toHaveLength(2)

    fireEvent.change(getAantalAdressen(), { target: { value: "2" } })
    await waitFor(() =>
      expect(screen.queryAllByText("Vul een heel getal in.")).toHaveLength(0),
    )
  })

  it("saves a parkeerruimte with an integer aantal adressen", async () => {
    const onSave = vi.fn()
    render(
      <Harness>
        <BuitenruimteFields
          index={0}
          label="Parkeerruimte"
          type="Parkeerruimte"
          onSave={onSave}
        />
      </Harness>,
    )

    fireEvent.change(getAantalAdressen(), { target: { value: "3" } })
    fireEvent.click(screen.getByRole("button", { name: /toevoegen/ }))

    await waitFor(() => expect(onSave).toHaveBeenCalled())
  })
})
