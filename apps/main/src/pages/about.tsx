import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'
import Parallax from '../components/home/parallax'
import MainLayout from '../layouts/main'

const AboutPage = (): JSX.Element => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: 'https://www.coleccionablespanama.com',
    logo: '/assets/shared/ui/images/logo.png',
    name: 'Coleccionables Panamá',
    description:
      'El mercado líder de coleccionables en Panamá. Especializado en monedas antiguas y cartas Pokémon.',
    foundingDate: '2025-01-01',
    foundingLocation: 'Ciudad de Panamá, Panamá'
  }
  return (
    <MainLayout
      title={'Sobre Nosotros'}
      description={'Mercado de coleccionables de Panamá'}
      className="px-0"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="item-jsonld"
        />
      </Head>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-full max-h-[calc(100vh_-_80px)] w-full overflow-hidden"
        >
          <div className="z-1 absolute inset-0 h-40 bg-gradient-to-b from-black/90"></div>
          <div className="z-1 absolute inset-0  bg-gradient-to-t from-blue-600/60 via-neutral-900/60 to-neutral-900/90" />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 1.1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: 'easeOut', duration: 1, delay: 0.3 }}
            className="absolute z-10 mt-[5rem] flex h-full w-full flex-col items-center justify-center"
          >
            <h1 className="font text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-8xl">
              Coleccionables de Panamá
            </h1>
            <p className=" mt-4 text-3xl tracking-tight text-slate-900 dark:text-slate-50">
              Descubre, colecciona y vende monedas antiguas y cartas Pokémon
              desde el corazón de Centroamérica.
            </p>
            <div className="mt-5">
              <Link
                href="/collections"
                className="relative inline-block rounded-full border border-transparent bg-blue-600 py-4 px-8 text-center text-2xl font-medium text-white hover:bg-blue-700"
              >
                Explorar
              </Link>
            </div>
          </motion.div>
          {/* <div className="relative z-10 flex w-full h-full flex-col items-center justify-center">
        </div> */}

          <Parallax />
        </motion.div>
      </AnimatePresence>

      <div className="px-8 pt-20">
        <h2 className="mb-4 text-3xl font-bold">
          ¿Qué es Coleccionables Panamá?
        </h2>
        <p className="mb-6 text-lg">
          Somos el mercado líder de coleccionables en Panamá, especializado en
          monedas antiguas y cartas Pokémon. Conectamos coleccionistas,
          vendedores y entusiastas desde el corazón de Centroamérica.
        </p>
        <h3 className="mb-3 text-2xl font-semibold">Nuestra Misión</h3>
        <p className="mb-6 text-lg">
          Facilitar el intercambio y subasta de coleccionables auténticos,
          preservando la historia y pasión por el coleccionismo en Panamá y toda
          Latinoamérica.
        </p>
        <h3 className="mb-3 text-2xl font-semibold">¿Por qué elegirnos?</h3>
        <ul className="mb-6 list-inside list-disc space-y-2 text-lg">
          <li>Plataforma segura y confiable operando desde Panamá</li>
          <li>
            Especialización en monedas antiguas panameñas e internacionales
          </li>
          <li>Amplia selección de cartas Pokémon auténticas</li>
          <li>Sistema de subastas transparente</li>
          <li>Comunidad activa de coleccionistas</li>
        </ul>
      </div>
    </MainLayout>
  )
}
export default AboutPage
