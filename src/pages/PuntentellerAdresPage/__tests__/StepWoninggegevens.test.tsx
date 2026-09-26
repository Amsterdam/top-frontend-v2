import { useEffect } from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, type UseFormReturn } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepWoninggegevens } from "../StepWoninggegevens/StepWoninggegevens"

type Form = UseFormReturn<GebruikersinvoerFormValues>

function Harness({
  values,
  onForm,
  onNextStep = vi.fn(),
}: {
  values: Partial<GebruikersinvoerFormValues>
  /** Hands the form to the test, e.g. to trigger validation. */
  onForm?: (form: Form) => void
  onNextStep?: () => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  useEffect(() => {
    onForm?.(form)
  }, [form, onForm])
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepWoninggegevens onNextStep={onNextStep} />
    </FormProvider>
  )
}

const energielabelSelect = () =>
  screen.queryByRole<HTMLSelectElement>("combobox", { name: "Energielabel" })
const energieIndexInput = () =>
  screen.queryByLabelText<HTMLInputElement>("Energie-index", {
    selector: "input:not([type=radio])",
  })
const bouwjaarInput = () =>
  screen.queryByLabelText<HTMLInputElement>("Bouwjaar", {
    selector: "input:not([type=radio])",
  })

describe("StepWoninggegevens", () => {
  afterEach(cleanup)

  it("asks for a choice when there's no energielabel, instead of showing the first label", () => {
    render(
      <Harness values={{ energie_type: "label", energielabel_klasse: "" }} />,
    )

    const select = energielabelSelect()!
    expect(select.value).toBe("")
    expect(select.selectedOptions[0].textContent).toBe("Maak een keuze")
  })

  it("shows only the field of the chosen energie_type", () => {
    const values = {
      energielabel_klasse: "C",
      energie_index: 1.45,
      bouwjaar: 1977,
    }

    render(<Harness values={{ ...values, energie_type: "label" }} />)
    expect(energielabelSelect()!.selectedOptions[0].textContent).toBe("Label C")
    expect(energieIndexInput()).toBeNull()
    expect(bouwjaarInput()).toBeNull()
    cleanup()

    render(<Harness values={{ ...values, energie_type: "index" }} />)
    expect(energieIndexInput()!.value).toBe("1.45")
    expect(energielabelSelect()).toBeNull()
    cleanup()

    render(<Harness values={{ ...values, energie_type: "bouwjaar" }} />)
    expect(bouwjaarInput()!.value).toBe("1977")
    expect(energielabelSelect()).toBeNull()
  })

  it("switches the field when another energie_type is chosen", () => {
    render(
      <Harness values={{ energie_type: "bouwjaar", energie_index: 1.45 }} />,
    )

    fireEvent.click(screen.getByRole("radio", { name: "Energie-index" }))

    expect(energieIndexInput()!.value).toBe("1.45")
    expect(bouwjaarInput()).toBeNull()
  })

  it("doesn't require the fields of the energie_types that aren't chosen (anymore)", async () => {
    let form: Form | undefined
    render(
      <Harness
        onForm={(f) => {
          form = f
        }}
        values={{
          energie_type: "label",
          bouwjaar: 1977,
          energielabel_klasse: "",
          energie_index: null,
        }}
      />,
    )

    fireEvent.click(screen.getByRole("radio", { name: "Bouwjaar" }))
    // Other required fields (WOZ-waarde, type woning, ...) are empty here, so only look at
    // the energielabel.
    await act(() => form!.trigger())

    expect(form!.getFieldState("energielabel_klasse").error).toBeUndefined()
  })

  describe("Volgende stap", () => {
    const complete: Partial<GebruikersinvoerFormValues> = {
      woz_waarde: 374000,
      energie_type: "bouwjaar",
      bouwjaar: 1977,
      type_woning: "Eengezinswoning",
      gemeenschappelijke_binnenruimtes: "false",
    }
    const volgendeStap = () =>
      fireEvent.click(screen.getByRole("button", { name: "Volgende stap" }))

    it("goes to the next step when the required fields are filled in", async () => {
      const onNextStep = vi.fn()
      render(<Harness values={complete} onNextStep={onNextStep} />)

      volgendeStap()

      await waitFor(() => expect(onNextStep).toHaveBeenCalledTimes(1))
    })

    it("stays on the step and shows the errors in an InvalidFormAlert, which gets focus", async () => {
      const onNextStep = vi.fn()
      render(
        <Harness
          values={{ ...complete, bouwjaar: null, type_woning: null }}
          onNextStep={onNextStep}
        />,
      )

      volgendeStap()

      const alert = (
        await screen.findByRole("heading", {
          name: "Verbeter de fouten voor u verder gaat",
        })
      ).closest(".ams-invalid-form-alert") as HTMLElement
      // In page order, linking to the fields.
      expect(
        within(alert)
          .getAllByRole("link")
          .map((link) => [link.textContent, link.getAttribute("href")]),
      ).toEqual([
        ["Bouwjaar is verplicht", "#bouwjaar"],
        ["Type woning is verplicht", "#type_woning-0"],
      ])
      await waitFor(() => expect(document.activeElement).toBe(alert))
      expect(onNextStep).not.toHaveBeenCalled()
    })
  })
})
