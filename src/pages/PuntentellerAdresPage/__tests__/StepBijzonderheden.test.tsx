import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepBijzonderheden } from "../StepBijzonderheden/StepBijzonderheden"

function Harness({
  values,
  onNextStep,
}: {
  values: Partial<GebruikersinvoerFormValues>
  onNextStep: () => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepBijzonderheden onNextStep={onNextStep} />
    </FormProvider>
  )
}

describe("StepBijzonderheden", () => {
  afterEach(cleanup)

  it("shows the missing answers in an InvalidFormAlert on Volgende stap, which gets focus", async () => {
    const onNextStep = vi.fn()
    render(
      <Harness
        values={{ monument_soort: null, zorgwoning: "false" }}
        onNextStep={onNextStep}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Volgende stap" }))

    const alert = (
      await screen.findByRole("heading", {
        name: "Verbeter de fouten voor u verder gaat",
      })
    ).closest(".ams-invalid-form-alert") as HTMLElement
    const links = within(alert).getAllByRole("link")
    expect(links[0].textContent).toBe("Geef aan of de woning een monument is")
    expect(links[0].getAttribute("href")).toBe("#monument_soort-0")
    expect(links.map((link) => link.textContent)).not.toContain(
      "Geef aan of de woning een zorgwoning is",
    )
    await waitFor(() => expect(document.activeElement).toBe(alert))
    expect(onNextStep).not.toHaveBeenCalled()
  })
})
