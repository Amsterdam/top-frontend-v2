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
  let sandwich = stripDoubleSlashes(
    `/${parts.filter((_) => _ !== null || _ !== undefined).join("/")}/`,
  )
  if (!leadingSlash || sandwich.match(/^\/https?:\/\//)) {
    sandwich = stripLeadingSlash(sandwich)
  }
  if (!trailingSlash) {
    sandwich = stripTrailingSlash(sandwich)
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
