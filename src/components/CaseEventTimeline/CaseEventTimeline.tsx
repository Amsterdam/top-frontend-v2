import { useMemo, useState } from "react"
import {
  ProgressList,
  Button,
  Row,
  Heading,
} from "@amsterdam/design-system-react"
import { MinusIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { Description, type DescriptionItem } from "@/components"
import { renderValue } from "./utils/renderValue"
import { EVENT_CONFIG } from "./config/eventConfig"

function buildDescriptionData(
  event: CaseEvent,
  config: (typeof EVENT_CONFIG)[string],
): DescriptionItem[] {
  const baseData = config.fields
    .map((field) => {
      const value = renderValue(
        field.value(event),
        field.label === "start_time" ? "time" : undefined,
      )
      if (value === undefined) return null
      return { label: field.label, value }
    })
    .filter(Boolean) as DescriptionItem[]

  // Add "Datum" field for VISIT events
  if (event.type === "VISIT") {
    const startTime = event.event_values.start_time
    const dateValue = renderValue(startTime)

    if (dateValue !== undefined) {
      return [{ label: "Datum", value: dateValue }, ...baseData]
    }
  }

  return baseData
}

export function CaseEventTimeline({ data }: { data?: CaseEvent[] }) {
  const [showAll, setShowAll] = useState(true)

  // Sort events by ID descending
  const events = useMemo(
    () => (data ? [...data].sort((a, b) => b.id - a.id) : []),
    [data],
  )

  const visibleEvents = showAll ? events : events.slice(0, 1)

  // Group consecutive events with the same type, except GENERIC_TASK
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
        // Add consecutive and not GENERIC_TASK → add to group
        currentGroup.push(event)
      } else {
        // TYPE changed or GENERIC_TASK → push current group and start new group
        groups.push(currentGroup)
        currentGroup = [event]
      }
    }

    if (currentGroup.length > 0) groups.push(currentGroup)

    return groups
  }, [visibleEvents])

  return (
    <>
      <ProgressList headingLevel={3}>
        {groupedEvents.map((group, groupIndex) => {
          const firstEvent = group[0]
          const config = EVENT_CONFIG[firstEvent.type]
          if (!config) return null

          const title =
            typeof config.title === "function"
              ? config.title(firstEvent)
              : config.title

          //  If group contains only 1 event or type is GENERIC_TASK → only Step
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
                  termsWidth="narrow"
                  className="mb-3"
                />
              </ProgressList.Step>
            )
          }

          // Group multiple consecutive events → Step + Substeps
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
                        termsWidth="narrow"
                        className="mb-3"
                      />
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
