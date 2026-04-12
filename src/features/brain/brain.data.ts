import type { BrainEntry } from './brain.types'

export const brainEntries: BrainEntry[] = [
  {
    id: 'founder-daily-ops-loop',
    title: 'Founder Daily Ops Loop',
    category: 'Workflows',
    summary: 'Morning-to-close cadence for priorities, execution, review, and carry-forward decisions.',
    tags: ['cadence', 'founder', 'operating-system'],
    contentFormat: 'markdown',
    createdAt: '2026-03-12T07:30:00.000Z',
    updatedAt: '2026-04-05T09:10:00.000Z',
    status: 'active',
    content: `# Founder Daily Ops Loop

Start the day by narrowing to one control objective, one growth objective, and one systems objective.

- Review revenue, delivery, and risk signals before opening comms
- Lock the top three outcomes before touching low-leverage work
- Move unresolved blockers into an explicit escalation lane by noon

## Closeout protocol

- Update the operating log with shipped work and open loops
- Note the one decision that changed leverage today
- Queue tomorrow's first move before shutting down the shell`,
  },
  {
    id: 'investor-update-operator-prompt',
    title: 'Investor Update Operator Prompt',
    category: 'Prompts',
    summary: 'Prompt frame for turning messy weekly inputs into a clear investor-grade update.',
    tags: ['prompt', 'comms', 'investors'],
    contentFormat: 'markdown',
    createdAt: '2026-03-08T15:00:00.000Z',
    updatedAt: '2026-04-04T15:30:00.000Z',
    status: 'active',
    content: `# Investor Update Operator Prompt

You are compiling a founder update from raw operating notes. Produce a concise weekly memo that is concrete, numerical where possible, and candid about risk.

- Lead with traction, then constraints, then asks
- Convert vague progress into dated milestones
- Strip hype language and keep the voice operational

## Required sections

1. Wins from the week
2. Risks or misses
3. Key metrics
4. Decisions made
5. Specific asks or intros needed`,
  },
  {
    id: 'wave-2-shell-expansion',
    title: 'Wave 2 Shell Expansion Thesis',
    category: 'Strategy',
    summary: 'Why BRAIN becomes the first operational surface before Vault, Factory, Cyber, and Nexus deepen.',
    tags: ['wave-2', 'shell', 'priorities'],
    contentFormat: 'markdown',
    createdAt: '2026-03-28T13:15:00.000Z',
    updatedAt: '2026-04-06T07:45:00.000Z',
    status: 'active',
    content: `# Wave 2 Shell Expansion Thesis

The shell is stable enough to support one real workflow. BRAIN should go first because it creates reusable patterns for list-detail navigation, dense information display, and future persistence boundaries.

- Start with local-only data and route-driven selection
- Prove a serious desktop workspace before adding storage complexity
- Keep the interaction model strict so later modules inherit discipline

## Non-goals for this pass

- No backend sync
- No AI assistance
- No auth or encryption
- No cross-module workflow activation`,
  },
  {
    id: 'meeting-decompression-sop',
    title: 'Meeting Decompression SOP',
    category: 'SOPs',
    summary: 'Post-meeting capture ritual for extracting decisions, owners, and next actions fast.',
    tags: ['meetings', 'capture', 'decisions'],
    contentFormat: 'markdown',
    createdAt: '2026-02-21T18:20:00.000Z',
    updatedAt: '2026-04-02T18:05:00.000Z',
    status: 'active',
    content: `# Meeting Decompression SOP

Never leave a meeting with action items trapped in memory.

- Write the decision made in one sentence
- Record each owner with a date, not a vague follow-up
- Separate facts, assumptions, and unresolved questions

## Output format

1. Decision
2. Commitments
3. Open risks
4. Follow-ups
5. What changes in the operating system now`,
  },
  {
    id: 'customer-signal-map',
    title: 'Customer Signal Map',
    category: 'Knowledge',
    summary: 'Reference note for interpreting support, sales, and usage signals without overreacting.',
    tags: ['customer', 'signals', 'interpretation'],
    contentFormat: 'plaintext',
    createdAt: '2026-02-10T11:05:00.000Z',
    updatedAt: '2026-04-01T12:20:00.000Z',
    status: 'archived',
    content: `Customer Signal Map

Strong signals are repeated, costly, and behavior-linked. Weak signals are loud but isolated.

Support pain that blocks delivery outranks feature requests.
Repeated objections in sales calls indicate positioning debt.
Usage drop after onboarding usually signals expectation mismatch.

Interpretation rule

Escalate only after at least two independent confirmations unless the issue threatens trust, money, or security immediately.`,
  },
  {
    id: 'ops-console-v2-idea-bank',
    title: 'Ops Console V2 Idea Bank',
    category: 'Ideas',
    summary: 'Candidate surfaces to tighten founder control loops without bloating the shell.',
    tags: ['ideas', 'ui', 'operations'],
    contentFormat: 'markdown',
    createdAt: '2026-03-18T10:05:00.000Z',
    updatedAt: '2026-03-31T10:15:00.000Z',
    status: 'draft',
    content: `# Ops Console V2 Idea Bank

- Rolling decision ledger pinned beside execution streams
- Heatmap of unresolved blockers by owner and age
- Founder focus timer tied to daily operating objectives
- Cross-module handoff rail for Brain to Vault to Factory workflows

## Screening rule

Only ship additions that reduce decision latency or context switching. Ignore cosmetic complexity.`,
  },
  {
    id: 'launch-war-room-playbook',
    title: 'Launch War Room Playbook',
    category: 'Playbooks',
    summary: 'Structured launch response flow for rollout day, incident triage, and communication control.',
    tags: ['launch', 'war-room', 'response'],
    contentFormat: 'markdown',
    createdAt: '2026-03-03T16:10:00.000Z',
    updatedAt: '2026-03-30T16:50:00.000Z',
    status: 'active',
    content: `# Launch War Room Playbook

The launch room should run one scoreboard, one incident queue, and one comms lead.

- Define a single source of truth for status
- Triage incidents by user harm before engineering elegance
- Hold outbound comms until facts are confirmed

## Rhythm

1. Fifteen-minute signal sweep
2. Decision checkpoint
3. Fix assignment
4. Customer-facing update
5. Debrief capture into Brain`,
  },
  {
    id: 'strategy-stack-ranking',
    title: 'Strategy Stack Ranking',
    category: 'Strategy',
    summary: 'Decision framework for ranking initiatives by leverage, speed, and reversibility.',
    tags: ['strategy', 'prioritization', 'leverage'],
    contentFormat: 'markdown',
    createdAt: '2026-01-29T08:10:00.000Z',
    updatedAt: '2026-03-29T08:40:00.000Z',
    status: 'active',
    content: `# Strategy Stack Ranking

Rank each initiative by expected leverage, time-to-feedback, and reversibility.

- High leverage plus fast feedback should dominate the stack
- Slow, expensive, irreversible work needs exceptional justification
- Protect strategy from urgency theater by forcing explicit tradeoffs

## Scoring note

Use a five-point scale for leverage, speed, and reversibility, then discuss the outliers rather than pretending the score is the decision.`,
  },
]
