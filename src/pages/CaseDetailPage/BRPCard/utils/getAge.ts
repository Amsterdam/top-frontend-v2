import dayjs from "dayjs"
import type { Resident } from "../types"

/**
 * De leeftijd uit het BRP. Ontbreekt die, dan berekend uit de geboortedatum,
 * maar alleen als die helemaal bekend is: bij alleen een jaar of een maand kan
 * de leeftijd een jaar ernaast zitten. Bij een overleden persoon niet, want
 * dan klopt een leeftijd tot vandaag niet.
 */
export const getAge = (resident: Resident) => {
  if (resident?.leeftijd != null) return resident.leeftijd
  if (resident?.overlijden) return undefined

  const birthDate = resident?.geboorte?.datum?.datum
  if (!birthDate || !dayjs(birthDate).isValid()) return undefined
  return dayjs().diff(birthDate, "year")
}
