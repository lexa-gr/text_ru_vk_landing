import { useEffect, type RefObject } from 'react'

import { initCardEffects } from '../effects/card-effects'
import { DESKTOP_QUERY } from './useMediaQuery'

/**
 * Подключает tilt + parallax + spotlight ко всем карточкам `selector` внутри контейнера.
 * Только на десктопной раскладке (≥ 1200px) — на узких экранах эффект выключен целиком, даже если
 * есть мышь. Порог отслеживается на лету: при пересечении границы во время ресайза эффект сам
 * включается или снимается.
 */
export function useCardEffects(containerRef: RefObject<HTMLElement | null>, selector: string): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const desktop = window.matchMedia(DESKTOP_QUERY)
    let dispose: (() => void) | null = null

    const sync = () => {
      dispose?.()
      dispose = desktop.matches ? initCardEffects(Array.from(container.querySelectorAll<HTMLElement>(selector))) : null
    }

    desktop.addEventListener('change', sync)
    sync()

    return () => {
      desktop.removeEventListener('change', sync)
      dispose?.()
    }
  }, [containerRef, selector])
}
