import api from '../../index'
import {
  GetCollectionsParamsType,
  GetCollectionsResponseType
} from 'coleccionablespanama/shared/types'

const getCollections = async (
  params: GetCollectionsParamsType
): Promise<GetCollectionsResponseType> => {
  const { data } = await api.get('/collections', { params })

  // Transform JSON Server flat array response to expected paginated format
  if (Array.isArray(data)) {
    const { limit = 20, offset = 0, filters, sort } = params

    const normalizeArray = (value?: string | string[]) =>
      Array.isArray(value) ? value : value ? [value] : []

    const filtered = data.filter((collection) => {
      const categories = normalizeArray(filters?.blockchain)
      const matchesCategory =
        categories.length === 0 || categories.includes(collection.blockchain)

      const minAssets = filters?.cached_assets_count?.ge
      const maxAssets = filters?.cached_assets_count?.le
      const assetsCount =
        collection.cached_assets_count ??
        collection.listed_count ??
        collection.supply ??
        0

      const matchesMin =
        minAssets === undefined || assetsCount >= Number(minAssets)
      const matchesMax =
        maxAssets === undefined || assetsCount <= Number(maxAssets)

      return matchesCategory && matchesMin && matchesMax
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'min_price':
          return (a.sales_volume || 0) - (b.sales_volume || 0)
        case 'max_price':
          return (b.sales_volume || 0) - (a.sales_volume || 0)
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

export default getCollections
