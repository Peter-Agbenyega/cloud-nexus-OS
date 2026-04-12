import { forwardRef, type KeyboardEvent } from 'react'
import type { BrainEntry } from '../brain.types'

type BrainListItemProps = {
  id: string
  entry: BrainEntry
  active: boolean
  tabIndex: number
  onSelect: (entryId: string) => void
  onMoveFocus: (index: number) => void
  optionIndex: number
  optionCount: number
}

function formatRelativeUpdate(updatedAt: string) {
  const deltaMs = Date.now() - new Date(updatedAt).getTime()
  const deltaHours = Math.max(1, Math.floor(deltaMs / (1000 * 60 * 60)))

  if (deltaHours < 24) {
    return `${deltaHours}h ago`
  }

  const deltaDays = Math.floor(deltaHours / 24)
  return `${deltaDays}d ago`
}

function getEntryAriaLabel(entry: BrainEntry, relativeUpdate: string) {
  return `${entry.title}. ${entry.category}. ${entry.status}. Updated ${relativeUpdate}.`
}

export const BrainListItem = forwardRef<HTMLDivElement, BrainListItemProps>(function BrainListItem(
  {
    id,
    entry,
    active,
    tabIndex,
    onSelect,
    onMoveFocus,
    optionIndex,
    optionCount,
  },
  ref,
) {
  const relativeUpdate = formatRelativeUpdate(entry.updatedAt)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        onMoveFocus(Math.min(optionIndex + 1, optionCount - 1))
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        onMoveFocus(Math.max(optionIndex - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        onMoveFocus(0)
        break
      case 'End':
        event.preventDefault()
        onMoveFocus(optionCount - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        onSelect(entry.id)
        break
      default:
        break
    }
  }

  return (
    <div
      id={id}
      ref={ref}
      role="option"
      tabIndex={tabIndex}
      className={`brain-list-item ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(entry.id)}
      onKeyDown={handleKeyDown}
      aria-label={getEntryAriaLabel(entry, relativeUpdate)}
      aria-selected={active}
    >
      <div className="brain-list-item__topline">
        <span className="brain-list-item__category">{entry.category}</span>
        <span className={`brain-status-pill brain-status-pill--${entry.status}`}>{entry.status}</span>
      </div>
      <strong className="brain-list-item__title">{entry.title}</strong>
      <p className="brain-list-item__summary">{entry.summary}</p>
      <div className="brain-list-item__meta">
        <span className="brain-list-item__time">{relativeUpdate}</span>
        <span className="brain-list-item__format">{entry.contentFormat}</span>
      </div>
      <div className="brain-list-item__tags" aria-hidden="true">
        {entry.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
})
