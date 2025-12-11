import MainLayout from '../../layouts/main'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getAsset } from 'coleccionablespanama/shared/api'
import {
  GetAssetResponseType,
  AssetType
} from 'coleccionablespanama/shared/types'
import { SVGProps, useEffect, useMemo, useState } from 'react'
import Tabs from '../../components/asset/tabs'
import { Info } from '../../components/asset/tabs/info'
import { Owners } from '../../components/asset/tabs/owners'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Viewer } from 'coleccionablespanama/text/viewer'
import { motion } from 'framer-motion'
import BidPanel from '../../components/asset/bid-panel'
import {
  getCategoryValue,
  getCategoryLabel,
  getCategorySlug
} from '../../utils/categories'

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

export default function NumismaticaDetail() {
  const router = useRouter()
  const { slug } = router.query as {
    slug?: string
  }
  const CATEGORY = 'numismatica'
  const breadcrumb: BreadcrumbProps[] = useMemo(() => [], [])

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
          const canonicalPath = `/numismatica/${data.record.slug}`

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
              name: 'Numismática',
              href: '/numismatica'
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
  }, [slug, router.isReady])

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
        <div className="2xl:gap-x-13 grid gap-y-8 py-8 px-4 sm:py-16 md:grid-cols-[1fr,350px] md:gap-x-4 md:gap-y-16 md:py-24 lg:grid-cols-[1fr,400px] lg:gap-x-8 xl:gap-x-10">
          <div className="col-span-full">{renderBreadcrumb}</div>

          {/* Image section - comes first on mobile */}
          <div className="md:row-span-2">
            <motion.div className="relative mx-auto flex h-full min-h-[400px] w-full sm:min-h-[500px] md:min-h-0 md:max-w-md lg:max-w-lg">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent dark:bg-transparent" />
              {detail?.media?.src && (
                <Image
                  src={detail.media.src}
                  style={{
                    backgroundColor: 'transparent'
                  }}
                  alt={detail.name}
                  width={600}
                  height={600}
                  className="z-1 absolute h-full w-full overflow-hidden rounded-2xl object-contain object-center"
                  unoptimized
                />
              )}
            </motion.div>
          </div>

          {/* Content section */}
          <div>
            <div className="grid grid-cols-1 gap-y-7">
              <div className="flex w-full flex-col items-start justify-center space-y-2">
                <div className="flex space-x-2.5">
                  <p className="w-full text-4xl font-bold leading-10 text-slate-900 dark:text-slate-50">
                    {detail?.name}
                  </p>
                </div>
                <div className="inline-flex items-center justify-start space-x-2"></div>
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
