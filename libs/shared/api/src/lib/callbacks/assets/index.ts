import api from '../../index'
import {
  GetAssetsResponseType,
  GetAssetsParamsType
} from 'coleccionablespanama/shared/types'

const getAssets = async (
  params?: GetAssetsParamsType
): Promise<GetAssetsResponseType> => {
  const { data } = await api.get('/assets')

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

      // Billing type (Comprar Ahora / Subasta)
      const billingTypes = normalizeArray(filters?.billing_type)
      const matchesBilling =
        billingTypes.length === 0 || billingTypes.includes(item.billing_type)

      // Price range
      const priceFrom = filters?.price?.from
      const priceTo = filters?.price?.to
      const matchesPriceFrom = !priceFrom || item.price >= Number(priceFrom)
      const matchesPriceTo = !priceTo || item.price <= Number(priceTo)

      // Year range
      const yearFrom = filters?.year?.from
      const yearTo = filters?.year?.to
      const matchesYearFrom =
        !yearFrom || (item.year && item.year >= Number(yearFrom))
      const matchesYearTo =
        !yearTo || (item.year && item.year <= Number(yearTo))

      // Grade range
      const gradeFrom = filters?.grade?.from
      const gradeTo = filters?.grade?.to
      const matchesGradeFrom =
        !gradeFrom || (item.grade && item.grade >= Number(gradeFrom))
      const matchesGradeTo =
        !gradeTo || (item.grade && item.grade <= Number(gradeTo))

      // Authenticator
      const matchesAuthenticator =
        !filters?.authenticator ||
        (filters.authenticator === 'N/A'
          ? !item.authenticator || item.authenticator === 'N/A'
          : item.authenticator === filters.authenticator)

      // Card type (array field - match if any selected type is in item's card_type array)
      const cardTypes = normalizeArray(filters?.card_type)
      const matchesCardType =
        cardTypes.length === 0 ||
        (item.card_type &&
          Array.isArray(item.card_type) &&
          cardTypes.some((type) => item.card_type.includes(type)))

      // Subcategory (for cards)
      const subcategories = normalizeArray(filters?.subcategory)
      const matchesSubcategory =
        subcategories.length === 0 || subcategories.includes(item.subcategory)

      // Metal (for coins)
      const metals = normalizeArray(filters?.metal)
      const matchesMetal = metals.length === 0 || metals.includes(item.metal)

      // Country (for coins)
      const countries = normalizeArray(filters?.country)
      const matchesCountry =
        countries.length === 0 || countries.includes(item.country)

      return (
        matchesCategory &&
        matchesSlug &&
        matchesBilling &&
        matchesPriceFrom &&
        matchesPriceTo &&
        matchesYearFrom &&
        matchesYearTo &&
        matchesGradeFrom &&
        matchesGradeTo &&
        matchesAuthenticator &&
        matchesCardType &&
        matchesSubcategory &&
        matchesMetal &&
        matchesCountry
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
