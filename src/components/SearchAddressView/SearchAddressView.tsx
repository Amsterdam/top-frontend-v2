import { useMemo, useState } from "react"
import {
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
  Row,
  SearchField,
} from "@amsterdam/design-system-react"
import { useSearchParams } from "react-router"
import debounce from "lodash.debounce"
import { useCasesSearch } from "@/api/hooks"
import { ItineraryListItem, ItineraryListItemVariant } from "@/components"

const DELAY = 750
const MIN_CHARS = 3

const isValidSearchString = (s: string) => s.length >= MIN_CHARS

type Props = {
  title: string
  description?: string
  themeName?: string
  variant: ItineraryListItemVariant
  onAdd?: (caseData: Case) => void
  onCancel?: () => void
}

export function SearchAddressView({
  title,
  description,
  themeName,
  variant,
  onAdd,
  onCancel,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearchString = searchParams.get("q") ?? ""
  const [debouncedSearchString, setDebouncedSearchString] =
    useState<string>(initialSearchString)
  const [inputValue, setInputValue] = useState(initialSearchString)
  const isValid = isValidSearchString(debouncedSearchString)
  const { data: cases, isFetching: isBusy } = useCasesSearch(
    debouncedSearchString,
    themeName,
    { lazy: !isValid },
  )

  // Memoize the debounced function to prevent recreation on every render
  const debouncedSetValue = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchString(value)
        setSearchParams(value ? { q: value } : {}, { replace: true })
      }, DELAY),
    [setSearchParams],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setInputValue(value)
    debouncedSetValue(value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    debouncedSetValue.cancel()
    setDebouncedSearchString(inputValue)
    setSearchParams(inputValue ? { q: inputValue } : {}, { replace: true })
  }

  const noResults = !isBusy && isValid && cases && cases.length === 0

  let statusMessage: string | null

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
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Row align="between" wrap>
          <Heading level={1}>{title}</Heading>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Annuleren
            </Button>
          )}
        </Row>
        {description && <Paragraph>{description}</Paragraph>}
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
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
        <Column>
          {!isBusy &&
            cases?.map((caseData, index) => (
              <ItineraryListItem
                key={`${caseData.id}-${index}`}
                item={{ case: caseData } as ItineraryItem}
                variant={variant}
                onAdd={onAdd}
              />
            ))}
        </Column>
      </Grid.Cell>
    </Grid>
  )
}

export default SearchAddressView
