import { type FormEvent, useMemo, useState } from 'react'
import {
  formatBrainTagsInput,
  parseBrainTagsInput,
  validateBrainEntry,
} from '../brain.form'
import {
  brainCategories,
  type BrainContentFormat,
  type BrainEntryWritableFields,
  type BrainStatus,
} from '../brain.types'

type BrainEntryFormProps = {
  mode: 'create' | 'edit'
  initialValue: BrainEntryWritableFields
  submitLabel: string
  onSubmit: (value: BrainEntryWritableFields) => void
  onCancel: () => void
}

const contentFormatOptions: BrainContentFormat[] = ['markdown', 'plaintext']
const statusOptions: BrainStatus[] = ['draft', 'active', 'archived']

export function BrainEntryForm({
  mode,
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: BrainEntryFormProps) {
  const [title, setTitle] = useState(initialValue.title)
  const [category, setCategory] = useState(initialValue.category)
  const [summary, setSummary] = useState(initialValue.summary)
  const [tagsInput, setTagsInput] = useState(formatBrainTagsInput(initialValue.tags))
  const [contentFormat, setContentFormat] = useState(initialValue.contentFormat)
  const [status, setStatus] = useState(initialValue.status)
  const [content, setContent] = useState(initialValue.content)
  const [touched, setTouched] = useState(false)

  const values = useMemo<BrainEntryWritableFields>(
    () => ({
      title,
      category,
      summary,
      tags: parseBrainTagsInput(tagsInput),
      contentFormat,
      status,
      content,
    }),
    [category, content, contentFormat, status, summary, tagsInput, title],
  )
  const errors = useMemo(() => validateBrainEntry(values), [values])
  const isValid = Object.keys(errors).length === 0
  const validationMessage = touched && !isValid ? 'Complete the required fields before saving.' : null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)

    if (!isValid) {
      return
    }

    onSubmit(values)
  }

  return (
    <form className="brain-entry-form" onSubmit={handleSubmit}>
      <div className="brain-entry-form__header">
        <div>
          <p className="brain-entry-form__eyebrow">{mode === 'create' ? 'Create entry' : 'Edit entry'}</p>
          <h3 className="brain-entry-form__title">
            {mode === 'create' ? 'New Brain operator note' : 'Update Brain operator note'}
          </h3>
          <p className="brain-entry-form__description">
            Capture a durable operator record with searchable metadata and a dense body for the workspace.
          </p>
        </div>
        <div className="brain-entry-form__actions">
          <button type="button" className="brain-action brain-action--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="brain-action" disabled={!isValid}>
            {submitLabel}
          </button>
        </div>
      </div>

      <div className="brain-entry-form__statusbar" aria-live="polite">
        <span>{mode === 'create' ? 'Route target: #brain/new' : 'Route target: selected note edit'}</span>
        <span>Tags parsed: {values.tags.length}</span>
        <span>Format: {contentFormat}</span>
        <span>Status: {status}</span>
      </div>

      {validationMessage ? <p className="brain-entry-form__validation">{validationMessage}</p> : null}

      <div className="brain-entry-form__grid">
        <label className="brain-entry-form__field brain-entry-form__field--wide">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Operator-facing title"
            aria-invalid={touched && errors.title ? 'true' : 'false'}
          />
          {touched && errors.title ? <small>{errors.title}</small> : null}
        </label>

        <label className="brain-entry-form__field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
            {brainCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="brain-entry-form__field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as BrainStatus)}>
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="brain-entry-form__field">
          <span>Format</span>
          <select
            value={contentFormat}
            onChange={(event) => setContentFormat(event.target.value as BrainContentFormat)}
          >
            {contentFormatOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="brain-entry-form__field">
          <span>Tags</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="comma, separated, tags"
          />
        </label>

        <label className="brain-entry-form__field brain-entry-form__field--wide">
          <span>Summary</span>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={3}
            placeholder="Dense operator summary for search and triage"
            aria-invalid={touched && errors.summary ? 'true' : 'false'}
          />
          {touched && errors.summary ? <small>{errors.summary}</small> : null}
        </label>

        <label className="brain-entry-form__field brain-entry-form__field--wide">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={18}
            placeholder="Write the operating note, prompt, SOP, or strategy body here"
            aria-invalid={touched && errors.content ? 'true' : 'false'}
          />
          {touched && errors.content ? <small>{errors.content}</small> : null}
        </label>
      </div>
    </form>
  )
}
