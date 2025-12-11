import { useRouter } from 'next/router'
import { AssetItemPlaceholder } from 'coleccionablespanama/shared/ui'
import qs from 'qs'
import MainLayout from '../../layouts/main'
import { useAsync, getAssets } from 'coleccionablespanama/shared/api'
import {
  AssetType,
  GetAssetsParamsType,
  GetAssetsResponseType
} from 'coleccionablespanama/shared/types'
import Item from '../../components/items/asset/item'
import { useEffect, useMemo, useRef, useState } from 'react'
import { InfinityLoadChecker } from '../../components/common/infinityLoadChecker'
import { motion } from 'framer-motion'
import { ReactComponent as EmptyIllustration } from '../../assets/empty.svg'
import ItemsListingLayout from '../../components/items/ItemsListingLayout'
import { COINS_FILTERS } from '../../components/items/sidebar/filterConfigs'

const mapper = (
  data: GetAssetsResponseType,
  prev?: GetAssetsResponseType
): GetAssetsResponseType => {
  // Only merge records if we're loading more (offset > 0)
  // Otherwise, replace the data entirely (filter change or initial load)
  if (
    prev &&
    Object.keys(prev).length &&
    data.paginate?.offset &&
    data.paginate.offset > 0
  ) {
    return { ...prev, ...data, records: [...prev.records, ...data.records] }
  }

  return data
}

const LIMIT = 20
const CATEGORY = 'Monedas Antiguas'

type FilterValue = string | string[] | { from: string; to: string } | null

type QueryFiltersProps = {
  paginate: {
    limit: number
    offset: number
  }
  filters?: Record<string, FilterValue>
  sort?: string
}

// Map UI filter keys to API keys
const mapFiltersToAPI = (filters: Record<string, FilterValue>) => {
  const apiFilters: Record<string, FilterValue> = {}

  Object.entries(filters).forEach(([key, value]) => {
    // Skip empty values
    if (value === '' || value === null || value === undefined) {
      return
    }

    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return
    }

    // Skip empty range objects
    if (
      typeof value === 'object' &&
      'from' in value &&
      !value.from &&
      !value.to
    ) {
      return
    }

    // Map 'category' to 'blockchain' for the API
    if (key === 'category') {
      apiFilters.blockchain = value
    } else {
      apiFilters[key] = value
    }
  })

  return apiFilters
}

const NumismaticaPage = () => {
  const { replace, asPath, query, isReady } = useRouter()

  const slugParams = (query.slug as string[]) || []
  const search = asPath.split('?')[1] ?? ''
  const params = qs.parse(search) as Omit<QueryFiltersProps, 'paginate'>

  const itemSlug = slugParams[0]

  const [localFiltersState, setLocalFiltersState] = useState<QueryFiltersProps>(
    {
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      filters: {
        ...params.filters,
        category: CATEGORY
      },
      sort: params.sort
    }
  )

  // Async hook for fetching assets
  const {
    data: assetsData,
    call: assetsCall,
    isLoading: assetsIsLoading,
    isSuccess: assetsIsSuccess
  } = useAsync<GetAssetsResponseType, GetAssetsParamsType>({
    callback: getAssets,
    mapper: mapper
  })

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (!isReady) return

    const apiFilters = mapFiltersToAPI(localFiltersState.filters || {})
    if (!apiFilters.blockchain) {
      apiFilters.blockchain = CATEGORY
    }

    assetsCall({
      ...localFiltersState.paginate,
      filters: apiFilters,
      sort: localFiltersState.sort
    })
  }, [isReady, localFiltersState])

  // Sync URL with filter state
  useEffect(() => {
    if (!isReady) return

    const newQuery = qs.stringify(
      {
        filters: localFiltersState.filters,
        sort: localFiltersState.sort
      },
      { addQueryPrefix: true, arrayFormat: 'comma' }
    )

    const newPath = itemSlug
      ? `/numismatica/${itemSlug}${newQuery}`
      : `/numismatica${newQuery}`

    if (asPath !== newPath) {
      replace(newPath, undefined, { shallow: true })
    }
  }, [isReady, localFiltersState, itemSlug, replace, asPath])

  const onChangeFilters = (key: string, value: FilterValue) => {
    setLocalFiltersState((prevState) => ({
      ...prevState,
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      filters: {
        ...prevState.filters,
        [key]: value
      }
    }))
  }

  const onResetFilters = () => {
    setLocalFiltersState({
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      filters: {
        category: CATEGORY
      },
      sort: undefined
    })
  }

  const loadMore = () => {
    setLocalFiltersState((prevState) => ({
      ...prevState,
      paginate: {
        ...prevState.paginate,
        offset: prevState.paginate.offset + LIMIT
      }
    }))
  }

  const filtersToDisplay = useMemo(() => {
    const filters = { ...localFiltersState.filters }
    // Remove category filter from display since it's fixed
    delete filters.category
    return filters
  }, [localFiltersState.filters])

  const allowLoad = useMemo(() => {
    const loadedCount = localFiltersState.paginate.offset + LIMIT
    const totalCount = assetsData?.paginate?.count ?? 0
    return loadedCount < totalCount
  }, [localFiltersState.paginate.offset, assetsData?.paginate?.count])

  return (
    <MainLayout
      title="Numismática | Coleccionables Panamá"
      description="Compra y vende monedas y billetes coleccionables en Panamá"
      className="px-0"
    >
      <ItemsListingLayout
        type="numismatica"
        filters={filtersToDisplay}
        filterConfigs={COINS_FILTERS}
        onFilterChange={onChangeFilters}
        onResetFilters={onResetFilters}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
              Numismática Coleccionable
            </h1>

            {/* Results Count */}
            {assetsData?.paginate?.count !== undefined && (
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {assetsData.paginate.count} resultados
              </p>
            )}

            {/* Items Grid */}
            {assetsIsLoading && !assetsData?.records?.length ? (
              <div className="wrapper-items">
                <div className="items grided">
                  {Array.from({ length: 8 }, (_, index) => (
                    <AssetItemPlaceholder key={index} />
                  ))}
                </div>
              </div>
            ) : assetsData?.records?.length ? (
              <>
                <div className="wrapper-items">
                  <div className="items grided">
                    {assetsData.records.map((item: AssetType) => (
                      <Item key={item.token} item={item} />
                    ))}
                  </div>
                </div>

                {/* Infinite Scroll Trigger */}
                <InfinityLoadChecker
                  allowLoad={allowLoad}
                  isLoading={assetsIsLoading}
                  loadMore={loadMore}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <EmptyIllustration className="mb-4 h-48 w-48" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No se encontraron monedas con los filtros seleccionados
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </ItemsListingLayout>
    </MainLayout>
  )
}

export default NumismaticaPage
