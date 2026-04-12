import './nexus.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'

const metrics = [
  { label: 'Critical tracks', value: '04', detail: 'Fundraise, product, security, runway' },
  { label: 'Pending actions', value: '11', detail: 'Founder decisions within 48h' },
  { label: 'Execution velocity', value: '+18%', detail: 'Compared with last operating cycle' },
]

const activity = [
  ['System brief assembled', 'Nexus shell initialized and module topology registered'],
  ['Product pressure point', 'Vault and Cyber both need clear wave-two data contracts'],
  ['Founder follow-up', 'Review route strategy and baseline component density'],
]

export function NexusPage() {
  return (
    <div className="module-page nexus-page">
      <SectionHeading
        eyebrow="Nexus"
        title="Operational command deck"
        description="High-signal overview for immediate decisions, current pressure, and founder-level execution flow."
      />

      <div className="metric-grid">
        {metrics.map((metric) => (
          <Panel key={metric.label} eyebrow={metric.label} value={metric.value}>
            <p className="muted-copy">{metric.detail}</p>
          </Panel>
        ))}
      </div>

      <div className="content-grid content-grid--primary">
        <Panel title="Quick actions" eyebrow="Immediate">
          <div className="action-list">
            <button type="button" className="action-tile">
              Prepare founder briefing
            </button>
            <button type="button" className="action-tile">
              Review active system risks
            </button>
            <button type="button" className="action-tile">
              Open production planning board
            </button>
          </div>
        </Panel>

        <Panel title="Activity pulse" eyebrow="Signals">
          <div className="list-table">
            {activity.map(([title, detail]) => (
              <div key={title} className="list-table__row">
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
