import { applyParallax, collectParallaxLayers, resetParallax } from './parallax'
import { PARALLAX } from './parallax.config'
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, getNormalizedPointer, isCardEffectsSupported } from './pointer'
import { clearSpotlight, hideSpotlight, showSpotlight, updateSpotlight } from './spotlight'
import { applyTilt, beginTilt, endTilt, resetTilt } from './tilt'

/**
 * Склейка tilt + parallax + spotlight для набора карточек: события мыши → точные целевые значения
 * transform, плавную интерполяцию между ними делает браузер через CSS `transition: transform`
 * (см. styles/parallax.css), а не JS вручную по кадрам.
 *
 * На каждое событие курсора (enter/move) пишем ОКОНЧАТЕЛЬНОЕ значение transform карточки и слоёв —
 * без промежуточных кадров и без requestAnimationFrame. Карточка и слои получают ОДИН и тот же
 * transition-duration за один синхронный вызов, поэтому наклон и параллакс всегда в одной фазе, как
 * и раньше. Spotlight по-прежнему питается «сырой» позицией курсора без сглаживания — см. spotlight.ts.
 *
 * Длительность разная для двух фаз: короткая, пока курсор внутри карточки (быстрый отклик на
 * mousemove — CSS сам плавно «перенацеливает» текущий transition на новую точку, без рывка), и
 * длиннее — на возврат в покой после mouseleave. Обе — в parallax.config.ts (PARALLAX.motion).
 */

const { followMs: FOLLOW_MS, releaseMs: RELEASE_MS } = PARALLAX.motion

function attachCard(card: HTMLElement): () => void {
  const layers = collectParallaxLayers(card)
  // Все элементы, чей transform мы пишем и чей transition-duration переключаем синхронно.
  const transitioned = [card, ...layers.map((layer) => layer.element)]

  // getBoundingClientRect() кэшируем и обновляем только на mouseenter/resize, а не на каждый
  // mousemove: чтение геометрии сразу после записи transform форсирует синхронный layout прямо
  // в обработчике события мыши.
  let rect = card.getBoundingClientRect()
  let hovering = false

  const measureRect = () => {
    rect = card.getBoundingClientRect()
  }

  const setTransitionDuration = (ms: number) => {
    const value = `${ms}ms`
    for (const element of transitioned) element.style.transitionDuration = value
  }

  /** Пишет точное целевое состояние в DOM за один вызов; rect уже измерен (см. measureRect). */
  const track = (event: MouseEvent) => {
    const pointer = getNormalizedPointer(rect, event)
    applyTilt(card, pointer.x, pointer.y)
    applyParallax(layers, pointer.x, pointer.y)
    updateSpotlight(card, rect, event)
  }

  const onEnter = (event: MouseEvent) => {
    hovering = true
    measureRect()
    setTransitionDuration(FOLLOW_MS)
    beginTilt(card)
    showSpotlight(card)
    track(event)
  }

  const onMove = (event: MouseEvent) => {
    track(event)
  }

  const onLeave = () => {
    hovering = false
    hideSpotlight(card)
    setTransitionDuration(RELEASE_MS)
    card.style.transform = ''
    resetParallax(layers)
  }

  /*
   * Снимаем TILTING_CLASS только когда transition возврата реально доиграл (а не по таймеру и не по
   * эпсилон-порогу, как раньше) — transitionend это событие даёт браузер сам. Если курсор вернулся до
   * конца анимации, браузер шлёт transitioncancel вместо transitionend — этот случай отфильтровывает
   * сама природа события, hovering — просто защитная подстраховка.
   */
  const onCardTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== card || event.propertyName !== 'transform') return
    if (!hovering) endTilt(card)
  }

  // Пока курсор над карточкой, resize окна мог сдвинуть/изменить её размер — перемеряем без ожидания
  // следующего mouseenter (на mousemove не перемеряем, см. комментарий у объявления rect).
  const onResize = () => {
    if (hovering) measureRect()
  }

  card.addEventListener('mouseenter', onEnter)
  card.addEventListener('mousemove', onMove)
  card.addEventListener('mouseleave', onLeave)
  card.addEventListener('transitionend', onCardTransitionEnd)
  window.addEventListener('resize', onResize)

  return () => {
    card.removeEventListener('mouseenter', onEnter)
    card.removeEventListener('mousemove', onMove)
    card.removeEventListener('mouseleave', onLeave)
    card.removeEventListener('transitionend', onCardTransitionEnd)
    window.removeEventListener('resize', onResize)
    resetTilt(card)
    resetParallax(layers)
    clearSpotlight(card)
  }
}

/**
 * Включает эффекты на карточках. На тач-устройствах и при `prefers-reduced-motion` слушатели не
 * навешиваются вообще; если условия меняются на лету (например, к планшету подключили мышь) —
 * эффект сам включается/выключается. Возвращает функцию полной очистки.
 */
export function initCardEffects(cards: HTMLElement[]): () => void {
  const pointerQuery = window.matchMedia(FINE_POINTER_QUERY)
  const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  let detachAll: Array<() => void> = []

  const sync = () => {
    detachAll.forEach((detach) => detach())
    detachAll = isCardEffectsSupported() ? cards.map(attachCard) : []
  }

  pointerQuery.addEventListener('change', sync)
  motionQuery.addEventListener('change', sync)
  sync()

  return () => {
    pointerQuery.removeEventListener('change', sync)
    motionQuery.removeEventListener('change', sync)
    detachAll.forEach((detach) => detach())
    detachAll = []
  }
}
