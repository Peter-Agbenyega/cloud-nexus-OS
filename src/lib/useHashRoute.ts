import { useEffect, useMemo, useState } from 'react'
import { buildHashRoute, parseHashRoute } from './hashRoute'
import { defaultModuleId, type ModuleId } from '../routes/modules'

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHashRoute(window.location.hash))

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash))
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const nextHash = buildHashRoute(route.activeModuleId, route.path)

    if (!window.location.hash) {
      window.location.hash = buildHashRoute(defaultModuleId)
      return
    }

    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash
    }
  }, [route.activeModuleId, route.path])

  const navigate = useMemo(
    () => (moduleId: ModuleId, subpath?: string | string[]) => {
      const nextHash = buildHashRoute(moduleId, subpath)

      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash
      }
    },
    [],
  )

  return {
    route,
    activeModuleId: route.activeModuleId,
    navigate,
  }
}
