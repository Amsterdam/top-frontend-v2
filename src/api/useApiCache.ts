import { useContext } from "react"
import { ApiCacheContext } from "./ApiCacheProvider"
import { type CacheStore } from "./types"

export const useApiCache = (): CacheStore => {
  const ctx = useContext(ApiCacheContext)
  if (!ctx) throw new Error("useApiCache must be used inside ApiCacheProvider")
  return ctx
}
