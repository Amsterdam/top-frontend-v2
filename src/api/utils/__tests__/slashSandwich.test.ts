import { describe, it, expect } from "vitest"
import {
  slashSandwich,
  stripDoubleSlashes,
  stripTrailingSlash,
  stripLeadingSlash,
} from "../slashSandwich"

describe("slashSandwich", () => {
  it("should glue parts together with leading and trailing slashes", () => {
    const result = slashSandwich(["foo", "/zoo/bar/", "/moo"])
    expect(result).toBe("/foo/zoo/bar/moo/")
  })

  it("should glue parts together without trailing slash", () => {
    const result = slashSandwich(["foo", "/zoo/bar/", "/moo"], {
      trailingSlash: false,
    })
    expect(result).toBe("/foo/zoo/bar/moo")
  })

  it("should glue parts together without leading slash", () => {
    const result = slashSandwich(["foo", "/zoo/bar/", "/moo"], {
      leadingSlash: false,
    })
    expect(result).toBe("foo/zoo/bar/moo/")
  })

  it("should glue parts together without leading and trailing slashes", () => {
    const result = slashSandwich(["foo", "/zoo/bar/", "/moo"], {
      leadingSlash: false,
      trailingSlash: false,
    })
    expect(result).toBe("foo/zoo/bar/moo")
  })

  it("should handle empty parts array", () => {
    const result = slashSandwich([])
    expect(result).toBe("/")
  })

  it("should handle parts with undefined values", () => {
    const result = slashSandwich(["foo", undefined, "/bar"])
    expect(result).toBe("/foo/bar/")
  })

  it("should handle parts with number values", () => {
    const result = slashSandwich(["foo", 123, "/bar"])
    expect(result).toBe("/foo/123/bar/")
  })
})

describe("stripDoubleSlashes", () => {
  it("should strip double slashes", () => {
    const result = stripDoubleSlashes("foo//bar")
    expect(result).toBe("foo/bar")
  })
})

describe("stripTrailingSlash", () => {
  it("should strip trailing slash", () => {
    const result = stripTrailingSlash("/foo/bar/")
    expect(result).toBe("/foo/bar")
  })

  it("should not change string without trailing slash", () => {
    const result = stripTrailingSlash("foo")
    expect(result).toBe("foo")
  })
})

describe("stripLeadingSlash", () => {
  it("should strip leading slash", () => {
    const result = stripLeadingSlash("/foo/bar/")
    expect(result).toBe("foo/bar/")
  })

  it("should not change string without leading slash", () => {
    const result = stripLeadingSlash("foo")
    expect(result).toBe("foo")
  })
})
