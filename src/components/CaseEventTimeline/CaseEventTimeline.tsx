import { useMemo, useState } from "react"
import {
  ProgressList,
  Button,
  Row,
  Heading,
} from "@amsterdam/design-system-react"
import { MinusIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { Description, Divider } from "@/components"
import { EVENT_CONFIG } from "./config/eventConfig"
import { buildDescriptionData } from "./utils/buildDescriptionData"
import styles from "./CaseEventTimeline.module.css"

export function CaseEventTimeline({ data }: { data?: CaseEvent[] }) {
  const [showAll, setShowAll] = useState(false)

  // Sort events by ID descending
  const events = useMemo(
    () => (data ? [...data].sort((a, b) => b.id - a.id) : []),
    [data],
  )

  const visibleEvents = showAll ? events : events.slice(0, 1)

  // Count total occurrences per type (excluding GENERIC_TASK)
  const totalCountPerType = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const event of events) {
      if (event.type === "GENERIC_TASK") continue
      counts[event.type] = (counts[event.type] ?? 0) + 1
    }

    return counts
  }, [events])

  // Group only consecutive events with the same type (except GENERIC_TASK)
  const groupedEvents = useMemo(() => {
    const groups: CaseEvent[][] = []
    let currentGroup: CaseEvent[] = []

    for (const event of visibleEvents) {
      if (currentGroup.length === 0) {
        currentGroup.push(event)
        continue
      }

      const prevEvent = currentGroup[currentGroup.length - 1]

      if (event.type === prevEvent.type && event.type !== "GENERIC_TASK") {
        currentGroup.push(event)
      } else {
        groups.push(currentGroup)
        currentGroup = [event]
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }, [visibleEvents])

  return (
    <>
      <ProgressList headingLevel={3}>
        {groupedEvents.map((group, groupIndex) => {
          const firstEvent = group[0]
          const config = EVENT_CONFIG[firstEvent.type]
          if (!config) return null

          const baseTitle =
            typeof config.title === "function"
              ? config.title(firstEvent)
              : config.title

          const stepCount =
            firstEvent.type === "GENERIC_TASK" ? 0 : group.length

          const totalCount = totalCountPerType[firstEvent.type] ?? 0

          const title =
            totalCount > 1 && stepCount > 0
              ? `${baseTitle} (${stepCount}/${totalCount})`
              : baseTitle

          // Single event or GENERIC_TASK → normal Step
          if (group.length === 1 || firstEvent.type === "GENERIC_TASK") {
            const event = firstEvent
            const descriptionData = buildDescriptionData(event, config)

            return (
              <ProgressList.Step
                key={event.id}
                heading={title}
                status={groupIndex === 0 ? "current" : "completed"}
              >
                <Description
                  data={descriptionData}
                  termsWidth="medium"
                  className="mt-4"
                />
                <Divider className={styles.customDivider} />
              </ProgressList.Step>
            )
          }

          // Multiple consecutive events → Step with Substeps
          return (
            <ProgressList.Step
              key={firstEvent.id}
              heading={title}
              status={groupIndex === 0 ? "current" : "completed"}
              hasSubsteps
            >
              <ProgressList.Substeps>
                {group.map((event) => {
                  const descriptionData = buildDescriptionData(event, config)

                  const dateItem = descriptionData.find(
                    (item) => item.label === "Datum",
                  )

                  const rest = descriptionData.filter(
                    (item) => item.label !== "Datum",
                  )

                  return (
                    <ProgressList.Substep key={event.id} status="completed">
                      {dateItem && (
                        <Heading level={3} className="mb-3">
                          {dateItem.value}
                        </Heading>
                      )}

                      <Description
                        data={rest}
                        termsWidth="medium"
                        className="mt-4"
                      />
                      <Divider className={styles.customDivider} />
                    </ProgressList.Substep>
                  )
                })}
              </ProgressList.Substeps>
            </ProgressList.Step>
          )
        })}
      </ProgressList>

      <Row align="center" className="mt-3">
        {events.length > 1 && (
          <Button
            variant="secondary"
            onClick={() => setShowAll((prev) => !prev)}
            icon={showAll ? MinusIcon : PlusIcon}
            iconBefore
          >
            {showAll ? "Toon minder" : "Toon meer"}
          </Button>
        )}
      </Row>
    </>
  )
}
