import { PARALLAX, resolveLayer } from './parallax.config'

/**
 * PARALLAX — сдвиг слоёв карточки по глубине (ось Z) и вбок, синхронно с наклоном.
 *
 * Сцена от зрителя вглубь: front (+) → стекло (0, неподвижно, см. spotlight.ts) → mid (0) → back (−) →
 * plate/фон (глубже back). Слои `back` уходят от зрителя и при наклоне смещаются ПРОТИВ курсора — как
 * предметы за окном при взгляде сбоку; слои `front`, наоборот, выдвинуты к зрителю и едут ВСЛЕД за
 * курсором. Числа берутся из parallax.config.ts; слой задаётся атрибутом в разметке:
 *
 *   data-parallax="plate | back | mid | front"
 *   data-parallax-depth="30"   точечно переопределяет глубину ОДНОГО элемента (редкое исключение)
 *
 * x/y — те же нормализованные −1…1 значения, что и у tilt: JS пишет их ОДИН раз на событие курсора
 * (без сглаживания), а плавную интерполяцию между старым и новым transform делает браузер через
 * `transition: transform` (см. styles/parallax.css) — так же, как и у карточки в tilt.ts, в одной
 * фазе с ней (card-effects.ts выставляет transition-duration на карточку и слои синхронно).
 */

export type ParallaxLayer = {
  element: HTMLElement
  shift: number
  depth: number
  fit: boolean
}

/** Снимок слоёв карточки: элементы и их параметры глубины. Читается один раз при подключении карточки. */
export function collectParallaxLayers(card: HTMLElement): ParallaxLayer[] {
  const layers: ParallaxLayer[] = []
  for (const element of card.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const resolved = resolveLayer(element.dataset.parallax)
    if (!resolved) {
      console.warn(`[parallax] неизвестный слой data-parallax="${element.dataset.parallax}"`, element)
      continue
    }
    const override = element.dataset.parallaxDepth
    layers.push({ element, ...resolved, depth: override === undefined ? resolved.depth : Number(override) })
  }
  return layers
}

/** x, y — нормализованная позиция курсора (−1…1). */
export function applyParallax(layers: ParallaxLayer[], x: number, y: number): void {
  const { perspective } = PARALLAX
  for (const { element, shift, depth, fit } of layers) {
    const translate = `translate3d(${(x * shift).toFixed(3)}px, ${(y * shift).toFixed(3)}px, ${depth.toFixed(3)}px)`
    // Перспектива уменьшает слой в P / (P − z) раз; обратный масштаб (P − z) / P возвращает исходный размер
    const scale = fit ? ` scale(${((perspective - depth) / perspective).toFixed(5)})` : ''
    element.style.transform = translate + scale
  }
}

export function resetParallax(layers: ParallaxLayer[]): void {
  for (const { element } of layers) element.style.transform = ''
}
