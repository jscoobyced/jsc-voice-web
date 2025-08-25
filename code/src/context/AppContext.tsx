import { createContext } from 'react'

interface AppContext {
  id: string
}

const defaultContext: AppContext = {
  id: 'defaultId',
}

const MyContext = createContext({
  id: '',
} as AppContext)

export default MyContext
export { defaultContext }
export type { AppContext }
