import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, useWatch } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { OppervlakteFields } from "../components/OppervlakteFields"

function Harness({ room }: { room: Partial<Binnenruimte> }) {
  const form = useForm<GebruikersinvoerFormValues>({
    mode: "onChange",
    defaultValues: {
      binnenruimtes: [
        {
          type: "Woonkamer",
          vlakken: [{ lengte: null, breedte: null, oppervlakte: null }],
          oppervlakte: null,
          verwarmd: "true",
          verkoeld: "false",
          aantal_adressen: 1,
          ...room,
        },
      ],
    },
  })
  // The ruimte's own oppervlakte isn't an input, so it's exposed for the test to check.
  const oppervlakte = useWatch({
    control: form.control,
    name: "binnenruimtes.0.oppervlakte",
  })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <output data-testid="oppervlakte">{String(oppervlakte)}</output>
      <OppervlakteFields name="binnenruimtes" index={0} />
    </FormProvider>
  )
}

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label, { exact: false }), {
    target: { value },
  })

const inputValue = (label: string) =>
  screen.getByLabelText<HTMLInputElement>(label, { exact: false }).value

const roomOppervlakte = () => screen.getByTestId("oppervlakte").textContent

describe("OppervlakteFields", () => {
  afterEach(cleanup)

  it("fills in the row's and the ruimte's oppervlakte from lengte x breedte", async () => {
    render(<Harness room={{}} />)

    type("Lengte (m)", "5")
    type("Breedte (m)", "4")

    await waitFor(() => expect(inputValue("Oppervlakte (m²)")).toBe("20"))
    expect(roomOppervlakte()).toBe("20")
    // One row needs no total: its oppervlakte is the total.
    expect(screen.queryByText("Totaal:")).toBeNull()
  })

  it("adds a row with the plus button and shows the total of the rows", async () => {
    render(<Harness room={{}} />)

    type("Lengte (m)", "5")
    type("Breedte (m)", "4")
    fireEvent.click(
      screen.getByRole("button", { name: "Oppervlakte toevoegen" }),
    )
    type("Oppervlakte 2 (m²)", "3")

    await waitFor(() => expect(roomOppervlakte()).toBe("23"))
    expect(inputValue("Oppervlakte 1 (m²)")).toBe("20")
    expect(screen.getByText("23 m²")).toBeTruthy()
  })

  it("leaves a removed row out of the total", async () => {
    render(
      <Harness
        room={{
          vlakken: [
            { lengte: 5, breedte: 4, oppervlakte: 20 },
            { lengte: 2, breedte: 1.5, oppervlakte: 3 },
          ],
          oppervlakte: 23,
        }}
      />,
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Oppervlakte 2 verwijderen" }),
    )

    await waitFor(() => expect(roomOppervlakte()).toBe("20"))
    expect(screen.queryByRole("button", { name: /verwijderen/ })).toBeNull()
  })

  it("keeps a typed-in oppervlakte when a saved room is opened again", () => {
    render(
      <Harness
        room={{
          vlakken: [{ lengte: 5, breedte: 4, oppervlakte: 18.5 }],
          oppervlakte: 18.5,
        }}
      />,
    )

    expect(inputValue("Oppervlakte (m²)")).toBe("18.5")
    expect(roomOppervlakte()).toBe("18.5")
  })
})
