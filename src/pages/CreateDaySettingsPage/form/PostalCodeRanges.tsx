import { useFieldArray, useFormContext } from "react-hook-form"
import { Row, Column, Button, Paragraph } from "@amsterdam/design-system-react"
import { DeleteIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"
import { usePostalCodeValidation } from "./postalCodeRangeValidation"
import type { FormValues } from "./types"

type PostalCodeRangesProps = {
  name: "postal_code_ranges"
}

export function PostalCodeRanges({ name }: PostalCodeRangesProps) {
  const form = useFormContext<FormValues>()
  const { control, formState } = form

  usePostalCodeValidation(form)

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <div>
      {fields.map((field, index) => {
        const startError =
          formState.errors.postal_code_ranges?.[index]?.range_start?.message
        const endError =
          formState.errors.postal_code_ranges?.[index]?.range_end?.message
        const rowLevelError =
          formState.errors.postal_code_ranges?.[index]?.message

        const rowError = startError || endError || rowLevelError

        return (
          <div key={field.id} className="mb-3">
            <Row>
              <Column>
                <TextInputControl<FormValues>
                  label="Van"
                  inputMode="numeric"
                  name={`postal_code_ranges.${index}.range_start` as const}
                  pattern="[0-9]*"
                  size={6}
                  hideErrorMessage
                  registerOptions={{
                    required: "Vul een startpostcode in. ",
                    min: {
                      value: 1000,
                      message: "De startpostcode moet minimaal 1000 zijn. ",
                    },
                    max: {
                      value: 1384,
                      message: "De startpostcode mag maximaal 1384 zijn. ",
                    },
                  }}
                />
              </Column>
              <Column>
                <TextInputControl<FormValues>
                  label="Tot en met"
                  inputMode="numeric"
                  name={`postal_code_ranges.${index}.range_end` as const}
                  pattern="[0-9]*"
                  size={6}
                  hideErrorMessage
                  registerOptions={{
                    required: "Vul een eindpostcode in. ",
                    min: {
                      value: 1000,
                      message: "De eindpostcode moet minimaal 1000 zijn. ",
                    },
                    max: {
                      value: 1384,
                      message: "De eindpostcode mag maximaal 1384 zijn. ",
                    },
                  }}
                />
              </Column>
              <Column align="end">
                <Button
                  variant="secondary"
                  icon={DeleteIcon}
                  iconBefore
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                />
              </Column>
            </Row>
            {rowError && (
              <Paragraph
                style={{
                  color: "var(--ams-color-feedback-error)",
                  marginTop: 4,
                }}
              >
                {rowLevelError || startError || endError}
              </Paragraph>
            )}
          </div>
        )
      })}
      <Button
        icon={PlusIcon}
        iconBefore
        onClick={() => append({ range_start: undefined, range_end: undefined })}
      >
        Voeg rij toe
      </Button>
    </div>
  )
}
