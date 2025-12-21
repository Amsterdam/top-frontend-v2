import { describe, it, expect } from "vitest"
import { mapToOptions } from "../mapToOptions"

describe("mapToOptions", () => {
  it("mapt items correct naar options", () => {
    const users = [
      { id: "1", fullName: "Alice" },
      { id: "2", fullName: "Bob" },
    ]

    const result = mapToOptions("id", "fullName", users, false)

    expect(result).toEqual([
      { value: "1", label: "Alice" },
      { value: "2", label: "Bob" },
    ])
  })

  it("forceert value en label naar strings", () => {
    const items = [{ id: 10, name: 20 }]

    const result = mapToOptions("id", "name", items, false)

    expect(result).toEqual([{ value: "10", label: "20" }])
  })

  it("returned een lege array wanneer input leeg is en includeEmpty false is", () => {
    const result = mapToOptions("id", "name", [], false)
    expect(result).toEqual([])
  })
})
