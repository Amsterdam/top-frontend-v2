import { Button, Grid, Heading } from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {
  FormProvider,
  SelectControl,
  TextInputControl,
  RadioControl,
} from "@amsterdam/ee-ads-rhf-lib"
import { useForm } from "react-hook-form"
import { useTheme, useUsers } from "@/api/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"

type FormValues = {
  "team_members[0]": Record<string, unknown>
  "team_members[1]": string
  "team_members[2]": string
  daySettings: string
  numAddresses: number
  startAddress?: string
}

export default function CreateListPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const [theme] = useTheme(themeId!)
  const [usersData] = useUsers()
  const form = useForm<FormValues>()

  const users = usersData ? usersData.results : []
  const userOptions = mapToOptions(users, "id", "full_name")

  return (
    <>
      <Heading level={1}>Genereer looplijst</Heading>
      <Heading level={2}>{theme?.name}</Heading>
      <FormProvider
        form={form}
        onSubmit={(e) => console.log("Submitted values", e)}
      >
        <Grid paddingBottom="x-large" paddingTop="x-large">
          <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }}>
            <SelectControl<FormValues>
              label="Toezichthouder 1"
              name="team_members[0]"
              options={userOptions}
              registerOptions={{
                required: "Toezichthouder is verplicht",
              }}
              className="ams-mb-xl"
            />
            <SelectControl<FormValues>
              label="Toezichthouder 2"
              name="team_members[1]"
              options={userOptions}
              registerOptions={{
                required: "Toezichthouder is verplicht",
              }}
              className="ams-mb-xl"
            />
            <SelectControl<FormValues>
              label="Handhaver"
              name="team_members[2]"
              options={userOptions}
              registerOptions={{
                required: "Handhaver is verplicht",
              }}
              className="ams-mb-xl"
            />

            <RadioControl<FormValues>
              label="Wat voor looplijst wil je maken?"
              name="daySettings"
              options={[
                { value: "today", label: "Vandaag" },
                { value: "tomorrow", label: "Morgen" },
              ]}
              registerOptions={{
                required: "Daginstelling is verplicht",
              }}
              className="ams-mb-xl"
            />
            <TextInputControl<FormValues>
              label="Hoeveel zaken wil je in je looplijst? (Max. 20)"
              name="numAddresses"
              inputMode="numeric"
              size={2}
              registerOptions={{
                required: "Aantal adressen is verplicht",
                min: {
                  value: 1,
                  message: "Minimaal 1 adres",
                },
                max: {
                  value: 20,
                  message: "Maximaal 20 adressen",
                },
              }}
              className="ams-mb-xl"
            />

            <Button type="submit">Genereer looplijst</Button>
          </Grid.Cell>
        </Grid>
      </FormProvider>
    </>
  )
}
