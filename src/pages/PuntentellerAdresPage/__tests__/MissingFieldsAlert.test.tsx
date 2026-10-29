import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { FormProvider } from "@amsterdam/ee-ads-rhf"
import { useForm } from "react-hook-form"
import { afterEach, describe, expect, it, vi } from "vitest"
import { MissingFieldsAlert } from "../components/MissingFieldsAlert"
import type { MissingField } from "../helpers/findMissingFields"

function Harness({
  values,
  onGoToField = vi.fn(),
}: {
  values: Partial<GebruikersinvoerFormValues>
  onGoToField?: (field: MissingField) => void
}) {
  const form = useForm<GebruikersinvoerFormValues>({ defaultValues: values })
  return (
    <FormProvider form={form} onSubmit={vi.fn()}>
      <MissingFieldsAlert onGoToField={onGoToField} />
    </FormProvider>
  )
}

/** Values with every required field filled in. */
const COMPLETE_VALUES: Partial<GebruikersinvoerFormValues> = {
  binnenruimtes: [],
  buitenruimtes: [],
  woz_peildatum_jaar: 2025,
  woz_waarde: 374000,
  energie_type: "bouwjaar",
  bouwjaar: 1977,
  type_woning: "Eengezinswoning",
  monument_soort: "geen_monument",
  zorgwoning: "false",
  woonvoorziening_handicap: "false",
  woonvoorziening_handicap_netto_investering: "",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
}

describe("MissingFieldsAlert", () => {
  afterEach(cleanup)

  it("lists the missing required fields and opens a field's step on click", () => {
    const onGoToField = vi.fn()
    render(
      <Harness
        values={{ ...COMPLETE_VALUES, woz_waarde: null as unknown as number }}
        onGoToField={onGoToField}
      />,
    )

    const alert = screen
      .getByRole("heading", { name: "Verbeter de fouten voor u verder gaat" })
      .closest(".ams-invalid-form-alert") as HTMLElement
    const link = within(alert).getByRole("link", {
      name: "WOZ-waarde is verplicht",
    })
    expect(fireEvent.click(link)).toBe(false) // the #link itself isn't followed
    expect(onGoToField).toHaveBeenCalledWith({
      step: 0,
      name: "woz_waarde",
      message: "WOZ-waarde is verplicht",
    })
  })

  it("shows nothing once everything required is filled in", () => {
    render(<Harness values={COMPLETE_VALUES} />)

    expect(
      screen.queryByRole("heading", {
        name: "Verbeter de fouten voor u verder gaat",
      }),
    ).toBeNull()
  })
})
