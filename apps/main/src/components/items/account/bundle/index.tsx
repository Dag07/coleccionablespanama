import { BundleType } from 'coleccionablespanama/shared/types'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Viewer } from 'coleccionablespanama/text/viewer'
import { childVariants, variants } from '../../../forms/asset/constants'
import {
  ChatBubbleBottomCenterTextIcon,
  DocumentIcon,
  EyeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { isObjectEmpty } from '../../../../utils/helpers'
import { format } from 'date-fns'

const isSerializedEditorState = (value?: string): boolean => {
  if (!value || typeof value !== 'string') return false
  try {
    const parsed = JSON.parse(value)
    return !!parsed?.root?.type
  } catch (_e) {
    return false
  }
}

type Props = {
  item: BundleType
  onClickEdit: (item: BundleType) => void
}

/**
 * @name Item
 * @description Render a single item in the list.
 * @param {Props} props
 * @param {BundleProps} props.item
 * @returns {JSX.Element}
 * @example
 * <Item item={item} />
 */
export const Item = ({ item, onClickEdit }: Props): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false)

  const renderVisibility = useMemo(() => {
    const date = item.published_at || item.created_at

    switch (item.visibility) {
      case 'public':
        return (
          <>
            <div className="flex flex-col">
              <div className="flex items-center text-green-500">
                <EyeIcon className="mr-1 h-4 w-4" />
                <span className="">Público</span>
              </div>
              <span className="flex flex-col text-xs font-medium opacity-50">
                <span>Publicado:</span>{' '}
                <span>{date && format(new Date(date), 'dd LLL yyyy')}</span>
              </span>
            </div>
          </>
        )
      case 'draft':
        return (
          <>
            <div className="flex flex-col">
              <div className="flex items-center">
                <DocumentIcon className="mr-1 h-4 w-4" />
                <span className="">Borrador</span>
              </div>
              <span className="flex flex-col text-xs font-medium opacity-50">
                <span>Subido:</span>{' '}
                <span>{date && format(new Date(date), 'dd LLL yyyy')}</span>
              </span>
            </div>
          </>
        )
      case 'private':
        return (
          <div className="flex items-center">
            <EyeIcon className="mr-1 h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Privado</span>
          </div>
        )
      default:
        return null
    }
  }, [item.created_at, item.published_at, item.visibility])

  const renderRestrictions = useMemo(() => {
    switch (item.restrictions) {
      case 'none':
        return <span>Sin restricciones</span>
      case 'sensitive':
        return <span>Contenido sensible</span>
      case 'sensitive_auto':
        return <span>Contenido sensible</span>
      case 'complaint_copyright':
        return (
          <span className="text-red-500">Reclamo de derechos de autor</span>
        )
      default:
        return null
    }
  }, [item.restrictions])

  return (
    <div
      className="duration-350 group relative mx-auto grid h-[6rem] w-full grid-cols-[minmax(300px,_400px)_minmax(100px,_120px)_minmax(100px,_120px)_minmax(100px,_120px)_minmax(100px,_120px)] gap-x-1 py-1 text-sm transition hover:bg-white dark:hover:bg-neutral-800/95"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="z-2 ml-7 flex w-full flex-row items-center overflow-hidden p-1">
        <div
          className="h-17 w-17 relative flex flex-shrink-0 items-center justify-center rounded bg-neutral-200 focus:outline-none dark:bg-neutral-700"
          style={{ backgroundColor: item.cover.dominant_color || '' }}
        >
          <Image
            className="relative inline-block h-16 w-16 rounded"
            src={item?.cover.src}
            alt=""
            width={32}
            height={32}
          />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium">{item.name}</p>
          <motion.div
            className="w-[150px] truncate text-xs  font-medium text-neutral-500"
            initial={'visible'}
            variants={{
              visible: {
                height: '30px',
                opacity: 1,
                transition: {
                  duration: 0.2,
                  delay: 0.1,
                  when: 'beforeChildren',
                  staggerChildren: 0.1
                }
              },
              hidden: {
                height: '20px',
                opacity: 0.7,
                filter: 'blur(0.6px)',
                transition: {
                  duration: 0.2,
                  delay: 0.2
                }
              }
            }}
            animate={isHovered ? 'hidden' : 'visible'}
            exit={'visible'}
          >
            {isObjectEmpty(item.description) ? (
              <span className="text-xs font-medium opacity-50">
                Agrega una descripción
              </span>
            ) : isSerializedEditorState(item.description as string) ? (
              <Viewer
                namespace={'description'}
                editorState={item.description as string}
              />
            ) : (
              <p className="text-xs text-neutral-500">
                {typeof item.description === 'string' ? item.description : ''}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={'hidden'}
            variants={variants}
            animate={isHovered ? 'visible' : 'hidden'}
            exit={'hidden'}
          >
            <motion.div variants={childVariants}>
              <div className="grid auto-cols-max grid-flow-col items-center gap-2 py-2">
                <button
                  type="button"
                  title="Editar"
                  className="duration-250 relative m-0 box-border flex h-8 w-8 cursor-pointer touch-manipulation select-none list-none items-center justify-center rounded-full border-0 bg-neutral-200 p-0 decoration-0 outline-none transition ease-in-out hover:bg-blue-100 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                  onClick={
                    () => onClickEdit(item)
                    // setOpenedFormAssetModal({
                    //   open: true,
                    //   slug: item.slug,
                    //   title: item.name
                    // })
                  }
                >
                  <PencilSquareIcon
                    strokeWidth="2"
                    className="h-5 w-5 touch-manipulation select-none"
                  />
                </button>
                <button
                  type="button"
                  title="Administrar comentarios"
                  className="duration-250 relative m-0 box-border flex h-8 w-8 cursor-pointer touch-manipulation select-none list-none items-center justify-center rounded-full border-0 bg-neutral-200 p-0 decoration-0 outline-none transition ease-in-out hover:bg-blue-100 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                  onClick={() =>
                    void console.log('open modal for manage comments')
                  }
                >
                  <ChatBubbleBottomCenterTextIcon
                    strokeWidth="2"
                    className="h-5 w-5 touch-manipulation select-none"
                  />
                </button>
                <Link
                  href="/bundle/[slug]"
                  as={`/bundle/${encodeURIComponent(item.slug)}`}
                  className="duration-250 relative m-0 box-border flex h-8 w-8 cursor-pointer touch-manipulation select-none list-none items-center justify-center rounded-full border-0 bg-neutral-200 p-0 decoration-0 outline-none transition ease-in-out hover:bg-blue-100 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                  title={`View ${item.name} on the marketplace`}
                >
                  <EyeIcon
                    strokeWidth="2"
                    className="h-5 w-5 touch-manipulation select-none"
                  />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {item.items_count != null && item.items_count > 0 ? (
        <div className="justify-left flex flex-row items-center">
          <div className="flex -space-x-4 overflow-hidden">
            {item.preview_assets?.slice(0, 3).map((asset, index) => (
              <div
                key={index}
                className="flex-inline relative overflow-hidden rounded-full border-2"
              >
                <div
                  className="bg-base-300 h-8 w-8"
                  style={{
                    backgroundColor: asset.media.dominant_color || ''
                  }}
                >
                  <Image
                    className="relative inline-block h-9 w-9 rounded-full ring-1 ring-white"
                    src={asset.media.src || ''}
                    alt=""
                    width={36}
                    height={36}
                  />
                </div>
              </div>
            ))}
            {item.items_count > 3 && (
              <div className="flex-inline relative overflow-hidden rounded-full border-2">
                <div className="flex h-full w-8 items-center justify-center bg-neutral-200 dark:bg-neutral-700">
                  <div className="font-bold">+{item.items_count - 3}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="justify-left flex items-center">Sin artículos</div>
      )}
      <div className="justify-left flex items-center">{renderVisibility}</div>
      <div className="justify-left flex items-center">{renderRestrictions}</div>
      <div className="justify-left flex items-center">{item.blockchain}</div>
    </div>
  )
}
