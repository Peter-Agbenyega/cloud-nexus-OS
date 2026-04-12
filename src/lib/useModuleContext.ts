import { createContext, useContext } from 'react'
import type { HashRoute } from './hashRoute'
import type { ModuleDefinition, ModuleId } from '../routes/modules'

export type ModuleNavigate = (moduleId: ModuleId, subpath?: string | string[]) => void

export type ActiveModuleContextValue = {
  activeModule: ModuleDefinition
  route: HashRoute
  navigate: ModuleNavigate
}

export const ActiveModuleContext = createContext<ActiveModuleContextValue | null>(null)

export function useOptionalActiveModule() {
  return useContext(ActiveModuleContext)
}

export function useActiveModule() {
  const value = useOptionalActiveModule()

  if (!value) {
    throw new Error('useActiveModule must be used within ActiveModuleContext')
  }

  return value
}
