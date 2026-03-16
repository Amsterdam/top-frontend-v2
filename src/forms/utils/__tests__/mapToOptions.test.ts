import { describe, it, expect } from "vitest"
import { mapToOptions } from "../mapToOptions"

describe("mapToOptions", () => {
  it("mapt items correct naar options zonder empty option", () => {
    const users = [
      { id: "1", fullName: "Alice" },
      { id: "2", fullName: "Bob" },
    ]

    const result = mapToOptions("id", "fullName", users)

    expect(result).toEqual([
      { value: "1", label: "Alice" },
      { value: "2", label: "Bob" },
    ])
  })

  it("forceert value en label naar strings", () => {
    const items = [{ id: 10, name: 20 }]

    const result = mapToOptions("id", "name", items)

    expect(result).toEqual([{ value: "10", label: "20" }])
  })

  it("returned een lege array wanneer input leeg is en geen emptyLabel is gegeven", () => {
    const result = mapToOptions("id", "name", [])
    expect(result).toEqual([])
  })

  it("voegt een empty option toe wanneer emptyLabel is gegeven", () => {
    const users = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]

    const result = mapToOptions("id", "name", users, "Selecteer een gebruiker")

    expect(result).toEqual([
      { value: "", label: "Selecteer een gebruiker" },
      { value: "1", label: "Alice" },
      { value: "2", label: "Bob" },
    ])
  })

  it("returned alleen empty option wanneer items undefined zijn en emptyLabel bestaat", () => {
    const result = mapToOptions("id", "name", undefined, "Selecteer")

    expect(result).toEqual([{ value: "", label: "Selecteer" }])
  })
})
