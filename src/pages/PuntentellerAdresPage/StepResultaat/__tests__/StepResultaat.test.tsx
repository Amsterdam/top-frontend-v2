import { cleanup, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepResultaat } from "../StepResultaat"

const VALUES = {
  binnenruimtes: [],
  buitenruimtes: [],
  bouwjaar: 1977,
} as unknown as GebruikersinvoerFormValues

const RESULTAAT: PuntentellerResultaat = {
  totaal_punten: 103,
  rubrieken: [
    { naam: "Oppervlakte vertrekken", punten: 56, regels: [] },
    { naam: "WOZ-waarde", punten: 47, regels: [] },
  ],
  opslagen: [],
  huurprijsopslagen: [],
  huurprijsopslag_procent: 0,
  maximale_huurprijs: null,
}

const RESUBMIT = "Wijzigingen opslaan en herberekenen"

function Harness({
  resultaat = RESULTAAT,
}: {
  resultaat?: PuntentellerResultaat | null
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: VALUES })
  return (
    <FormProvider {...form}>
      <StepResultaat resultaat={resultaat ?? undefined} onGoToField={vi.fn()} />
    </FormProvider>
  )
}

describe("StepResultaat", () => {
  afterEach(cleanup)

  it("says there's no berekening yet and offers to make one, while nothing is saved", () => {
    render(<Harness resultaat={null} />)

    expect(
      screen.getByRole("heading", { name: "Nog geen berekening" }),
    ).toBeDefined()
    expect(screen.queryByRole("heading", { name: "Puntentelling" })).toBeNull()
    expect(
      screen.getByRole("button", { name: "Sla op en bereken" }),
    ).toBeDefined()
    expect(screen.queryByRole("button", { name: RESUBMIT })).toBeNull()
  })

  it("lists the required fields still missing", () => {
    render(<Harness />)

    expect(
      screen.getByRole("heading", {
        name: "Verbeter de fouten voor u verder gaat",
      }),
    ).toBeDefined()
  })
})
