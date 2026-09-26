import { useEffect } from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm, type UseFormReturn } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepWoninggegevens } from "../StepWoninggegevens/StepWoninggegevens"

type Form = UseFormReturn<GebruikersinvoerFormValues>

function Harness({
  values,
  onForm,
}: {
  values: Partial<GebruikersinvoerFormValues>
  /** Hands the form to the test, e.g. to trigger validation. */
  onForm?: (form: Form) => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  useEffect(() => {
    onForm?.(form)
  }, [form, onForm])
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepWoninggegevens onNextStep={vi.fn()} />
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
})
