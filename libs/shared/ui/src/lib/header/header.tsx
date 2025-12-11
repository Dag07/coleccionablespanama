import Link from 'next/link'
import Image from 'next/image'
import logo from '../../assets/favicon/coleccionablespanama.png'
import { Fragment, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { GalleryIcon, ImageAddIcon } from '@remixicons/react/line'
import ProfileMenu from './components/dropdowns/profile'
import { Search } from './components/search/main'
import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  usePresence,
  useWillChange
} from 'framer-motion'

const pagesLinks = [
  {
    name: 'Cartas Coleccionables',
    description: 'Cartas y colecciones Pokémon seleccionadas.',
    href: '/cartas',
    icon: ChartBarIcon
  },
  {
    name: 'Numismática',
    description: 'Monedas antiguas y conmemorativas.',
    href: '/numismatica',
    icon: ChartBarIcon
  },
  {
    name: 'Otros',
    description: 'Otros coleccionables únicos.',
    href: '/items/otros',
    icon: ChartBarIcon
  }
]
const createButtons = [
  {
    name: 'Agregar Coleccionable',
    key: 'asset',
    description: 'Publica tu coleccionable para venta o subasta',
    icon: ImageAddIcon
  },
  {
    name: 'Agregar Colección',
    key: 'collection',
    description: 'Organiza tus coleccionables en una colección',
    icon: GalleryIcon
  }
]

type Props = {
  currency: string
  address: string | undefined
  balance: number
  isAuth: boolean
  onAuth?: () => void
  onCreate?: (key: string) => void
  onLogOut: () => void
}

