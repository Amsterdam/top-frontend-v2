import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
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

  it("shows the specificaties of each ruimte, with its oppervlakte in the heading", () => {
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
      .getByRole("heading", { name: "Slaapkamer 1 (12,5 m²)" })
      .closest("div") as HTMLElement
    expect(valueOf(within(slaapkamer1).getByText("Lengte"))).toBe("5 m")
    expect(valueOf(within(slaapkamer1).getByText("Breedte"))).toBe("2,5 m")
    expect(valueOf(within(slaapkamer1).getByText("Verwarmd"))).toBe("Ja")
    expect(
      screen.getByRole("heading", { name: "Slaapkamer 2 (10 m²)" }),
    ).toBeDefined()
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

  it("shows the oppervlakte per categorie in its heading, and the total", () => {
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

    expect(
      screen.getByRole("heading", { name: "Binnenruimtes (30,5 m²)" }),
    ).toBeDefined()
    expect(
      screen.getByRole("heading", { name: "Buitenruimtes (4,25 m²)" }),
    ).toBeDefined()
    // A room without oppervlakte gets no m² in its heading.
    expect(screen.getByRole("heading", { name: "Overloop" })).toBeDefined()
  })

  it("counts an oppervlakte typed into the input, which arrives as a string", () => {
    // TextInputControl ignores valueAsNumber, so this is what the form really holds.
    const typed = {
      ...binnenruimte("Woonkamer", null),
      oppervlakte: "20.5" as unknown as number,
    }
    render(<Harness values={{ binnenruimtes: [typed], buitenruimtes: [] }} />)

    expect(
      screen.getByRole("heading", { name: "Woonkamer (20,5 m²)" }),
    ).toBeDefined()
    expect(
      screen.getByRole("heading", { name: "Binnenruimtes (20,5 m²)" }),
    ).toBeDefined()
  })

  it("leaves the m² out of the headings when the oppervlakte is 0", () => {
    render(
      <Harness
        values={{
          binnenruimtes: [binnenruimte("Berging", 0)],
          buitenruimtes: [],
        }}
      />,
    )

    expect(screen.getByRole("heading", { name: "Binnenruimtes" })).toBeDefined()
    expect(screen.getByRole("heading", { name: "Berging" })).toBeDefined()
    expect(screen.getByRole("heading", { name: "Buitenruimtes" })).toBeDefined()
    expect(screen.getByText("Geen buitenruimtes toegevoegd.")).toBeDefined()
    expect(screen.queryByText("Totale oppervlakte")).toBeNull()
  })

  it("links to the Sla op en bereken button and focuses it", () => {
    // jsdom doesn't implement scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn()
    render(<Harness values={{ binnenruimtes: [], buitenruimtes: [] }} />)

    fireEvent.click(screen.getByRole("link", { name: "Sla op en bereken" }))

    const button = screen.getByRole("button", { name: "Sla op en bereken" })
    expect(button.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    )
    expect(document.activeElement).toBe(button)
  })
})
