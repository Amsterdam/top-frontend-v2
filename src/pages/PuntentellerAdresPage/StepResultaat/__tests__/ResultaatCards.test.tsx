import { cleanup, render, screen } from "@testing-library/react"
import dayjs from "dayjs"
import "dayjs/locale/nl"
import { afterEach, describe, expect, it } from "vitest"
import {
  BerekeningCard,
  HuurprijsCard,
  PuntenopbouwCard,
} from "../ResultaatCards"

dayjs.locale("nl")

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

/** The punten cell next to a row's label: the row's last cell, with plain spaces. */
const puntenOf = (label: string) =>
  screen
    .getByText(label)
    .closest("tr")
    ?.lastElementChild?.textContent?.replace(/\u00a0/g, " ")

describe("HuurprijsCard", () => {
  afterEach(cleanup)

  it("adds up the basishuurprijs and each opslag, split by its procent", () => {
    render(
      <HuurprijsCard
        resultaat={{
          ...RESULTAAT,
          huurprijsopslagen: [
            { naam: "Nieuwbouw", procent: 10 },
            { naam: "Gemeentelijk monument", procent: 5 },
          ],
          maximale_huurprijs: {
            bedrag: 600,
            met_opslagen: 690,
            prijspeil: "2025-07-01",
          },
        }}
      />,
    )

    expect(puntenOf("Basishuurprijs (104 punten)")).toBe("€ 600,00")
    expect(puntenOf("Opslag Nieuwbouw (10%)")).toBe("+ € 60,00")
    expect(puntenOf("Opslag Gemeentelijk monument (5%)")).toBe("+ € 30,00")
    expect(puntenOf("Totaal per maand")).toBe("€ 690,00")
  })

  it("shows just the huurprijs and its huurprijstabel without opslagen", () => {
    render(
      <HuurprijsCard
        resultaat={{
          ...RESULTAAT,
          huurprijsopslagen: [],
          maximale_huurprijs: {
            bedrag: 600,
            met_opslagen: 600,
            prijspeil: "2025-07-01",
          },
        }}
      />,
    )

    expect(screen.getByText("€ 600,00")).toBeDefined()
    expect(
      screen.getByText("Volgens de huurprijstabel van 1 juli 2025."),
    ).toBeDefined()
    expect(screen.queryByRole("table")).toBeNull()
  })

  it("shows nothing when no huurprijstabel applies", () => {
    const { container } = render(<HuurprijsCard resultaat={RESULTAAT} />)

    expect(container.innerHTML).toBe("")
  })
})

describe("PuntenopbouwCard", () => {
  afterEach(cleanup)

  it("lists the subtotal of every rubriek and opslag, also without punten, and the total", () => {
    render(
      <PuntenopbouwCard
        resultaat={{
          ...RESULTAAT,
          rubrieken: [
            ...RESULTAAT.rubrieken,
            { naam: "Parkeren", punten: 0, regels: [] },
          ],
        }}
      />,
    )

    expect(puntenOf("Oppervlakte vertrekken")).toBe("56")
    expect(puntenOf("Parkeren")).toBe("0")
    expect(puntenOf("Rijksmonument")).toBe("48")
    expect(puntenOf("Totaal")).toBe("104")
  })
})

describe("BerekeningCard", () => {
  afterEach(cleanup)

  it("shows every rubriek and opslag with its subtotal and regels, and the total", () => {
    render(<BerekeningCard resultaat={RESULTAAT} />)

    expect(
      screen.getByRole("heading", { name: "Oppervlakte vertrekken" }),
    ).toBeDefined()
    expect(puntenOf("Woonkamer: Oppervlakte in m²")).toBe("56")
    expect(puntenOf("Extra punten")).toBe("48")
    expect(
      screen
        .getAllByText("Subtotaal")
        .map((cell) => cell.closest("tr")?.lastElementChild?.textContent),
    ).toEqual(["56", "48"])
    expect(screen.getByRole("heading", { name: "Totaal" })).toBeDefined()
    expect(screen.getByRole("heading", { name: "104 punten" })).toBeDefined()
  })

  it("shows the berekening of a regel inline, except with a factor of 1", () => {
    render(
      <BerekeningCard
        resultaat={{
          ...RESULTAAT,
          rubrieken: [
            {
              naam: "Keuken",
              punten: 0.5,
              regels: [
                {
                  omschrijving: "Inbouw kookplaat gas",
                  punten: 0.5,
                  ruimte: "Keuken",
                  aantal: 1,
                  factor: 0.5,
                },
              ],
            },
          ],
        }}
      />,
    )

    expect(screen.getByText("(1 × 0,5)")).toBeDefined()
    expect(screen.queryByText(/56 × 1/)).toBeNull()
  })

  it("leaves out a rubriek without regels", () => {
    render(
      <BerekeningCard
        resultaat={{
          ...RESULTAAT,
          rubrieken: [{ naam: "Parkeren", punten: 0, regels: [] }],
          opslagen: [],
        }}
      />,
    )

    expect(screen.queryByText(/Parkeren/)).toBeNull()
  })
})
