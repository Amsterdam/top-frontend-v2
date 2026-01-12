import { useEffect, useMemo, useState } from "react"
import { Heading, Paragraph, SearchField } from "@amsterdam/design-system-react"
import { SearchIcon } from "@amsterdam/design-system-react-icons"
import { useLocation, useNavigate, useParams } from "react-router"
import debounce from "lodash.debounce"
import { useCasesSearch, useTheme } from "@/api/hooks"
import { Divider, PageGrid, PageHeading } from "@/components"
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
    if (!value) {
      execGet()
    }
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

  const noResults = !isBusy && inputValue && cases && cases.length === 0
  const isValid = isValidSearchString(debouncedSearchString)

  let statusMessage: string | null = null

  if (isBusy) {
    statusMessage = "Zoeken naar adressen..."
  } else if (!isValid) {
    statusMessage = `Voer minimaal ${MIN_CHARS} tekens in om te zoeken.`
  } else if (noResults) {
    statusMessage = "Geen adressen gevonden."
  }

  return (
    <PageGrid>
      <PageHeading
        label="Startadres zoeken"
        icon={SearchIcon}
        backLinkLabel="Terug"
        backLinkUrl={`/lijst/nieuw/${themeId}`}
        backLinkState={{
          formValues: { ...currentFormValues },
        }}
      />

      <SearchField onSubmit={onSubmit} style={{ maxWidth: 600 }}>
        <SearchField.Input
          placeholder="Zoek een adres op basis van postcode en huisnummer of straatnaam."
          name="search-box"
          onChange={onChange}
          value={inputValue}
        />
        <SearchField.Button />
      </SearchField>

      <>
        <Heading level={3}>Adressen ({cases?.length || 0})</Heading>
        <Divider />

        {statusMessage && (
          <Paragraph style={{ fontStyle: "italic" }}>{statusMessage}</Paragraph>
        )}

        {!isBusy &&
          cases?.map((caseData, index) => (
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
                type="addStartAddress"
                onAdd={onAddCase}
              />
            </div>
          ))}
      </>
    </PageGrid>
  )
}

export default SearchAddressPage
