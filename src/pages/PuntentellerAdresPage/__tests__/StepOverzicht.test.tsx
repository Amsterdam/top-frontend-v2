import { cleanup, render, screen, within } from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { StepOverzicht } from "../StepOverzicht/StepOverzicht"

const binnenruimte = (
  type: BinnenruimteType,
  oppervlakte: number | null,
): Binnenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte,
  verwarmd: "true",
  verkoeld: "false",
})

function Harness({ values }: { values: Partial<GebruikersinvoerFormValues> }) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepOverzicht />
    </FormProvider>
  )
}

/** The Description value shown next to a term. */
const valueOf = (term: HTMLElement) => term.nextElementSibling?.textContent

describe("StepOverzicht", () => {
  afterEach(cleanup)

  it("shows the specificaties of each ruimte", () => {
    render(
      <Harness
        values={{
          binnenruimtes: [
            {
              ...binnenruimte("Slaapkamer", 12.5),
              lengte: 5,
              breedte: 2.5,
            },
            binnenruimte("Slaapkamer", 10),
          ],
          buitenruimtes: [],
        }}
      />,
    )

    const slaapkamer1 = screen
      .getByRole("heading", { name: "Slaapkamer 1" })
      .closest("div") as HTMLElement
    expect(valueOf(within(slaapkamer1).getByText("Lengte"))).toBe("5 m")
    expect(valueOf(within(slaapkamer1).getByText("Breedte"))).toBe("2,5 m")
    expect(valueOf(within(slaapkamer1).getByText("Oppervlakte"))).toBe(
      "12,5 m²",
    )
    expect(valueOf(within(slaapkamer1).getByText("Verwarmd"))).toBe("ja")
    expect(screen.getByRole("heading", { name: "Slaapkamer 2" })).toBeDefined()
  })

  it("only shows the sanitair that's present for a badkamer", () => {
    render(
      <Harness
        values={{
          binnenruimtes: [
            {
              ...binnenruimte("Badkamer", 6),
              douche_bad: "douche",
              handdoekenradiator: "1",
              wastafel: "0",
            },
          ],
          buitenruimtes: [],
        }}
      />,
    )

    expect(
      valueOf(
        screen.getByText(
          "Is er een douche, een bad of een combinatie van beide?",
        ),
      ),
    ).toBe("Douche")
    expect(screen.queryByText("Wastafel")).toBeNull()
  })

  it("adds up the oppervlakte per categorie and in total", () => {
    render(
      <Harness
        values={{
          binnenruimtes: [
            binnenruimte("Woonkamer", 20.5),
            binnenruimte("Slaapkamer", 10),
            binnenruimte("Overloop", null),
          ],
          buitenruimtes: [
            {
              type: "Balkon",
              lengte: null,
              breedte: null,
              oppervlakte: 4.25,
              aantal_adressen: 1,
            },
          ],
        }}
      />,
    )

    expect(valueOf(screen.getByText("Totale oppervlakte binnenruimtes"))).toBe(
      "30,5 m²",
    )
    expect(valueOf(screen.getByText("Totale oppervlakte buitenruimtes"))).toBe(
      "4,25 m²",
    )
    expect(valueOf(screen.getByText("Totaal"))).toBe("34,75 m²")
  })

  it("counts an oppervlakte typed into the input, which arrives as a string", () => {
    // TextInputControl ignores valueAsNumber, so this is what the form really holds.
    const typed = {
      ...binnenruimte("Woonkamer", null),
      oppervlakte: "20.5" as unknown as number,
    }
    render(<Harness values={{ binnenruimtes: [typed], buitenruimtes: [] }} />)

    expect(valueOf(screen.getByText("Oppervlakte"))).toBe("20,5 m²")
    expect(valueOf(screen.getByText("Totaal"))).toBe("20,5 m²")
  })

  it("shows 0 m² when no ruimtes are added", () => {
    render(<Harness values={{ binnenruimtes: [], buitenruimtes: [] }} />)

    expect(screen.getByText("Geen binnenruimtes toegevoegd.")).toBeDefined()
    expect(valueOf(screen.getByText("Totaal"))).toBe("0 m²")
  })
})
