import { useRouter } from 'next/router'
import { AssetItemPlaceholder } from 'coleccionablespanama/shared/ui'
import qs from 'qs'
import MainLayout from '../../layouts/main'
import { useAsync, getAssets } from 'coleccionablespanama/shared/api'
import {
  AssetType,
  GetAssetsParamsType,
  GetAssetsResponseType,
  GetAssetsFiltersParamsType
} from 'coleccionablespanama/shared/types'
import Item from '../../components/items/asset/item'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useComponentDidUpdate } from 'coleccionablespanama/usehooks'
import { InfinityLoadChecker } from '../../components/common/infinityLoadChecker'
import { motion } from 'framer-motion'
import FilterBar from '../../components/common/filterBar'
import { ReactComponent as EmptyIllustration } from '../../assets/empty.svg'
import {
  TypeProps,
  OnChangeValueProps
} from '../../components/common/filterBar/types'
import { BILLING_TYPE_OPTIONS } from '../../constants/assets'

const mapper = (
  data: GetAssetsResponseType,
  prev?: GetAssetsResponseType
): GetAssetsResponseType => {
  if (prev && Object.keys(prev).length) {
    return { ...prev, ...data, records: [...prev.records, ...data.records] }
  }

  return data
}

// Cards-specific filters
const CARDS_FILTERS = [
  {
    title: 'Precio',
    value: 'price',
    type: TypeProps.RANGE,
    params: {
      firstTitle: 'mín',
      secondTitle: 'máx',
      firstKey: 'ge',
      secondKey: 'le'
    }
  },
  {
    title: 'Tipo de venta',
    value: 'billing_type',
    type: TypeProps.ARRAY,
    options: BILLING_TYPE_OPTIONS
  }
]

const LIMIT = 20

type QueryFiltersProps = {
  paginate: {
    limit: number
    offset: number
  }
  filters?: GetAssetsFiltersParamsType
  sort?: string
}

const CartasPage = () => {
  const { replace, asPath, query, isReady } = useRouter()
  const pathHydratedRef = useRef(false)

  const slugParams = (query.slug as string[]) || []
  const search = asPath.split('?')[1] ?? ''
  const params = qs.parse(search) as Omit<QueryFiltersProps, 'paginate'>

  // Fixed category for cartas (Pokémon)
  const CATEGORY = 'Pokémon TCG'
  const itemSlug = slugParams[0]

  const [localFiltersState, setLocalFiltersState] = useState<QueryFiltersProps>(
    {
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      filters: {
        blockchain: [CATEGORY], // Always filter by Pokémon TCG
        ...params.filters
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

  // Hydration guard - only run after client-side router is ready
  useEffect(() => {
    if (isReady && !pathHydratedRef.current) {
      pathHydratedRef.current = true
    }
  }, [isReady])

  // Sync URL with filter state
  useEffect(() => {
    if (!pathHydratedRef.current) return

    const newQuery = qs.stringify(
      {
        filters: localFiltersState.filters,
        sort: localFiltersState.sort
      },
      { addQueryPrefix: true, arrayFormat: 'comma' }
    )

    const newPath = itemSlug
      ? `/cartas/${itemSlug}${newQuery}`
      : `/cartas${newQuery}`

    if (asPath !== newPath) {
      replace(newPath, undefined, { shallow: true })
    }
  }, [localFiltersState, itemSlug, replace, asPath])

  // Fetch data when filters change
  useComponentDidUpdate(() => {
    if (!pathHydratedRef.current) return

    assetsCall({
      ...localFiltersState.paginate,
      ...localFiltersState.filters,
      sort: localFiltersState.sort
    })
  }, [localFiltersState])

  const onChangeFilters = (key: string, value: OnChangeValueProps) => {
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

  const onDeleteFilter = (key: string) => {
    setLocalFiltersState((prevState) => {
      const newFilters = { ...prevState.filters }
      delete newFilters[key as keyof GetAssetsFiltersParamsType]
      return {
        ...prevState,
        paginate: {
          limit: LIMIT,
          offset: 0
        },
        filters: newFilters
      }
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
    // Remove blockchain filter from display since it's fixed
    delete filters.blockchain
    return filters
  }, [localFiltersState.filters])

  const allowLoad = useMemo(() => {
    const loadedCount = localFiltersState.paginate.offset + LIMIT
    const totalCount = assetsData?.paginate?.count ?? 0
    return loadedCount < totalCount
  }, [localFiltersState.paginate.offset, assetsData?.paginate?.count])

  return (
    <MainLayout
      title="Cartas Pokémon | Coleccionables Panamá"
      description="Compra y vende cartas de Pokémon coleccionables en Panamá"
      className="px-0"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Cartas Pokémon Coleccionables
          </h1>

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar
              filters={CARDS_FILTERS}
              values={filtersToDisplay}
              onChange={onChangeFilters}
              onCloseTag={onDeleteFilter}
            />
          </div>

          {/* Results Count */}
          {assetsData?.paginate?.count !== undefined && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {assetsData.paginate.count} resultados
            </p>
          )}

          {/* Items Grid */}
          {assetsIsLoading && !assetsData?.records?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <AssetItemPlaceholder key={index} />
              ))}
            </div>
          ) : assetsData?.records?.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {assetsData.records.map((item: AssetType) => (
                  <Item key={item.token} item={item} />
                ))}
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
                No se encontraron cartas con los filtros seleccionados
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default CartasPage
