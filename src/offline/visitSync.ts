import { queryClient } from "@/api/queryClient"
import { queryKeys } from "@/api/queryKeys"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { showToastOutsideReact } from "@/components/toasts/toastBridge"

const STORAGE_KEY = "top-offline-visit-mutations"
export const OFFLINE_VISIT_QUEUE_EVENT = "top:offline-visit-queue-change"

const isBrowser = () => typeof window !== "undefined"

const createQueueId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

const createLocalVisitId = () =>
  -(Date.now() + Math.floor(Math.random() * 1000))

type OfflineMutationBase = {
  id: string
}

type OfflineSaveVisitCreateMutation = OfflineMutationBase & {
  kind: "saveVisit"
  mode: "create"
  localVisitId: number
  itineraryId?: string
  payload: VisitPayload
}

type OfflineSaveVisitUpdateMutation = OfflineMutationBase & {
  kind: "saveVisit"
  mode: "update"
  visitId: number
  itineraryId?: string
  payload: VisitPayload
}

type OfflineCompleteVisitMutation = OfflineMutationBase & {
  kind: "completeVisit"
  visitId: number
  itineraryId?: string
  payload: { completed: boolean }
}

type OfflineUpdateItineraryItemPositionMutation = OfflineMutationBase & {
  kind: "updateItineraryItemPosition"
  itineraryId?: string
  itineraryItemId: number
  payload: { position: number }
}

type OfflineMutation =
  | OfflineSaveVisitCreateMutation
  | OfflineSaveVisitUpdateMutation
  | OfflineCompleteVisitMutation
  | OfflineUpdateItineraryItemPositionMutation

export type MutationResult<T> = {
  data: T
  queued: boolean
}

let flushPromise: Promise<void> | null = null

const readQueue = (): OfflineMutation[] => {
  if (!isBrowser()) return []

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as OfflineMutation[]) : []
  } catch {
    return []
  }
}

const writeQueue = (queue: OfflineMutation[]) => {
  if (!isBrowser()) return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  window.dispatchEvent(new Event(OFFLINE_VISIT_QUEUE_EVENT))
}

const enqueueMutation = (mutation: OfflineMutation) => {
  writeQueue([...readQueue(), mutation])
}

const replaceVisitIdsInQueue = (
  queue: OfflineMutation[],
  localVisitId: number,
  syncedVisitId: number,
) =>
  queue.map((mutation) => {
    if (mutation.kind === "saveVisit" && mutation.mode === "update") {
      return mutation.visitId === localVisitId
        ? { ...mutation, visitId: syncedVisitId }
        : mutation
    }

    if (mutation.kind === "completeVisit") {
      return mutation.visitId === localVisitId
        ? { ...mutation, visitId: syncedVisitId }
        : mutation
    }

    return mutation
  })

const normalizeVisitId = (visitId?: string | number) => {
  if (visitId === undefined) return undefined

  const normalized = Number(visitId)
  return Number.isFinite(normalized) ? normalized : undefined
}

const buildOptimisticVisitFromPayload = (
  visitId: number,
  payload: VisitPayload,
  currentVisit?: Visit | null,
): Visit => {
  if ("completed" in payload) {
    return {
      ...(currentVisit ?? {
        id: visitId,
        team_members: [],
        case_id: "",
        completed: false,
        observations: null,
        start_time: new Date().toISOString(),
        itinerary_item: null,
        author: "",
      }),
      completed: payload.completed,
      id: visitId,
    }
  }

  return {
    ...(currentVisit ?? {
      id: visitId,
      team_members: [],
      completed: false,
      author: "",
    }),
    id: visitId,
    case_id: String(payload.case_id ?? currentVisit?.case_id ?? ""),
    completed: currentVisit?.completed ?? false,
    situation: payload.situation ?? null,
    observations: payload.observations ?? null,
    start_time:
      payload.start_time ??
      currentVisit?.start_time ??
      new Date().toISOString(),
    description: payload.description ?? null,
    can_next_visit_go_ahead: payload.can_next_visit_go_ahead ?? null,
    can_next_visit_go_ahead_description:
      payload.can_next_visit_go_ahead_description ?? null,
    suggest_next_visit: payload.suggest_next_visit ?? null,
    suggest_next_visit_description:
      payload.suggest_next_visit_description ?? null,
    personal_notes: payload.personal_notes ?? null,
    itinerary_item:
      payload.itinerary_item ?? currentVisit?.itinerary_item ?? null,
    author: payload.author ?? currentVisit?.author ?? "",
  }
}

