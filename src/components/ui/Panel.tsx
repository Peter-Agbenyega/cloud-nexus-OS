import type { CSSProperties, ReactNode } from 'react'
import { useOptionalActiveModule } from '../../lib/useModuleContext'

type PanelProps = {
  title?: string
  eyebrow?: string
  value?: string
  accent?: string
  children: ReactNode
  className?: string
}

export function Panel({
  title,
  eyebrow,
  value,
  accent,
  children,
  className,
}: PanelProps) {
  const moduleContext = useOptionalActiveModule()
  const classes = ['panel', className].filter(Boolean).join(' ')
  const panelAccent = accent ?? moduleContext?.activeModule.accent ?? 'var(--border-strong)'

  return (
    <section className={classes} style={{ '--panel-accent': panelAccent } as CSSProperties}>
      {(title ?? eyebrow ?? value) && (
        <header className="panel__header">
          <div>
            {eyebrow && <p className="panel__eyebrow">{eyebrow}</p>}
            {title && <h3 className="panel__title">{title}</h3>}
          </div>
          {value && <span className="panel__value">{value}</span>}
        </header>
      )}
      {children}
    </section>
  )
}
