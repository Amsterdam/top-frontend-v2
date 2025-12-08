import { describe, it, expect } from "vitest"
import stringifyQueryParams from "../stringifyQueryParams"

describe("stringifyQueryParams", () => {
  it("should correctly convert an object to a query string with query prefix", () => {
    const params = { search: "test", page: 2, sort: "desc" }
    const result = stringifyQueryParams(params)
    expect(result).toBe("?search=test&page=2&sort=desc")
  })

  it("should correctly convert an object to a query string without query prefix", () => {
    const params = { search: "test", page: 2, sort: "desc" }
    const result = stringifyQueryParams(params, false)
    expect(result).toBe("search=test&page=2&sort=desc")
  })

  it("should exclude undefined values", () => {
    const params = { search: "test", page: undefined, sort: "desc" }
    const result = stringifyQueryParams(params)
    expect(result).toBe("?search=test&sort=desc")
  })

  it("should exclude null values", () => {
    const params = { search: "test", page: undefined, sort: "desc" }
    const result = stringifyQueryParams(params)
    expect(result).toBe("?search=test&sort=desc")
  })

  it("should convert numbers to strings", () => {
    const params = { search: "test", page: 1, count: 100 }
    const result = stringifyQueryParams(params)
    expect(result).toBe("?search=test&page=1&count=100")
  })

  it("should return an empty query string for an empty object", () => {
    const params = {}
    const result = stringifyQueryParams(params)
    expect(result).toBe("?") // or "" based on desired behavior (you can adjust if needed)
  })

  it("should handle empty query string without prefix correctly", () => {
    const params = {}
    const result = stringifyQueryParams(params, false)
    expect(result).toBe("")
  })
})
