import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import * as Slash from "../slashSandwich"
import { makeApiUrl } from "../makeApiUrl"
import { env } from "@/config/env"

describe("makeApiUrl", () => {
  const originalEnv = { ...env }

  beforeEach(() => {
    vi.clearAllMocks()
    env.VITE_API_URL = "https://api.example.com"
  })

  it("should call slashSandwich with base URL only", () => {
    const slashSandwichMock = vi
      .spyOn(Slash, "default")
      .mockImplementation((arr) => arr.join("/"))
    const url = makeApiUrl()
    expect(slashSandwichMock).toHaveBeenCalledWith(["https://api.example.com"])
    expect(url).toBe("https://api.example.com")
  })

  it("should concatenate single path segment", () => {
    const slashSandwichMock = vi
      .spyOn(Slash, "default")
      .mockImplementation((arr) => arr.join("/"))
    const url = makeApiUrl("users")
    expect(slashSandwichMock).toHaveBeenCalledWith([
      "https://api.example.com",
      "users",
    ])
    expect(url).toBe("https://api.example.com/users")
  })

  it("should concatenate multiple path segments", () => {
    const slashSandwichMock = vi
      .spyOn(Slash, "default")
      .mockImplementation((arr) => arr.join("/"))
    const url = makeApiUrl("users", 42, "profile")
    expect(slashSandwichMock).toHaveBeenCalledWith([
      "https://api.example.com",
      "users",
      42,
      "profile",
    ])
    expect(url).toBe("https://api.example.com/users/42/profile")
  })

  it("should ignore undefined path segments", () => {
    const slashSandwichMock = vi
      .spyOn(Slash, "default")
      .mockImplementation((arr) => arr.join("/"))
    const url = makeApiUrl("users", undefined, 42)
    expect(slashSandwichMock).toHaveBeenCalledWith([
      "https://api.example.com",
      "users",
      42,
    ])
    expect(url).toBe("https://api.example.com/users/42")
  })

  afterEach(() => {
    Object.assign(env, originalEnv)
  })
})
