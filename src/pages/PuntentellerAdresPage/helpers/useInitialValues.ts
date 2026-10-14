import { useSearchParams } from "react-router"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { DUMMY_DATA, isDummyDataNaam } from "../dummyData"

type InitialValues = {
  /** Values that win over the defaults and the prefilled invoerwaarden; none to start empty. */
  values?: Partial<GebruikersinvoerFormValues>
  /** Whether the values are still loading, so the form waits before it's filled in. */
  isPending: boolean
}

/**
 * Where the wizard starts from, besides the address's own invoerwaarden. For now only the
 * dummydata (?dummydata=<naam>, outside PROD only, see dummyData.ts). A saved puntentelling
 * fetched from the API would be another source here: return its values (mapped to form values)
 * and its isPending.
 */
export function useInitialValues(): InitialValues {
  const [searchParams] = useSearchParams()
  const dummyDataNaam = searchParams.get("dummydata")

  if (isAcceptanceOrLocalEnvironment() && isDummyDataNaam(dummyDataNaam)) {
    return { values: DUMMY_DATA[dummyDataNaam], isPending: false }
  }

  return { isPending: false }
}
