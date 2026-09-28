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
import type { MissingField } from "../helpers/findMissingFields"
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

function Harness({
  values,
  onGoToField = vi.fn(),
}: {
  values: Partial<GebruikersinvoerFormValues>
  onGoToField?: (field: MissingField) => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <StepOverzicht onGoToField={onGoToField} />
    </FormProvider>
  )
}

/** Values with every required field filled in. */
const COMPLETE_VALUES: Partial<GebruikersinvoerFormValues> = {
  binnenruimtes: [],
  buitenruimtes: [],
  woz_waarde: 374000,
  energie_type: "bouwjaar",
  bouwjaar: 1977,
  type_woning: "Eengezinswoning",
  gemeenschappelijke_binnenruimtes: "false",
  monument_soort: "geen_monument",
  zorgwoning: "false",
  voorzieningen_voor_mensen_met_handicap: "false",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
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

  it.each([
    ["label", "Energielabel C"],
    ["index", "Energie-index 1,45"],
    ["bouwjaar", "Bouwjaar 1977"],
  ] as const)(
    "shows the energieprestatie following energie_type %s",
    (energieType, expected) => {
      render(
        <Harness
          values={{
            binnenruimtes: [],
            buitenruimtes: [],
            energie_type: energieType,
            energielabel_klasse: "C",
            energie_index: "1.45" as unknown as number,
            bouwjaar: 1977,
          }}
        />,
      )

      expect(valueOf(screen.getByText("Energieprestatie"))).toBe(expected)
    },
  )

  it("lists the missing required fields in an InvalidFormAlert and opens a field's step on click", () => {
    const onGoToField = vi.fn()
    render(
      <Harness
        values={{ ...COMPLETE_VALUES, woz_waarde: null as unknown as number }}
        onGoToField={onGoToField}
      />,
    )

    const alert = screen
      .getByRole("heading", { name: "Verbeter de fouten voor u verder gaat" })
      .closest(".ams-invalid-form-alert") as HTMLElement
    const link = within(alert).getByRole("link", {
      name: "WOZ-waarde is verplicht",
    })
    expect(fireEvent.click(link)).toBe(false) // the #link itself isn't followed
    expect(onGoToField).toHaveBeenCalledWith({
      step: 0,
      name: "woz_waarde",
      message: "WOZ-waarde is verplicht",
    })
  })

  it("shows no InvalidFormAlert once everything required is filled in", () => {
    render(<Harness values={COMPLETE_VALUES} />)

    expect(
      screen.queryByRole("heading", {
        name: "Verbeter de fouten voor u verder gaat",
      }),
    ).toBeNull()
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
