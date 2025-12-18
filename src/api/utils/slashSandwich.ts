/**
 * Joins all given parts into a single path with exactly one / between each part.
 * Example: ['foo', '/zoo/bar/', '/moo'] becomes '/foo/zoo/bar/moo/'
 *
 * Options:
 * - trailingSlash=false will remove the final slash: '/foo/zoo/bar/moo'
 * - leadingSlash=false will remove the initial slash: 'foo/zoo/bar/moo/'
 */
export const slashSandwich = (
  parts: Array<string | number | undefined>,
  { leadingSlash = true, trailingSlash = true } = {},
): string => {
  // filter null/undefined
  const filteredParts = parts.filter((p) => p !== null && p !== undefined)

  // check of het laatste segment een query string is
  const lastPart = filteredParts[filteredParts.length - 1]
  const isQueryString = typeof lastPart === "string" && lastPart.startsWith("?")

  // join alle pathdelen behalve query string
  const pathParts = isQueryString ? filteredParts.slice(0, -1) : filteredParts
  let sandwich = stripDoubleSlashes(`/${pathParts.join("/")}/`)

  if (!leadingSlash || sandwich.match(/^\/https?:\/\//)) {
    sandwich = stripLeadingSlash(sandwich)
  }
  if (!trailingSlash) {
    sandwich = stripTrailingSlash(sandwich)
  }

  // voeg query string erachter als die bestaat
  if (isQueryString) {
    sandwich += lastPart
  }

  return sandwich
}

/**
 * Removes all consecutive slashes from a path.
 * Only the slashes immediately following a protocol (like 'http://') are preserved.
 * Example: 'foo//bar' becomes 'foo/bar'
 *          '/foo///bar/' becomes '/foo/bar/'
 *          'https://www.domain.com//foo' becomes 'https://www.domain.com/foo'
 */
export const stripDoubleSlashes = (path: string): string =>
  path.replace(/^\/+/, "/").replace(/([^:]\/)\/+/g, "$1")

/**
 * Removes the trailing slash from a string if it exists.
 * Example: '/foo/bar/' becomes '/foo/bar'
 *          'foo' remains 'foo'
 */
export const stripTrailingSlash = (path: string): string =>
  path.replace(/\/$/, "")

/**
 * Removes the leading slash from a string if it exists.
 * Example: '/foo/bar/' becomes 'foo/bar/'
 *          'foo' remains 'foo'
 */
export const stripLeadingSlash = (path: string): string =>
  path.replace(/^\//, "")

export default slashSandwich
