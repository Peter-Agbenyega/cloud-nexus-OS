import './brain.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { BrainRepositoryProvider } from './BrainRepositoryProvider'
import { BrainDetail } from './components/BrainDetail'
import { BrainEntryForm } from './components/BrainEntryForm'
import { BrainEmptyState } from './components/BrainEmptyState'
import { BrainFilters } from './components/BrainFilters'
import { BrainList } from './components/BrainList'
import { useBrainWorkspace } from './useBrainWorkspace'

function BrainPageContent() {
  const {
    routeMode,
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    visibleEntries,
    selectedEntryId,
    selectedEntry,
    selectedEntryFormValue,
    canEditSelectedEntry,
    clearSelection,
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
    createEntryDraft,
  } = useBrainWorkspace()

  const emptyStateMode = workspaceSelection.state === 'invalid' ? 'invalid' : 'idle'
  const detailPanelMode = routeMode === 'create'
    ? 'create'
    : canEditSelectedEntry
      ? 'edit'
      : selectedEntry
        ? 'detail'
        : 'empty'

  return (
    <div className="module-page brain-page">
      <SectionHeading
        eyebrow="Brain"
        title="Operational memory workspace"
        description="A dense local-first surface for prompts, strategy, playbooks, and operating notes with route-aware selection inside the shell."
      />

      <div className="brain-layout">
        <Panel
          title="Brain index"
          eyebrow="Local dataset"
          value={`${visibleEntries.length.toString().padStart(2, '0')} visible`}
          className="brain-panel brain-panel--list"
        >
          <div className="brain-list-panel__body">
            <div className="brain-controls">
              <div className="brain-controls__actions">
                <button type="button" className="brain-action" onClick={goToCreateEntry}>
                  New entry
                </button>
              </div>
              <label className="brain-search">
                <span>Search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, tags, summaries"
                />
              </label>
              <BrainFilters activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>

            <BrainList
              entries={visibleEntries}
              activeEntryId={selectedEntry?.id ?? null}
              onSelect={selectEntry}
            />
          </div>
        </Panel>

        <Panel title="Entry detail" eyebrow="Selected note" className="brain-panel brain-panel--detail">
          {detailPanelMode === 'create' ? (
            <BrainEntryForm
              key="brain-entry-create"
              mode="create"
              initialValue={createEntryDraft}
              submitLabel="Create entry"
              onSubmit={submitCreateEntry}
              onCancel={cancelCreateEntry}
            />
          ) : detailPanelMode === 'edit' && selectedEntry && selectedEntryFormValue ? (
            <BrainEntryForm
              key={selectedEntry.id}
              mode="edit"
              initialValue={selectedEntryFormValue}
              submitLabel="Save changes"
              onSubmit={submitEditEntry}
              onCancel={cancelEditEntry}
            />
          ) : detailPanelMode === 'detail' && selectedEntry ? (
            <BrainDetail
              key={selectedEntry.id}
              entry={selectedEntry}
              onEdit={() => goToEditEntry(selectedEntry.id)}
              onArchive={archiveSelectedEntry}
            />
          ) : (
            <BrainEmptyState mode={emptyStateMode} invalidEntryId={selectedEntryId} />
          )}
        </Panel>

        <Panel title="Workspace state" eyebrow="Boundary" className="brain-panel brain-panel--workspace">
          <div className="brain-workspace">
            <div className="brain-workspace__toolbar">
              <span>route: {workspaceRoute.rawHash}</span>
              <span>view: {workspaceRoute.selectionState}</span>
              <span>storage: memory</span>
              <span>sync: offline</span>
              <span>mode: local-only</span>
            </div>
            <div className="brain-workspace__canvas">
              <div className="brain-workspace__block">
                <p className="brain-workspace__label">Selection state</p>
                <strong>{workspaceSelection.title ?? 'No note selected'}</strong>
                <dl className="brain-workspace__stats">
                  <div>
                    <dt>Status</dt>
                    <dd>{workspaceSelection.state === 'create' ? 'create-draft' : workspaceSelection.status ?? 'idle'}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{workspaceSelection.format ?? 'n/a'}</dd>
                  </div>
                  <div>
                    <dt>Segments</dt>
                    <dd>{workspaceSelection.routeSegmentCount}</dd>
                  </div>
                </dl>
              </div>
              <div className="brain-workspace__block">
                <p className="brain-workspace__label">Dataset status</p>
                <dl className="brain-workspace__stats">
                  <div>
                    <dt>Visible</dt>
                    <dd>{workspaceDataset.visible}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{workspaceDataset.total}</dd>
                  </div>
                  <div>
                    <dt>Active</dt>
                    <dd>{workspaceDataset.byStatus.active}</dd>
                  </div>
                  <div>
                    <dt>Draft</dt>
                    <dd>{workspaceDataset.byStatus.draft}</dd>
                  </div>
                  <div>
                    <dt>Archived</dt>
                    <dd>{workspaceDataset.byStatus.archived}</dd>
                  </div>
                  <div>
                    <dt>Markdown</dt>
                    <dd>{markdownEntryCount}</dd>
                  </div>
                </dl>
              </div>
              <div className="brain-workspace__block">
                <p className="brain-workspace__label">Route contract</p>
                <p>
                  Navigation now flows through the shared module context, keeping note selection aligned with the
                  shell hash router instead of module-local URL mutation.
                </p>
                <div className="brain-workspace__actions">
                  {selectedEntryId || workspaceSelection.state === 'create' ? (
                    <button type="button" className="brain-action brain-action--secondary" onClick={clearSelection}>
                      Clear selection
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function BrainPage() {
  return (
    <BrainRepositoryProvider>
      <BrainPageContent />
    </BrainRepositoryProvider>
  )
}
