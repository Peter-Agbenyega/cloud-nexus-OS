import { createContext, useContext } from 'react'
import type { VaultRepository } from './repository'

export const VaultRepositoryContext = createContext<VaultRepository | null>(null)

export function useVaultRepository() {
  const repository = useContext(VaultRepositoryContext)

  if (!repository) {
    throw new Error('useVaultRepository must be used within VaultProvider')
  }

  return repository
}
