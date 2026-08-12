import {
  Column,
  Heading,
  Icon,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  CalendarIcon,
  CertificateIcon,
  DocumentCheckMarkIcon,
  MailIcon,
  PersonIcon,
} from "@amsterdam/design-system-react-icons"
import { HeadingWithIcon } from "@/components"
import { formatDate } from "@/shared"

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
    <Column gap="large">
      {!registrations ||
        (registrations.length === 0 && (
          <Paragraph>Geen registraties gevonden.</Paragraph>
        ))}
      {registrations?.map((reg) => (
        <Column as="article" key={reg.registrationNumber} gap="small">
          <Row>
            <Icon
              svg={CertificateIcon}
              size="heading-4"
              title="Registratienummer"
            />
            <Heading level={4}>{reg.registrationNumber}</Heading>
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
    </Column>
  )
}

export default Registrations
