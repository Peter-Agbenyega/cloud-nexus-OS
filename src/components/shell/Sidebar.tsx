import type { CSSProperties } from 'react'
import type { ModuleDefinition, ModuleId } from '../../routes/modules'

type SidebarProps = {
  activeModuleId: ModuleId
  collapsed: boolean
  modules: ModuleDefinition[]
  onSelect: (moduleId: ModuleId) => void
}

export function Sidebar({
  activeModuleId,
  collapsed,
  modules,
  onSelect,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">CN</div>
        {!collapsed && (
          <div>
            <p className="sidebar__eyebrow">Cloud Nexus OS</p>
            <h1 className="sidebar__title">Founder Control Surface</h1>
          </div>
        )}
      </div>

      <nav className="sidebar__nav" aria-label="Primary modules">
        {modules.map((module) => {
          const isActive = module.id === activeModuleId

          return (
            <button
              key={module.id}
              type="button"
              className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
              onClick={() => onSelect(module.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{ '--module-accent': module.accent } as CSSProperties}
            >
              <span className="nav-item__code">{module.shortCode}</span>
              {!collapsed && (
                <span className="nav-item__meta">
                  <span className="nav-item__label">{module.label}</span>
                  <span className="nav-item__strapline">{module.strapline}</span>
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="sidebar__footer">
          <div className="signal-stack">
            <span className="signal-stack__label">MODE</span>
            <strong>Local-first shell</strong>
          </div>
          <div className="signal-stack">
            <span className="signal-stack__label">WAVE</span>
            <strong>Wave 1 steel frame</strong>
          </div>
        </div>
      )}
    </aside>
  )
}
