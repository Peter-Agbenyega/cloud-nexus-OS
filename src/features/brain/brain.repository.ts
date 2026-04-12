import type { Dispatch, SetStateAction } from 'react'
import { brainEntries } from './brain.data'
import {
  filterBrainEntries,
  findBrainEntryById,
  getBrainDatasetStats,
} from './brain.selectors'
import type {
  BrainDatasetStats,
  BrainEntry,
  BrainEntryCreatePayload,
  BrainEntrySearchFilters,
  BrainEntryUpdatePatch,
} from './brain.types'

export type BrainRepository = {
  listEntries: () => BrainEntry[]
  getEntryById: (entryId: string) => BrainEntry | null
  searchEntries: (filters?: BrainEntrySearchFilters) => BrainEntry[]
  getStats: () => BrainDatasetStats
  createEntry: (payload: BrainEntryCreatePayload) => BrainEntry
  updateEntry: (entryId: string, patch: BrainEntryUpdatePatch) => void
  archiveEntry: (entryId: string) => void
}

function createBrainEntryId(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug || 'brain-entry'}-${Math.random().toString(36).slice(2, 8)}`
}

export function createBrainRepository(
  entries: BrainEntry[] = brainEntries,
  setEntries?: Dispatch<SetStateAction<BrainEntry[]>>,
): BrainRepository {

  return {
    listEntries: () => entries,
    getEntryById: (entryId) => findBrainEntryById(entries, entryId),
    searchEntries: (filters) => filterBrainEntries(entries, filters),
    getStats: () => getBrainDatasetStats(entries),
    createEntry: (payload) => {
      const now = new Date().toISOString()
      const nextEntry: BrainEntry = {
        ...payload,
        id: createBrainEntryId(payload.title),
        createdAt: now,
        updatedAt: now,
      }

      setEntries?.((currentEntries) => [nextEntry, ...currentEntries])

      return nextEntry
    },
    updateEntry: (entryId, patch) => {
      if (!setEntries) {
        return
      }

      // Read and write against the same state snapshot so chained mutations cannot patch stale entry data.
      setEntries((currentEntries) =>
        currentEntries.map((entry) => {
          if (entry.id !== entryId) {
            return entry
          }

          return {
            ...entry,
            ...patch,
            updatedAt: new Date().toISOString(),
          }
        }),
      )
    },
    archiveEntry: (entryId) => {
      if (!setEntries) {
        return
      }

      // Keep archive reads inside the updater so repeated writes see the latest entry snapshot.
      setEntries((currentEntries) =>
        currentEntries.map((entry) => {
          if (entry.id !== entryId) {
            return entry
          }

          return {
            ...entry,
            status: 'archived',
            updatedAt: new Date().toISOString(),
          }
        }),
      )
    },
  }
}
