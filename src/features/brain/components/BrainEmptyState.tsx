import type { BrainSelectionState } from '../brain.types'

type BrainEmptyStateProps = {
  mode?: Exclude<BrainSelectionState, 'resolved' | 'create'>
  invalidEntryId?: string | null
}

export function BrainEmptyState({
  mode = 'idle',
  invalidEntryId,
}: BrainEmptyStateProps) {
  const isInvalidMode = mode === 'invalid'

  return (
    <div className="brain-empty-state">
      <p className="brain-empty-state__eyebrow">Detail</p>
      <h3>
        {isInvalidMode ? 'Entry not found' : 'Select a Brain entry'}
      </h3>
      <p>
        {isInvalidMode
          ? `The note id "${invalidEntryId}" does not exist in the local Brain dataset.`
          : 'Choose an item from the left pane to inspect the full note in this workspace.'}
      </p>
      <ul className="data-list">
        <li>Deep links use the pattern `#brain/note/&lt;id&gt;`.</li>
        <li>Edit links use the pattern `#brain/note/&lt;id&gt;/edit`.</li>
        <li>The current pass is local-only, in-memory, and route-aware.</li>
        <li>Invalid selections fail soft and keep the shell stable.</li>
      </ul>
    </div>
  )
}
