import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { BerekeningCard } from "../ResultaatCards"

const resultaat = (
  overrides: Partial<PuntentellerResultaat> = {},
): PuntentellerResultaat => ({
  rubrieken: {
    badkamer: 0,
    vertrekken: 56,
    verwarming: 2,
    buitenruimte: -5,
    keuken: 0.001,
    woz: 47,
  },
  energieprestatie_berekening: {
    categorie: "label",
    punten: 0,
    punten_voor_monumentcorrectie: 0,
    monumentcorrectie_toegepast: false,
  },
  totaal_punten_bruto: 100,
  correcties: { totaal_zonder_woz: 53, woz_na_cap: 47 },
  totaal_punten_na_caps: 100,
  ...overrides,
})

/** The punten cell next to a row's label: the row's last cell. */
const puntenOf = (label: string) =>
  screen.getByText(label).closest("tr")?.lastElementChild?.textContent

describe("BerekeningCard", () => {
  afterEach(cleanup)

  it("shows every rubriek with punten", () => {
    render(<BerekeningCard resultaat={resultaat()} />)

    expect(puntenOf("Vertrekken")).toBe("56")
    expect(puntenOf("Verwarming")).toBe("2")
    expect(puntenOf("Buitenruimte")).toBe("-5")
    expect(puntenOf("WOZ-waarde")).toBe("47")
    expect(puntenOf("Totaal")).toBe("100")
  })

  it("leaves out the rubrieken with 0 punten", () => {
    render(<BerekeningCard resultaat={resultaat()} />)

    expect(screen.queryByText("Badkamer")).toBeNull()
    // Rounds to 0 as well, so it would show as "0".
    expect(screen.queryByText("Keuken")).toBeNull()
  })

  it("always shows the subtotal in bold, above the corrections", () => {
    render(<BerekeningCard resultaat={resultaat()} />)

    const subtotaal = screen.getByRole("rowheader", {
      name: "Subtotaal",
    })
    expect(puntenOf("Subtotaal")).toBe("100")
    expect(subtotaal.closest("tr")?.querySelector("strong")?.textContent).toBe(
      "100",
    )
    // The subtotal row comes right before the corrections row.
    expect(subtotaal.closest("tr")?.nextElementSibling?.textContent).toContain(
      "Geen correcties toegepast",
    )
    expect(screen.getByText("Geen correcties toegepast")).toBeDefined()
    expect(puntenOf("Geen correcties toegepast")).toBe("0")
  })

  it("shows the subtotal before the corrections", () => {
    render(
      <BerekeningCard
        resultaat={resultaat({
          totaal_punten_na_caps: 110,
          correcties: {
            totaal_zonder_woz: 53,
            woz_na_cap: 47,
            nieuwbouw_toegepast: true,
            nieuwbouw_huurprijsopslag_factor: 1.1,
          },
        })}
      />,
    )

    expect(puntenOf("Subtotaal")).toBe("100")
    expect(puntenOf("Nieuwbouw")).toBe("+ 10")
    expect(puntenOf("Totaal")).toBe("110")
  })
})
