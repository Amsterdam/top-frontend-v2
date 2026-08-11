import { useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import {
  Heading,
  LinkList,
  Paragraph,
  SearchField,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import debounce from "lodash.debounce"
import { RESULTS_PER_PAGE, useBagPdokSearch } from "@/api/hooks"

const DELAY = 750
const MIN_CHARS = 3

const isValidSearchString = (s: string) => s.length >= MIN_CHARS

type Props = {
  onSelectAddress: (address: BAGPdokAddress) => void
}

export function StepAddressSearch({ onSelectAddress }: Props) {
  const [inputValue, setInputValue] = useState("")
  const [debouncedSearchString, setDebouncedSearchString] = useState("")
  const isValid = isValidSearchString(debouncedSearchString)

  const { data, isFetching: isBusy } = useBagPdokSearch(debouncedSearchString, {
    lazy: !isValid,
  })
  const addresses = data?.response.docs

  const debouncedSetValue = useMemo(
    () => debounce((value: string) => setDebouncedSearchString(value), DELAY),
    [],
  )

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setInputValue(value)
    debouncedSetValue(value)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    debouncedSetValue.cancel()
    setDebouncedSearchString(inputValue)
  }

  let statusMessage: string | null

  if (isBusy) {
    statusMessage = "Zoeken naar adressen..."
  } else if (!isValid) {
    statusMessage = `Voer minimaal ${MIN_CHARS} tekens in om te zoeken.`
  } else {
    statusMessage = null
  }

  const showResultsInfo = !isBusy && isValid

  return (
    <>
      <Heading level={2} className="ams-mb-m">
        Bereken de punten van een woning
      </Heading>
      <Paragraph className="ams-mb-m">
        Zoek het adres van de woning. We halen automatisch beschikbare gegevens
        op, zoals de WOZ-waarde en het energielabel. Daarna kun je de kenmerken
        van de woning controleren en de puntentelling compleet maken.
      </Paragraph>

      <SearchField
        onSubmit={onSubmit}
        style={{ maxWidth: 600 }}
        className="ams-mb-m"
      >
        <SearchField.Input
          placeholder="Zoek een adres op basis van postcode en huisnummer of straatnaam."
          name="search-box"
          onChange={onChange}
          value={inputValue}
        />
        <SearchField.Button />
      </SearchField>

      {showResultsInfo && (
        <Paragraph className="ams-mb-m">
          <strong>{addresses?.length ?? 0}</strong>{" "}
          {addresses?.length === 1 ? "adres" : "adressen"} gevonden voor "
          {debouncedSearchString}"
          {(addresses?.length ?? 0) >= RESULTS_PER_PAGE &&
            ` (maximaal ${RESULTS_PER_PAGE} getoond)`}
        </Paragraph>
      )}

      {statusMessage && <Paragraph>{statusMessage}</Paragraph>}

      {!isBusy && addresses && addresses.length > 0 && (
        <LinkList>
          {addresses.map((address) => (
            <LinkList.Link
              href="#"
              key={address.nummeraanduiding_id}
              icon={ChevronForwardIcon}
              onClick={(e) => {
                e.preventDefault()
                onSelectAddress(address)
              }}
            >
              {address.weergavenaam}
            </LinkList.Link>
          ))}
        </LinkList>
      )}
    </>
  )
}

export default StepAddressSearch
