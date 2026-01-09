import { Alert, Paragraph } from "@amsterdam/design-system-react"
import { SelectControl } from "@amsterdam/ee-ads-rhf-lib"

const TEAM_LABELS = ["Toezichthouder 1", "Toezichthouder 2", "Handhaver"]

type Option = {
  label: string
  value: string
}

type Props = {
  teamMembers: string[] | undefined
  userOptions: Option[]
  currentUserId?: string
  showCurrentUserWarning?: boolean
}

export function TeamMembersFields({
  teamMembers,
  userOptions,
  currentUserId,
  showCurrentUserWarning = false,
}: Props) {
  const filteredUserOptions = (excludeIds: (string | undefined)[] = []) =>
    userOptions.filter(
      (option) => !excludeIds.includes(option.value) || option.value === "",
    )

  const isCurrentUserMissing =
    showCurrentUserWarning &&
    !!currentUserId &&
    Array.isArray(teamMembers) &&
    !teamMembers.includes(currentUserId)

  return (
    <>
      {isCurrentUserMissing && (
        <Alert
          heading="Teamlid ontbreekt"
          headingLevel={2}
          severity="warning"
          className="ams-mb-l"
        >
          <Paragraph>
            Let op: je staat niet langer als teamlid ingesteld. Na het opslaan
            vervalt je toegang tot deze lijst.
          </Paragraph>
        </Alert>
      )}
      {TEAM_LABELS.map((label, index) => (
        <SelectControl
          key={label}
          label={label}
          name={`teamMembers.${index}`}
          options={filteredUserOptions(
            teamMembers?.filter((_, i) => i !== index),
          )}
          registerOptions={{
            required: `${label} is verplicht`,
          }}
          className="ams-mb-l"
        />
      ))}
    </>
  )
}
