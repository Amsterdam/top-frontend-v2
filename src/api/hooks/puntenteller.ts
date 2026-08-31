import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/queryKeys"

/**
 * TODO(puntenteller-backend): de puntenteller-backend en dit endpoint bestaan nog niet.
 * Vervang queryFn door een echte fetch<PuntentellerInvoerwaarden>(makeApiUrl(...)) zodra
 * het endpoint (GET /puntenteller/adressen/:bagId/invoerwaarden) live is. Het responstype
 * blijft ongewijzigd.
 */
const DUMMY_INVOERWAARDEN: PuntentellerInvoerwaarden = {
  straat: "Tjasker",
  huisnummer: "59",
  bouwjaar: 1970,
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
  energielabel: "C",
}

export const useAddressInvoerwaarden = (bagId?: string) => {
  return useQuery({
    queryKey: queryKeys.puntenteller.invoerwaarden(bagId ?? ""),
    queryFn: () => Promise.resolve(DUMMY_INVOERWAARDEN),
    enabled: Boolean(bagId),
  })
}

type SaveGebruikersinvoerOptions = {
  bagId?: string
}

/**
 * TODO(puntenteller-backend): vervang mutationFn door een echte
 * fetch<Gebruikersinvoer>(makeApiUrl(...), { method: "POST", data: payload }) zodra het
 * endpoint bestaat. Voor nu wordt alleen de React Query cache bijgewerkt (geen persistentie).
 */
export const useSaveGebruikersinvoer = ({
  bagId,
}: SaveGebruikersinvoerOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      payload: GebruikersinvoerFormValues,
    ): Promise<Gebruikersinvoer> =>
      Promise.resolve({ id: 1, ...payload, completed: true }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.puntenteller.gebruikersinvoer(bagId ?? ""),
        data,
      )
    },
  })
}
