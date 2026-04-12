import { Suspense, type CSSProperties, useEffect, useState } from 'react'
import { ModuleErrorBoundary } from '../components/shell/ModuleErrorBoundary'
import { Header } from '../components/shell/Header'
import { Sidebar } from '../components/shell/Sidebar'
import { getActiveModule } from '../lib/hashRoute'
import { useHashRoute } from '../lib/useHashRoute'
import { ActiveModuleContext } from '../lib/useModuleContext'
import { modules } from '../routes/modules'

export function AppShell() {
  const { activeModuleId, navigate, route } = useHashRoute()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [booting, setBooting] = useState(true)
  const [viewResetCount, setViewResetCount] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 720)
    return () => window.clearTimeout(timer)
  }, [])

  const module = getActiveModule(route)
  const ActiveView = module.component
  const activeViewKey = `${module.id}:${viewResetCount}`

  return (
    <div className={`shell ${booting ? 'shell--booting' : ''}`}>
      <Sidebar
        activeModuleId={activeModuleId}
        collapsed={sidebarCollapsed}
        modules={modules}
        onSelect={navigate}
      />

      <div className="shell__main">
        <Header
          activeModule={module}
          booting={booting}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />

        <main className="workspace" style={{ '--module-accent': module.accent } as CSSProperties}>
          <ActiveModuleContext.Provider value={{ activeModule: module, route, navigate }}>
            <ModuleErrorBoundary
              activeModule={module}
              resetKey={activeViewKey}
              onRetry={() => setViewResetCount((value) => value + 1)}
            >
              <Suspense
                fallback={
                  <section className="module-state" aria-live="polite" aria-busy="true">
                    <p className="module-state__eyebrow">Module stream</p>
                    <h2 className="module-state__title">Loading {module.label} surface</h2>
                    <p className="module-state__description">
                      Pulling the next command-center view into the shell.
                    </p>
                  </section>
                }
              >
                <ActiveView key={activeViewKey} />
              </Suspense>
            </ModuleErrorBoundary>
          </ActiveModuleContext.Provider>
        </main>
      </div>
    </div>
  )
}
