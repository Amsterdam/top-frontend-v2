import { useCallback, useEffect, useRef, useState } from "react"
import useRequest, { type HttpMethod } from "./useRequest"
import { useApiCache } from "./useApiCache"

type GetOptions = {
  method: "GET"
}

type MutateOptions = {
  method: "POST" | "PUT" | "PATCH" | "DELETE"
  skipCacheClear?: boolean
  useResponseAsCache?: boolean
}

type Options = GetOptions | MutateOptions

const isGetOptions = (options: Options): options is GetOptions =>
  options.method === "GET"

const isMutateOptions = (options: Options): options is MutateOptions =>
  ["POST", "PUT", "PATCH", "DELETE"].includes(options.method)

type CacheItem<T> = {
  value?: T
  valid: boolean
  errors: unknown[]
}

type Config = {
  url: string
  isProtected?: boolean
  lazy?: boolean
  keepUsingInvalidCache?: boolean
  handleError?: (error: unknown) => void
}

export const useApi = <Schema, Payload = Partial<Schema>>({
  url,
  isProtected,
  lazy,
  keepUsingInvalidCache,
  handleError,
}: Config) => {
  const request = useRequest()
  const cache = useApiCache()
  const [isBusy, setIsBusy] = useState(false)
  const isFetchingRef = useRef(false)
  const cacheItem = cache.get(url) as CacheItem<Schema> | undefined

  const setCacheItem = useCallback(
    (value: Schema) => {
      cache.set(url, {
        value,
        valid: true,
        errors: [],
      })
    },
    [cache, url],
  )

  const addErrorToCache = useCallback(
    (error: unknown) => {
      cache.set(url, {
        value: cacheItem?.value,
        valid: false,
        errors: [...(cacheItem?.errors ?? []), error],
      })
    },
    [cache, cacheItem, url],
  )

  const execRequest = useCallback(
    async (options: Options, payload?: Payload) => {
      if (isFetchingRef.current) return
      try {
        isFetchingRef.current = true
        setIsBusy(true)

        if (isMutateOptions(options) && !options.skipCacheClear) {
          cache.delete(url)
        }

        const response = await request<Schema>(
          options.method as HttpMethod,
          url,
          payload,
          { protected: isProtected },
        )

        if (
          isGetOptions(options) ||
          (isMutateOptions(options) && options.useResponseAsCache)
        ) {
          setCacheItem(response)
        }

        return response
      } catch (error) {
        addErrorToCache(error)
        if (handleError) {
          handleError(error)
        } else {
          throw error
        }
      } finally {
        isFetchingRef.current = false
        setIsBusy(false)
      }
    },
    [
      request,
      url,
      cache,
      isProtected,
      setCacheItem,
      addErrorToCache,
      handleError,
    ],
  )

  const execGet = useCallback(
    () => execRequest({ method: "GET" }),
    [execRequest],
  )

  const execPost = useCallback(
    (payload?: Payload, options?: Omit<MutateOptions, "method">) =>
      execRequest({ method: "POST", ...options }, payload),
    [execRequest],
  )

  const execPut = useCallback(
    (payload?: Payload, options?: Omit<MutateOptions, "method">) =>
      execRequest({ method: "PUT", ...options }, payload),
    [execRequest],
  )

  const execPatch = useCallback(
    (payload?: Payload, options?: Omit<MutateOptions, "method">) =>
      execRequest({ method: "PATCH", ...options }, payload),
    [execRequest],
  )

  const execDelete = useCallback(
    (options?: Omit<MutateOptions, "method">) =>
      execRequest({ method: "DELETE", ...options }),
    [execRequest],
  )

  useEffect(() => {
    if ((!cacheItem || !cacheItem.valid) && !lazy) {
      void execGet()
    }
  }, [cacheItem, lazy, execGet])

  const data =
    cacheItem && (cacheItem.valid || keepUsingInvalidCache)
      ? cacheItem.value
      : undefined

  const errors = cacheItem?.errors ?? []

  return [
    data,
    {
      isBusy,
      hasErrors: errors.length > 0,
      execGet,
      execPost,
      execPut,
      execPatch,
      execDelete,
    },
    errors,
  ] as const
}

export default useApi
