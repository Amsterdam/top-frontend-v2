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
  onSubmit,
}: {
  values: Partial<GebruikersinvoerFormValues>
  onSubmit: () => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <StepBijzonderheden />
    </FormProvider>
  )
}

/** Every bijzonderheid answered. */
const COMPLETE_VALUES: Partial<GebruikersinvoerFormValues> = {
  monument_soort: "geen_monument",
  zorgwoning: "false",
  woonvoorziening_handicap: "false",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
}

describe("StepBijzonderheden", () => {
  afterEach(cleanup)

  it("shows the missing answers in an InvalidFormAlert on Sla op en bereken, which gets focus", async () => {
    const onSubmit = vi.fn()
    render(
      <Harness
        values={{ ...COMPLETE_VALUES, monument_soort: null }}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Sla op en bereken" }))

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
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits the form once every answer is given", async () => {
    const onSubmit = vi.fn()
    render(<Harness values={COMPLETE_VALUES} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole("button", { name: "Sla op en bereken" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })
})
