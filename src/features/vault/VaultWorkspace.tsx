import { MaskedValue } from './MaskedValue'
import { VaultEntryForm } from './VaultEntryForm'
import type { BrainLinkOption, VaultEntry, VaultEntryWritableFields, VaultSelectionState } from './types'

type VaultWorkspaceProps = {
  routeMode: VaultSelectionState
  selectedEntryId: string | null
  selectedEntry: VaultEntry | null
  selectedEntryFormValue: VaultEntryWritableFields | null
  createEntryDraft: VaultEntryWritableFields
  linkedBrainEntries: BrainLinkOption[]
  brainOptions: BrainLinkOption[]
  onEdit: (entryId: string) => void
  onArchive: () => void
  onCancelCreate: () => void
  onCancelEdit: () => void
  onSubmitCreate: (value: VaultEntryWritableFields) => void
  onSubmitEdit: (value: VaultEntryWritableFields) => void
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function VaultEmptyState({
  invalidEntryId,
  malformedPath,
}: {
  invalidEntryId?: string | null
  malformedPath?: boolean
}) {
  return (
    <div className="vault-empty-state">
      <p className="vault-empty-state__eyebrow">Detail</p>
      <h3>Entry not found</h3>
      <p>
        {malformedPath
          ? 'The current Vault route does not match a valid workspace path.'
          : `The vault entry id "${invalidEntryId}" does not exist in the local dataset.`}
      </p>
      <ul className="data-list">
        <li>Detail links use the pattern `#vault/entry/&lt;id&gt;`.</li>
        <li>Edit links use the pattern `#vault/entry/&lt;id&gt;/edit`.</li>
        <li>Unknown ids and malformed paths fail soft without breaking the shell.</li>
      </ul>
    </div>
  )
}

function VaultDetail({
  entry,
  linkedBrainEntries,
  onEdit,
  onArchive,
}: {
  entry: VaultEntry
  linkedBrainEntries: BrainLinkOption[]
  onEdit: () => void
  onArchive: () => void
}) {
  return (
    <article className="vault-detail">
      <div className="vault-detail__header">
        <div>
          <p className="vault-detail__eyebrow">{entry.type}</p>
          <h3 className="vault-detail__title">{entry.label}</h3>
        </div>
        <div className="vault-detail__header-actions">
          <span className={`vault-status-pill vault-status-pill--${entry.status}`}>{entry.status}</span>
          <button type="button" className="vault-action vault-action--secondary" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="vault-action vault-action--danger" onClick={onArchive}>
            Archive
          </button>
        </div>
      </div>

      <div className="vault-detail__meta-grid" aria-label="Entry metadata">
        <div>
          <span>Created</span>
          <strong>{formatTimestamp(entry.createdAt)}</strong>
        </div>
        <div>
          <span>Updated</span>
          <strong>{formatTimestamp(entry.updatedAt)}</strong>
        </div>
        <div>
          <span>Brain links</span>
          <strong>{entry.linkedBrainEntryIds.length}</strong>
        </div>
      </div>

      <div className="vault-detail__tags">
        {entry.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <p className="vault-detail__description">{entry.description}</p>

      <div className="vault-detail__value-block">
        <p className="vault-detail__section-label">Sensitive value</p>
        <MaskedValue value={entry.value} />
      </div>

      <div className="vault-detail__linked">
        <p className="vault-detail__section-label">Linked Knowledge</p>
        {linkedBrainEntries.length > 0 ? (
          <div className="vault-detail__knowledge-list">
            {linkedBrainEntries.map((brainEntry) => (
              <div key={brainEntry.id} className="vault-detail__knowledge-item">
                <strong>{brainEntry.title}</strong>
                <span>{brainEntry.id}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="vault-detail__empty-copy">No Brain records are linked to this Vault entry yet.</p>
        )}
      </div>
    </article>
  )
}

export function VaultWorkspace({
  routeMode,
  selectedEntryId,
  selectedEntry,
  selectedEntryFormValue,
  createEntryDraft,
  linkedBrainEntries,
  brainOptions,
  onEdit,
  onArchive,
  onCancelCreate,
  onCancelEdit,
  onSubmitCreate,
  onSubmitEdit,
}: VaultWorkspaceProps) {
  if (routeMode === 'create') {
    return (
      <VaultEntryForm
        key="vault-entry-create"
        mode="create"
        initialValue={createEntryDraft}
        brainOptions={brainOptions}
        submitLabel="Create entry"
        onSubmit={onSubmitCreate}
        onCancel={onCancelCreate}
      />
    )
  }

  if (routeMode === 'edit' && selectedEntry && selectedEntryFormValue) {
    return (
      <VaultEntryForm
        key={selectedEntry.id}
        mode="edit"
        initialValue={selectedEntryFormValue}
        brainOptions={brainOptions}
        submitLabel="Save changes"
        onSubmit={onSubmitEdit}
        onCancel={onCancelEdit}
        onArchive={onArchive}
      />
    )
  }

  if (selectedEntry) {
    return (
      <VaultDetail
        entry={selectedEntry}
        linkedBrainEntries={linkedBrainEntries}
        onEdit={() => onEdit(selectedEntry.id)}
        onArchive={onArchive}
      />
    )
  }

  return (
    <VaultEmptyState
      invalidEntryId={selectedEntryId}
      malformedPath={routeMode === 'invalid'}
    />
  )
}
