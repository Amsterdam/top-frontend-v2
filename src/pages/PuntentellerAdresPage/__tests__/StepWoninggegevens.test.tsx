import { cleanup, render, screen } from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepWoninggegevens } from "../StepWoninggegevens/StepWoninggegevens"

function Harness({ energielabel }: { energielabel: string }) {
  const form = useForm<GebruikersinvoerFormValues>({
    defaultValues: { energielabel_klasse: energielabel },
  })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepWoninggegevens onNextStep={vi.fn()} />
    </FormProvider>
  )
}

const energielabelSelect = () =>
  screen.getByRole<HTMLSelectElement>("combobox", { name: "Energielabel" })

describe("StepWoninggegevens", () => {
  afterEach(cleanup)

  it("asks for a choice when there's no energielabel, instead of showing the first label", () => {
    render(<Harness energielabel="" />)

    const select = energielabelSelect()
    expect(select.value).toBe("")
    expect(select.selectedOptions[0].textContent).toBe("Maak een keuze")
  })

  it("shows the energielabel that's known", () => {
    render(<Harness energielabel="C" />)

    expect(energielabelSelect().selectedOptions[0].textContent).toBe("Label C")
  })
})
