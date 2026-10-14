import type { CSSProperties } from "react"
import {
  Column,
  Heading,
  Paragraph,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import { HUURSEGMENTEN, huursegment, type Huursegment } from "./berekening"
import styles from "./StepResultaat.module.css"

const formatPunten = (punten: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(punten)

const formatEuro = (bedrag: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
    bedrag,
  )

// Where the segment bar ends; a higher score pins the marker to the end.
const SCALE_MAX = 250

const formatRange = ({ from, to }: Huursegment) =>
  to === Infinity ? `${from} punten of meer` : `${from} t/m ${to} punten`

type Props = {
  resultaat: PuntentellerResultaat
}

/** The puntentotaal, with a segment bar showing its huursegment. */
export function ScoreCard({ resultaat }: Props) {
  const total = resultaat.totaal_punten
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
        {resultaat.maximale_huurprijs && (
          <Paragraph>
            Maximale huurprijs:{" "}
            <strong>{formatEuro(resultaat.maximale_huurprijs.bedrag)}</strong>{" "}
            per maand
            {resultaat.maximale_huurprijs.met_opslagen !==
              resultaat.maximale_huurprijs.bedrag && (
              <>
                , met opslagen{" "}
                <strong>
                  {formatEuro(resultaat.maximale_huurprijs.met_opslagen)}
                </strong>
              </>
            )}
            .
          </Paragraph>
        )}
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

/** How the total came about: every rubriek and opslag with its regels, then the total. */
export function BerekeningCard({ resultaat }: Props) {
  return (
    <Column gap="large">
      <Heading level={2}>Berekening</Heading>
      {[...resultaat.rubrieken, ...resultaat.opslagen].map((rubriek, index) => (
        <Table key={`${rubriek.naam}-${index}`}>
          <Table.Caption>{rubriek.naam}</Table.Caption>
          <Table.Header className="ams-visually-hidden">
            <Table.Row>
              <Table.HeaderCell>Onderdeel</Table.HeaderCell>
              <Table.HeaderCell align="end">Punten</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rubriek.regels.map((regel, regelIndex) => (
              <Table.Row key={regelIndex}>
                <Table.Cell>
                  {regel.ruimte ? `${regel.ruimte}: ` : ""}
                  {regel.omschrijving}
                  {regel.aantal !== null && regel.factor !== null && (
                    <Paragraph size="small">
                      {formatPunten(regel.aantal)} ×{" "}
                      {formatPunten(regel.factor)}
                    </Paragraph>
                  )}
                </Table.Cell>
                <Table.Cell align="end" className={styles.punten}>
                  {formatPunten(regel.punten)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell scope="row">Subtotaal</Table.HeaderCell>
              <Table.Cell align="end" className={styles.punten}>
                <strong>{formatPunten(rubriek.punten)}</strong>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      ))}
      <Table>
        <Table.Caption className="ams-visually-hidden">
          Totaal aantal punten
        </Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell scope="row">Totaal</Table.HeaderCell>
            <Table.Cell align="end" className={styles.punten}>
              <strong>{formatPunten(resultaat.totaal_punten)}</strong>
            </Table.Cell>
          </Table.Row>
          {resultaat.huurprijsopslagen.map(({ naam, procent }) => (
            <Table.Row key={naam}>
              <Table.Cell>Huurprijsopslag {naam}</Table.Cell>
              <Table.Cell align="end" className={styles.punten}>
                {formatPunten(procent)}%
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Column>
  )
}
