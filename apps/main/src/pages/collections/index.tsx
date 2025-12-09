import { useRouter } from 'next/router'
import { ReactComponent as EmptyIllustration } from '../../assets/empty.svg'
import {
  AssetTabsPlaceholder,
  CollectionItemPlaceholder,
  AssetItemPlaceholder
} from 'coleccionablespanama/shared/ui'
import qs from 'qs'
import MainLayout from '../../layouts/main'
import {
  useAsync,
  getCollections,
  getAssets
} from 'coleccionablespanama/shared/api'
import {
  CollectionType,
  GetCollectionsResponseType,
  GetCollectionsParamsType
} from 'coleccionablespanama/shared/types'
import {
  AssetType,
  GetAssetsParamsType,
  GetAssetsResponseType
} from 'coleccionablespanama/shared/types'
import Item from '../../components/items/collection/item'
import AssetItem from '../../components/items/asset/item'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { InfinityLoadChecker } from '../../components/common/infinityLoadChecker'
import { useComponentDidUpdate } from 'coleccionablespanama/usehooks'
import { GetCollectionsFiltersParamsType } from 'coleccionablespanama/shared/types'

import {
  TypeProps,
  OnChangeValueProps
} from '../../components/common/filterBar/types'

import FilterBar from '../../components/common/filterBar'
import { BLOCKCHAIN_CHECKS } from '../../constants/user/assets'
import { motion } from 'framer-motion'
import { COLLECTIONS_SORT_TABS } from '../../constants/collections'
import classNames from 'classnames'

const COLLECTIONS_FILTERS = [
  {
    title: 'Categoría',
    value: 'blockchain',
    type: TypeProps.ARRAY,
    options: BLOCKCHAIN_CHECKS
  },
  {
    title: 'Artículos Incluidos',
    value: 'cached_assets_count',
    type: TypeProps.RANGE,
    params: {
      firstTitle: 'mín',
      secondTitle: 'máx',
      firstKey: 'ge',
      secondKey: 'le'
    }
  }
]

const Tabs = lazy(() => import('../../components/asset/tabs'))

const mapper = (
  data: GetCollectionsResponseType,
  prev?: GetCollectionsResponseType
): GetCollectionsResponseType => {
  if (prev && Object.keys(prev).length) {
    return { ...prev, ...data, records: [...prev.records, ...data.records] }
  }

  return data
}

const LIMIT = 20

type QueryFiltersProps = {
  paginate: {
    limit: number
    offset: number
  }
  filters?: GetCollectionsFiltersParamsType
  sort?: string
}

