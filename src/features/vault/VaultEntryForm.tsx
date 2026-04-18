import { type FormEvent, useMemo, useState } from 'react'
import { MaskedValue } from './MaskedValue'
import { vaultEntryStatuses, vaultEntryTypes, type BrainLinkOption, type VaultEntryWritableFields } from './types'

type VaultEntryFormProps = {
  mode: 'create' | 'edit'
  initialValue: VaultEntryWritableFields
  brainOptions: BrainLinkOption[]
  submitLabel: string
  onSubmit: (value: VaultEntryWritableFields) => void
  onCancel: () => void
  onArchive?: () => void
}

type VaultEntryFormErrors = {
  label?: string
  description?: string
  value?: string
}

function formatTagsInput(tags: string[]) {
  return tags.join(', ')
}

function parseTagsInput(value: string) {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )
}

function validateVaultEntry(values: VaultEntryWritableFields): VaultEntryFormErrors {
  const errors: VaultEntryFormErrors = {}

  if (!values.label.trim()) {
    errors.label = 'Label is required.'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (!values.value.trim()) {
    errors.value = 'Value is required.'
  }

  return errors
}

export function VaultEntryForm({
  mode,
  initialValue,
  brainOptions,
  submitLabel,
  onSubmit,
  onCancel,
  onArchive,
}: VaultEntryFormProps) {
  const [type, setType] = useState(initialValue.type)
  const [label, setLabel] = useState(initialValue.label)
  const [description, setDescription] = useState(initialValue.description)
  const [value, setValue] = useState(initialValue.value)
  const [tagsInput, setTagsInput] = useState(formatTagsInput(initialValue.tags))
  const [linkedBrainEntryIds, setLinkedBrainEntryIds] = useState(initialValue.linkedBrainEntryIds)
  const [status, setStatus] = useState(initialValue.status)
  const [brainQuery, setBrainQuery] = useState('')
  const [touched, setTouched] = useState(false)

  const values = useMemo<VaultEntryWritableFields>(
    () => ({
      type,
      label,
      description,
      value,
      tags: parseTagsInput(tagsInput),
      linkedBrainEntryIds,
      status,
    }),
    [description, label, linkedBrainEntryIds, status, tagsInput, type, value],
  )
  const errors = useMemo(() => validateVaultEntry(values), [values])
  const isValid = Object.keys(errors).length === 0
  const validationMessage = touched && !isValid ? 'Complete the required fields before saving.' : null
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValue),
    [initialValue, values],
  )
  const filteredBrainOptions = useMemo(() => {
    const normalizedQuery = brainQuery.trim().toLowerCase()

    return brainOptions.filter((option) => (
      normalizedQuery.length === 0
      || option.title.toLowerCase().includes(normalizedQuery)
    ))
  }, [brainOptions, brainQuery])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)

    if (!isValid) {
      return
    }

    onSubmit(values)
  }

  const handleCancel = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) {
      return
    }

    onCancel()
  }

  const toggleBrainLink = (brainEntryId: string) => {
    setLinkedBrainEntryIds((currentIds) => (
      currentIds.includes(brainEntryId)
        ? currentIds.filter((id) => id !== brainEntryId)
        : [...currentIds, brainEntryId]
    ))
  }

  return (
    <form className="vault-entry-form" onSubmit={handleSubmit}>
      <div className="vault-entry-form__header">
        <div>
          <p className="vault-entry-form__eyebrow">{mode === 'create' ? 'Create entry' : 'Edit entry'}</p>
          <h3 className="vault-entry-form__title">
            {mode === 'create' ? 'New Vault record' : 'Update Vault record'}
          </h3>
          <p className="vault-entry-form__description">
            Store a controlled secret, note, or document with explicit metadata and read-only links into Brain.
          </p>
        </div>
        <div className="vault-entry-form__actions">
          {mode === 'edit' && onArchive ? (
            <button type="button" className="vault-action vault-action--danger" onClick={onArchive}>
              Archive
            </button>
          ) : null}
          <button type="button" className="vault-action vault-action--secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="vault-action" disabled={!isValid}>
            {submitLabel}
          </button>
        </div>
      </div>

      <div className="vault-entry-form__statusbar" aria-live="polite">
        <span>{mode === 'create' ? 'Route target: #vault/new' : 'Route target: selected vault entry edit'}</span>
        <span>Tags parsed: {values.tags.length}</span>
        <span>Brain links: {linkedBrainEntryIds.length}</span>
        <span>Status: {status}</span>
      </div>

      {validationMessage ? <p className="vault-entry-form__validation">{validationMessage}</p> : null}

      <div className="vault-entry-form__grid">
        <label className="vault-entry-form__field vault-entry-form__field--wide">
          <span>Label</span>
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Operator-facing record name"
            aria-invalid={touched && errors.label ? 'true' : 'false'}
          />
          {touched && errors.label ? <small>{errors.label}</small> : null}
        </label>

        <label className="vault-entry-form__field">
          <span>Type</span>
          <select value={type} onChange={(event) => setType(event.target.value as typeof type)}>
            {vaultEntryTypes.map((entryType) => (
              <option key={entryType} value={entryType}>
                {entryType}
              </option>
            ))}
          </select>
        </label>

        {mode === 'edit' ? (
          <label className="vault-entry-form__field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as (typeof vaultEntryStatuses)[number])}>
              {vaultEntryStatuses.map((entryStatus) => (
                <option key={entryStatus} value={entryStatus}>
                  {entryStatus}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="vault-entry-form__field vault-entry-form__field--wide">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Context note for when and why this record is used"
            aria-invalid={touched && errors.description ? 'true' : 'false'}
          />
          {touched && errors.description ? <small>{errors.description}</small> : null}
        </label>

        <label className="vault-entry-form__field vault-entry-form__field--wide">
          <span>Value</span>
          <MaskedValue
            mode="input"
            value={value}
            onChange={setValue}
            placeholder="Enter the sensitive value"
            ariaInvalid={touched && Boolean(errors.value)}
          />
          {touched && errors.value ? <small>{errors.value}</small> : null}
        </label>

        <label className="vault-entry-form__field">
          <span>Tags</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="comma, separated, tags"
          />
        </label>

        <div className="vault-entry-form__field vault-entry-form__field--wide">
          <span>Linked Brain entries</span>
          <input
            type="search"
            value={brainQuery}
            onChange={(event) => setBrainQuery(event.target.value)}
            placeholder="Search Brain titles"
          />
          <div className="vault-entry-form__brain-links" role="listbox" aria-label="Available Brain entries">
            {filteredBrainOptions.length > 0 ? (
              filteredBrainOptions.map((option) => {
                const isSelected = linkedBrainEntryIds.includes(option.id)

                return (
                  <label key={option.id} className={`vault-brain-link ${isSelected ? 'is-selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBrainLink(option.id)}
                    />
                    <span>{option.title}</span>
                  </label>
                )
              })
            ) : (
              <p className="vault-entry-form__brain-empty">No Brain entries match the current search.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
