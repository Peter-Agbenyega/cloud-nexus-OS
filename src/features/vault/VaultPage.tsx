import './vault.css'
import { Panel } from '../../components/ui/Panel'
import { SectionHeading } from '../../components/ui/SectionHeading'

const vaultItems = [
  ['Operator credentials', 'Awaiting secure storage implementation'],
  ['Infrastructure recovery notes', 'Classified until encryption layer exists'],
  ['Key contacts', 'Metadata shell only'],
]

export function VaultPage() {
  return (
    <div className="module-page vault-page">
      <SectionHeading
        eyebrow="Vault"
        title="Locked state and inventory shell"
        description="Security-first framing without implementing secrets, encryption, or persistence ahead of the right foundation."
      />

      <div className="content-grid">
        <Panel title="Access state" eyebrow="Control">
          <div className="locked-shell">
            <div className="locked-shell__badge">LOCKED</div>
            <p className="muted-copy">
              Secret access flows, key derivation, and local encrypted storage are intentionally deferred to Wave 2+.
            </p>
          </div>
        </Panel>

        <Panel title="Vault inventory" eyebrow="Catalog">
          <div className="list-table">
            {vaultItems.map(([title, detail]) => (
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