const getCachedVisit = (visitId?: number, itineraryId?: string) => {
  if (visitId === undefined) return null

  const fromVisitDetail = queryClient.getQueryData<Visit>(
    queryKeys.visits.detail(visitId),
  )

  if (fromVisitDetail) return fromVisitDetail

  if (!itineraryId) return null

  const itinerary = queryClient.getQueryData<Itinerary>(
    queryKeys.itineraries.detail(itineraryId),
  )

  for (const item of itinerary?.items ?? []) {
    const visit = item.visits.find(
      (existingVisit) => existingVisit.id === visitId,
    )

    if (visit) return visit
  }

  return null
}

const upsertVisitInItineraryCache = (
  itineraryId: string | undefined,
  visit: Visit,
  replaceVisitId = visit.id,
) => {
  if (!itineraryId || !visit.itinerary_item) return

  queryClient.setQueryData(
    queryKeys.itineraries.detail(itineraryId),
    (current: Itinerary | undefined) => {
      if (!current) return current

      return {
        ...current,
        items: current.items.map((item) => {
          if (item.id !== visit.itinerary_item) return item

          const existingVisit = item.visits.find(
            (currentVisit) => currentVisit.id === replaceVisitId,
          )
          const mergedVisit = existingVisit
            ? {
                ...visit,
                completed: existingVisit.completed || visit.completed,
              }
            : visit

          const hasVisit = item.visits.some(
            (currentVisit) => currentVisit.id === replaceVisitId,
          )

          return {
            ...item,
            visits: hasVisit
              ? item.visits.map((currentVisit) =>
                  currentVisit.id === replaceVisitId
                    ? mergedVisit
                    : currentVisit,
                )
              : [...item.visits, mergedVisit],
          }
        }),
      }
    },
  )
}

const setVisitCache = (visit: Visit) => {
  queryClient.setQueryData(queryKeys.visits.detail(visit.id), visit)
}

const removeVisitCache = (visitId: number) => {
  queryClient.removeQueries({ queryKey: queryKeys.visits.detail(visitId) })
}

const setItineraryItemPositionCache = (
  itineraryId: string | undefined,
  itineraryItemId: number,
  position: number,
) => {
  if (!itineraryId) return

  queryClient.setQueryData(
    queryKeys.itineraries.detail(itineraryId),
    (current: Itinerary | undefined) => {
      if (!current) return current

      return {
        ...current,
        items: current.items.map((item) =>
          item.id === itineraryItemId ? { ...item, position } : item,
        ),
      }
    },
  )
}

const parseResponseBody = async (response: Response) => {
  const text = await response.text()

  try {
    return text ? (JSON.parse(text) as unknown) : null
  } catch {
    return text
  }
}

const requestWithToken = async <Schema>(
  url: string,
  method: "POST" | "PUT" | "PATCH",
  data: unknown,
  accessToken: string,
): Promise<Schema> => {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(
      typeof body === "string" ? body : response.statusText || "Request failed",
    )
  }

  return body as Schema
}

const shouldQueueMutation = (error: unknown) =>
  !window.navigator.onLine || error instanceof TypeError

export const queueVisitSave = ({
  visitId,
  itineraryId,
  payload,
}: {
  visitId?: string | number
  itineraryId?: string
  payload: VisitPayload
}): Visit => {
  const normalizedVisitId = normalizeVisitId(visitId)
  const currentVisit = getCachedVisit(normalizedVisitId, itineraryId)

  if (normalizedVisitId !== undefined) {
    const optimisticVisit = buildOptimisticVisitFromPayload(
      normalizedVisitId,
      payload,
      currentVisit,
    )

    enqueueMutation({
      id: createQueueId(),
      kind: "saveVisit",
      mode: "update",
      visitId: normalizedVisitId,
      itineraryId,
      payload,
    })

    return optimisticVisit
  }

  const localVisitId = createLocalVisitId()
  const optimisticVisit = buildOptimisticVisitFromPayload(localVisitId, payload)

  enqueueMutation({
    id: createQueueId(),
    kind: "saveVisit",
    mode: "create",
    localVisitId,
    itineraryId,
    payload,
  })

  return optimisticVisit
}

export const queueVisitCompletion = ({
  visitId,
  itineraryId,
  payload,
}: {
  visitId?: string | number
  itineraryId?: string
  payload: { completed: boolean }
}) => {
  const normalizedVisitId = normalizeVisitId(visitId)

  if (normalizedVisitId === undefined) {
    throw new Error("Cannot queue a visit completion without a visit id.")
  }

  const optimisticVisit = buildOptimisticVisitFromPayload(
    normalizedVisitId,
    payload,
    getCachedVisit(normalizedVisitId, itineraryId),
  )

  enqueueMutation({
    id: createQueueId(),
    kind: "completeVisit",
    visitId: normalizedVisitId,
    itineraryId,
    payload,
  })

  return optimisticVisit
}

export const queueItineraryItemPositionUpdate = ({
  itineraryId,
  itineraryItemId,
  payload,
}: {
  itineraryId?: string
  itineraryItemId: number
  payload: { position: number }
}) => {
  enqueueMutation({
    id: createQueueId(),
    kind: "updateItineraryItemPosition",
    itineraryId,
    itineraryItemId,
    payload,
  })
}

