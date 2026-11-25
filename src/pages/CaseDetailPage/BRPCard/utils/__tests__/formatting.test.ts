import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getTimeFromNow } from "../formatting"

describe("the time from now", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-11-25T12:00:00"))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("counts down like an age: whole years, months or days", () => {
    // Turns 25 in two weeks: still 24.
    expect(getTimeFromNow("2001-12-11")).toBe("24 jaar")
    expect(getTimeFromNow("2001-11-25")).toBe("25 jaar")
    expect(getTimeFromNow("2026-01-01")).toBe("10 maanden")
    expect(getTimeFromNow("2025-12-01")).toBe("11 maanden")
    expect(getTimeFromNow("2026-10-20")).toBe("één maand")
    expect(getTimeFromNow("2026-11-24")).toBe("één dag")
    expect(getTimeFromNow("2026-11-15")).toBe("10 dagen")
  })

  it("says nothing without a valid date", () => {
    expect(getTimeFromNow(undefined)).toBe("")
    expect(getTimeFromNow("onbekend")).toBe("")
  })
})
