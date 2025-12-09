import MainLayout from '../../../layouts/main'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getAsset } from 'coleccionablespanama/shared/api'
import {
  GetAssetResponseType,
  AssetType
} from 'coleccionablespanama/shared/types'
import { SVGProps, useEffect, useMemo, useState } from 'react'
import Tabs from '../../../components/asset/tabs'
import { Info } from '../../../components/asset/tabs/info'
import { Owners } from '../../../components/asset/tabs/owners'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Viewer } from 'coleccionablespanama/text/viewer'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import BidPanel from '../../../components/asset/bid-panel'
import {
  getCategoryValue,
  getCategoryLabel,
  getCategorySlug
} from '../../../utils/categories'

const isObjectEmpty = (value: object | string) =>
  typeof value === 'object' ? Object.keys(value).length === 0 : !value

const isSerializedEditorState = (value?: string): boolean => {
  if (!value || typeof value !== 'string') return false
  try {
    const parsed = JSON.parse(value)
    return !!parsed?.root?.type
  } catch (_e) {
    return false
  }
}

const TABS = [
  { title: 'Detalles', value: 'info' },
  { title: 'Propietarios', value: 'owners' },
  { title: 'Historial', value: 'history' },
  { title: 'Ofertas', value: 'bids' }
]

interface BreadcrumbProps {
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
  name: string
  href?: string
}

