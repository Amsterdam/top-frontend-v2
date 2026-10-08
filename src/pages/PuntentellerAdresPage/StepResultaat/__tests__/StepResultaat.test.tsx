import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { mapFormValuesToPayload } from "../../helpers/mapFormValuesToPayload"
import { StepResultaat } from "../StepResultaat"

const VALUES = {
  binnenruimtes: [],
  buitenruimtes: [],
  bouwjaar: 1977,
} as unknown as GebruikersinvoerFormValues

const RESULTAAT: PuntentellerResultaat = {
  rubrieken: { vertrekken: 56, woz: 47 },
  energieprestatie_berekening: {
    categorie: "label",
    punten: 0,
    punten_voor_monumentcorrectie: 0,
    monumentcorrectie_toegepast: false,
  },
  totaal_punten_bruto: 103,
  correcties: { totaal_zonder_woz: 56, woz_na_cap: 47 },
  totaal_punten_na_caps: 103,
}

const RESUBMIT = "Wijzigingen opslaan en herberekenen"

function Harness({ savedPayload }: { savedPayload: string }) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: VALUES })
  return (
    <FormProvider {...form}>
      <StepResultaat
        resultaat={RESULTAAT}
        savedPayload={savedPayload}
        onPreviousStep={vi.fn()}
      />
    </FormProvider>
  )
}

describe("StepResultaat", () => {
  afterEach(cleanup)

  it("says there's no berekening yet and how to get one, while nothing is saved", () => {
    const onPreviousStep = vi.fn()
    render(<StepResultaat onPreviousStep={onPreviousStep} />)

    expect(
      screen.getByRole("heading", { name: "Nog geen berekening" }),
    ).toBeDefined()
    expect(screen.queryByRole("heading", { name: "Puntentelling" })).toBeNull()
    expect(screen.queryByRole("button", { name: RESUBMIT })).toBeNull()

    fireEvent.click(
      screen.getByRole("button", { name: "Terug naar overzicht" }),
    )

    expect(onPreviousStep).toHaveBeenCalled()
  })

  it("offers to save again once the form differs from the last save", () => {
    render(<Harness savedPayload="{}" />)

    expect(screen.getByRole("button", { name: RESUBMIT })).toBeDefined()
  })

  it("doesn't offer to save again while the form is as it was saved", () => {
    render(
      <Harness savedPayload={JSON.stringify(mapFormValuesToPayload(VALUES))} />,
    )

    expect(screen.queryByRole("button", { name: RESUBMIT })).toBeNull()
  })
})
