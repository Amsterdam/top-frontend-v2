import { useCallback, useEffect, useRef, useState } from "react"
import useRequest, { type HttpMethod } from "./useRequest"
import { useApiCache } from "./useApiCache"
import { useApiErrorHandler } from "@/api/utils/useApiErrorHandler"
import type { ApiError } from "@/api/types/apiError"

type GetOptions = {
  method: "GET"
}

type MutateOptions = {
  method: "POST" | "PUT" | "PATCH" | "DELETE"
  skipCacheClear?: boolean
  useResponseAsCache?: boolean
  clearCacheKeys?: string[]
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

type ApiConfig = {
  url: string
  isProtected?: boolean
  lazy?: boolean
  keepUsingInvalidCache?: boolean
  handleError?: (error: ApiError) => boolean
}

export const useApi = <Schema, Payload = Partial<Schema>>({
  url,
  isProtected = true,
  lazy = false,
  keepUsingInvalidCache,
  handleError,
}: ApiConfig) => {
  const request = useRequest()
  const cache = useApiCache()
  const [isBusy, setIsBusy] = useState(false)
  const isFetchingRef = useRef(false)
  const cacheItem = cache.get(url) as CacheItem<Schema> | undefined
  const handleGlobalError = useApiErrorHandler()

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

  const updateCache = useCallback(
    (updater: (item: Schema | undefined) => void) => {
      const current = cache.get(url) as CacheItem<Schema> | undefined
      if (!current) return

      const newValue = current.value
        ? structuredClone(current.value)
        : undefined
      updater(newValue)

      cache.set(url, {
        value: newValue,
        valid: true,
        errors: current.errors ?? [],
      })
    },
    [cache, url],
  )

  const execRequest = useCallback(
    async (options: Options, payload?: Payload) => {
      if (isFetchingRef.current) return
      try {
        isFetchingRef.current = true
        setIsBusy(true)

        if (isMutateOptions(options)) {
          if (!options.skipCacheClear) {
            cache.delete(url)
          }

          if (options.clearCacheKeys?.length) {
            options.clearCacheKeys.forEach((keyFragment) => {
              Array.from(cache.keys()).forEach((cacheKey) => {
                if (cacheKey.includes(keyFragment)) {
                  cache.delete(cacheKey)
                }
              })
            })
          }
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
        const apiError: ApiError = (error as ApiError)?.status
          ? (error as ApiError)
          : {
              status: 500,
              message:
                (error as Error).message ||
                "Er is een onverwachte fout opgetreden.",
              cause: error,
            }

        addErrorToCache(apiError)

        const handledLocally = handleError?.(apiError) === true

        if (!handledLocally) {
          handleGlobalError(apiError)
        }

        throw apiError
      } finally {
        isFetchingRef.current = false
        setIsBusy(false)
      }
    },
    [
      request,
      url,
      isProtected,
      cache,
      setCacheItem,
      addErrorToCache,
      handleError,
      handleGlobalError,
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
    if (!cacheItem && !lazy) {
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
      updateCache,
    },
    errors,
  ] as const
}

export default useApi
