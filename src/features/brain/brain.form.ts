import type { BrainEntry, BrainEntryCreatePayload, BrainEntryWritableFields } from './brain.types'

export type BrainEntryFormErrors = {
  title?: string
  summary?: string
  content?: string
}

export function createDefaultBrainEntryDraft(): BrainEntryCreatePayload {
  return {
    title: '',
    category: 'Ideas',
    summary: '',
    tags: ['draft'],
    contentFormat: 'markdown',
    status: 'draft',
    content: `# Objective

- Capture the operator note clearly
- Record the next decision or action path
- Refine tags once the entry stabilizes`,
  }
}

export function mapBrainEntryToFormValue(entry: BrainEntry): BrainEntryWritableFields {
  return {
    title: entry.title,
    category: entry.category,
    summary: entry.summary,
    tags: entry.tags,
    contentFormat: entry.contentFormat,
    status: entry.status,
    content: entry.content,
  }
}

export function formatBrainTagsInput(tags: string[]) {
  return tags.join(', ')
}

export function parseBrainTagsInput(value: string) {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )
}

export function validateBrainEntry(values: BrainEntryWritableFields): BrainEntryFormErrors {
  const errors: BrainEntryFormErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required.'
  }

  if (!values.summary.trim()) {
    errors.summary = 'Summary is required.'
  }

  if (!values.content.trim()) {
    errors.content = 'Content is required.'
  }

  return errors
}
