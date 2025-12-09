import { useContext, Context, useEffect } from 'react'
import { CollectionFormContextType } from 'coleccionablespanama/shared/types'
import { CheckIcon } from '@remixicons/react/fill'

const SelectStep4 = ({
  Context
}: {
  Context: Context<CollectionFormContextType>
}) => {
  const { setStep4Answered } = useContext<CollectionFormContextType>(Context)
  useEffect(() => {
    setStep4Answered(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <h3 className="text-xl font-bold">Verificación</h3>
      <div className="my-5">
        <p className="text-sm">
          Revisaremos si la imagen de portada contiene infracciones que puedan
          restringir su publicación. Si el archivo no cumple los requisitos,
          podrás corregirlo antes de publicarlo.
          <a className="block font-semibold text-blue-600">Leer más…</a>
        </p>
      </div>

      <div className="space-between my-8 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="relative flex items-center rounded-lg bg-neutral-100 p-2 text-neutral-700 transition duration-150 ease-in-out focus:outline-none dark:bg-neutral-700 dark:text-neutral-100">
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 px-1 py-1 text-neutral-700 focus:outline-none dark:bg-neutral-600 dark:text-neutral-200">
              <CheckIcon
                className="h-8 w-8 fill-green-600"
                strokeWidth="2"
                aria-hidden="true"
              />
            </div>
            <div className="ml-2 border-l border-gray-200 dark:border-neutral-500">
              <div className="ml-3">
                <p className="text-md font-medium">Derechos de autor</p>
                <p className="text-xs text-neutral-400">
                  No se encontraron infracciones.
                </p>
              </div>
            </div>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
          </div>
        </div>
      </div>
      <div className="py-2">
        <div className="w-full border-t border-gray-100 dark:border-neutral-700" />
      </div>
      <div>
        <p className="text-xs text-neutral-400">
          Ten en cuenta que esta es una revisión preliminar durante la carga. Si
          existen infracciones en tu portada, podrían detectarse después.
          <a className="ml-1 font-semibold text-blue-600">Leer más…</a>
        </p>
      </div>
    </div>
  )
}

export default SelectStep4
