import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Greeting } from "../Greeting"

describe("Greeting component", () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  const testCases = [
    { hour: 0, expected: "Goedenacht" },
    { hour: 6, expected: "Goedemorgen" },
    { hour: 12, expected: "Goedemiddag" },
    { hour: 18, expected: "Goedenavond" },
  ]

  testCases.forEach(({ hour, expected }) => {
    it(`renders "${expected}" at hour ${hour}`, () => {
      const mockDate = new Date(2025, 0, 1, hour)
      vi.setSystemTime(mockDate)

      render(<Greeting />)
      expect(screen.getByText(expected)).toBeDefined()
    })
  })
})