const Header = ({
  currency,
  onAuth,
  onCreate,
  balance,
  address,
  isAuth,
  onLogOut
}: Props): JSX.Element => {
  const [isPresent, safeToRemove] = usePresence()

  useEffect(() => {
    !isPresent && setTimeout(safeToRemove, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent])

  const willChange = useWillChange()

  return (
    <header className="header sticky top-0 z-50 bg-white/90 shadow-md backdrop-blur transition duration-300 dark:bg-neutral-800/90">
      <Popover>
        <div className="mx-auto px-3 sm:px-4 lg:px-8">
          <div className="align-center flex items-center justify-between gap-3 py-3 md:justify-start md:gap-6 md:py-4">
            <div className="mr-auto flex min-w-[44px] justify-start">
              <Link
                href={'/'}
                title="Ir al inicio"
                className="fill-[#23262F] dark:fill-[#F4F5F6]"
              >
                <>
                  <span className="block sm:hidden">
                    <Image
                      src={logo}
                      alt="Coleccionables Panamá"
                      width={38}
                      height={38}
                      className="h-12 w-auto"
                    />
                  </span>
                  <span className="hidden sm:block">
                    <Image
                      src={logo}
                      alt="Coleccionables Panamá"
                      width={120}
                      height={32}
                      className="h-12 w-auto"
                    />
                  </span>
                </>
              </Link>
            </div>
            <div className="hidden flex-1 px-3 md:block">
              <Search />
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <Popover.Button className="mb-1 inline-flex items-center rounded-full bg-gray-600 p-2 text-gray-100 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:hover:bg-neutral-600">
                <span className="sr-only">Abrir menú</span>
                <Bars3Icon
                  className="h-6 w-6"
                  strokeWidth="2"
                  aria-hidden="true"
                />
              </Popover.Button>
            </div>
            <Popover.Group
              as="nav"
              className="mr-0 hidden space-x-10 md:mr-auto md:flex md:space-x-6"
            >
              <Link
                href={'/cartas'}
                className="text-base font-medium text-slate-900 hover:text-slate-800 dark:text-slate-50 dark:hover:text-slate-300"
              >
                Cartas
              </Link>
              <Link
                href={'/numismatica'}
                className="text-base font-medium text-slate-900 hover:text-slate-800 dark:text-slate-50 dark:hover:text-slate-300"
              >
                Numismática
              </Link>
              <Link
                href={'/items/otros'}
                className="text-base font-medium text-slate-900 hover:text-slate-800 dark:text-slate-50 dark:hover:text-slate-300"
              >
                Otros
              </Link>
            </Popover.Group>

            <motion.div
              // layout

              variants={{
                enter: () => ({
                  zIndex: 0,
                  opacity: 0,
                  scale: 0.9,
                  with: 'auto',
                  transition: {
                    duration: 0.2,
                    delay: 0.1
                  },
                  transitionBegin: {
                    zIndex: -1,
                    opacity: 0
                  }
                }),
                center: () => ({
                  zIndex: 1,
                  opacity: 1,
                  scale: 1,
                  width: 'auto',
                  transition: {
                    duration: 0.3,
                    delay: 0.1
                  }
                }),
                exit: () => ({
                  zIndex: 1,
                  opacity: 0,
                  scale: 0.9,
                  width: 'auto',
                  transition: {
                    duration: 0.2,
                    delay: 0.1
                  }
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative"
              style={{ willChange }}
            >
              {!isAuth && (
                <motion.div
                  layout
                  layoutId="noauth"
                  className="flex items-center justify-end"
                  style={{ willChange }} // Prevents layout animation on initial render
                >
                  <button
                    type="button"
                    className="relative ml-5 inline-block rounded-md border border-transparent bg-blue-600 py-2 px-6 text-center font-medium text-white hover:bg-blue-700"
                    onClick={() => onAuth?.()}
                  >
                    Iniciar Sesión
                  </button>
                </motion.div>
              )}
              {isAuth && (
                <motion.div
                  layout
                  layoutId="auth"
                  className="ml-5 hidden items-center justify-end md:flex"
                  style={{ willChange }} // Prevents layout animation on initial render
                >
                  <Popover className="align-center relative mr-5 flex rounded-full bg-white/95 backdrop-blur dark:bg-neutral-800/95">
                    {({ open, close }) => (
                      <>
                        <Popover.Button
                          title="Agregar artículos"
                          aria-label="Agregar artículos"
                          className={`${
                            open
                              ? 'bg-blue-50 dark:bg-blue-500/20'
                              : 'bg-neutral-200 dark:bg-neutral-700'
                          } duration-250 relative m-0 box-border  flex h-10 w-10 cursor-pointer touch-manipulation select-none list-none items-center justify-center rounded-full border-0 p-0 decoration-0 outline-none transition ease-in-out hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-neutral-600`}
                        >
                          <PlusIcon
                            strokeWidth="3"
                            className={`${
                              open ? 'text-blue-500' : 'text-slate-900'
                            } w-5 touch-manipulation select-none list-none border-0 decoration-0 outline-none dark:text-slate-50`}
                          />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-1/2 z-10 mt-14 w-screen max-w-xs -translate-x-1/2 transform sm:px-0">
                            <div className="overflow-hidden rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 drop-shadow-lg dark:bg-neutral-800">
                              <div className="relative grid gap-1 p-1">
                                {createButtons.map((item) => (
                                  <button
                                    key={item.key}
                                    type="button"
                                    className="flex items-center rounded-lg p-2 text-neutral-700 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
                                    onClick={() => {
                                      onCreate?.(item.key)
                                      close()
                                    }}
                                  >
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 px-1 py-1 text-neutral-700 focus:outline-none dark:bg-neutral-700 dark:fill-neutral-200 dark:text-neutral-200">
                                      <item.icon
                                        className="h-6 w-6 flex-shrink-0 fill-slate-900 dark:fill-slate-50"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div className="text-left">
                                      <p className="ml-4 text-base font-medium">
                                        {item.name}
                                      </p>
                                      <p className="ml-4 text-sm text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                  <div className="flex items-center">
                    <ProfileMenu
                      currency={currency}
                      address={address}
                      balance={balance}
                      onLogOut={onLogOut}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
            {/* </AnimateSharedLayout> */}
          </div>
        </div>
        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
          >
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800">
              <div className="px-5 pt-5 pb-6">
                <div className="flex items-center justify-between">
                  <Link
                    href={'/'}
                    className="fill-[#23262F] focus:outline-none dark:fill-[#F4F5F6]"
                  >
                    <Image
                      src={logo}
                      alt="Coleccionables Panamá"
                      width={120}
                      height={32}
                      className="h-12 w-auto"
                    />
                  </Link>
                  <div className="-mr-2">
                    <Popover.Button className="mb-1 w-full rounded-full bg-gray-600 px-2 py-2 font-medium text-gray-100 hover:bg-gray-500 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600">
                      <span className="sr-only">Cerrar menú</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {pagesLinks.map((item) => (
                      <Link
                        href={item.href}
                        key={item.href}
                        className="-m-3 flex w-full items-center rounded-md px-2 py-3 font-medium text-gray-100 hover:bg-gray-500 focus:outline-none dark:hover:bg-stone-600"
                      >
                        <>
                          <item.icon
                            className="h-6 w-6 flex-shrink-0 text-slate-900 dark:text-slate-50"
                            aria-hidden="true"
                          />
                          <span className="ml-3 text-base font-medium text-slate-900 dark:text-slate-50">
                            {item.name}
                          </span>
                        </>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="space-y-6 py-6 px-5">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {createButtons.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                      onClick={() => {
                        onCreate?.(item.key)
                      }}
                    >
                      {item.name}.
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  )
}

export default Header
