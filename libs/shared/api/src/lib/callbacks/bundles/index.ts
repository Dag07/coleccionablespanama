import api from '../../index'
import {
  GetBundlesParamsType,
  GetBundlesResponseType
} from 'coleccionablespanama/shared/types'

const getBundles = async (
  params?: GetBundlesParamsType
): Promise<GetBundlesResponseType> => {
  const { data } = await api.get('/bundles', { params })

  // Transform JSON Server flat array response to expected paginated format
  if (Array.isArray(data)) {
    const { limit = 20, offset = 0, filters, sort } = params || {}

    const normalizeArray = (value?: string | string[]) =>
      Array.isArray(value) ? value : value ? [value] : []

    const filtered = data.filter((bundle) => {
      const categories = normalizeArray(filters?.blockchain)
      const matchesCategory =
        categories.length === 0 || categories.includes(bundle.blockchain)

      const minItems = filters?.cached_assets_count?.ge
      const maxItems = filters?.cached_assets_count?.le
      const itemsCount = bundle.items_count ?? 0
      const matchesMinItems =
        minItems === undefined || itemsCount >= Number(minItems)
      const matchesMaxItems =
        maxItems === undefined || itemsCount <= Number(maxItems)

      const minPrice = filters?.price?.ge
      const maxPrice = filters?.price?.le
      const price = (bundle as unknown as { price?: number })?.price ?? 0
      const matchesMinPrice =
        minPrice === undefined || price >= Number(minPrice)
      const matchesMaxPrice =
        maxPrice === undefined || price <= Number(maxPrice)

      return (
        matchesCategory &&
        matchesMinItems &&
        matchesMaxItems &&
        matchesMinPrice &&
        matchesMaxPrice
      )
    })

    const sorted = [...filtered].sort((a, b) => {
      const priceA = (a as unknown as { price?: number })?.price ?? 0
      const priceB = (b as unknown as { price?: number })?.price ?? 0

      switch (sort) {
        case 'min_price':
          return priceA - priceB
        case 'max_price':
          return priceB - priceA
        case 'oldest':
          return a.token.localeCompare(b.token)
        default:
          return b.token.localeCompare(a.token)
      }
    })

    const paginatedRecords = sorted.slice(offset, offset + limit)
    return {
      records: paginatedRecords,
      paginate: {
        count: sorted.length,
        limit,
        offset
      }
    }
  }

  return data
}

export default getBundles
