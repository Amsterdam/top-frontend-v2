import { describe, expect, it } from "vitest"
import { huursegment } from "../berekening"

describe("huursegment", () => {
  it.each([
    [17, "Sociale huur"],
    [143, "Sociale huur"],
    [143.4, "Sociale huur"],
    [143.5, "Middenhuur"],
    [186, "Middenhuur"],
    [187, "Vrije sector"],
    [412, "Vrije sector"],
  ])("puts %s punten in %s", (punten, name) => {
    expect(huursegment(punten).name).toBe(name)
  })
})
