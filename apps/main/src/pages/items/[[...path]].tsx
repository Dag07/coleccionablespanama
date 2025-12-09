import { useRouter } from 'next/router'
import {
  AssetItemPlaceholder,
  AssetTabsPlaceholder
} from 'coleccionablespanama/shared/ui'
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
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useComponentDidUpdate } from 'coleccionablespanama/usehooks'
import { InfinityLoadChecker } from '../../components/common/infinityLoadChecker'
import { motion } from 'framer-motion'
import FilterBar from '../../components/common/filterBar'
import { ReactComponent as EmptyIllustration } from '../../assets/empty.svg'
import {
  TypeProps,
  OnChangeValueProps
} from '../../components/common/filterBar/types'
import { BILLING_TYPE_OPTIONS, ASSETS_SORT_TABS } from '../../constants/assets'
import { BLOCKCHAIN_CHECKS } from '../../constants/user/assets'
import {
  CATEGORY_SLUG_BY_VALUE,
  getCategoryValue,
  getCategoryLabel
} from '../../utils/categories'

const Tabs = lazy(() => import('../../components/asset/tabs'))

const mapper = (
  data: GetAssetsResponseType,
  prev?: GetAssetsResponseType
): GetAssetsResponseType => {
  if (prev && Object.keys(prev).length) {
    return { ...prev, ...data, records: [...prev.records, ...data.records] }
  }

  return data
}

