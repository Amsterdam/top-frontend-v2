type OptionItem = {
  id: number
  name: string
  [key: string]: unknown
}

export function mapIdsToObjects(
  ids?: number[] | null,
  options?: OptionItem[] | null,
): OptionItem[] {
  if (!ids?.length || !options?.length) return []

  const optionMap = new Map(options.map((opt) => [opt.id, opt]))

  return ids.flatMap((id) => optionMap.get(id) ?? [])
}

export function mapIdsToNames(
  ids?: number[] | null,
  options?: OptionItem[] | null,
): string[] {
  if (!ids?.length || !options?.length) return []

  const optionMap = new Map(options.map(({ id, name }) => [id, name]))

  return ids.flatMap((id) => optionMap.get(id) ?? [])
}
