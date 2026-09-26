import { Fragment, type ReactNode } from "react"
import { Paragraph } from "@amsterdam/design-system-react"
import dayjs from "dayjs"
import { formatDate } from "@/shared/dateFormatters"
import {
  type BouwjaarReason,
  parseEnergieIndex,
  selectEnergieGrondslag,
} from "../helpers/energieGrondslag"

// "1 september 2016"; the Dutch month names come from the dayjs locale set in App.tsx.
const DATE_FORMAT = "D MMMM YYYY"

const formatEnergieIndex = (value: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(value)

/** The conclusion when the energieprestatie falls back to the bouwjaar, per reason. */
const BOUWJAAR_REASONS: Record<BouwjaarReason, string> = {
  no_data:
    "De energieprestatie wordt daarom berekend op basis van het bouwjaar.",
  expired:
    "Omdat de meting is verlopen, wordt de energieprestatie berekend op basis van het bouwjaar.",
  label_2015_2021:
    "Een energielabel dat is opgenomen tussen 1 januari 2015 en 1 januari 2021 telt niet mee, daarom wordt de energieprestatie berekend op basis van het bouwjaar.",
  unknown_opnamedatum:
    "Omdat niet bekend is wanneer het energielabel is opgenomen, wordt de energieprestatie berekend op basis van het bouwjaar.",
}

type Props = {
  energie: PuntentellerEnergie | null | undefined
  /** The day to compare meting_geldig_tot with; defaults to today. */
  today?: string
}

/**
 * A paragraph about the energielabel and energie-index the backend found for the address
 * (EP-Online), with the values and dates in bold, followed by what the energieprestatie is
 * based on (see selectEnergieGrondslag), e.g. "Uit onze gegevens blijkt dat deze woning
 * energielabel C heeft, opgenomen op 1 september 2016 en geldig tot 1 september 2026. Een
 * energielabel dat is opgenomen tussen …". Dates that are missing are left out; a measurement
 * that's no longer valid on `today` says "verlopen op" instead of "geldig tot".
 */
export function EnergielabelSummary({
  energie,
  today = dayjs().format("YYYY-MM-DD"),
}: Props) {
  const grondslag = selectEnergieGrondslag(energie, today)

  const energieindex = parseEnergieIndex(energie?.energieindex)

  if (!energie || (!energie.energielabel && energieindex === null)) {
    return (
      <Paragraph>
        Uit onze gegevens is geen energielabel of energie-index bekend voor deze
        woning. {BOUWJAAR_REASONS.no_data}
      </Paragraph>
    )
  }

  const values: ReactNode[] = []
  if (energie.energielabel) {
    values.push(<strong>energielabel {energie.energielabel}</strong>)
  }
  if (energieindex !== null) {
    values.push(
      <strong>energie-index {formatEnergieIndex(energieindex)}</strong>,
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

  const conclusion =
    grondslag.type === "label"
      ? "Dit energielabel telt mee voor de energieprestatie."
      : grondslag.type === "index"
        ? "De energie-index telt mee voor de energieprestatie."
        : BOUWJAAR_REASONS[grondslag.reason]

  return (
    <Paragraph>
      Uit onze gegevens blijkt dat deze woning{" "}
      {values.map((value, index) => (
        <Fragment key={index}>
          {index > 0 && " en "}
          {value}
        </Fragment>
      ))}{" "}
      heeft
      {details.map((detail, index) => (
        <Fragment key={index}>
          {index === 0 ? ", " : " en "}
          {detail}
        </Fragment>
      ))}
      . {conclusion}
    </Paragraph>
  )
}
