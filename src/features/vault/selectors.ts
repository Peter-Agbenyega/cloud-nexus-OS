import type {
  VaultDatasetStats,
  VaultEntry,
  VaultEntrySearchFilters,
  VaultEntryType,
  VaultSelectionState,
  VaultWorkspaceDatasetSummary,
  VaultWorkspaceSelectionSummary,
} from './types'

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase()
}

function buildEntrySearchText(entry: VaultEntry) {
  return [entry.label, entry.description, entry.type, ...entry.tags].join(' ').toLowerCase()
}

export function filterVaultEntries(entries: VaultEntry[], filters: VaultEntrySearchFilters = {}) {
  const normalizedQuery = normalizeSearchText(filters.query ?? '')
  const type = filters.type ?? 'all'

  return entries.filter((entry) => {
    const matchesStatus = entry.status === 'active'
    const matchesType = type === 'all' || entry.type === type
    const matchesQuery = normalizedQuery.length === 0 || buildEntrySearchText(entry).includes(normalizedQuery)

    return matchesStatus && matchesType && matchesQuery
  })
}

export function findVaultEntryById(entries: VaultEntry[], entryId: string) {
  return entries.find((entry) => entry.id === entryId) ?? null
}

export function getVaultDatasetStats(entries: VaultEntry[]): VaultDatasetStats {
  return entries.reduce(
    (stats, entry) => {
      stats.byType[entry.type] += 1
      stats[entry.status] += 1
      return stats
    },
    {
      total: entries.length,
      active: 0,
      archived: 0,
      byType: {
        credential: 0,
        secret: 0,
        document: 0,
        contract: 0,
        note: 0,
      } satisfies Record<VaultEntryType, number>,
    },
  )
}

export function getVaultSelectionState(entryId: string | null, entry: VaultEntry | null): VaultSelectionState {
  if (!entryId) {
    return 'idle'
  }

  return entry ? 'resolved' : 'invalid'
}

export function getVaultWorkspaceSelectionSummary(params: {
  createEntryDraft: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'>
  routeMode: VaultSelectionState
  routeSegmentCount: number
  selectedEntryId: string | null
  selectedEntry: VaultEntry | null
}): VaultWorkspaceSelectionSummary {
  const state = params.routeMode === 'create' || params.routeMode === 'edit'
    ? params.routeMode
    : getVaultSelectionState(params.selectedEntryId, params.selectedEntry)

  return {
    state,
    title: state === 'create'
      ? 'Create new vault entry'
      : state === 'edit' && params.selectedEntry
        ? `Editing ${params.selectedEntry.label}`
        : params.selectedEntry?.label ?? null,
    status: state === 'create' ? params.createEntryDraft.status : params.selectedEntry?.status ?? null,
    type: state === 'create' ? params.createEntryDraft.type : params.selectedEntry?.type ?? null,
    routeSegmentCount: params.routeSegmentCount,
  }
}

export function getVaultWorkspaceDatasetSummary(
  datasetStats: VaultDatasetStats,
  visibleEntries: VaultEntry[],
): VaultWorkspaceDatasetSummary {
  return {
    ...datasetStats,
    visible: visibleEntries.length,
  }
}
