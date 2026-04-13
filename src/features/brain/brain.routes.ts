export type BrainRouteState = {
  mode: 'idle' | 'detail' | 'create' | 'edit'
  selectedEntryId: string | null
}

export function resolveBrainRoute(segments: string[]): BrainRouteState {
  if (segments.length === 0) {
    return {
      mode: 'idle',
      selectedEntryId: null,
    }
  }

  if (segments[0] === 'new' && segments.length === 1) {
    return {
      mode: 'create',
      selectedEntryId: null,
    }
  }

  if (segments[0] === 'note' && segments[1] && segments[2] === 'edit' && segments.length === 3) {
    return {
      mode: 'edit',
      selectedEntryId: segments[1],
    }
  }

  if (segments[0] === 'note' && segments[1] && segments.length === 2) {
    return {
      mode: 'detail',
      selectedEntryId: segments[1],
    }
  }

  return {
    mode: 'idle',
    selectedEntryId: null,
  }
}
