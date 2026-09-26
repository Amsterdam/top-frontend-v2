import { cleanup, render } from "@testing-library/react"
import dayjs from "dayjs"
import "dayjs/locale/nl"
import { afterEach, describe, expect, it } from "vitest"
import { EnergielabelSummary } from "../StepWoninggegevens/EnergielabelSummary"

// The app sets the Dutch locale in App.tsx, which these tests don't render.
dayjs.locale("nl")

const energie = (
  overrides: Partial<PuntentellerEnergie> = {},
): PuntentellerEnergie => ({
  energielabel: "C",
  energieindex: null,
  registratiedatum: "2016-09-13",
  opnamedatum: "2016-09-01",
  meting_geldig_tot: "2026-09-01",
  ...overrides,
})

const TODAY = "2025-06-15"

/** The rendered sentence and the parts shown in bold. */
const renderSummary = (
  value: PuntentellerEnergie | null | undefined,
  today = TODAY,
) => {
  const { container } = render(
    <EnergielabelSummary energie={value} today={today} />,
  )
  return {
    text: container.textContent,
    bold: [...container.querySelectorAll("strong")].map(
      (strong) => strong.textContent,
    ),
  }
}

describe("EnergielabelSummary", () => {
  afterEach(cleanup)

  it("names the label, opnamedatum and until when it's valid, all in bold", () => {
    expect(renderSummary(energie())).toEqual({
      text: "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 september 2016 en geldig tot 1 september 2026.",
      bold: ["energielabel C", "1 september 2016", "1 september 2026"],
    })
  })

  it("says the measurement has expired once meting_geldig_tot has passed", () => {
    expect(renderSummary(energie(), "2026-09-02").text).toBe(
      "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 september 2016 en verlopen op 1 september 2026.",
    )
  })

  it("leaves out the dates that are missing", () => {
    expect(renderSummary(energie({ opnamedatum: null }))).toEqual({
      text: "Uit onze gegevens blijkt dat deze woning energielabel C heeft, geldig tot 1 september 2026.",
      bold: ["energielabel C", "1 september 2026"],
    })
    expect(
      renderSummary(energie({ opnamedatum: null, meting_geldig_tot: null }))
        .text,
    ).toBe("Uit onze gegevens blijkt dat deze woning energielabel C heeft.")
  })

  it("says there's no energielabel when the backend has none", () => {
    const noLabel = {
      text: "Uit onze gegevens is geen energielabel bekend voor deze woning.",
      bold: [],
    }
    expect(renderSummary(null)).toEqual(noLabel)
    expect(renderSummary(undefined)).toEqual(noLabel)
    expect(renderSummary(energie({ energielabel: null }))).toEqual(noLabel)
  })
})
