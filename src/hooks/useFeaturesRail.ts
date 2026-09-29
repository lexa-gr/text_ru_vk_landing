import { useLayoutEffect, type RefObject } from 'react'

import { initFeaturesRail } from '../effects/features-rail'

/** Подключает рельсу-таймлайн (effects/features-rail.ts) к корню секции «Работайте с продвижением…». */
export function useFeaturesRail(rootRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = rootRef.current
    return root ? initFeaturesRail(root) : undefined
  }, [rootRef])
}
