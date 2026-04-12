import { createContext, useContext } from 'react'
import type { BrainRepository } from './brain.repository'

export const BrainRepositoryContext = createContext<BrainRepository | null>(null)

export function useBrainRepository() {
  const repository = useContext(BrainRepositoryContext)

  if (!repository) {
    throw new Error('useBrainRepository must be used within BrainRepositoryProvider')
  }

  return repository
}
