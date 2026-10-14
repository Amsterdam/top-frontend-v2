import { cleanup, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { afterEach, describe, expect, it } from "vitest"
import { UnsavedChangesAlert } from "../components/UnsavedChangesAlert"
import { mapFormValuesToPayload } from "../helpers/mapFormValuesToPayload"

const VALUES = {
  binnenruimtes: [],
  buitenruimtes: [],
  bouwjaar: 1977,
} as unknown as GebruikersinvoerFormValues

const RESUBMIT = "Wijzigingen opslaan en herberekenen"

function Harness({ savedPayload }: { savedPayload?: string }) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: VALUES })
  return (
    <FormProvider {...form}>
      <UnsavedChangesAlert savedPayload={savedPayload} />
    </FormProvider>
  )
}

describe("UnsavedChangesAlert", () => {
  afterEach(cleanup)

  it("warns and offers to save again once the form differs from the last save", () => {
    render(<Harness savedPayload="{}" />)

    expect(
      screen.getByRole("heading", { name: "Dit resultaat is niet actueel" }),
    ).toBeDefined()
    expect(screen.getByRole("button", { name: RESUBMIT })).toBeDefined()
  })

  it("shows nothing while the form is as it was saved", () => {
    render(
      <Harness savedPayload={JSON.stringify(mapFormValuesToPayload(VALUES))} />,
    )

    expect(screen.queryByRole("button", { name: RESUBMIT })).toBeNull()
  })

  it("shows nothing before the first save", () => {
    render(<Harness />)

    expect(screen.queryByRole("button", { name: RESUBMIT })).toBeNull()
  })
})
