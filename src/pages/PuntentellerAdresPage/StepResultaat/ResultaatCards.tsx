import type { CSSProperties } from "react"
import {
  Column,
  Heading,
  Paragraph,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import {
  correcties,
  HUURSEGMENTEN,
  huursegment,
  rubrieken,
  type Huursegment,
} from "./berekening"
import styles from "./StepResultaat.module.css"

const formatPunten = (punten: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(punten)

/** "+ 3,5" or "− 2" (a real minus sign) for a correction's effect; just "0" when it rounds to 0. */
const formatDifference = (punten: number) => {
  const amount = formatPunten(Math.abs(punten))
  if (amount === "0") return amount
  return `${punten < 0 ? "−" : "+"} ${amount}`
}

// Where the segment bar ends; a higher score pins the marker to the end.
const SCALE_MAX = 250

const formatRange = ({ from, to }: Huursegment) =>
  to === Infinity ? `${from} punten of meer` : `${from} t/m ${to} punten`

type Props = {
  resultaat: PuntentellerResultaat
}

/** The puntentotaal, with a segment bar showing its huursegment. */
export function ScoreCard({ resultaat }: Props) {
  const total = resultaat.totaal_punten_na_caps
  const segment = huursegment(total)
  const position = Math.min(Math.max(total / SCALE_MAX, 0), 1) * 100

  return (
    <Column gap="large">
      <Column gap="small">
        <Heading level={2}>Puntentelling</Heading>
        <Paragraph>
          <span className={styles.score}>{formatPunten(total)}</span> punten
        </Paragraph>
        <Paragraph>
          Deze woning valt in de <strong>{segment.name.toLowerCase()}</strong> (
          {formatRange(segment)}).
        </Paragraph>
      </Column>

      {/* Decorative: the sentence above already says which segment it is. */}
      <div className={styles.segmentBar} aria-hidden>
        <div className={styles.track}>
          {HUURSEGMENTEN.map((s, index) => (
            <div
              key={s.name}
              className={styles.segment}
              data-segment={index}
              style={{
                flexGrow: (Math.min(s.to, SCALE_MAX) - s.from + 1) / SCALE_MAX,
              }}
            />
          ))}
        </div>
        <div
          className={styles.marker}
          style={{ "--position": `${position}%` } as CSSProperties}
        />
      </div>

      <Row wrap>
        {HUURSEGMENTEN.map((s, index) => (
          <Row key={s.name} alignVertical="center" gap="small">
            <span className={styles.swatch} data-segment={index} />
            <Paragraph size="small">
              {s === segment ? (
                <strong>
                  {s.name} · {formatRange(s)}
                </strong>
              ) : (
                <>
                  {s.name} · {formatRange(s)}
                </>
              )}
            </Paragraph>
          </Row>
        ))}
      </Row>
    </Column>
  )
}

/** How the total came about: every rubriek, each correction the backend applied, the total. */
export function BerekeningCard({ resultaat }: Props) {
  const applied = correcties(resultaat)
  const rows: {
    key: string
    label: string
    note?: string
    punten: string
    /** Shown in bold, like the total. */
    strong?: boolean
  }[] = [
    ...rubrieken(resultaat).map(({ name, label, punten }) => ({
      key: name,
      label,
      punten: formatPunten(punten),
    })),
    {
      key: "subtotaal",
      label: "Subtotaal",
      punten: formatPunten(resultaat.totaal_punten_bruto),
      strong: true,
    },
    ...applied.map(({ label, note, punten }) => ({
      key: label,
      label,
      note,
      punten: formatDifference(punten),
    })),
    ...(applied.length === 0
      ? [
          {
            key: "correcties",
            label: "Correcties",
            note: "Geen correcties toegepast",
            punten: formatDifference(0),
          },
        ]
      : []),
  ]

  return (
    <Column gap="large">
      <Heading level={2}>Berekening</Heading>
      <Table>
        <Table.Caption className="ams-visually-hidden">
          Berekening van de punten
        </Table.Caption>
        <Table.Header className="ams-visually-hidden">
          <Table.Row>
            <Table.HeaderCell>Onderdeel</Table.HeaderCell>
            <Table.HeaderCell align="end">Punten</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(({ key, label, note, punten, strong }) => (
            <Table.Row key={key}>
              {strong ? (
                <Table.HeaderCell scope="row">{label}</Table.HeaderCell>
              ) : (
                <Table.Cell>
                  {label}
                  {note && <Paragraph size="small">{note}</Paragraph>}
                </Table.Cell>
              )}
              <Table.Cell align="end">
                {strong ? <strong>{punten}</strong> : punten}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell scope="row">Totaal</Table.HeaderCell>
            <Table.Cell align="end">
              <strong>{formatPunten(resultaat.totaal_punten_na_caps)}</strong>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Column>
  )
}