const ASSETS_FILTERS = [
  {
    title: 'Categoría',
    value: 'blockchain',
    type: TypeProps.ARRAY,
    options: BLOCKCHAIN_CHECKS
  },
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

const Items = () => {
  const { replace, asPath, query, isReady } = useRouter()
  const pathHydratedRef = useRef(false)

  const pathParams = (query.path as string[]) || []
  const search = asPath.split('?')[1] ?? ''
  const params = qs.parse(search) as Omit<QueryFiltersProps, 'paginate'>

  const initialCategory = getCategoryValue(pathParams[0])
  const initialSlug = pathParams[1]
  const currentCategorySlug = pathParams[0]
  const currentCategoryLabel = getCategoryLabel(currentCategorySlug)

  const [localFiltersState, setLocalFiltersState] = useState<QueryFiltersProps>(
    {
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      ...params,
      filters: {
        ...params.filters,
        ...(initialCategory ? { blockchain: [initialCategory] } : {}),
        ...(initialSlug ? { slug: initialSlug } : {})
      }
    }
  )

  const { paginate, sort, ...panelFilterState } = localFiltersState

  const { data, call, isLoading, isSuccess, clearAsyncData } = useAsync<
    GetAssetsResponseType,
    GetAssetsParamsType
  >({
    callback: getAssets,
    mapper
  })

  const allowLoad = data
    ? !isLoading && data?.records.length < data?.paginate?.count
    : false

  const tabIndex = useMemo(() => {
    const index = ASSETS_SORT_TABS.findIndex(
      (tab) => tab.value === localFiltersState?.sort
    )

    return index >= 0 ? index : 0
  }, [localFiltersState?.sort])

  const onChangeTab = (index: number) => {
    const tab = ASSETS_SORT_TABS[index]

    clearAsyncData()
    setLocalFiltersState((prev) => ({ ...prev, sort: tab.value }))
  }

  const onCloseTag = (key: keyof GetAssetsFiltersParamsType) => {
    const { [key]: deletedProp, ...rest } = localFiltersState.filters || {}
    clearAsyncData()

    setLocalFiltersState((prev) => ({
      ...prev,
      filters: { ...rest },
      paginate: { limit: LIMIT, offset: 0 }
    }))
  }

  const loadMore = () => {
    setLocalFiltersState((prev) => ({
      ...prev,
      paginate: {
        ...prev.paginate,
        offset: prev.paginate.offset + LIMIT
      }
    }))
  }

  const onChangeFilters = (key: string, value: OnChangeValueProps) => {
    clearAsyncData()

    setLocalFiltersState((prev) => ({
      ...prev,
      paginate: { limit: LIMIT, offset: 0 },
      filters: { ...prev.filters, [key]: value }
    }))
  }

  // Keep path in sync with selected category (single) and optional slug filter
  useEffect(() => {
    if (!isReady || !pathHydratedRef.current) return
    const { filters, sort } = localFiltersState

    const categorySlug =
      Array.isArray(filters?.blockchain) && filters.blockchain.length === 1
        ? CATEGORY_SLUG_BY_VALUE[filters.blockchain[0]]
        : undefined
    const slugSegment =
      typeof filters?.slug === 'string' && filters.slug.length > 0
        ? filters.slug
        : undefined

    const segments = [categorySlug, slugSegment].filter(Boolean).join('/')
    const basePath = segments ? `/items/${segments}` : '/items'

    const filteredFilters = { ...(filters || {}) }

    if (categorySlug) {
      delete filteredFilters.blockchain
    }
    if (slugSegment) {
      delete filteredFilters.slug
    }

    const nextQuery = qs.stringify({
      sort,
      filters: Object.keys(filteredFilters).length ? filteredFilters : undefined
    })
    const nextPathWithQuery = nextQuery ? `${basePath}?${nextQuery}` : basePath
    const normalizePath = (path: string) =>
      path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path

    const currentPath = normalizePath(asPath)
    const targetPath = normalizePath(nextPathWithQuery)

    if (targetPath !== currentPath) {
      const useShallow = !!(categorySlug || slugSegment)
      replace(nextPathWithQuery, undefined, useShallow ? { shallow: true } : {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFiltersState.filters, localFiltersState.sort, isReady])

  useEffect(() => {
    // When user navigates directly to a path param, sync it back to filters
    if (!isReady) return
    const pathCategory = getCategoryValue(pathParams[0])
    const pathSlug = pathParams[1]

    const currentCategory =
      Array.isArray(localFiltersState.filters?.blockchain) &&
      localFiltersState.filters?.blockchain[0]
    const currentSlug =
      typeof localFiltersState.filters?.slug === 'string'
        ? localFiltersState.filters?.slug
        : undefined

    // If no path params and no filters, or if path matches filters, mark as hydrated
    if (
      (!pathCategory && !pathSlug && !currentCategory && !currentSlug) ||
      (pathCategory === currentCategory && pathSlug === currentSlug)
    ) {
      pathHydratedRef.current = true
      return
    }

    clearAsyncData()
    setLocalFiltersState((prev) => ({
      ...prev,
      filters: (() => {
        const next = { ...(prev.filters || {}) }
        if (pathCategory) {
          next.blockchain = [pathCategory]
        } else {
          delete next.blockchain
        }
        if (pathSlug) {
          next.slug = pathSlug
        } else {
          delete next.slug
        }
        return next
      })(),
      paginate: { limit: LIMIT, offset: 0 }
    }))
    pathHydratedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathParams.join('/'), isReady])

  // Separate effect for API calls
  useEffect(() => {
    if (!isReady || !pathHydratedRef.current) return

    const { filters, paginate, sort } = localFiltersState
    call({
      limit: LIMIT,
      filters: filters || {},
      offset: paginate.offset,
      sort: ASSETS_SORT_TABS[tabIndex]?.value || ASSETS_SORT_TABS[0].value
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFiltersState, isReady, tabIndex])

  useComponentDidUpdate(
    (prev) => {
      if (!!prev.search && !search) {
        clearAsyncData()

        setLocalFiltersState((prev) => ({
          paginate: { ...prev.paginate, offset: 0 }
        }))
      }
    },
    { search }
  )

  const items = useMemo(() => {
    const count = Math.min(
      localFiltersState.paginate.offset + LIMIT,
      data?.paginate?.count ?? 0
    )

    return Array.from(
      { length: count },
      (_, index) => data?.records[index] ?? {}
    ) as AssetType[]
  }, [data?.paginate?.count, data?.records, localFiltersState.paginate.offset])

  return (
    <MainLayout
      title={
        currentCategoryLabel
          ? `${currentCategoryLabel} | Mercado`
          : 'Todos los artículos | Mercado'
      }
      description={
        currentCategoryLabel
          ? `Explora ${currentCategoryLabel.toLowerCase()} en Panamá.`
          : 'Explora todos los coleccionables: Pokémon, Monedas y más.'
      }
      className="px-0"
    >
      <motion.div
        initial={{ opacity: 0, y: -5, scale: 1.1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: 'easeOut', duration: 1, delay: 0.3 }}
        className="my-20 flex flex-col items-center justify-center"
      >
        <h1 className="font text-4xl font-extrabold tracking-tight text-slate-900 dark:text-gray-50 sm:text-8xl">
          {currentCategoryLabel || 'Todos los artículos'}
        </h1>
        <p className="mt-4 text-3xl tracking-tight text-slate-900 dark:text-gray-50">
          {currentCategoryLabel
            ? `Explora ${currentCategoryLabel.toLowerCase()} destacadas.`
            : 'Filtra por Pokémon, Monedas u Otros coleccionables.'}
        </p>
      </motion.div>
      <div className="relative flex items-start py-6 sm:py-8 md:py-10">
        <div className="flex w-full flex-col">
          <div className="z-1 sticky top-[72px] mx-auto flex w-full flex-col bg-white shadow-[0_10px_5px_-10px_rgba(0,0,0,0.2)] dark:bg-neutral-800">
            <div className="flex flex-col gap-3 px-3 py-3 md:grid md:grid-flow-col md:items-center md:px-6">
              <FilterBar<GetAssetsFiltersParamsType>
                filters={ASSETS_FILTERS}
                onCloseTag={onCloseTag}
                values={panelFilterState.filters || {}}
                onChange={onChangeFilters}
              />
              <div className="relative ml-auto flex md:mr-4">
                <div className="mt-1 flex">
                  <Suspense fallback={<AssetTabsPlaceholder />}>
                    <Tabs
                      tabs={ASSETS_SORT_TABS}
                      tabIndex={tabIndex}
                      setTabIndex={onChangeTab}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 pb-10 pt-4 sm:px-5 md:px-8">
            <div className="wrapper-items">
              <div className="items grided">
                {!isSuccess && !data?.paginate?.count
                  ? Array.from({ length: 24 }, (_, index) => (
                      <AssetItemPlaceholder key={index} />
                    ))
                  : items.map((item) => <Item key={item.token} item={item} />)}
                {isSuccess && items.length === 0 && (
                  <motion.div
                    variants={{
                      initial: {
                        opacity: 0
                      },
                      animate: {
                        opacity: 1
                      },
                      exit: {
                        opacity: 0
                      }
                    }}
                    className="flex h-full w-full flex-col items-center justify-center p-10 sm:p-16 md:p-20"
                  >
                    <div className="h-[16rem] w-[18rem] sm:h-[18rem] sm:w-[22rem] md:h-[20rem] md:w-[25rem]">
                      <EmptyIllustration />
                    </div>
                    <h2 className="mt-5 text-center text-2xl font-medium text-neutral-500 dark:text-neutral-50">
                      No se encontraron coleccionables
                    </h2>
                  </motion.div>
                )}
              </div>
            </div>
            <InfinityLoadChecker
              allowLoad={allowLoad}
              isLoading={isLoading}
              loadMore={loadMore}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
export default Items
