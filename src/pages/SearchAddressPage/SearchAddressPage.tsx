import { useEffect, useMemo, useState } from "react"
import {
  Grid,
  Heading,
  Paragraph,
  SearchField,
} from "@amsterdam/design-system-react"
import { useLocation, useNavigate, useParams } from "react-router"
import debounce from "lodash.debounce"
import { useCasesSearch, useTheme } from "@/api/hooks"
import { ItineraryListItem } from "@/components"

const DELAY = 750
const MIN_CHARS = 3

const isValidSearchString = (s: string) => s.length >= MIN_CHARS

export function SearchAddressPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const [theme] = useTheme(themeId)
  const [debouncedSearchString, setDebouncedSearchString] = useState<string>("")
  const [inputValue, setInputValue] = useState("")
  const [cases, { execGet, isBusy }] = useCasesSearch(inputValue, theme?.name, {
    lazy: true,
  })
  const navigate = useNavigate()
  const location = useLocation()
  const currentFormValues = location.state?.formValues

  // Memoize the debounced function to prevent recreation on every render
  const debouncedSetValue = useMemo(
    () => debounce((value: string) => setDebouncedSearchString(value), DELAY),
    [],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setInputValue(value)
    debouncedSetValue(value)
  }

  useEffect(() => {
    if (isValidSearchString(debouncedSearchString)) {
      execGet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchString])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    execGet()
  }

  const onAddCase = (caseData: Case) => {
    navigate(`/lijst/nieuw/${themeId}`, {
      replace: true,
      state: {
        formValues: { ...currentFormValues, startCase: caseData },
      },
    })
  }

  const isValid = isValidSearchString(debouncedSearchString)
  const noResults = !isBusy && isValid && cases && cases.length === 0

  let statusMessage: string | null = null

  if (isBusy) {
    statusMessage = "Zoeken naar adressen..."
  } else if (!isValid) {
    statusMessage = `Voer minimaal ${MIN_CHARS} tekens in om te zoeken.`
  } else if (noResults) {
    statusMessage = "Geen adressen gevonden."
  } else {
    statusMessage = null
  }

  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Startadres zoeken</Heading>
      </Grid.Cell>

      <Grid.Cell span="all">
        <SearchField onSubmit={onSubmit} style={{ maxWidth: 600 }}>
          <SearchField.Input
            placeholder="Zoek een adres op basis van postcode en huisnummer of straatnaam."
            name="search-box"
            onChange={onChange}
            value={inputValue}
          />
          <SearchField.Button />
        </SearchField>
      </Grid.Cell>

      <Grid.Cell span="all">
        <Heading level={2} className="ams-mb-l">
          Adressen ({cases?.length || 0})
        </Heading>

        {statusMessage && <Paragraph>{statusMessage}</Paragraph>}

        {!isBusy &&
          cases?.map((caseData) => (
            <ItineraryListItem
              key={caseData.id}
              item={{ case: caseData } as ItineraryItem}
              variant="addStartAddress"
              onAdd={onAddCase}
            />
          ))}
      </Grid.Cell>
    </Grid>
  )
}

export default SearchAddressPage
