import type { VaultEntry } from './types'

export const vaultSeedEntries: VaultEntry[] = [
  {
    id: 'vault-aws-root-key',
    type: 'credential',
    label: 'AWS Root Key',
    description: 'Emergency-only credential for the primary Cloud Nexus infrastructure account.',
    value: 'AKIA-TEST-ROOT-7F4Q9M2Y8P',
    tags: ['infra', 'aws', 'production'],
    linkedBrainEntryIds: ['incident-response-runbook-r4m0p2', 'production-readiness-gates-x2n4c1'],
    status: 'active',
    createdAt: '2026-04-08T14:18:00.000Z',
    updatedAt: '2026-04-17T09:42:00.000Z',
  },
  {
    id: 'vault-openai-platform-token',
    type: 'secret',
    label: 'OpenAI Platform Token',
    description: 'Scoped server token for the assistant execution layer in the founder cockpit.',
    value: 'sk-test-XXXXXXXXXXXXXXXXXXXX',
    tags: ['ai', 'integration', 'server'],
    linkedBrainEntryIds: ['ai-agent-ops-playbook-k9d3t7'],
    status: 'active',
    createdAt: '2026-04-09T10:05:00.000Z',
    updatedAt: '2026-04-17T12:10:00.000Z',
  },
  {
    id: 'vault-investor-side-letter',
    type: 'contract',
    label: 'Investor Side Letter',
    description: 'Summary copy of the side letter terms for the seed vehicle.',
    value: `Cloud Nexus Side Letter Summary

- Pro-rata participation rights up to the next priced round
- Quarterly reporting requirement to syndicate leads
- Standard transfer restrictions remain in effect`,
    tags: ['legal', 'finance', 'fundraising'],
    linkedBrainEntryIds: ['seed-round-syndicate-notes-c7h2v8'],
    status: 'active',
    createdAt: '2026-04-01T15:22:00.000Z',
    updatedAt: '2026-04-11T18:07:00.000Z',
  },
  {
    id: 'vault-dr-recovery-checklist',
    type: 'document',
    label: 'Disaster Recovery Checklist',
    description: 'Operator-ready recovery document for infra lockout and provider outages.',
    value: `1. Verify latest infrastructure backup snapshots
2. Reissue compromised keys from the break-glass account
3. Restore DNS, auth, and primary data plane services
4. Log every action into the incident timeline`,
    tags: ['ops', 'recovery', 'playbook'],
    linkedBrainEntryIds: ['incident-response-runbook-r4m0p2'],
    status: 'active',
    createdAt: '2026-03-28T08:12:00.000Z',
    updatedAt: '2026-04-16T16:38:00.000Z',
  },
  {
    id: 'vault-founder-note-banking',
    type: 'note',
    label: 'Founder Banking Notes',
    description: 'Sensitive operating notes tied to treasury setup and bank admin handoff.',
    value: `Use the treasury account only for payroll, tax holdback, and vendor disbursement.
Require dual approval before wiring funds above $25,000.`,
    tags: ['finance', 'ops'],
    linkedBrainEntryIds: ['cash-ops-rhythm-v3m8q6'],
    status: 'archived',
    createdAt: '2026-03-20T11:40:00.000Z',
    updatedAt: '2026-04-05T07:55:00.000Z',
  },
]