export default function ItemDetail() {
  const router = useRouter()
  const { category, slug } = router.query as {
    category?: string
    slug?: string
  }
  const breadcrumb: BreadcrumbProps[] = useMemo(() => [], [])
  const [isHovered, setHovered] = useState(false)
  const [tagsZoneHovered, setTagsZoneHovered] = useState(false)

  const [detail, setDetail] = useState<AssetType | null>(null)
  const [isError, setError] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const renderTabContent = useMemo(() => {
    switch (tabIndex) {
      case 0:
        return <Info />
      case 1:
        return <Owners />
      default:
        return null
    }
  }, [tabIndex])

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady || !slug) return

      try {
        const data: GetAssetResponseType = await getAsset(slug as string)
        if (data && data.record) {
          const detectedCategory = getCategorySlug(data.record.blockchain)
          const targetCategory = category || detectedCategory
          const canonicalPath = `/items/${targetCategory}/${data.record.slug}`

          if (router.asPath !== canonicalPath) {
            router.replace(canonicalPath, undefined, { shallow: true })
          }

          breadcrumb.push(
            {
              icon: HomeIcon,
              name: 'Inicio',
              href: '/'
            },
            {
              icon: ChevronRightIcon,
              name: getCategoryLabel(targetCategory) || 'Artículos',
              href: `/items/${targetCategory}`
            },
            {
              icon: ChevronRightIcon,
              name: data.record.name,
              href: canonicalPath
            }
          )
          setDetail(data.record)
        } else {
          setError(true)
        }
      } catch (error) {
        setError(true)
      }
    }
    fetchData()

    return () => {
      setError(false)
      setDetail(null)
      breadcrumb.length = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, category, router.isReady])

  const renderBreadcrumb = useMemo(() => {
    return (
      <nav
        className="flex rounded-lg border border-t border-gray-100 px-5 py-5 text-slate-900 shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        aria-label="Ruta de navegación"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumb &&
            breadcrumb.map((item) => (
              <li key={item.name} className="inline-flex items-center">
                <Link
                  href={item.href || ''}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.icon && (
                    <item.icon className="mr-2 h-5 w-5 " aria-hidden="true" />
                  )}
                  {item.name}
                </Link>
              </li>
            ))}
        </ol>
      </nav>
    )
  }, [breadcrumb])

  const renderTags = useMemo(() => {
    const randomColor = () => {
      const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-gray-800',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500'
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }
    if (!detail?.tags || detail.tags.length === 0) return null

    return (
      <div className="inline-flex flex-wrap items-start justify-start space-x-2">
        {detail.tags.map((tag, idx) => {
          const isString = typeof tag === 'string'
          const tagSlug = isString ? tag : tag?.slug ?? String(tag)
          const name = isString ? tag : tag?.name ?? tag?.slug ?? String(tag)

          return (
            <Link
              href={`/tag/${encodeURIComponent(tagSlug)}`}
              key={`${tagSlug}-${idx}`}
              className={classNames(
                randomColor(),
                'flex items-center justify-center rounded px-2 pt-2 pb-1.5 shadow drop-shadow hover:opacity-100'
              )}
            >
              <p className="text-xs font-bold uppercase leading-3 text-gray-50">
                {name}
              </p>
            </Link>
          )
        })}
      </div>
    )
  }, [detail])

  if (isError) return <div>Error al cargar</div>
  if (!detail) return null

  return (
    <>
      <MainLayout
        title={detail?.name || '...'}
        description={
          typeof detail?.description === 'string' ? detail?.description : '...'
        }
        className="container"
      >
        <div className="2xl:gap-x-13 grid gap-y-16 py-24 px-4 sm:grid-cols-1 sm:gap-x-2 md:grid-cols-[1fr,350px] md:gap-x-4 lg:grid-cols-[1fr,400px]  lg:gap-x-8 xl:gap-x-10">
          <div className="col-span-full row-start-1">{renderBreadcrumb}</div>
          <div className="row-span-2 row-start-2 lg:mr-10">
            <motion.div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative flex h-full w-full"
            >
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent dark:bg-transparent" />
              {detail?.media?.src && (
                <>
                  <Image
                    src={detail.media.src}
                    style={{
                      backgroundColor: 'transparent'
                    }}
                    alt={detail.name}
                    width={400}
                    height={400}
                    className="z-1 absolute h-full w-full overflow-hidden rounded-2xl object-contain object-center"
                    unoptimized
                  />
                  <motion.div
                    initial={'visible'}
                    variants={{
                      visible: { opacity: 1, transition: { delay: 0.1 } },
                      hidden: { opacity: 0 }
                    }}
                    animate={
                      isHovered && !tagsZoneHovered ? 'hidden' : 'visible'
                    }
                    exit={'visible'}
                    onMouseEnter={() => setTagsZoneHovered(true)}
                    onMouseLeave={() => setTagsZoneHovered(false)}
                    className="absolute z-10 flex w-full flex-shrink-0 px-5 pt-5 pb-10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {renderTags}
                  </motion.div>
                  <motion.div
                    initial={'hidden'}
                    variants={{
                      visible: { opacity: 0.5, transition: { delay: 0.1 } },
                      hidden: { opacity: 0 }
                    }}
                    animate={isHovered ? 'visible' : 'hidden'}
                    exit={'hidden'}
                    className="absolute inset-0 flex items-center justify-center group-hover:opacity-0"
                  >
                    <Image
                      src={detail.media.src}
                      alt={detail.name}
                      width={400}
                      height={400}
                      style={{ backgroundColor: 'transparent' }}
                      className="absolute inset-0 z-0 h-full w-full overflow-hidden rounded-2xl object-contain object-center blur-xl"
                      unoptimized
                    />
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
          <div className="row-start-2 row-end-4">
            <div className="grid grid-cols-1 gap-y-7">
              <div className="flex w-full flex-col items-start justify-center space-y-2">
                <div className="flex space-x-2.5">
                  <p className="w-full text-4xl font-bold leading-10 text-slate-900 dark:text-slate-50">
                    {detail?.name}
                  </p>
                </div>
                <div className="inline-flex items-center justify-start space-x-2">
                  <div className="ml-auto flex items-center justify-center rounded border-2 border-green-500 px-1 py-1 text-sm font-bold text-green-500">
                    <span>8 PSA</span>
                  </div>
                  <div className="ml-auto flex items-center justify-center rounded border-2 border-gray-200 px-1 py-1 text-sm font-bold text-gray-500 dark:border-neutral-700">
                    <span>$100</span>
                  </div>
                  <p className="text-sm font-bold leading-none text-gray-500">
                    {detail?.available_supply_units} en stock
                  </p>
                </div>
              </div>
              <div className="text-base leading-normal text-slate-900 dark:text-slate-50">
                {detail?.description && isObjectEmpty(detail.description) ? (
                  <span className="text-xs font-medium opacity-50">
                    Sin descripción
                  </span>
                ) : isSerializedEditorState(detail?.description as string) ? (
                  <Viewer
                    namespace={'description'}
                    editorState={detail?.description as string}
                  />
                ) : detail?.description ? (
                  <p>{detail.description as string}</p>
                ) : null}
              </div>
              <div className="flex flex-col space-y-2.5">
                <Tabs
                  tabs={TABS}
                  tabIndex={tabIndex}
                  setTabIndex={setTabIndex}
                />
                {renderTabContent}
              </div>
              <BidPanel asset={detail} />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}
