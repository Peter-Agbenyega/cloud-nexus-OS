import type { Dispatch, SetStateAction } from 'react'
import { vaultSeedEntries } from './seed'
import {
  vaultEntryStatuses,
  vaultEntryTypes,
  type VaultDatasetStats,
  type VaultEntry,
  type VaultEntryCreatePayload,
  type VaultEntrySearchFilters,
  type VaultEntryType,
  type VaultEntryUpdatePatch,
} from './types'
import { filterVaultEntries, findVaultEntryById, getVaultDatasetStats } from './selectors'

export const VAULT_STORAGE_KEY = 'vault_entries'

export type VaultRepository = {
  listEntries: () => VaultEntry[]
  getEntryById: (entryId: string) => VaultEntry | null
  searchEntries: (filters?: VaultEntrySearchFilters) => VaultEntry[]
  getStats: () => VaultDatasetStats
  createEntry: (payload: VaultEntryCreatePayload) => VaultEntry
  updateEntry: (entryId: string, patch: VaultEntryUpdatePatch) => void
  archiveEntry: (entryId: string) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isVaultEntry(value: unknown): value is VaultEntry {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string'
    && vaultEntryTypes.includes(value.type as VaultEntryType)
    && typeof value.label === 'string'
    && typeof value.description === 'string'
    && typeof value.value === 'string'
    && Array.isArray(value.tags)
    && value.tags.every((tag) => typeof tag === 'string')
    && Array.isArray(value.linkedBrainEntryIds)
    && value.linkedBrainEntryIds.every((brainEntryId) => typeof brainEntryId === 'string')
    && vaultEntryStatuses.includes(value.status as (typeof vaultEntryStatuses)[number])
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string'
  )
}

function cloneEntry(entry: VaultEntry): VaultEntry {
  return {
    ...entry,
    tags: [...entry.tags],
    linkedBrainEntryIds: [...entry.linkedBrainEntryIds],
  }
}

function cloneEntries(entries: VaultEntry[]) {
  return entries.map(cloneEntry)
}

function getSeedVaultEntries() {
  return cloneEntries(vaultSeedEntries)
}

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function parseStoredEntries(rawEntries: string): VaultEntry[] | null {
  try {
    const parsed = JSON.parse(rawEntries) as unknown

    if (!Array.isArray(parsed) || !parsed.every(isVaultEntry)) {
      return null
    }

    return cloneEntries(parsed)
  } catch {
    return null
  }
}

export function loadVaultEntries(): VaultEntry[] {
  const storage = getBrowserStorage()

  if (!storage) {
    return getSeedVaultEntries()
  }

  let storedEntries: string | null = null

  try {
    storedEntries = storage.getItem(VAULT_STORAGE_KEY)
  } catch {
    return getSeedVaultEntries()
  }

  if (storedEntries === null) {
    return getSeedVaultEntries()
  }

  return parseStoredEntries(storedEntries) ?? getSeedVaultEntries()
}

export function saveVaultEntries(entries: VaultEntry[]) {
  const storage = getBrowserStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Ignore storage failures so the module stays usable when persistence is blocked.
  }
}

function createVaultEntryId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `vault-${Math.random().toString(36).slice(2, 10)}`
}

export function createVaultRepository(
  entries: VaultEntry[] = vaultSeedEntries,
  setEntries?: Dispatch<SetStateAction<VaultEntry[]>>,
): VaultRepository {
  return {
    listEntries: () => entries,
    getEntryById: (entryId) => findVaultEntryById(entries, entryId),
    searchEntries: (filters) => filterVaultEntries(entries, filters),
    getStats: () => getVaultDatasetStats(entries),
    createEntry: (payload) => {
      const now = new Date().toISOString()
      const nextEntry: VaultEntry = {
        ...payload,
        id: createVaultEntryId(),
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
