import { useId, type CSSProperties } from "react"
import {
  Column,
  Heading,
  Paragraph,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import { formatDate } from "@/shared/dateFormatters"
import { toNumber } from "../helpers/oppervlakte"
import { HUURSEGMENTEN, huursegment, type Huursegment } from "./berekening"
import styles from "./StepResultaat.module.css"

// With a real minus sign (U+2212) instead of the hyphen Intl gives: it reads better next to
// the digits, and screen readers read it as "min".
const formatPunten = (punten: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 })
    .format(punten)
    .replace("-", "\u2212")

const formatEuro = (bedrag: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
    bedrag,
  )

// Where the segment bar ends; a higher score pins the marker to the end.
const SCALE_MAX = 250

const formatRange = ({ from, to }: Huursegment) =>
  to === Infinity ? `${from} punten of meer` : `${from} t/m ${to} punten`

/** Every rubriek and opslag, in the order the backend gives them. */
const allRubrieken = (resultaat: PuntentellerResultaat) => [
  ...resultaat.rubrieken,
  ...resultaat.opslagen,
]

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

/**
 * The maximale huurprijs, large like the puntentotaal, and the huurprijstabel it comes from.
 * With huurprijsopslagen, a table below adds it up: the basishuurprijs plus each opslag in
 * euro's. Includes the current rent and its difference from the maximum.
 */
