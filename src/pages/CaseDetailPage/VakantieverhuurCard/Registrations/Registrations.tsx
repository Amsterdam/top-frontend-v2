import { Column, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  BedIcon,
  CalendarIcon,
  DocumentCheckMarkIcon,
  MailIcon,
  PersonIcon,
} from "@amsterdam/design-system-react-icons"
import { HeadingWithIcon } from "@/components"
import { formatDate } from "@/shared"
import styles from "./Registrations.module.css"

type Props = {
  registrations?: Registration[]
}

function getFullName(
  personalDetails: Registration["requester"]["personalDetails"],
): string {
  const { firstName, lastNamePrefix, lastName } = personalDetails

  if (lastNamePrefix) {
    return `${firstName} ${lastNamePrefix} ${lastName}`
  }

  return `${firstName} ${lastName}`
}

function Registrations({ registrations }: Props) {
  return (
    <div className="mb-4">
      <Row wrap className="mb-2">
        <HeadingWithIcon
          label={`Registraties (${registrations?.length ?? 0})`}
          svg={DocumentCheckMarkIcon}
          level={4}
        />
      </Row>
      {!registrations ||
        (registrations.length === 0 && (
          <Paragraph>Geen registraties gevonden.</Paragraph>
        ))}
      {registrations?.map((reg) => (
        <Column key={reg.registrationNumber} gap="small" className="mb-4">
          <Row wrap>
            <span className={styles.registrationNumber}>
              {reg.registrationNumber}
            </span>
          </Row>
          <Row>
            <Icon svg={PersonIcon} title="Volledige naam" />
            <Paragraph>
              {getFullName(reg?.requester?.personalDetails)}
            </Paragraph>
          </Row>
          <Row>
            <Icon svg={MailIcon} title="E-mailadres" />
            <Paragraph>{reg?.requester?.email}</Paragraph>
          </Row>
          <Row>
            <Icon svg={CalendarIcon} title="Aangemaakt" />
            <Paragraph>Aangemaakt: {formatDate(reg?.createdAt)}</Paragraph>
          </Row>
          <Row>
            <Icon svg={CalendarIcon} title="Overeenkomst" />
            <Paragraph>Overeenkomst: {formatDate(reg?.createdAt)}</Paragraph>
          </Row>
          <Row>
            <Icon svg={BedIcon} title="B&B" />
            <Paragraph>
              B&B: {reg.requestForBedAndBreakfast ? "Ja" : "Nee"}
            </Paragraph>
          </Row>
        </Column>
      ))}
    </div>
  )
}

export default Registrations
