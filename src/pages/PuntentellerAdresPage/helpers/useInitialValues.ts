import { useMemo } from "react"
import { useParams, useSearchParams } from "react-router"
import { usePuntentelling } from "@/api/hooks"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { DUMMY_DATA, isDummyDataNaam } from "../dummyData"
import { mapPuntentellingToFormValues } from "./mapPuntentellingToFormValues"

type InitialValues = {
  /** Values that win over the defaults and the prefilled invoerwaarden; none to start empty. */
  values?: Partial<GebruikersinvoerFormValues>
  /** The saved puntentelling being changed (/puntenteller/:bagId/:puntentellingId). */
  puntentelling?: PuntentellingDetail
  /** Whether the values are still loading, so the form waits before it's filled in. */
  isPending: boolean
  /** Whether the saved puntentelling couldn't be fetched, so there's nothing to change. */
  isError?: boolean
}

/**
 * Where the wizard starts from, besides the address's own invoerwaarden: a saved puntentelling
 * when the url names one (/puntenteller/:bagId/:puntentellingId), otherwise the dummydata
 * (?dummydata=<naam>, outside PROD only, see dummyData.ts).
 */
export function useInitialValues(): InitialValues {
  const { puntentellingId } = useParams<{ puntentellingId: string }>()
  const [searchParams] = useSearchParams()
  const dummyDataNaam = searchParams.get("dummydata")
  const id = puntentellingId === undefined ? undefined : Number(puntentellingId)
  const { data: puntentelling, isPending, isError } = usePuntentelling(id)
  const puntentellingValues = useMemo(
    () => puntentelling && mapPuntentellingToFormValues(puntentelling),
    [puntentelling],
  )

  if (id !== undefined) {
    return {
      values: puntentellingValues,
      puntentelling,
      isPending,
      isError,
    }
  }

  if (isAcceptanceOrLocalEnvironment() && isDummyDataNaam(dummyDataNaam)) {
    return { values: DUMMY_DATA[dummyDataNaam], isPending: false }
  }

  return { isPending: false }
}
