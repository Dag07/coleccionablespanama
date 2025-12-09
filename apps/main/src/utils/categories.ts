export const CATEGORY_SLUG_BY_VALUE: Record<string, string> = {
  'Pokémon TCG': 'pokemon',
  'Monedas Antiguas': 'monedas',
  Otros: 'otros'
}

export const CATEGORY_LABEL_BY_SLUG: Record<string, string> = {
  pokemon: 'Cartas Pokémon',
  monedas: 'Monedas de colección',
  otros: 'Otros coleccionables'
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
