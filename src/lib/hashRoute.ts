import {
  defaultModuleId,
  getModuleById,
  isModuleId,
  type ModuleDefinition,
  type ModuleId,
} from '../routes/modules'

export type HashRoute = {
  activeModuleId: ModuleId
  segments: string[]
  path: string
  rawHash: string
}

export function parseHashRoute(hash: string): HashRoute {
  const rawHash = hash.startsWith('#') ? hash : `#${hash}`
  const normalized = rawHash.slice(1).trim()
  const [candidateModuleId, ...restSegments] = normalized
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)

  const activeModuleId = candidateModuleId && isModuleId(candidateModuleId)
    ? candidateModuleId
    : defaultModuleId

  const segments = candidateModuleId && isModuleId(candidateModuleId)
    ? restSegments
    : []

  return {
    activeModuleId,
    segments,
    path: segments.join('/'),
    rawHash,
  }
}

export function buildHashRoute(activeModuleId: ModuleId, subpath?: string | string[]) {
  const segments = Array.isArray(subpath)
    ? subpath
    : typeof subpath === 'string'
      ? subpath.split('/')
      : []

  const normalizedSegments = segments.map((segment) => segment.trim()).filter(Boolean)
  return `#${[activeModuleId, ...normalizedSegments].join('/')}`
}

export function getActiveModule(route: HashRoute): ModuleDefinition {
  return getModuleById(route.activeModuleId)
}
