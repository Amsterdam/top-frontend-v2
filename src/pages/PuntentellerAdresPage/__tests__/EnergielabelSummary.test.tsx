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
  registratiedatum: "2021-03-13",
  opnamedatum: "2021-03-01",
  meting_geldig_tot: "2031-03-01",
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

  it("names the label, opnamedatum and until when it's valid, all in bold, and that the label counts", () => {
    expect(renderSummary(energie())).toEqual({
      text: "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 maart 2021 en geldig tot 1 maart 2031. Dit energielabel telt mee voor de energieprestatie.",
      bold: ["energielabel C", "1 maart 2021", "1 maart 2031"],
    })
  })

  it("says the bouwjaar is used for a label opgenomen from 2015 until 2021", () => {
    expect(
      renderSummary(
        energie({ opnamedatum: "2016-09-01", meting_geldig_tot: "2026-09-01" }),
      ).text,
    ).toBe(
      "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 september 2016 en geldig tot 1 september 2026. Een energielabel dat is opgenomen tussen 1 januari 2015 en 1 januari 2021 telt niet mee, daarom wordt de energieprestatie berekend op basis van het bouwjaar.",
    )
  })

  it("names the energie-index next to the label and says the index counts", () => {
    expect(
      renderSummary(
        energie({
          energieindex: "1,45",
          opnamedatum: "2016-09-01",
          meting_geldig_tot: "2026-09-01",
        }),
      ),
    ).toEqual({
      text: "Uit onze gegevens blijkt dat deze woning energielabel C en energie-index 1,45 heeft, opgenomen op 1 september 2016 en geldig tot 1 september 2026. De energie-index telt mee voor de energieprestatie.",
      bold: [
        "energielabel C",
        "energie-index 1,45",
        "1 september 2016",
        "1 september 2026",
      ],
    })
  })

  it("says the measurement has expired once meting_geldig_tot has passed, so the bouwjaar is used", () => {
    expect(renderSummary(energie(), "2031-03-02").text).toBe(
      "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 maart 2021 en verlopen op 1 maart 2031. Omdat de meting is verlopen, wordt de energieprestatie berekend op basis van het bouwjaar.",
    )
  })

  it("leaves out the dates that are missing", () => {
    expect(renderSummary(energie({ opnamedatum: null }))).toEqual({
      text: "Uit onze gegevens blijkt dat deze woning energielabel C heeft, geldig tot 1 maart 2031. Omdat niet bekend is wanneer het energielabel is opgenomen, wordt de energieprestatie berekend op basis van het bouwjaar.",
      bold: ["energielabel C", "1 maart 2031"],
    })
    expect(renderSummary(energie({ meting_geldig_tot: null })).text).toBe(
      "Uit onze gegevens blijkt dat deze woning energielabel C heeft, opgenomen op 1 maart 2021. Dit energielabel telt mee voor de energieprestatie.",
    )
  })

  it("says there's no energielabel or energie-index when the backend has none", () => {
    const noData = {
      text: "Uit onze gegevens is geen energielabel of energie-index bekend voor deze woning. De energieprestatie wordt daarom berekend op basis van het bouwjaar.",
      bold: [],
    }
    expect(renderSummary(null)).toEqual(noData)
    expect(renderSummary(undefined)).toEqual(noData)
    expect(renderSummary(energie({ energielabel: null }))).toEqual(noData)
  })
})
