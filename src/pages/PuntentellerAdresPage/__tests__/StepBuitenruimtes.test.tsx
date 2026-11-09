import { useEffect } from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, type UseFormReturn } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepBuitenruimtes } from "../StepBuitenruimtes/StepBuitenruimtes"

type Form = UseFormReturn<GebruikersinvoerFormValues>

function Harness({
  values,
  onForm,
}: {
  values: Partial<GebruikersinvoerFormValues>
  onForm: (form: Form) => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  useEffect(() => {
    onForm(form)
  }, [form, onForm])
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepBuitenruimtes onNextStep={vi.fn()} />
    </FormProvider>
  )
}

const balkon = (oppervlakte: number | null): Buitenruimte => ({
  type: "Balkon",
  vlakken: [{ lengte: null, breedte: null, oppervlakte }],
  oppervlakte,
  aantal_adressen: 1,
})

const oppervlakteInput = () =>
  screen.getByLabelText<HTMLInputElement>("Oppervlakte (m²)")
const annuleren = () =>
  fireEvent.click(screen.getByRole("button", { name: "Annuleren" }))

describe("StepBuitenruimtes", () => {
  afterEach(cleanup)

  it("drops a new buitenruimte on Annuleren, without asking for its required fields", () => {
    let form: Form | undefined
    render(
      <Harness
        values={{ buitenruimtes: [] }}
        onForm={(f) => {
          form = f
        }}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Balkon" }))
    expect(screen.getByRole("heading", { name: "Balkon" })).toBeDefined()

    annuleren()

    expect(screen.queryByRole("heading", { name: "Balkon" })).toBeNull()
    expect(form!.getValues("buitenruimtes")).toEqual([])
  })

  it("starts the oppervlakte rows over when another type is chosen for a new buitenruimte", () => {
    let form: Form | undefined
    render(
      <Harness
        values={{ buitenruimtes: [] }}
        onForm={(f) => {
          form = f
        }}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Balkon" }))
    fireEvent.click(
      screen.getByRole("button", { name: "Oppervlakte toevoegen" }),
    )
    fireEvent.change(screen.getByLabelText("Oppervlakte 2 (m²)"), {
      target: { value: "13" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Dakterras" }))

    // One empty row, as the form values of the new room have it.
    expect(screen.queryByLabelText("Oppervlakte 2 (m²)")).toBeNull()
    expect(oppervlakteInput().value).toBe("")
    expect(form!.getValues("buitenruimtes.0.vlakken")).toEqual([
      { lengte: null, breedte: null, oppervlakte: null },
    ])
  })

  it("shows the total oppervlakte of the added buitenruimtes in the heading", () => {
    render(
      <Harness
        values={{ buitenruimtes: [balkon(8), balkon(4.5), balkon(null)] }}
        onForm={vi.fn()}
      />,
    )

    expect(
      screen.getByRole("heading", {
        name: "Toegevoegde buitenruimtes (12,5 m²)",
      }),
    ).toBeDefined()
  })

  it("focuses the oppervlakte of a buitenruimte once it's opened for editing", () => {
    render(<Harness values={{ buitenruimtes: [balkon(8)] }} onForm={vi.fn()} />)

    fireEvent.click(screen.getByRole("button", { name: "Wijzigen" }))

    expect(document.activeElement?.getAttribute("name")).toBe(
      "buitenruimtes.0.vlakken.0.oppervlakte",
    )
  })

  it("undoes the edits of a saved buitenruimte on Annuleren, including its errors", async () => {
    let form: Form | undefined
    render(
      <Harness
        values={{ buitenruimtes: [balkon(8)] }}
        onForm={(f) => {
          form = f
        }}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Wijzigen" }))
    fireEvent.change(oppervlakteInput(), { target: { value: "" } })
    fireEvent.click(screen.getByRole("button", { name: "Balkon opslaan" }))
    expect(
      (await screen.findAllByText("Vul de oppervlakte in.")).length,
    ).toBeGreaterThan(0)

    annuleren()

    expect(form!.getValues("buitenruimtes.0.oppervlakte")).toBe(8)
    expect(screen.getByText("Balkon (8 m²)")).toBeDefined()
    expect(
      form!.getFieldState("buitenruimtes.0.vlakken.0.oppervlakte").error,
    ).toBe(undefined)

    // Opening it again shows the saved values, without the old error.
    fireEvent.click(screen.getByRole("button", { name: "Wijzigen" }))
    expect(oppervlakteInput().value).toBe("8")
    expect(screen.queryByText("Vul de oppervlakte in.")).toBeNull()
  })
})
