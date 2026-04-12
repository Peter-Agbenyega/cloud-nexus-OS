import './cyber.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'

const incidents = [
  ['Surface hardening', 'No backend exposure in Wave 1', 'Low'],
  ['Credential storage gap', 'Vault intentionally non-operational', 'Medium'],
  ['Dependency baseline', 'Needs Wave 2 review and package policy', 'Medium'],
]

export function CyberPage() {
  return (
    <div className="module-page cyber-page">
      <SectionHeading
        eyebrow="Cyber"
        title="Threat, incident, and compliance shell"
        description="A serious security posture surface for future telemetry and governance layers, without shipping fake scanners or feeds."
      />

      <div className="content-grid">
        <Panel title="Threat monitor" eyebrow="Watch">
          <div className="threat-meter">
            <div className="threat-meter__band threat-meter__band--high" />
            <div className="threat-meter__band threat-meter__band--medium" />
            <div className="threat-meter__band threat-meter__band--low" />
            <strong>Posture: guarded shell</strong>
          </div>
        </Panel>

        <Panel title="Incidents and controls" eyebrow="Register">
          <div className="incident-list">
            {incidents.map(([name, detail, severity]) => (
              <div key={name} className="incident-list__row">
                <div>
                  <strong>{name}</strong>
                  <p>{detail}</p>
                </div>
                <span>{severity}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Compliance shell" eyebrow="Readiness">
          <ul className="data-list">
            <li>Asset inventory model pending</li>
            <li>Access logging model pending</li>
            <li>Incident workflow pending</li>
            <li>Vendor and dependency review pending</li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}
