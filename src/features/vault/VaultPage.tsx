import './vault.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { VaultProvider } from './VaultProvider'
import { VaultListView } from './VaultListView'
import { VaultWorkspace } from './VaultWorkspace'
import { useVaultWorkspace } from './useVaultWorkspace'

function VaultPageContent() {
  const {
    routeMode,
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
  } = useVaultWorkspace()

  return (
    <div className="module-page vault-page">
      <SectionHeading
        eyebrow="Vault"
        title="Secure asset and credential workspace"
        description="A local-first founder cockpit surface for credentials, secrets, documents, contracts, and notes with masked reveal controls and Brain-linked context."
      />

      <div className="vault-layout">
        <Panel
          title="Vault index"
          eyebrow="Local dataset"
          value={`${visibleEntries.length.toString().padStart(2, '0')} visible`}
          className="vault-panel vault-panel--list"
        >
          <VaultListView
            entries={visibleEntries}
            activeEntryId={selectedEntry?.id ?? null}
            activeType={activeType}
            query={query}
            onTypeChange={setActiveType}
            onQueryChange={setQuery}
            onSelect={selectEntry}
            onCreate={goToCreateEntry}
          />
        </Panel>

        <Panel title="Entry detail" eyebrow="Selected record" className="vault-panel vault-panel--detail">
          <VaultWorkspace
            routeMode={routeMode}
            selectedEntryId={selectedEntryId}
            selectedEntry={selectedEntry}
            selectedEntryFormValue={selectedEntryFormValue}
            createEntryDraft={createEntryDraft}
            linkedBrainEntries={linkedBrainEntries}
            brainOptions={brainOptions}
            onEdit={goToEditEntry}
            onArchive={archiveSelectedEntry}
            onCancelCreate={cancelCreateEntry}
            onCancelEdit={cancelEditEntry}
            onSubmitCreate={submitCreateEntry}
            onSubmitEdit={submitEditEntry}
          />
        </Panel>

        <Panel title="Workspace state" eyebrow="Boundary" className="vault-panel vault-panel--workspace">
          <div className="vault-workspace">
            <div className="vault-workspace__toolbar">
              <span>route: {workspaceRoute.rawHash}</span>
              <span>view: {workspaceRoute.selectionState}</span>
              <span>storage: localStorage</span>
              <span>search scope: label + description</span>
              <span>value indexing: disabled</span>
            </div>
            <div className="vault-workspace__canvas">
              <div className="vault-workspace__block">
                <p className="vault-workspace__label">Selection state</p>
                <strong>{workspaceSelection.title ?? 'No vault entry selected'}</strong>
                <dl className="vault-workspace__stats">
                  <div>
                    <dt>Status</dt>
                    <dd>{workspaceSelection.status ?? 'idle'}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{workspaceSelection.type ?? 'n/a'}</dd>
                  </div>
                  <div>
                    <dt>Segments</dt>
                    <dd>{workspaceSelection.routeSegmentCount}</dd>
                  </div>
                </dl>
              </div>

              <div className="vault-workspace__block">
                <p className="vault-workspace__label">Dataset status</p>
                <dl className="vault-workspace__stats">
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
                    <dd>{workspaceDataset.active}</dd>
                  </div>
                  <div>
                    <dt>Archived</dt>
                    <dd>{workspaceDataset.archived}</dd>
                  </div>
                  <div>
                    <dt>Credentials</dt>
                    <dd>{workspaceDataset.byType.credential}</dd>
                  </div>
                  <div>
                    <dt>Secrets</dt>
                    <dd>{workspaceDataset.byType.secret}</dd>
                  </div>
                </dl>
              </div>

              <div className="vault-workspace__block">
                <p className="vault-workspace__label">Route contract</p>
                <p>
                  Workspace mode derives from the shared hash route, so list, detail, create, edit, and invalid
                  states stay aligned with shell navigation rather than local UI state.
                </p>
                <div className="vault-workspace__actions">
                  {selectedEntryId || routeMode === 'create' ? (
                    <button type="button" className="vault-action vault-action--secondary" onClick={clearSelection}>
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

export function VaultPage() {
  return (
    <VaultProvider>
      <VaultPageContent />
    </VaultProvider>
  )
}
