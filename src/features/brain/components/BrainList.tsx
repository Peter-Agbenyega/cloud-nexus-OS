import { useRef } from 'react'
import type { BrainEntry } from '../brain.types'
import { BrainListItem } from './BrainListItem'

type BrainListProps = {
  entries: BrainEntry[]
  activeEntryId: string | null
  onSelect: (entryId: string) => void
}

export function BrainList({ entries, activeEntryId, onSelect }: BrainListProps) {
  const optionRefs = useRef<Array<HTMLDivElement | null>>([])

  if (entries.length === 0) {
    return (
      <div className="brain-list brain-list--empty" aria-live="polite">
        <p>No matching entries.</p>
        <span>Adjust the category filter or search terms.</span>
      </div>
    )
  }

  const focusAndSelect = (index: number) => {
    const targetEntry = entries[index]

    if (!targetEntry) {
      return
    }

    onSelect(targetEntry.id)
    optionRefs.current[index]?.focus()
  }

  return (
    <div className="brain-list" role="listbox" aria-label="Brain entries">
      {entries.map((entry, index) => (
        <BrainListItem
          key={entry.id}
          id={`brain-entry-${entry.id}`}
          entry={entry}
          active={entry.id === activeEntryId}
          tabIndex={entry.id === activeEntryId || (!activeEntryId && index === 0) ? 0 : -1}
          onSelect={onSelect}
          onMoveFocus={focusAndSelect}
          optionIndex={index}
          optionCount={entries.length}
          ref={(element) => {
            optionRefs.current[index] = element
          }}
        />
      ))}
    </div>
  )
}
