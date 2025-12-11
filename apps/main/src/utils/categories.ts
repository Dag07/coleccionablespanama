export const CATEGORY_SLUG_BY_VALUE: Record<string, string> = {
  'Pokémon TCG': 'cartas',
  'Monedas Antiguas': 'numismatica',
  Otros: 'otros'
}

export const CATEGORY_LABEL_BY_SLUG: Record<string, string> = {
  cartas: 'Cartas Pokémon',
  numismatica: 'Numismática',
  otros: 'Otros coleccionables',
  // Legacy support
  pokemon: 'Cartas Pokémon',
  monedas: 'Numismática'
}

export const CATEGORY_VALUE_BY_SLUG: Record<string, string> = Object.entries(
  CATEGORY_SLUG_BY_VALUE
).reduce((acc, [value, slug]) => {
  acc[slug] = value
  return acc
}, {} as Record<string, string>)

export const getCategorySlug = (blockchain?: string): string => {
  return blockchain ? CATEGORY_SLUG_BY_VALUE[blockchain] || 'otros' : 'otros'
}

export const getCategoryValue = (slug?: string): string | undefined => {
  if (!slug) return undefined
  return CATEGORY_VALUE_BY_SLUG[slug]
}

export const getCategoryLabel = (slug?: string): string | undefined => {
  if (!slug) return undefined
  return CATEGORY_LABEL_BY_SLUG[slug]
}
