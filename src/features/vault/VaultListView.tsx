import { forwardRef, useRef, type KeyboardEvent } from 'react'
import { vaultEntryTypes, type VaultEntry, type VaultEntryTypeFilter } from './types'

type VaultListViewProps = {
  entries: VaultEntry[]
  activeEntryId: string | null
  activeType: VaultEntryTypeFilter
  query: string
  onTypeChange: (type: VaultEntryTypeFilter) => void
  onQueryChange: (query: string) => void
  onSelect: (entryId: string) => void
  onCreate: () => void
}

type VaultListItemProps = {
  id: string
  entry: VaultEntry
  active: boolean
  tabIndex: number
  optionIndex: number
  optionCount: number
  onSelect: (entryId: string) => void
  onMoveFocus: (index: number) => void
}

function formatRelativeUpdate(updatedAt: string) {
  const deltaMs = Date.now() - new Date(updatedAt).getTime()
  const deltaHours = Math.max(1, Math.floor(deltaMs / (1000 * 60 * 60)))

  if (deltaHours < 24) {
    return `${deltaHours}h ago`
  }

  return `${Math.floor(deltaHours / 24)}d ago`
}

function getEntryAriaLabel(entry: VaultEntry, relativeUpdate: string) {
  return `${entry.label}. ${entry.type}. ${entry.status}. Updated ${relativeUpdate}.`
}

const VaultListItem = forwardRef<HTMLDivElement, VaultListItemProps>(function VaultListItem(
  {
    id,
    entry,
    active,
    tabIndex,
    optionIndex,
    optionCount,
    onSelect,
    onMoveFocus,
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
      className={`vault-list-item ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(entry.id)}
      onKeyDown={handleKeyDown}
      aria-selected={active}
      aria-label={getEntryAriaLabel(entry, relativeUpdate)}
    >
      <div className="vault-list-item__topline">
        <span className="vault-list-item__type">{entry.type}</span>
        <span className={`vault-status-pill vault-status-pill--${entry.status}`}>{entry.status}</span>
      </div>
      <strong className="vault-list-item__title">{entry.label}</strong>
      <p className="vault-list-item__description">{entry.description}</p>
      <div className="vault-list-item__meta">
        <span className="vault-list-item__time">{relativeUpdate}</span>
        <span className="vault-list-item__links">{entry.linkedBrainEntryIds.length} Brain link(s)</span>
      </div>
      <div className="vault-list-item__tags" aria-hidden="true">
        {entry.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
})

function VaultTypeFilters({
  activeType,
  onSelect,
}: {
  activeType: VaultEntryTypeFilter
  onSelect: (type: VaultEntryTypeFilter) => void
}) {
  return (
    <div className="vault-filters" role="tablist" aria-label="Vault entry types">
      {(['all', ...vaultEntryTypes] as const).map((entryType) => {
        const isActive = entryType === activeType

        return (
          <button
            key={entryType}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`vault-filter ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelect(entryType)}
          >
            {entryType}
          </button>
        )
      })}
    </div>
  )
}

export function VaultListView({
  entries,
  activeEntryId,
  activeType,
  query,
  onTypeChange,
  onQueryChange,
  onSelect,
  onCreate,
}: VaultListViewProps) {
  const optionRefs = useRef<Array<HTMLDivElement | null>>([])

  const focusAndSelect = (index: number) => {
    const targetEntry = entries[index]

    if (!targetEntry) {
      return
    }

    onSelect(targetEntry.id)
    optionRefs.current[index]?.focus()
  }

  return (
    <div className="vault-list-panel__body">
      <div className="vault-controls">
        <div className="vault-controls__actions">
          <button type="button" className="vault-action" onClick={onCreate}>
            New entry
          </button>
        </div>
        <label className="vault-search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search labels and descriptions"
          />
        </label>
        <VaultTypeFilters activeType={activeType} onSelect={onTypeChange} />
      </div>

      {entries.length === 0 ? (
        <div className="vault-list vault-list--empty" aria-live="polite">
          <p>No matching active entries.</p>
          <span>Adjust the type filter or search terms.</span>
        </div>
      ) : (
        <div className="vault-list" role="listbox" aria-label="Vault entries">
          {entries.map((entry, index) => (
            <VaultListItem
              key={entry.id}
              id={`vault-entry-${entry.id}`}
              entry={entry}
              active={entry.id === activeEntryId}
              tabIndex={entry.id === activeEntryId || (!activeEntryId && index === 0) ? 0 : -1}
              optionIndex={index}
              optionCount={entries.length}
              onSelect={onSelect}
              onMoveFocus={focusAndSelect}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
