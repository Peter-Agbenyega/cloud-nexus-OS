import { brainEntries } from './brain.data'
import {
  brainCategories,
  brainContentFormats,
  brainStatuses,
  type BrainEntry,
} from './brain.types'

export const BRAIN_STORAGE_KEY = 'cloud-nexus-os.brain.entries'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isBrainEntry(value: unknown): value is BrainEntry {
  if (!isRecord(value)) {
    return false
  }

  // Shared runtime enums keep persistence validation aligned with BrainEntry types as those values evolve.
  return (
    typeof value.id === 'string'
    && typeof value.title === 'string'
    && brainCategories.includes(value.category as (typeof brainCategories)[number])
    && typeof value.summary === 'string'
    && Array.isArray(value.tags)
    && value.tags.every((tag) => typeof tag === 'string')
    && brainContentFormats.includes(value.contentFormat as (typeof brainContentFormats)[number])
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string'
    && brainStatuses.includes(value.status as (typeof brainStatuses)[number])
    && typeof value.content === 'string'
  )
}

function cloneEntries(entries: BrainEntry[]): BrainEntry[] {
  return entries.map((entry) => ({
    ...entry,
    tags: [...entry.tags],
  }))
}

function getSeedBrainEntries(): BrainEntry[] {
  return cloneEntries(brainEntries)
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

function parseStoredEntries(rawEntries: string): BrainEntry[] | null {
  try {
    const parsed = JSON.parse(rawEntries) as unknown

    if (!Array.isArray(parsed) || !parsed.every(isBrainEntry)) {
      return null
    }

    return cloneEntries(parsed)
  } catch {
    return null
  }
}

export function loadBrainEntries(): BrainEntry[] {
  const storage = getBrowserStorage()

  if (!storage) {
    return getSeedBrainEntries()
  }

  let storedEntries: string | null = null

  try {
    storedEntries = storage.getItem(BRAIN_STORAGE_KEY)
  } catch {
    return getSeedBrainEntries()
  }

  if (storedEntries === null) {
    return getSeedBrainEntries()
  }

  // Once stored data is unreadable, fall back to the shipped seed so Brain still boots deterministically.
  return parseStoredEntries(storedEntries) ?? getSeedBrainEntries()
}

export function saveBrainEntries(entries: BrainEntry[]) {
  const storage = getBrowserStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Ignore storage write failures so Brain stays usable even when persistence is unavailable.
  }
}
