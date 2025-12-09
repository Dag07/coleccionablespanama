import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Parallax from './parallax'

const Hero = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative h-full max-h-[calc(100vh_-_80px)] w-full overflow-hidden"
      >
        <div className="pointer-events-none z-1 absolute inset-0 h-1/4 bg-gradient-to-b from-black/90"></div>
        <div className="pointer-events-none z-1 absolute -inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#010d47]"></div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 1.1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ease: 'easeOut', duration: 1, delay: 0.3 }}
          className="absolute z-10 flex h-full w-full flex-col items-center justify-center space-y-6 px-4"
        >
          <div className="pointer-events-none backdrop-blur-xs absolute inset-0 rounded-lg bg-black/40"></div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            El Marketplace de Coleccionables
            <span className="text-shadow-lg block bg-gradient-to-r from-amber-400 via-red-500 to-purple-500 bg-clip-text ">
              de Panamá
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative z-10 max-w-2xl text-center text-lg text-gray-200 sm:text-xl md:text-2xl"
          >
            Explora, subasta y colecciona.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="relative z-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/items/monedas"
              className="group relative overflow-hidden rounded-full border-2 border-amber-500 bg-amber-600 px-8 py-4 text-center text-xl font-semibold text-white shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Monedas</span>
            </Link>
            <Link
              href="/items/pokemon"
              className="group relative overflow-hidden rounded-full border-2 border-red-500 bg-red-600 px-8 py-4 text-center text-xl font-semibold text-white shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Pokémon</span>
            </Link>
            <Link
              href="/items/otros"
              className="duration-1500 group relative overflow-hidden rounded-full border-2 border-purple-500 bg-purple-600 px-8 py-4 text-center text-xl font-semibold text-white shadow-lg transition-all hover:scale-105  hover:shadow-xl"
            >
              <span className="relative z-10">Otros</span>
            </Link>
          </motion.div>
        </motion.div>
        <Parallax />
      </motion.div>
    </AnimatePresence>
  )
}
export default Hero
