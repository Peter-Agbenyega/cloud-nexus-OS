import type {
  BrainContentFormat,
  BrainDatasetStats,
  BrainEntry,
  BrainEntrySearchFilters,
  BrainSelectionState,
  BrainStatus,
  BrainWorkspaceDatasetSummary,
  BrainWorkspaceSelectionSummary,
} from './brain.types'
import type { BrainRouteState } from './brain.routes'

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase()
}

function buildEntrySearchText(entry: BrainEntry) {
  return [entry.title, entry.summary, entry.category, ...entry.tags].join(' ').toLowerCase()
}

export function filterBrainEntries(entries: BrainEntry[], filters: BrainEntrySearchFilters = {}) {
  const normalizedQuery = normalizeSearchText(filters.query ?? '')
  const category = filters.category ?? 'All'

  return entries.filter((entry) => {
    const matchesCategory = category === 'All' || entry.category === category
    const matchesQuery = normalizedQuery.length === 0
      || buildEntrySearchText(entry).includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })
}

export function findBrainEntryById(entries: BrainEntry[], entryId: string) {
  return entries.find((entry) => entry.id === entryId) ?? null
}

export function getBrainDatasetStats(entries: BrainEntry[]): BrainDatasetStats {
  return entries.reduce(
    (stats, entry) => {
      stats.byStatus[entry.status] += 1
      stats.byFormat[entry.contentFormat] += 1
      return stats
    },
    {
      total: entries.length,
      byStatus: {
        active: 0,
        draft: 0,
        archived: 0,
      } satisfies Record<BrainStatus, number>,
      byFormat: {
        markdown: 0,
        plaintext: 0,
      },
    },
  )
}

export function getBrainSelectionState(entryId: string | null, entry: BrainEntry | null): BrainSelectionState {
  if (!entryId) {
    return 'idle'
  }

  return entry ? 'resolved' : 'invalid'
}

export function getBrainWorkspaceSelectionSummary(params: {
  routeMode: BrainRouteState['mode']
  routeSegmentCount: number
  selectedEntryId: string | null
  selectedEntry: BrainEntry | null
}): BrainWorkspaceSelectionSummary {
  // Route mode describes what the hash requested; selection state describes whether that request resolved.
  const state = params.routeMode === 'create'
    ? 'create'
    : getBrainSelectionState(params.selectedEntryId, params.selectedEntry)

  return {
    state,
    title: state === 'create'
      ? 'Create new entry'
      : params.routeMode === 'edit' && params.selectedEntry
        ? `Editing ${params.selectedEntry.title}`
        : params.selectedEntry?.title ?? null,
    status: state === 'create' ? 'draft' : params.selectedEntry?.status ?? null,
    format: state === 'create' ? 'markdown' : params.selectedEntry?.contentFormat ?? null,
    routeSegmentCount: params.routeSegmentCount,
  }
}

export function getBrainWorkspaceDatasetSummary(
  datasetStats: BrainDatasetStats,
  visibleEntries: BrainEntry[],
): BrainWorkspaceDatasetSummary {
  return {
    ...datasetStats,
    visible: visibleEntries.length,
  }
}

export function getBrainFormatCount(
  datasetStats: BrainDatasetStats,
  format: BrainContentFormat,
) {
  return datasetStats.byFormat[format]
}
