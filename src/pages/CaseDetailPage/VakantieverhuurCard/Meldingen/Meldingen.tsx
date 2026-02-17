import { Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  DeleteIcon,
  NotificationIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"
import dayjs from "dayjs"
import { formatDate } from "@/shared/dateFormatters"
import { Divider, HeadingWithIcon } from "@/components"
import styles from "./Meldingen.module.css"

type Props = {
  meldingen?: Melding[]
}

export default function Meldingen({ meldingen }: Props) {
  const startDate = dayjs().subtract(1, "year").startOf("year").format()

  const totalNights = meldingen?.reduce(
    (total, { nachten }) => total + nachten,
    0,
  )

  return (
    <>
      <Row align="between" wrap className="mb-2">
        <HeadingWithIcon
          label={`Meldingen (${meldingen?.length ?? 0})`}
          svg={NotificationIcon}
          level={4}
        />
        <Paragraph size="small">
          {totalNights} nachten sinds {formatDate(startDate, "D MMM YYYY")}
        </Paragraph>
      </Row>
      {!meldingen ||
        (meldingen.length === 0 && (
          <Paragraph>Geen meldingen gevonden.</Paragraph>
        ))}
      <div className={styles.meldingen}>
        {meldingen?.map((melding, index) => (
          <div key={melding.gemaaktOp} className={styles.melding}>
            <Row>
              <strong>
                {formatDate(melding.startDatum, "D MMM")} -{" "}
                {formatDate(melding.eindDatum, "D MMM")}
              </strong>
              {melding.isAangepast && (
                <Icon
                  svg={PencilIcon}
                  title="Aangepast"
                  className={styles.iconOrange}
                />
              )}
              {melding.isVerwijderd && (
                <Icon
                  svg={DeleteIcon}
                  title="Verwijderd"
                  className={styles.iconRed}
                />
              )}
            </Row>
            <Paragraph size="small">
              {melding.nachten} Nacht{melding.nachten !== 1 ? "en" : ""} -{" "}
              {melding.gasten} Gast{melding.gasten !== 1 ? "en" : ""}
            </Paragraph>
            <Paragraph size="small">
              Gemaakt op {formatDate(melding.gemaaktOp, "DD MMM, HH:mm")}
            </Paragraph>
            {index < meldingen.length - 1 && (
              <Divider noMarginBottom margin="medium" />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