export function HuurprijsCard({
  resultaat,
  huidigeHuurprijs,
}: Props & {
  huidigeHuurprijs?: GebruikersinvoerFormValues["huidige_huurprijs"]
}) {
  const { maximale_huurprijs: huurprijs, huurprijsopslagen } = resultaat
  const huidige = toNumber(huidigeHuurprijs)
  const verschil =
    huidige !== null && huurprijs ? huurprijs.met_opslagen - huidige : null
  const richting = verschil !== null && verschil < 0 ? "boven" : "onder"

  // The backend only gives the total in euro's; split it over the opslagen by their procent,
  // so the regels add up to it exactly.
  const opslagBedrag = huurprijs ? huurprijs.met_opslagen - huurprijs.bedrag : 0
  const opslagProcent = huurprijsopslagen.reduce((sum, o) => sum + o.procent, 0)

  return (
    <Column gap="large">
      <div className={styles.huurprijsColumns}>
        <Column gap="small">
          <Heading level={2}>Maximale huurprijs</Heading>
          {huurprijs ? (
            <>
              <Paragraph>
                <span className={styles.bedrag}>
                  {formatEuro(huurprijs.met_opslagen)}
                </span>{" "}
                per maand
              </Paragraph>
              <Paragraph>
                Volgens de huurprijstabel van{" "}
                {formatDate(huurprijs.prijspeil, "D MMMM YYYY")}.
              </Paragraph>
            </>
          ) : (
            <Paragraph>
              Er is geen maximale huurprijs beschikbaar. Een vergelijking is
              niet mogelijk.
            </Paragraph>
          )}
        </Column>

        <Column gap="small">
          {huidige !== null && huidige !== 0 && (
            <>
              <Heading level={2}>Huidige huurprijs</Heading>
              {huidige < 0 ? (
                <Paragraph>
                  Vul bij Woning een geldige huurprijs van 0 euro of meer in.
                </Paragraph>
              ) : (
                <>
                  <Paragraph>
                    <span className={styles.bedrag}>{formatEuro(huidige)}</span>{" "}
                    per maand
                  </Paragraph>
                  {huurprijs && verschil !== null && (
                    <>
                      <Paragraph>
                        {verschil === 0
                          ? "Huidige huur is gelijk aan de maximale huurprijs."
                          : `Huidige huur ligt ${formatEuro(Math.abs(verschil))} ${richting} de maximale huurprijs.`}
                        {huurprijs.met_opslagen > 0 && verschil !== 0 && (
                          <>
                            {" "}
                            {new Intl.NumberFormat("nl-NL", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(
                              (Math.abs(verschil) / huurprijs.met_opslagen) * 100,
                            )}
                            % {richting}{" "}maximum.
                          </>
                        )}
                      </Paragraph>
                      {huurprijs.met_opslagen === 0 && (
                        <Paragraph>
                          Het verschil in percentage kan niet worden berekend
                          bij een maximale huurprijs van 0 euro.
                        </Paragraph>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Column>
      </div>

      {huurprijs && huurprijsopslagen.length > 0 && (
        <Table className={styles.fullWidth}>
          <Table.Caption className="ams-visually-hidden">
            Opbouw maximale huurprijs
          </Table.Caption>
          <Table.Header className="ams-visually-hidden">
            <Table.Row>
              <Table.HeaderCell>Onderdeel</Table.HeaderCell>
              <Table.HeaderCell align="end">Bedrag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Basishuurprijs ({formatPunten(resultaat.totaal_punten)} punten)
              </Table.Cell>
              <Table.Cell align="end" className={styles.punten}>
                {formatEuro(huurprijs.bedrag)}
              </Table.Cell>
            </Table.Row>
            {huurprijsopslagen.map(({ naam, procent }) => (
              <Table.Row key={naam}>
                <Table.Cell>
                  Opslag {naam} ({formatPunten(procent)}%)
                </Table.Cell>
                <Table.Cell align="end" className={styles.punten}>
                  +{" "}
                  {formatEuro(
                    opslagProcent
                      ? (opslagBedrag * procent) / opslagProcent
                      : 0,
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell scope="row">Totaal per maand</Table.HeaderCell>
              <Table.Cell align="end" className={styles.punten}>
                <strong>{formatEuro(huurprijs.met_opslagen)}</strong>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </Column>
  )
}

/**
 * The subtotal of every rubriek at a glance, including the ones without punten, so it shows
 * what didn't count too.
 */
export function PuntenopbouwCard({ resultaat }: Props) {
  return (
    <Table className={styles.fullWidth}>
      <Table.Caption>
        <Heading level={2}>Puntenopbouw</Heading>
      </Table.Caption>
      <Table.Header className="ams-visually-hidden">
        <Table.Row>
          <Table.HeaderCell>Rubriek</Table.HeaderCell>
          <Table.HeaderCell align="end">Punten</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {allRubrieken(resultaat).map((rubriek, index) => (
          <Table.Row key={`${rubriek.naam}-${index}`}>
            <Table.Cell>{rubriek.naam}</Table.Cell>
            <Table.Cell align="end" className={styles.punten}>
              {formatPunten(rubriek.punten)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell scope="row">Totaal</Table.HeaderCell>
          <Table.Cell align="end" className={styles.punten}>
            <strong>{formatPunten(resultaat.totaal_punten)}</strong>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

/**
 * One regel's label, with its berekening inline. Without one when the factor is 1: then the
 * aantal is the punten already.
 */
function RegelLabel({ regel }: { regel: PuntentellerRegel }) {
  const { ruimte, omschrijving, aantal, factor } = regel

  return (
    <>
      {ruimte ? `${ruimte}: ` : ""}
      {omschrijving}
      {aantal !== null && factor !== null && factor !== 1 && (
        <span>{` (${formatPunten(aantal)} × ${formatPunten(factor)})`}</span>
      )}
    </>
  )
}

/**
 * A rubriek in a white block of its own (ams-grid__cell, the block a Grid.Cell is): its
 * regels with the subtotal below them. Nothing for a rubriek without regels, not even the
 * block.
 */
function Rubriek({ rubriek }: { rubriek: PuntentellerRubriek }) {
  const headingId = useId()
  const isLeeg = rubriek.regels.length === 0

  if (isLeeg) {
    return null
  }

  return (
    <section aria-labelledby={headingId} className="ams-grid__cell">
      <Table className={styles.fullWidth} aria-labelledby={headingId}>
        <Table.Caption>
          <Heading level={3}>{rubriek.naam}</Heading>
        </Table.Caption>
        <Table.Header className="ams-visually-hidden">
          <Table.Row>
            <Table.HeaderCell>Onderdeel</Table.HeaderCell>
            <Table.HeaderCell align="end">Punten</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rubriek.regels.map((regel, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <RegelLabel regel={regel} />
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
    </section>
  )
}

/**
 * How the total came about: every rubriek and opslag with its regels, then the total, each in
 * a white block of its own on the grey background.
 */
export function BerekeningCard({ resultaat }: Props) {
  return (
    <Column gap="large">
      <Heading level={2}>Berekening</Heading>
      {allRubrieken(resultaat).map((rubriek, index) => (
        <Rubriek key={`${rubriek.naam}-${index}`} rubriek={rubriek} />
      ))}
      <div className="ams-grid__cell">
        <Row align="between">
          <Heading level={2}>Totaal</Heading>
          <Heading level={2}>
            {formatPunten(resultaat.totaal_punten)} punten
          </Heading>
        </Row>
      </div>
    </Column>
  )
}
