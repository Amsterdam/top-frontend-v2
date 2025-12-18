import { createContext, useState, type ReactNode } from "react"

import { type CacheStore } from "@/types/cache"

const ApiCacheContext = createContext<CacheStore | null>(null)

export const ApiCacheProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState<CacheStore>(() => new Map())

  return (
    <ApiCacheContext.Provider value={store}>
      {children}
    </ApiCacheContext.Provider>
  )
}

export { ApiCacheContext }