const resolveVisitId = (
  visitId: number,
  localToRemoteVisitIds: Map<number, number>,
) => {
  if (visitId > 0) return visitId

  return localToRemoteVisitIds.get(visitId)
}

export const flushOfflineVisitQueue = async (accessToken?: string) => {
  if (!accessToken || !isBrowser() || !window.navigator.onLine) return

  if (flushPromise) {
    await flushPromise
    return
  }

  flushPromise = (async () => {
    let syncedMutationCount = 0
    const localToRemoteVisitIds = new Map<number, number>()

    while (window.navigator.onLine) {
      const queue = readQueue()
      const mutation = queue[0]

      if (!mutation) {
        if (syncedMutationCount > 0) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.itineraries.all,
          })
          await queryClient.invalidateQueries({
            queryKey: queryKeys.visits.all,
          })

          showToastOutsideReact({
            title: "Offline wijzigingen gesynchroniseerd",
            description:
              syncedMutationCount === 1
                ? "1 wijziging is verzonden zodra de app weer online was."
                : `${syncedMutationCount} wijzigingen zijn verzonden zodra de app weer online was.`,
            severity: "success",
          })
        }

        return
      }

      try {
        if (mutation.kind === "saveVisit") {
          if (mutation.mode === "create") {
            const savedVisit = await requestWithToken<Visit>(
              makeApiUrl("visits"),
              "POST",
              mutation.payload,
              accessToken,
            )

            localToRemoteVisitIds.set(mutation.localVisitId, savedVisit.id)
            upsertVisitInItineraryCache(
              mutation.itineraryId,
              savedVisit,
              mutation.localVisitId,
            )
            setVisitCache(savedVisit)
            removeVisitCache(mutation.localVisitId)

            writeQueue(
              replaceVisitIdsInQueue(
                readQueue().filter(
                  (queuedMutation) => queuedMutation.id !== mutation.id,
                ),
                mutation.localVisitId,
                savedVisit.id,
              ),
            )
          } else {
            const resolvedVisitId = resolveVisitId(
              mutation.visitId,
              localToRemoteVisitIds,
            )

            if (!resolvedVisitId) return

            const savedVisit = await requestWithToken<Visit>(
              makeApiUrl("visits", resolvedVisitId),
              "PUT",
              mutation.payload,
              accessToken,
            )

            upsertVisitInItineraryCache(
              mutation.itineraryId,
              savedVisit,
              mutation.visitId,
            )
            setVisitCache(savedVisit)
            writeQueue(
              readQueue().filter(
                (queuedMutation) => queuedMutation.id !== mutation.id,
              ),
            )
          }
        }

        if (mutation.kind === "completeVisit") {
          const resolvedVisitId = resolveVisitId(
            mutation.visitId,
            localToRemoteVisitIds,
          )

          if (!resolvedVisitId) return

          const savedVisit = await requestWithToken<Visit>(
            makeApiUrl("visits", resolvedVisitId),
            "PATCH",
            mutation.payload,
            accessToken,
          )

          upsertVisitInItineraryCache(
            mutation.itineraryId,
            savedVisit,
            mutation.visitId,
          )
          setVisitCache(savedVisit)
          writeQueue(
            readQueue().filter(
              (queuedMutation) => queuedMutation.id !== mutation.id,
            ),
          )
        }

        if (mutation.kind === "updateItineraryItemPosition") {
          await requestWithToken<ItineraryItem>(
            makeApiUrl("itinerary-items", mutation.itineraryItemId),
            "PATCH",
            mutation.payload,
            accessToken,
          )

          setItineraryItemPositionCache(
            mutation.itineraryId,
            mutation.itineraryItemId,
            mutation.payload.position,
          )
          writeQueue(
            readQueue().filter(
              (queuedMutation) => queuedMutation.id !== mutation.id,
            ),
          )
        }

        syncedMutationCount += 1
      } catch (error) {
        if (shouldQueueMutation(error)) {
          return
        }

        showToastOutsideReact({
          title: "Synchroniseren mislukt",
          description:
            "Niet alle offline wijzigingen konden worden verstuurd. Probeer het opnieuw zodra de verbinding stabiel is.",
          severity: "error",
        })
        return
      }
    }
  })().finally(() => {
    flushPromise = null
  })

  await flushPromise
}

export const applyQueuedVisitToCache = (
  itineraryId: string | undefined,
  visit: Visit,
) => {
  setVisitCache(visit)
  upsertVisitInItineraryCache(itineraryId, visit)
}

export const applyQueuedItineraryItemPositionToCache = (
  itineraryId: string | undefined,
  itineraryItemId: number,
  position: number,
) => {
  setItineraryItemPositionCache(itineraryId, itineraryItemId, position)
}
