import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { BerekeningCard } from "../ResultaatCards"

const RESULTAAT: PuntentellerResultaat = {
  totaal_punten: 104,
  rubrieken: [
    {
      naam: "Oppervlakte vertrekken",
      punten: 56,
      regels: [
        {
          omschrijving: "Oppervlakte in m²",
          punten: 56,
          ruimte: "Woonkamer",
          aantal: 56,
          factor: 1,
        },
      ],
    },
  ],
  opslagen: [
    {
      naam: "Rijksmonument",
      punten: 48,
      regels: [
        {
          omschrijving: "Extra punten",
          punten: 48,
          ruimte: null,
          aantal: null,
          factor: null,
        },
      ],
    },
  ],
  huurprijsopslagen: [{ naam: "Nieuwbouw", procent: 10 }],
  huurprijsopslag_procent: 10,
  maximale_huurprijs: null,
}

/** The punten cell next to a row's label: the row's last cell. */
const puntenOf = (label: string) =>
  screen.getByText(label).closest("tr")?.lastElementChild?.textContent

describe("BerekeningCard", () => {
  afterEach(cleanup)

  it("shows every rubriek and opslag with its regels and the total", () => {
    render(<BerekeningCard resultaat={RESULTAAT} />)

    expect(screen.getByText("Oppervlakte vertrekken")).toBeDefined()
    expect(puntenOf("Woonkamer: Oppervlakte in m²")).toBe("56")
    expect(puntenOf("Extra punten")).toBe("48")
    expect(puntenOf("Totaal")).toBe("104")
    expect(puntenOf("Huurprijsopslag Nieuwbouw")).toBe("10%")
  })
})
