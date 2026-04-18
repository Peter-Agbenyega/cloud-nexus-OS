import { useMemo, useState } from 'react'
import { useActiveModule } from '../../lib/useModuleContext'
import { loadBrainEntries } from '../brain/brain.persistence'
import { createBrainRepository } from '../brain/brain.repository'
import { useVaultRepository } from './vault.repository.context'
import { getVaultWorkspaceDatasetSummary, getVaultWorkspaceSelectionSummary } from './selectors'
import type { BrainLinkOption, VaultEntryWritableFields, VaultEntryTypeFilter, VaultSelectionState } from './types'

type VaultRouteState = {
  mode: VaultSelectionState
  selectedEntryId: string | null
}

function createDefaultVaultEntryDraft(): VaultEntryWritableFields {
  return {
    type: 'credential',
    label: '',
    description: '',
    value: '',
    tags: ['secure'],
    linkedBrainEntryIds: [],
    status: 'active',
  }
}

function mapVaultEntryToFormValue(entry: VaultEntryWritableFields & { id?: string }) {
  return {
    type: entry.type,
    label: entry.label,
    description: entry.description,
    value: entry.value,
    tags: [...entry.tags],
    linkedBrainEntryIds: [...entry.linkedBrainEntryIds],
    status: entry.status,
  }
}

function resolveVaultRoute(segments: string[]): VaultRouteState {
  if (segments.length === 0) {
    return {
      mode: 'idle',
      selectedEntryId: null,
    }
  }

  if (segments[0] === 'new' && segments.length === 1) {
    return {
      mode: 'create',
      selectedEntryId: null,
    }
  }

  if (segments[0] === 'entry' && segments[1] && segments[2] === 'edit' && segments.length === 3) {
    return {
      mode: 'edit',
      selectedEntryId: segments[1],
    }
  }

  if (segments[0] === 'entry' && segments[1] && segments.length === 2) {
    return {
      mode: 'resolved',
      selectedEntryId: segments[1],
    }
  }

  return {
    mode: 'invalid',
    selectedEntryId: segments[1] ?? null,
  }
}

export function useVaultWorkspace() {
  const { activeModule, navigate, route } = useActiveModule()
  const repository = useVaultRepository()
  const [activeType, setActiveType] = useState<VaultEntryTypeFilter>('all')
  const [query, setQuery] = useState('')
  const createEntryDraft = useMemo(() => createDefaultVaultEntryDraft(), [])

  const routeState = useMemo(() => resolveVaultRoute(route.segments), [route.segments])
  const selectedEntryId = routeState.selectedEntryId

  const visibleEntries = useMemo(
    () => repository.searchEntries({ type: activeType, query }),
    [activeType, query, repository],
  )
  const selectedEntry = useMemo(
    () => (selectedEntryId ? repository.getEntryById(selectedEntryId) : null),
    [repository, selectedEntryId],
  )
  const selectedEntryFormValue = useMemo(
    () => (selectedEntry ? mapVaultEntryToFormValue(selectedEntry) : null),
    [selectedEntry],
  )
  const datasetStats = useMemo(() => repository.getStats(), [repository])
  const workspaceSelection = useMemo(
    () => getVaultWorkspaceSelectionSummary({
      createEntryDraft,
      routeMode: routeState.mode,
      routeSegmentCount: route.segments.length,
      selectedEntryId,
      selectedEntry,
    }),
    [createEntryDraft, route.segments.length, routeState.mode, selectedEntry, selectedEntryId],
  )
  const workspaceDataset = useMemo(
    () => getVaultWorkspaceDatasetSummary(datasetStats, visibleEntries),
    [datasetStats, visibleEntries],
  )
  const workspaceRoute = useMemo(
    () => ({
      rawHash: route.rawHash || '#vault',
      selectionState: workspaceSelection.state,
      selectedEntryId,
    }),
    [route.rawHash, selectedEntryId, workspaceSelection.state],
  )

  const brainOptions = useMemo<BrainLinkOption[]>(() => {
    const brainRepository = createBrainRepository(loadBrainEntries())

    return brainRepository
      .listEntries()
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
      }))
      .sort((left, right) => left.title.localeCompare(right.title))
  }, [])
  const linkedBrainEntries = useMemo(
    () => brainOptions.filter((option) => selectedEntry?.linkedBrainEntryIds.includes(option.id)),
    [brainOptions, selectedEntry],
  )

  const selectEntry = (entryId: string) => {
    navigate(activeModule.id, ['entry', entryId])
  }

  const goToCreateEntry = () => {
    navigate(activeModule.id, ['new'])
  }

  const goToEditEntry = (entryId: string) => {
    navigate(activeModule.id, ['entry', entryId, 'edit'])
  }

  const clearSelection = () => {
    navigate(activeModule.id, [])
  }

  const cancelCreateEntry = () => {
    navigate(activeModule.id, [])
  }

  const cancelEditEntry = () => {
    if (!selectedEntryId) {
      navigate(activeModule.id, [])
      return
    }

    navigate(activeModule.id, ['entry', selectedEntryId])
  }

  const submitCreateEntry = (payload: VaultEntryWritableFields) => {
    const nextEntry = repository.createEntry(payload)

    setActiveType('all')
    setQuery('')
    selectEntry(nextEntry.id)
  }

  const submitEditEntry = (payload: VaultEntryWritableFields) => {
    if (!selectedEntryId) {
      return
    }

    repository.updateEntry(selectedEntryId, payload)
    navigate(activeModule.id, ['entry', selectedEntryId])
  }

  const archiveSelectedEntry = () => {
    if (!selectedEntryId) {
      return
    }

    repository.archiveEntry(selectedEntryId)
    navigate(activeModule.id, [])
  }

  return {
    routeMode: routeState.mode,
    query,
    setQuery,
    activeType,
    setActiveType,
    visibleEntries,
    selectedEntryId,
    selectedEntry,
    selectedEntryFormValue,
    workspaceSelection,
    workspaceDataset,
    workspaceRoute,
    linkedBrainEntries,
    brainOptions,
    selectEntry,
    goToCreateEntry,
    goToEditEntry,
    cancelCreateEntry,
    cancelEditEntry,
    submitCreateEntry,
    submitEditEntry,
    archiveSelectedEntry,
    clearSelection,
    createEntryDraft,
  }
}