const Collections = () => {
  const { replace, asPath } = useRouter()
  const search = asPath.split('?')[1] ?? ''
  const params = qs.parse(search) as Omit<QueryFiltersProps, 'paginate'>
  const [viewMode, setViewMode] = useState<'collections' | 'items'>('items')

  const [localFiltersState, setLocalFiltersState] = useState<QueryFiltersProps>(
    {
      paginate: {
        limit: LIMIT,
        offset: 0
      },
      ...params
    }
  )

  const onChangeFilters = (key: string, value: OnChangeValueProps) => {
    clearAsyncData()

    setLocalFiltersState((prev) => ({
      ...prev,
      paginate: { limit: LIMIT, offset: 0 },
      filters: { ...prev.filters, [key]: value }
    }))
  }

  const onCloseTag = (key: keyof GetCollectionsFiltersParamsType) => {
    const { [key]: deletedProp, ...rest } = localFiltersState.filters || {}
    clearAsyncData()

    setLocalFiltersState((prev) => ({
      ...prev,
      filters: { ...rest },
      paginate: { limit: LIMIT, offset: 0 }
    }))
  }

  const { data, call, isLoading, isSuccess, clearAsyncData } = useAsync<
    GetCollectionsResponseType,
    GetCollectionsParamsType
  >({
    callback: getCollections,
    mapper
  })

  const {
    data: assetsData,
    call: callAssets,
    isLoading: isAssetsLoading,
    isSuccess: isAssetsSuccess,
    clearAsyncData: clearAssetsData
  } = useAsync<GetAssetsResponseType, GetAssetsParamsType>({
    callback: getAssets,
    mapper
  })

  const [assetsPaginate, setAssetsPaginate] = useState({
    limit: LIMIT,
    offset: 0
  })

  const { paginate, ...panelFilterState } = localFiltersState

  const allowLoad = data
    ? !isLoading && data?.records.length < data?.paginate?.count
    : false

  const tabIndex = useMemo(() => {
    const index = COLLECTIONS_SORT_TABS.findIndex(
      (tab) => tab.value === localFiltersState?.sort
    )

    return index >= 0 ? index : 0
  }, [localFiltersState?.sort])

  const onChangeTab = (index: number) => {
    const tab = COLLECTIONS_SORT_TABS[index]

    clearAsyncData()
    setLocalFiltersState((prev) => ({ ...prev, sort: tab.value }))
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

  useEffect(() => {
    const { filters, paginate, sort } = localFiltersState
    const nextQuery = qs.stringify({ filters, sort })
    if (nextQuery !== search) {
      replace(`/collections?${nextQuery}`)
    }

    if (viewMode === 'collections') {
      call({
        limit: LIMIT,
        offset: paginate.offset,
        filters: filters || {},
        sort:
          COLLECTIONS_SORT_TABS[tabIndex]?.value ||
          COLLECTIONS_SORT_TABS[0].value
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFiltersState, viewMode])

  useEffect(() => {
    if (viewMode !== 'items') return
    callAssets({
      limit: assetsPaginate.limit,
      offset: assetsPaginate.offset
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, assetsPaginate])

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
    ) as CollectionType[]
  }, [data?.paginate?.count, data?.records, localFiltersState.paginate.offset])

  const assetItems = useMemo(() => {
    const count = Math.min(
      assetsPaginate.offset + LIMIT,
      assetsData?.paginate?.count ?? 0
    )

    return Array.from(
      { length: count },
      (_, index) => assetsData?.records[index] ?? {}
    ) as AssetType[]
  }, [assetsData?.paginate?.count, assetsData?.records, assetsPaginate.offset])

  const onChangeViewMode = (mode: 'collections' | 'items') => {
    setViewMode(mode)
    if (mode === 'collections') {
      clearAssetsData()
      setAssetsPaginate({ limit: LIMIT, offset: 0 })
    }
  }

  return (
    <MainLayout
      title={'Todos los artículos | Mercado de Coleccionables'}
      description={
        'Explora artículos por categorías: Pokémon, Monedas y Otros.'
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
          Explora artículos y colecciones
        </h1>
        <p className="mt-4 text-3xl tracking-tight text-slate-900 dark:text-gray-50">
          Alterna entre artículos y colecciones, y filtra por Pokémon, Monedas u
          Otros.
        </p>
      </motion.div>
      <div className="flex w-full flex-col">
        <div className="z-1 sticky top-[82px] mx-auto flex w-full flex-col bg-white shadow-[0_10px_5px_-10px_rgba(0,0,0,0.2)] dark:bg-neutral-800">
          <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 md:px-8 md:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-700">
                <button
                  type="button"
                  onClick={() => onChangeViewMode('collections')}
                  className={classNames(
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    viewMode === 'collections'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-800 dark:text-slate-50'
                      : 'text-gray-600 hover:text-slate-900 dark:text-gray-200 dark:hover:text-white'
                  )}
                >
                  Ver colecciones
                </button>
                <button
                  type="button"
                  onClick={() => onChangeViewMode('items')}
                  className={classNames(
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    viewMode === 'items'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-800 dark:text-slate-50'
                      : 'text-gray-600 hover:text-slate-900 dark:text-gray-200 dark:hover:text-white'
                  )}
                >
                  Todos los artículos
                </button>
              </div>
              {viewMode === 'collections' && (
                <div className="relative ml-auto flex">
                  <div className="mt-2 flex">
                    <Suspense fallback={<AssetTabsPlaceholder />}>
                      <Tabs
                        tabs={COLLECTIONS_SORT_TABS}
                        tabIndex={tabIndex}
                        setTabIndex={onChangeTab}
                      />
                    </Suspense>
                  </div>
                </div>
              )}
            </div>
            {viewMode === 'collections' && (
              <div className="grid grid-flow-col">
                <FilterBar<GetCollectionsFiltersParamsType>
                  filters={COLLECTIONS_FILTERS}
                  onCloseTag={onCloseTag}
                  values={panelFilterState.filters || {}}
                  onChange={onChangeFilters}
                />
              </div>
            )}
          </div>
        </div>
        <div className="m-8">
          <div className="wrapper-items">
            <div className="items grided">
              {viewMode === 'collections' ? (
                <>
                  {!isSuccess && !data?.paginate?.count
                    ? Array.from({ length: 24 }, (_, index) => (
                        <CollectionItemPlaceholder key={index} />
                      ))
                    : items.map((item) => (
                        <Item key={item.token} item={item} />
                      ))}
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
                      className="flex h-full w-full flex-col items-center justify-center p-20"
                    >
                      <div className="h-[20rem] w-[25rem]">
                        <EmptyIllustration />
                      </div>
                      <h2 className="mt-5 text-2xl font-medium text-neutral-500 dark:text-neutral-50">
                        No se encontraron colecciones
                      </h2>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  {!isAssetsSuccess && !assetsData?.paginate?.count
                    ? Array.from({ length: 24 }, (_, index) => (
                        <AssetItemPlaceholder key={index} />
                      ))
                    : assetItems.map((item) => (
                        <AssetItem key={item.token} item={item} />
                      ))}
                  {isAssetsSuccess && assetItems.length === 0 && (
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
                      className="flex h-full w-full flex-col items-center justify-center p-20"
                    >
                      <div className="h-[20rem] w-[25rem]">
                        <EmptyIllustration />
                      </div>
                      <h2 className="mt-5 text-2xl font-medium text-neutral-500 dark:text-neutral-50">
                        No se encontraron artículos
                      </h2>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
          {viewMode === 'collections' ? (
            <InfinityLoadChecker
              allowLoad={allowLoad}
              isLoading={isLoading}
              loadMore={loadMore}
            />
          ) : (
            <InfinityLoadChecker
              allowLoad={
                assetsData
                  ? !isAssetsLoading &&
                    assetItems.length < (assetsData?.paginate?.count || 0)
                  : false
              }
              isLoading={isAssetsLoading}
              loadMore={() =>
                setAssetsPaginate((prev) => ({
                  ...prev,
                  offset: prev.offset + LIMIT
                }))
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
export default Collections
