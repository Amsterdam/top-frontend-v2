import { Fragment, type ReactNode } from "react"
import { Paragraph } from "@amsterdam/design-system-react"
import dayjs from "dayjs"
import { formatDate } from "@/shared/dateFormatters"

// "1 september 2016"; the Dutch month names come from the dayjs locale set in App.tsx.
const DATE_FORMAT = "D MMMM YYYY"

type Props = {
  energie: PuntentellerEnergie | null | undefined
  /** The day to compare meting_geldig_tot with; defaults to today. */
  today?: string
}

/**
 * A paragraph with a sentence about the energielabel the backend found for the address (EP-Online), with
 * "energielabel <label>" and the dates in bold, e.g. "Uit onze gegevens blijkt dat deze woning energielabel C heeft,
 * opgenomen op 1 september 2016 en geldig tot 1 september 2026." Dates that are missing are left
 * out; a measurement that's no longer valid on `today` says "verlopen op" instead of "geldig tot".
 */
export function EnergielabelSummary({
  energie,
  today = dayjs().format("YYYY-MM-DD"),
}: Props) {
  if (!energie?.energielabel) {
    return (
      <Paragraph>
        Uit onze gegevens is geen energielabel bekend voor deze woning.
      </Paragraph>
    )
  }

  const details: ReactNode[] = []
  if (energie.opnamedatum) {
    details.push(
      <>
        opgenomen op{" "}
        <strong>{formatDate(energie.opnamedatum, DATE_FORMAT)}</strong>
      </>,
    )
  }
  if (energie.meting_geldig_tot) {
    details.push(
      <>
        {dayjs(energie.meting_geldig_tot).isBefore(today, "day")
          ? "verlopen op"
          : "geldig tot"}{" "}
        <strong>{formatDate(energie.meting_geldig_tot, DATE_FORMAT)}</strong>
      </>,
    )
  }

  return (
    <Paragraph>
      Uit onze gegevens blijkt dat deze woning{" "}
      <strong>energielabel {energie.energielabel}</strong> heeft
      {details.map((detail, index) => (
        <Fragment key={index}>
          {index === 0 ? ", " : " en "}
          {detail}
        </Fragment>
      ))}
      .
    </Paragraph>
  )
}
