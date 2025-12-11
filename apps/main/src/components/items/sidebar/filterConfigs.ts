export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  type: 'select' | 'checkbox' | 'range' | 'badge'
  label: string
  options?: FilterOption[]
  prefix?: string
  suffix?: string
  fromLabel?: string
  toLabel?: string
}

export const CARDS_FILTERS: FilterConfig[] = [
  {
    key: 'subcategory',
    type: 'checkbox',
    label: 'Subcategoría',
    options: [
      { value: 'Baseball', label: 'Baseball' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Football', label: 'Football' },
      { value: 'Hockey', label: 'Hockey' },
      { value: 'Pokémon (English)', label: 'Pokémon (Inglés)' },
      { value: 'Pokémon (Japanese)', label: 'Pokémon (Japonés)' },
      { value: 'Pokémon (Other Languages)', label: 'Pokémon (Otros Idiomas)' },
      { value: 'Other', label: 'Otro' }
    ]
  },
  {
    key: 'card_type',
    type: 'checkbox',
    label: 'Tipo de Carta',
    options: [
      { value: 'Holo', label: 'Holo' },
      { value: '1st Edition', label: '1ra Edición' },
      { value: 'Shadowless', label: 'Shadowless' },
      { value: 'Promo', label: 'Promo' },
      { value: 'Reverse Holo', label: 'Reverse Holo' }
    ]
  },
  {
    key: 'year',
    type: 'range',
    label: 'Año',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  },
  {
    key: 'grade',
    type: 'range',
    label: 'Grado (1-10)',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  },
  {
    key: 'authenticator',
    type: 'select',
    label: 'Autenticador',
    options: [
      { value: '', label: 'Todos' },
      { value: 'PSA', label: 'PSA' },
      { value: 'BGS', label: 'BGS/Beckett' },
      { value: 'CGC', label: 'CGC' },
      { value: 'SGC', label: 'SGC' },
      { value: 'N/A', label: 'No Autenticado' }
    ]
  },
  {
    key: 'billing_type',
    type: 'checkbox',
    label: 'Opción de Compra',
    options: [
      { value: 'fixed_price', label: 'Comprar Ahora' },
      { value: 'auction', label: 'Subasta' }
    ]
  },
  {
    key: 'price',
    type: 'range',
    label: 'Precio',
    prefix: '$',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  }
]

export const COINS_FILTERS: FilterConfig[] = [
  {
    key: 'year',
    type: 'range',
    label: 'Año',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  },
  {
    key: 'grade',
    type: 'range',
    label: 'Grado (1-70)',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  },
  {
    key: 'authenticator',
    type: 'select',
    label: 'Autenticador',
    options: [
      { value: '', label: 'Todos' },
      { value: 'PCGS', label: 'PCGS' },
      { value: 'NGC', label: 'NGC' },
      { value: 'ANACS', label: 'ANACS' },
      { value: 'ICG', label: 'ICG' },
      { value: 'N/A', label: 'No Autenticado' }
    ]
  },
  {
    key: 'metal',
    type: 'checkbox',
    label: 'Metal',
    options: [
      { value: 'Gold', label: 'Oro' },
      { value: 'Silver', label: 'Plata' },
      { value: 'Copper', label: 'Cobre' },
      { value: 'Platinum', label: 'Platino' },
      { value: 'Bronze', label: 'Bronce' }
    ]
  },
  {
    key: 'billing_type',
    type: 'checkbox',
    label: 'Opción de Compra',
    options: [
      { value: 'fixed_price', label: 'Comprar Ahora' },
      { value: 'auction', label: 'Subasta' }
    ]
  },
  {
    key: 'price',
    type: 'range',
    label: 'Precio',
    prefix: '$',
    fromLabel: 'Desde',
    toLabel: 'Hasta'
  },
  {
    key: 'country',
    type: 'checkbox',
    label: 'País',
    options: [
      { value: 'United States', label: 'Estados Unidos' },
      { value: 'Great Britain', label: 'Gran Bretaña' },
      { value: 'France', label: 'Francia' },
      { value: 'Germany', label: 'Alemania' },
      { value: 'Roman Empire', label: 'Imperio Romano' },
      { value: 'Spain', label: 'España' },
      { value: 'Mexico', label: 'México' }
    ]
  }
]
