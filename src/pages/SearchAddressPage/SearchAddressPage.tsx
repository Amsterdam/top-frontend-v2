import { useEffect, useState } from "react"
import {
  Button,
  Grid,
  Heading,
  Row,
  Icon,
} from "@amsterdam/design-system-react"
import {
  HouseIcon,
  SearchIcon,
  UndoIcon,
} from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { FormProvider, TextInputControl } from "@amsterdam/ee-ads-rhf-lib"
import { useForm } from "react-hook-form"
import { useAddressSearch } from "@/api/hooks"
import { AmsterdamCrossSpinnerOverlay, Divider } from "@/components"
import { ItineraryListItem } from "../ListPage/components"

type FormValues = {
  streetName: string
  postalCode: string
  streetNumber: number | ""
}

export function SearchAddressPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<FormValues | null>(null)

  const [data, { execGet, isBusy }] = useAddressSearch(
    searchParams?.streetNumber || 0,
    searchParams?.postalCode,
    searchParams?.streetName,
    undefined,
    themeId,
    { lazy: true },
  )

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      streetName: "",
      postalCode: "",
      streetNumber: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    setSearchParams(values)
  }

  useEffect(() => {
    if (!searchParams) return
    execGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const { formState } = form

  return (
    <>
      <Row alignVertical="center" gap="small" className="mb-3">
        <Icon svg={HouseIcon} size="heading-1" />
        <Heading level={1}>Startadres</Heading>
      </Row>

      <Heading level={2}>Bij welk adres wil je beginnen?</Heading>

      <FormProvider form={form} onSubmit={onSubmit}>
        <Grid paddingBottom="x-large" paddingTop="x-large">
          <Grid.Cell span={{ narrow: 4, medium: 6, wide: 5 }}>
            <AmsterdamCrossSpinnerOverlay loading={isBusy}>
              <TextInputControl<FormValues>
                label="Straatnaam"
                name="streetName"
                inputMode="text"
                className="ams-mb-xl"
              />

              <TextInputControl<FormValues>
                label="Postcode"
                name="postalCode"
                inputMode="text"
                size={10}
                registerOptions={{
                  validate: (value) =>
                    !value ||
                    /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(String(value)) ||
                    "Gebruik een geldige postcode zoals 1234 AB",
                }}
                className="ams-mb-xl"
              />
              <TextInputControl<FormValues>
                label="Huisnummer"
                name="streetNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                size={5}
                registerOptions={{
                  required: "Het huisnummer is verplicht",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Het huisnummer mag alleen cijfers bevatten",
                  },
                  min: {
                    value: 1,
                    message: "Minimaal 1 adres",
                  },
                }}
                className="ams-mb-xl"
              />

              <Row gap="large" wrap className="ams-mb-xl">
                <Button
                  type="submit"
                  disabled={!formState.isValid || isBusy}
                  iconBefore
                  icon={SearchIcon}
                >
                  Zoeken
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => form.reset()}
                  iconBefore
                  icon={UndoIcon}
                >
                  Wis formulier
                </Button>

                <Button variant="tertiary" onClick={() => navigate(-1)}>
                  Annuleer
                </Button>
              </Row>
            </AmsterdamCrossSpinnerOverlay>
          </Grid.Cell>
        </Grid>
      </FormProvider>

      <Heading level={3}>Beschikbare zaken ({data?.cases.length || 0})</Heading>
      <Divider />

      {!isBusy &&
        data?.cases.map((caseData, index) => (
          <div
            key={caseData.id}
            className="animate-slide-in-left"
            style={{
              animationDelay: `${index * 0.1}s`,
              borderBottom: "1px solid var(--ams-color-separator)",
              marginBottom: 2,
            }}
          >
            <ItineraryListItem
              key={caseData.id}
              item={{ case: caseData } as ItineraryItem}
              type="addAddress"
            />
          </div>
        ))}
    </>
  )
}

export default SearchAddressPage
