import type { CSSProperties } from 'react'
import type { ModuleDefinition } from '../../routes/modules'

type HeaderProps = {
  activeModule: ModuleDefinition
  booting: boolean
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function Header({
  activeModule,
  booting,
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span />
          <span />
          <span />
        </button>
        <div>
          <p className="topbar__eyebrow">Operational module</p>
          <div className="topbar__title-row">
            <h2 className="topbar__title">{activeModule.label}</h2>
            <span
              className="status-pill"
              style={{ '--status-accent': activeModule.accent } as CSSProperties}
            >
              {activeModule.status}
            </span>
          </div>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__summary">
          <span className="topbar__label">Scope</span>
          <strong>{activeModule.description}</strong>
        </div>
        <div className={`boot-indicator ${booting ? 'boot-indicator--active' : ''}`}>
          <span className="boot-indicator__dot" />
          <span>{booting ? 'Booting shell' : 'Shell ready'}</span>
        </div>
      </div>
    </header>
  )
}
