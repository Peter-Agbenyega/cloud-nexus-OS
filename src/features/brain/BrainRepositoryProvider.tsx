import { useMemo, useState, type PropsWithChildren } from 'react'
import { brainEntries } from './brain.data'
import { createBrainRepository } from './brain.repository'
import { BrainRepositoryContext } from './brain.repository.context'

export function BrainRepositoryProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState(() => [...brainEntries])
  const repository = useMemo(() => createBrainRepository(entries, setEntries), [entries])

  return (
    <BrainRepositoryContext.Provider value={repository}>
      {children}
    </BrainRepositoryContext.Provider>
  )
}
