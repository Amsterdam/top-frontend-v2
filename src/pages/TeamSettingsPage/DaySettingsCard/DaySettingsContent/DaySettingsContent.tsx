import { PriorityTag, StatusTag, Tag } from "@/components"
import type { TeamSettingsOptions } from "../../types"
import {
  Column,
  Heading,
  Paragraph,
  Row,
  UnorderedList,
} from "@amsterdam/design-system-react"
import { formatDate } from "@/shared/dateFormatters"
import { mapIdsToNames, mapIdsToObjects } from "../utils"
import styles from "./DaySettingsContent.module.css"

const GAP_TAGS = "small"

type Props = {
  daySetting: DaySettings
  teamSettingsOptions: TeamSettingsOptions
}

function InfoRow({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.item}>
      <Column gap={GAP_TAGS}>
        <Heading level={4}>{title}</Heading>
        {children}
      </Column>
    </div>
  )
}

function renderNamesList(names: string[]) {
  if (!names.length) return <Paragraph>-</Paragraph>

  return (
    <UnorderedList>
      {names.map((name) => (
        <UnorderedList.Item key={name}>{name}</UnorderedList.Item>
      ))}
    </UnorderedList>
  )
}

export default function DaySettingsContent({
  daySetting,
  teamSettingsOptions,
}: Props) {
  const isThemeOnderhuur = daySetting?.team_settings?.name === "Onderhuur"

  const housingCorporationNames = mapIdsToNames(
    daySetting.housing_corporations,
    teamSettingsOptions.housingCorporations,
  )

  const reasonNames = mapIdsToNames(
    daySetting.reasons,
    teamSettingsOptions.reasons,
  )

  const projectNames = mapIdsToNames(
    daySetting.project_ids,
    teamSettingsOptions.caseProjects,
  )

  const subjectNames = mapIdsToNames(
    daySetting.subjects,
    teamSettingsOptions.subjects,
  )

  const tagNames = mapIdsToNames(daySetting.tags, teamSettingsOptions.tags)

  const districtNames = mapIdsToNames(
    daySetting.districts,
    teamSettingsOptions.districts,
  )

  const stateTypeNames = mapIdsToNames(
    daySetting.state_types,
    teamSettingsOptions.stateTypes,
  )

  const daySegments = mapIdsToNames(
    daySetting?.day_segments,
    teamSettingsOptions?.scheduleTypes?.day_segments,
  )

  const weekSegments = mapIdsToNames(
    daySetting?.week_segments,
    teamSettingsOptions?.scheduleTypes?.week_segments,
  )

  const priorities = mapIdsToObjects(
    daySetting?.priorities,
    teamSettingsOptions?.scheduleTypes?.priorities,
  )

  return (
    <div className={styles.masonry}>
      <InfoRow title="Openingsdatum">
        <Paragraph>
          {formatDate(daySetting.opening_date, "D MMM YYYY", "-")}
        </Paragraph>
      </InfoRow>

      {isThemeOnderhuur && (
        <>
          <InfoRow title="Samenlopen met een corporatie">
            <Paragraph>
              {daySetting.housing_corporation_combiteam ? "Ja" : "Nee"}
            </Paragraph>
          </InfoRow>

          <InfoRow title="Corporaties">
            {renderNamesList(housingCorporationNames)}
          </InfoRow>
        </>
      )}

      {daySetting?.postal_code_ranges?.length > 0 && (
        <InfoRow title="Postcodes">
          {daySetting.postal_code_ranges.map((range) => (
            <Paragraph key={`${range.range_start}-${range.range_end}`}>
              {`${range.range_start} - ${range.range_end}`}
            </Paragraph>
          ))}
        </InfoRow>
      )}

      {districtNames.length > 0 && (
        <InfoRow title="Stadsdelen">
          <Row wrap gap={GAP_TAGS}>
            {districtNames.map((name) => (
              <Tag key={name} color="grey" name={name} />
            ))}
          </Row>
        </InfoRow>
      )}

      <InfoRow title="Openingsredenen">{renderNamesList(reasonNames)}</InfoRow>

      {projectNames.length > 0 && (
        <InfoRow title="Projecten">{renderNamesList(projectNames)}</InfoRow>
      )}

      {subjectNames.length > 0 && (
        <InfoRow title="Onderwerpen">{renderNamesList(subjectNames)}</InfoRow>
      )}

      {tagNames.length > 0 && (
        <InfoRow title="Tags">
          <Row wrap gap={GAP_TAGS}>
            {tagNames.map((name) => (
              <Tag key={name} name={name} color="grey" />
            ))}
          </Row>
        </InfoRow>
      )}

      <InfoRow title="Statussen">
        <Row wrap gap={GAP_TAGS}>
          {stateTypeNames.map((name) => (
            <StatusTag key={name} statusName={name} />
          ))}
        </Row>
      </InfoRow>

      {(daySegments.length > 0 || weekSegments.length > 0) && (
        <InfoRow title="Dagdelen & Weekdelen">
          <Row wrap gap={GAP_TAGS}>
            {daySegments.map((name) => (
              <Tag
                key={name}
                name={name}
                color={name === "Overdag" ? "orange" : "blue"}
              />
            ))}
            {weekSegments.map((name) => (
              <Tag
                key={name}
                name={name}
                color={name === "Doordeweeks" ? "green" : "red"}
              />
            ))}
          </Row>
        </InfoRow>
      )}

      {priorities.length > 0 && (
        <InfoRow title="Prioriteiten">
          <Row wrap gap={GAP_TAGS}>
            {priorities.map((priority) => (
              <PriorityTag
                key={priority.id}
                priority={priority as unknown as { weight: number }}
                showNormalPriority
              />
            ))}
          </Row>
        </InfoRow>
      )}
    </div>
  )
}
