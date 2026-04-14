export const brainCategories = [
  'Prompts',
  'Ideas',
  'SOPs',
  'Strategy',
  'Playbooks',
  'Knowledge',
  'Workflows',
] as const

export type BrainCategory = (typeof brainCategories)[number]
export type BrainCategoryFilter = BrainCategory | 'All'

export const brainContentFormats = ['plaintext', 'markdown'] as const

export type BrainContentFormat = (typeof brainContentFormats)[number]

export const brainStatuses = ['active', 'draft', 'archived'] as const

export type BrainStatus = (typeof brainStatuses)[number]

export type BrainEntry = {
  id: string
  title: string
  category: BrainCategory
  summary: string
  tags: string[]
  contentFormat: BrainContentFormat
  createdAt: string
  updatedAt: string
  status: BrainStatus
  content: string
}

export type BrainEntryWritableFields = Omit<BrainEntry, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Strict create contract for the upcoming form pass.
 * Callers provide every user-editable field explicitly; the repository only stamps ids and timestamps.
 */
export type BrainEntryCreatePayload = BrainEntryWritableFields

export type BrainEntryUpdatePatch = Partial<BrainEntryWritableFields>

export type BrainDatasetStats = {
  total: number
  byStatus: Record<BrainStatus, number>
  byFormat: Record<BrainContentFormat, number>
}

export type BrainEntrySearchFilters = {
  category?: BrainCategoryFilter
  query?: string
}

export type BrainSelectionState = 'idle' | 'resolved' | 'invalid' | 'create'

export type BrainWorkspaceSelectionSummary = {
  state: BrainSelectionState
  title: string | null
  status: BrainStatus | null
  format: BrainContentFormat | null
  routeSegmentCount: number
}

export type BrainWorkspaceDatasetSummary = BrainDatasetStats & {
  visible: number
}

export type BrainWorkspaceRouteSummary = {
  rawHash: string
  selectionState: BrainSelectionState
  selectedEntryId: string | null
}
