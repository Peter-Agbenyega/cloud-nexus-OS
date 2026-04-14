import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { loadBrainEntries, saveBrainEntries } from './brain.persistence'
import { createBrainRepository } from './brain.repository'
import { BrainRepositoryContext } from './brain.repository.context'

export function BrainRepositoryProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState(loadBrainEntries)
  const repository = useMemo(() => createBrainRepository(entries, setEntries), [entries])

  useEffect(() => {
    saveBrainEntries(entries)
  }, [entries])

  return (
    <BrainRepositoryContext.Provider value={repository}>
      {children}
    </BrainRepositoryContext.Provider>
  )
}
