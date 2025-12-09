import api from '../../index'
import {
  GetAssetsResponseType,
  GetAssetsParamsType
} from 'coleccionablespanama/shared/types'

const getAssets = async (
  params?: GetAssetsParamsType
): Promise<GetAssetsResponseType> => {
  const fetchItems = async () => {
    try {
      return await api.get('/items')
    } catch (error: unknown) {
      const status = (error as any)?.response?.status
      if (status === 404) {
        return await api.get('/assets')
      }
      throw error
    }
  }

  const { data } = await fetchItems()

  // Transform JSON Server flat array response to expected paginated format
  if (Array.isArray(data)) {
    const { limit = 20, offset = 0, filters, sort } = params || {}

    const normalizeArray = (value?: string | string[]) =>
      Array.isArray(value) ? value : value ? [value] : []

    const filtered = data.filter((item) => {
      const categories = normalizeArray(filters?.blockchain)
      const matchesCategory =
        categories.length === 0 || categories.includes(item.blockchain)

      const matchesSlug =
        !filters?.slug ||
        item.slug === filters.slug ||
        item.token === filters.slug

      const matchesBilling =
        !filters?.billing_type || item.billing_type === filters.billing_type

      const minPrice = filters?.price?.ge
      const maxPrice = filters?.price?.le
      const matchesMin =
        minPrice === undefined || item.price >= Number(minPrice)
      const matchesMax =
        maxPrice === undefined || item.price <= Number(maxPrice)

      return (
        matchesCategory &&
        matchesSlug &&
        matchesBilling &&
        matchesMin &&
        matchesMax
      )
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'min_price':
          return (a.price || 0) - (b.price || 0)
        case 'max_price':
          return (b.price || 0) - (a.price || 0)
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

export default getAssets
