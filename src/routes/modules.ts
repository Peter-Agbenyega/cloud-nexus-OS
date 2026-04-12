import { lazy, type LazyExoticComponent, type ComponentType } from 'react'

export type ModuleId = 'nexus' | 'brain' | 'vault' | 'factory' | 'cyber'

export type ModuleDefinition = {
  id: ModuleId
  shortCode: string
  label: string
  accent: string
  strapline: string
  description: string
  status: string
  component: LazyExoticComponent<ComponentType>
}

export const modules: ModuleDefinition[] = [
  {
    id: 'nexus',
    shortCode: 'NX',
    label: 'NEXUS',
    accent: 'var(--accent-nexus)',
    strapline: 'Founder overview and operational pulse',
    description: 'Mission control for priorities, activity, and immediate actions.',
    status: 'Online',
    component: lazy(() =>
      import('../features/nexus/NexusPage').then((module) => ({ default: module.NexusPage })),
    ),
  },
  {
    id: 'brain',
    shortCode: 'BR',
    label: 'BRAIN',
    accent: 'var(--accent-brain)',
    strapline: 'Structured thinking and working memory',
    description: 'Research, notes, and editor surfaces for active problem solving.',
    status: 'Indexing',
    component: lazy(() =>
      import('../features/brain/BrainPage').then((module) => ({ default: module.BrainPage })),
    ),
  },
  {
    id: 'vault',
    shortCode: 'VT',
    label: 'VAULT',
    accent: 'var(--accent-vault)',
    strapline: 'Sensitive knowledge and controlled access',
    description: 'Locked-state shell and secure inventory patterns for future hardening.',
    status: 'Locked',
    component: lazy(() =>
      import('../features/vault/VaultPage').then((module) => ({ default: module.VaultPage })),
    ),
  },
  {
    id: 'factory',
    shortCode: 'FC',
    label: 'FACTORY',
    accent: 'var(--accent-factory)',
    strapline: 'Execution pipeline and production queues',
    description: 'Planning lanes, throughput views, and build readiness.',
    status: 'Queued',
    component: lazy(() =>
      import('../features/factory/FactoryPage').then((module) => ({ default: module.FactoryPage })),
    ),
  },
  {
    id: 'cyber',
    shortCode: 'CY',
    label: 'CYBER',
    accent: 'var(--accent-cyber)',
    strapline: 'Security posture and operational risk',
    description: 'Threat, incident, and compliance surfaces with escalation framing.',
    status: 'Watching',
    component: lazy(() =>
      import('../features/cyber/CyberPage').then((module) => ({ default: module.CyberPage })),
    ),
  },
]

export const defaultModuleId: ModuleId = 'nexus'

export function isModuleId(value: string): value is ModuleId {
  return modules.some((module) => module.id === value)
}

export function getModuleById(id: ModuleId) {
  const module = modules.find((entry) => entry.id === id)

  if (!module) {
    throw new Error(`Unknown module id: ${id}`)
  }

  return module
}
