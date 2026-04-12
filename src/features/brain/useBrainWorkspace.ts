import { useMemo, useState } from 'react'
import { useActiveModule } from '../../lib/useModuleContext'
import { createDefaultBrainEntryDraft, mapBrainEntryToFormValue } from './brain.form'
import { resolveBrainRoute } from './brain.routes'
import { useBrainRepository } from './brain.repository.context'
import {
  getBrainFormatCount,
  getBrainWorkspaceDatasetSummary,
  getBrainWorkspaceSelectionSummary,
} from './brain.selectors'
import type { BrainCategoryFilter, BrainEntryCreatePayload, BrainEntryWritableFields } from './brain.types'

export function useBrainWorkspace() {
  const { activeModule, navigate, route } = useActiveModule()
  const repository = useBrainRepository()
  const [activeCategory, setActiveCategory] = useState<BrainCategoryFilter>('All')
  const [query, setQuery] = useState('')

  const routeState = useMemo(() => resolveBrainRoute(route.segments), [route.segments])
  const selectedEntryId = routeState.selectedEntryId

  const visibleEntries = useMemo(
    () => repository.searchEntries({ category: activeCategory, query }),
    [activeCategory, query, repository],
  )

  const selectedEntry = useMemo(
    () => (selectedEntryId ? repository.getEntryById(selectedEntryId) : null),
    [repository, selectedEntryId],
  )
  const canEditSelectedEntry = routeState.mode === 'edit' && selectedEntry !== null
  const selectedEntryFormValue = useMemo(
    () => (selectedEntry ? mapBrainEntryToFormValue(selectedEntry) : null),
    [selectedEntry],
  )

  const datasetStats = useMemo(
    () => repository.getStats(),
    [repository],
  )
  const workspaceSelection = useMemo(
    () => getBrainWorkspaceSelectionSummary({
      routeMode: routeState.mode,
      routeSegmentCount: route.segments.length,
      selectedEntryId,
      selectedEntry,
    }),
    [route.segments.length, routeState.mode, selectedEntry, selectedEntryId],
  )
  const workspaceDataset = useMemo(
    () => getBrainWorkspaceDatasetSummary(datasetStats, visibleEntries),
    [datasetStats, visibleEntries],
  )
  const markdownEntryCount = useMemo(
    () => getBrainFormatCount(datasetStats, 'markdown'),
    [datasetStats],
  )
  const workspaceRoute = useMemo(
    () => ({
      rawHash: route.rawHash || '#brain',
      selectionState: workspaceSelection.state,
      selectedEntryId,
    }),
    [route.rawHash, selectedEntryId, workspaceSelection.state],
  )

  const selectEntry = (entryId: string) => {
    navigate(activeModule.id, ['note', entryId])
  }

  const goToCreateEntry = () => {
    navigate(activeModule.id, ['new'])
  }

  const goToEditEntry = (entryId: string) => {
    navigate(activeModule.id, ['note', entryId, 'edit'])
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

    navigate(activeModule.id, ['note', selectedEntryId])
  }

  const submitCreateEntry = (payload: BrainEntryCreatePayload) => {
    const nextEntry = repository.createEntry(payload)

    setActiveCategory('All')
    setQuery('')
    selectEntry(nextEntry.id)
  }

  const submitEditEntry = (payload: BrainEntryWritableFields) => {
    if (!selectedEntryId) {
      return
    }

    repository.updateEntry(selectedEntryId, payload)
    navigate(activeModule.id, ['note', selectedEntryId])
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
    activeCategory,
    setActiveCategory,
    visibleEntries,
    selectedEntryId,
    selectedEntry,
    selectedEntryFormValue,
    canEditSelectedEntry,
    workspaceSelection,
    workspaceDataset,
    workspaceRoute,
    markdownEntryCount,
    selectEntry,
    goToCreateEntry,
    goToEditEntry,
    cancelCreateEntry,
    cancelEditEntry,
    submitCreateEntry,
    submitEditEntry,
    archiveSelectedEntry,
    createEntryDraft: createDefaultBrainEntryDraft(),
    clearSelection,
  }
}
