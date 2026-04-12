import ReactMarkdown from 'react-markdown'
import type { BrainEntry } from '../brain.types'

type BrainDetailProps = {
  entry: BrainEntry
  onEdit: () => void
  onArchive: () => void
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

function renderPlaintext(content: string, entryId: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => (
      <p key={`${entryId}-plaintext-${index}`} className="brain-detail__paragraph">
        {block}
      </p>
    ))
}

export function BrainDetail({ entry, onEdit, onArchive }: BrainDetailProps) {
  return (
    <article className="brain-detail">
      <div className="brain-detail__header">
        <div>
          <p className="brain-detail__eyebrow">{entry.category}</p>
          <h3 className="brain-detail__title">{entry.title}</h3>
        </div>
        <div className="brain-detail__header-actions">
          <span className={`brain-status-pill brain-status-pill--${entry.status}`}>{entry.status}</span>
          <button type="button" className="brain-action brain-action--secondary" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="brain-action brain-action--danger" onClick={onArchive}>
            Archive
          </button>
        </div>
      </div>

      <div className="brain-detail__meta-grid" aria-label="Entry metadata">
        <div>
          <span>Created</span>
          <strong>{formatTimestamp(entry.createdAt)}</strong>
        </div>
        <div>
          <span>Updated</span>
          <strong>{formatTimestamp(entry.updatedAt)}</strong>
        </div>
        <div>
          <span>Format</span>
          <strong>{entry.contentFormat}</strong>
        </div>
      </div>

      <div className="brain-detail__tags">
        {entry.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <p className="brain-detail__summary">{entry.summary}</p>

        <div className="brain-detail__content">
        {entry.contentFormat === 'markdown' ? (
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h4>{children}</h4>,
              h2: ({ children }) => <h5>{children}</h5>,
              h3: ({ children }) => <h6>{children}</h6>,
              p: ({ children }) => <p className="brain-detail__paragraph">{children}</p>,
              ul: ({ children }) => <ul className="brain-detail__list">{children}</ul>,
              ol: ({ children }) => (
                <ol className="brain-detail__list brain-detail__list--ordered">{children}</ol>
              ),
            }}
          >
            {entry.content}
          </ReactMarkdown>
        ) : (
          renderPlaintext(entry.content, entry.id)
        )}
      </div>
    </article>
  )
}
