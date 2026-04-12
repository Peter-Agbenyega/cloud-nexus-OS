import './factory.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'

const lanes = [
  {
    title: 'Backlog',
    items: ['Wave 2 data contracts', 'Command palette structure', 'Security telemetry adapters'],
  },
  {
    title: 'Active',
    items: ['Frontend shell hardening', 'Module interaction patterns'],
  },
  {
    title: 'Review',
    items: ['Design density calibration', 'Route and component boundaries'],
  },
]

export function FactoryPage() {
  return (
    <div className="module-page factory-page">
      <SectionHeading
        eyebrow="Factory"
        title="Planning and throughput shell"
        description="Execution lanes for operational planning, queue management, and build readiness without locking into workflow infrastructure yet."
      />

      <div className="kanban-grid">
        {lanes.map((lane) => (
          <Panel key={lane.title} title={lane.title} eyebrow="Lane">
            <div className="kanban-lane">
              {lane.items.map((item) => (
                <div key={item} className="kanban-card">
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
