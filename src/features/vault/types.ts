export const vaultEntryTypes = [
  'credential',
  'secret',
  'document',
  'contract',
  'note',
] as const

export const vaultEntryStatuses = ['active', 'archived'] as const

export type VaultEntryType = (typeof vaultEntryTypes)[number]
export type VaultEntryStatus = (typeof vaultEntryStatuses)[number]
export type VaultEntryTypeFilter = 'all' | VaultEntryType

export interface VaultEntry {
  id: string
  type: VaultEntryType
  label: string
  description: string
  value: string
  tags: string[]
  linkedBrainEntryIds: string[]
  status: VaultEntryStatus
  createdAt: string
  updatedAt: string
}

export type VaultEntryWritableFields = Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'>
export type VaultEntryCreatePayload = VaultEntryWritableFields
export type VaultEntryUpdatePatch = Partial<VaultEntryWritableFields>

export type VaultEntrySearchFilters = {
  type?: VaultEntryTypeFilter
  query?: string
}

export type VaultDatasetStats = {
  total: number
  active: number
  archived: number
  byType: Record<VaultEntryType, number>
}

export type VaultSelectionState = 'idle' | 'resolved' | 'invalid' | 'create' | 'edit'

export type VaultWorkspaceSelectionSummary = {
  state: VaultSelectionState
  title: string | null
  status: VaultEntryStatus | null
  type: VaultEntryType | null
  routeSegmentCount: number
}

export type VaultWorkspaceDatasetSummary = VaultDatasetStats & {
  visible: number
}

export type VaultWorkspaceRouteSummary = {
  rawHash: string
  selectionState: VaultSelectionState
  selectedEntryId: string | null
}

export type BrainLinkOption = {
  id: string
  title: string
}
