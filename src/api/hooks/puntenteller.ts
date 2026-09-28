import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { slashSandwich } from "@/api/utils/slashSandwich"
import { env } from "@/config/env"
import { queryKeys } from "@/api/queryKeys"

/**
 * TODO(puntenteller-backend): a separate base URL for now, because the puntenteller-backend runs
 * locally next to the TOP-API. Remove it once the endpoints are reachable through VITE_API_URL.
 */
const PUNTENTELLER_API_URL =
  env.VITE_PUNTENTELLER_API_URL ?? "http://localhost:8080/api/v1/"

/**
 * Set to true to work on the wizard without a running puntenteller-backend: the invoerwaarden
 * then come from DUMMY_INVOERWAARDEN below instead of the backend.
 */
const USE_DUMMY_INVOERWAARDEN = false

const DUMMY_INVOERWAARDEN: PuntentellerInvoerwaarden = {
  straat: "Tjasker",
  huisnummer: "59",
  bouwjaar: 1977,
  gebruiksoppervlakte: 90,
  woz_waarden: [
    { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
    { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
    { peildatum: "2023-01-01", vastgestelde_waarde: 350000 },
    { peildatum: "2022-01-01", vastgestelde_waarde: 355000 },
    { peildatum: "2021-01-01", vastgestelde_waarde: 302000 },
    { peildatum: "2020-01-01", vastgestelde_waarde: 276000 },
    { peildatum: "2019-01-01", vastgestelde_waarde: 278000 },
    { peildatum: "2018-01-01", vastgestelde_waarde: 232000 },
    { peildatum: "2017-01-01", vastgestelde_waarde: 189000 },
    { peildatum: "2016-01-01", vastgestelde_waarde: 164000 },
    { peildatum: "2015-01-01", vastgestelde_waarde: 146000 },
    { peildatum: "2014-01-01", vastgestelde_waarde: 138500 },
  ],
  wozobjectnummer: 36300297723,
  energie: {
    energielabel: "C",
    energieindex: null,
    registratiedatum: null,
    opnamedatum: null,
    meting_geldig_tot: null,
  },
}

/** GET /puntenteller/adressen/:bagId/invoerwaarden/: the known data of the address (BAG, WOZ, EP-Online). */
export const useAddressInvoerwaarden = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.puntenteller.invoerwaarden(bagId ?? ""),
    queryFn: () =>
      USE_DUMMY_INVOERWAARDEN
        ? Promise.resolve(DUMMY_INVOERWAARDEN)
        : fetch<PuntentellerInvoerwaarden>(
            slashSandwich([
              PUNTENTELLER_API_URL,
              "puntenteller",
              "adressen",
              bagId,
              "invoerwaarden",
            ]),
          ),
    enabled: Boolean(bagId),
  })
}

type SaveGebruikersinvoerOptions = {
  bagId?: string
}

/**
 * Saves the gebruikersinvoer; the backend calculates the punten in the same request and only
 * returns the resultaat ("Sla op en bereken" in the overzicht-stap).
 */
export const useSaveGebruikersinvoer = ({
  bagId,
}: SaveGebruikersinvoerOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GebruikersinvoerPayload) =>
      fetch<PuntentellerResultaat>(
        slashSandwich([
          PUNTENTELLER_API_URL,
          "puntenteller",
          "adressen",
          bagId,
        ]),
        { method: "POST", data: payload },
      ),
    // The response is only the berekening (the resultaat-stap reads it from the mutation), so
    // the address's list of gebruikersinvoer is refetched to include the new one. `exact`
    // leaves the invoerwaarden, which sit under the same address key, alone.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      }),
  })
}
