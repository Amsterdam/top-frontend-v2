import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { queryClient } from "../../api/queryClient"
import { queryKeys } from "../../api/queryKeys"
import {
  applyQueuedVisitToCache,
  flushOfflineVisitQueue,
  queueVisitCompletion,
  queueVisitSave,
} from "../visitSync"

const { showToastOutsideReactMock } = vi.hoisted(() => ({
  showToastOutsideReactMock: vi.fn(),
}))

vi.mock("@/components/toasts/toastBridge", () => ({
  showToastOutsideReact: showToastOutsideReactMock,
}))

const STORAGE_KEY = "top-offline-visit-mutations"
const ITINERARY_ID = "978"
const ITINERARY_ITEM_ID = 123

const setOnlineStatus = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    get: () => online,
  })
}

const readQueue = () =>
  JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Array<
    Record<string, unknown>
  >

const createResponse = (
  body: unknown,
  init: { ok?: boolean; status?: number; statusText?: string } = {},
) =>
  ({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? "OK",
    text: () =>
      Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
  }) as Response

const createItinerary = (visits: unknown[] = []) => ({
  items: [
    {
      id: ITINERARY_ITEM_ID,
      position: 1,
      visits,
    },
  ],
})

describe("visitSync", () => {
  beforeEach(() => {
    queryClient.clear()
    window.localStorage.clear()
    vi.clearAllMocks()
    setOnlineStatus(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("builds an optimistic visit from cached data and queues an update mutation", () => {
    const existingVisit = {
      id: 42,
      itinerary_item: ITINERARY_ITEM_ID,
      completed: false,
      case_id: "6711",
      start_time: "2026-08-13T11:02:00Z",
      author: "Existing author",
      team_members: [],
      description: "Old description",
      observations: "Old observations",
    }

    queryClient.setQueryData(
      queryKeys.visits.detail(existingVisit.id),
      existingVisit,
    )

    const payload = {
      description: "Updated description",
    } as Parameters<typeof queueVisitSave>[0]["payload"]

    const optimisticVisit = queueVisitSave({
      visitId: String(existingVisit.id),
      itineraryId: ITINERARY_ID,
      payload,
    })

    expect(optimisticVisit).toEqual(
      expect.objectContaining({
        id: existingVisit.id,
        itinerary_item: ITINERARY_ITEM_ID,
        case_id: existingVisit.case_id,
        start_time: existingVisit.start_time,
        author: existingVisit.author,
        completed: existingVisit.completed,
        description: payload.description,
      }),
    )

    expect(readQueue()).toEqual([
      expect.objectContaining({
        kind: "saveVisit",
        mode: "update",
        visitId: existingVisit.id,
        itineraryId: ITINERARY_ID,
        payload,
      }),
    ])
  })

  it("flushes a queued created visit and later completion using the synced visit id", async () => {
    queryClient.setQueryData(
      queryKeys.itineraries.detail(ITINERARY_ID),
      createItinerary(),
    )

    const savePayload = {
      case_id: "6711",
      itinerary_item: ITINERARY_ITEM_ID,
      start_time: "2026-08-13T11:02:00Z",
      author: "Planner",
    } as Parameters<typeof queueVisitSave>[0]["payload"]

    const optimisticVisit = queueVisitSave({
      itineraryId: ITINERARY_ID,
      payload: savePayload,
    })
    applyQueuedVisitToCache(ITINERARY_ID, optimisticVisit)

    const completedOptimisticVisit = queueVisitCompletion({
      visitId: optimisticVisit.id,
      itineraryId: ITINERARY_ID,
      payload: { completed: true },
    })
    applyQueuedVisitToCache(ITINERARY_ID, completedOptimisticVisit)

    const createdVisit = {
      ...optimisticVisit,
      id: 456,
      completed: false,
    }
    const completedVisit = {
      ...createdVisit,
      completed: true,
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createResponse(createdVisit))
      .mockResolvedValueOnce(createResponse(completedVisit))

    vi.stubGlobal("fetch", fetchMock)

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries")

    await flushOfflineVisitQueue("mock-access-token")

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("/visits/"),
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer mock-access-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savePayload),
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/visits/456/"),
      expect.objectContaining({
        method: "PATCH",
        headers: {
          Authorization: "Bearer mock-access-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      }),
    )

    expect(
      queryClient.getQueryData(queryKeys.visits.detail(optimisticVisit.id)),
    ).toBeUndefined()
    expect(queryClient.getQueryData(queryKeys.visits.detail(456))).toEqual(
      completedVisit,
    )

    expect(
      queryClient.getQueryData(queryKeys.itineraries.detail(ITINERARY_ID)),
    ).toEqual(createItinerary([completedVisit]))

    expect(readQueue()).toEqual([])
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.itineraries.all,
    })
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.visits.all,
    })
    expect(showToastOutsideReactMock).toHaveBeenCalledWith({
      title: "Offline wijzigingen gesynchroniseerd",
      description: "2 wijzigingen zijn verzonden zodra de app weer online was.",
      severity: "success",
    })
  })
})
