import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { createVaultRepository, loadVaultEntries, saveVaultEntries } from './repository'
import { VaultRepositoryContext } from './vault.repository.context'

export function VaultProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState(loadVaultEntries)
  const repository = useMemo(() => createVaultRepository(entries, setEntries), [entries])

  useEffect(() => {
    saveVaultEntries(entries)
  }, [entries])

  return (
    <VaultRepositoryContext.Provider value={repository}>
      {children}
    </VaultRepositoryContext.Provider>
  )
}
