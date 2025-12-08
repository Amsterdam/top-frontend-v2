export const stringifyQueryParams = (
  params: Record<string, string | number | string[] | undefined>,
  addQueryPrefix = true,
) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParams.append(key, String(v))
        }
      })
    } else {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return addQueryPrefix ? `?${queryString}` : queryString
}

export default stringifyQueryParams
