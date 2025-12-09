import MainLayout from '../layouts/main'
import Hero from '../components/home/hero'
import Items from '../components/items'
import { AssetItemPlaceholder } from 'coleccionablespanama/shared/ui'
import { getAssets, useAsync } from 'coleccionablespanama/shared/api'
import {
  GetAssetsParamsType,
  GetAssetsResponseType
} from 'coleccionablespanama/shared/types'
import { MutableRefObject, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useOnScreen } from 'coleccionablespanama/usehooks'
import { motion } from 'framer-motion'

export default function Home(): JSX.Element {
  // Refs
  const assetsContainerRef = useRef<HTMLDivElement | null>(null)

  // Async hooks
  const {
    data: assetsData,
    call: assetsCall,
    // isLoading: assetsIsLoading,
    isSuccess: assetsIsSuccess
  } = useAsync<GetAssetsResponseType, GetAssetsParamsType>({
    callback: getAssets
  })

  // On screen hooks
  const assetsContainerOnScreen: boolean = useOnScreen<HTMLDivElement>(
    assetsContainerRef as MutableRefObject<HTMLDivElement>,
    '0px'
  )
  useEffect(() => {
    if (!assetsIsSuccess && assetsContainerOnScreen) {
      assetsCall({ limit: 15, offset: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsContainerOnScreen])

  return (
    <MainLayout
      title={'Panama Collectors | Todos los artículos'}
      description={
        'Compra, vende y subasta Pokémon, monedas y otros coleccionables en Panamá.'
      }
      className="px-0"
    >
      <Hero />
      <div className="bg-[#010d47] px-8 pt-10" ref={assetsContainerRef}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 1.1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ease: 'easeOut', duration: 1, delay: 0.3 }}
          className="z-10 my-[5rem] flex h-full w-full flex-col items-center justify-center"
        >
          <h1 className="font text-4xl font-extrabold tracking-tight text-slate-900 dark:text-blue-500 sm:text-8xl">
            Todos los artículos
          </h1>
          <p className=" mt-4 text-3xl tracking-tight text-slate-900 dark:text-blue-500">
            Filtra por Pokémon, Monedas u Otros y encuentra tu próxima pieza.
          </p>
          <div className="mt-10">
            <Link
              href="/items"
              className="relative inline-block rounded-full border border-transparent bg-blue-600 py-4 px-8 text-center text-2xl font-medium text-white hover:bg-blue-700"
            >
              Ver todos los artículos
            </Link>
          </div>
        </motion.div>
        {/* <div className="flex flex-row items-center justify-center">
          <div className="">
            <h3 className="font-semibold">Top Collections</h3>
          </div>
          <div className="right-0 ml-auto">
            <Link
              href="/collections"
              className="mb-1 w-full rounded-[7px] bg-gray-200 p-3 text-gray-900 transition duration-150 ease-in-out hover:bg-gray-300 focus:outline-none dark:bg-neutral-700 dark:text-gray-50"
            >
              Ver todas las colecciones
            </Link>
          </div>
        </div> */}
        {!assetsIsSuccess && !assetsData?.paginate?.count ? (
          <div className="items-slider">
            <div className="wrapper-items">
              <div className="items carousel">
                <div className="min-w-[44px]" />
                {Array.from({ length: 6 }, (_, index) => (
                  <AssetItemPlaceholder key={index} />
                ))}
                <div className="min-w-[44px]" />
              </div>
            </div>
          </div>
        ) : (
          assetsData?.records && (
            <Items type="asset" items={assetsData?.records} />
          )
        )}
      </div>
    </MainLayout>
  )
}
