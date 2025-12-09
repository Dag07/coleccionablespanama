import { createContext } from 'react'
import { AssetFormContextType } from 'coleccionablespanama/shared/types'

const Context = createContext<Partial<AssetFormContextType>>({})

export default Context
