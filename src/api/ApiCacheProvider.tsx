import { createContext, useState, type ReactNode } from "react"

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
