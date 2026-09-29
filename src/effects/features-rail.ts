/**
 * FEATURES RAIL — вертикальная линия-таймлайн слева от списка «Работайте с продвижением комплексно»:
 * точка на каждый шаг + соединяющий отрезок, оба перекрашиваются в зелёный по мере скролла.
 *
 * JS ничего не раскладывает — только меряет и красит:
 *
 *   1. ИЗМЕРЕНИЕ. Точка встаёт по верхнему краю ТЕКСТОВОГО блока своего шага (`.feature__content`,
 *      измеряется через getBoundingClientRect — размер зависит от текста и ширины окна, поэтому
 *      захардкодить нельзя), плюс DOT_TOP_OFFSET вниз — иначе точка визуально выше строчных букв
 *      заголовка (line-height даёт отступ сверху символов). Между точкой и следующей — отрезок с
 *      зазором 12px сверху и снизу (как у .step-block__rail в Activation).
 *   2. ПРОГРЕСС. Точка отсчёта — середина окна (window.scrollY + innerHeight / 2). Точка шага
 *      становится зелёной, когда середина окна опускается до её положения в документе; отрезок к
 *      следующей точке заливается зелёным непрерывно и пропорционально тому, насколько середина окна
 *      прошла этот отрезок, — как движение прогресс-бара, без скачков.
 *
 * Пересчёт положения — при resize / загрузке шрифтов / изменении высоты шагов (ResizeObserver): текст
 * и картинки могут сдвинуть точки. Сама заливка — на scroll + requestAnimationFrame (не чаще раза за
 * кадр, на кадре читается только window.scrollY).
 */

const RAIL_SELECTOR = '.features__rail'
const CONTENT_SELECTOR = '.feature__content'
const DOT_SELECTOR = '[data-rail-dot]'
const LINE_SELECTOR = '[data-rail-line]'
const FILL_SELECTOR = '[data-rail-fill]'

/** Зазор между точкой и отрезком линии, сверху и снизу, px — как у .step-block__rail. */
const LINE_GAP = 12
/** Высота точки, px (см. .features__rail-dot в Features.css). */
const DOT_SIZE = 16
/** Смещение точки вниз от верха .feature__content, px: оптически выравнивает её с текстом заголовка. */
const DOT_TOP_OFFSET = 8

/** Атрибут состояния: точка/сегмент пройдены серединой окна. */
const REACHED_ATTR = 'data-reached'

/** Запускает эффект на корне секции. Возвращает функцию полной очистки. */
export function initFeaturesRail(root: HTMLElement): () => void {
  const rail = root.querySelector<HTMLElement>(RAIL_SELECTOR)
  const contents = Array.from(root.querySelectorAll<HTMLElement>(CONTENT_SELECTOR))
  const dots = Array.from(root.querySelectorAll<HTMLElement>(DOT_SELECTOR))
  const lines = Array.from(root.querySelectorAll<HTMLElement>(LINE_SELECTOR))
  const fills = Array.from(root.querySelectorAll<HTMLElement>(FILL_SELECTOR))
  const count = Math.min(contents.length, dots.length)
  if (!rail || count < 2) return () => {}

  // Положения — в координатах ДОКУМЕНТА (getBoundingClientRect().top + scrollY), а не окна: тогда на
  // кадре скролла достаточно свежего window.scrollY, без повторного чтения раскладки.
  let railDocTop = 0
  let dotDocTops: number[] = []

  const measure = () => {
    railDocTop = rail.getBoundingClientRect().top + window.scrollY
    dotDocTops = contents.slice(0, count).map((el) => el.getBoundingClientRect().top + window.scrollY + DOT_TOP_OFFSET)

    dots.forEach((dot, i) => {
      dot.style.top = `${dotDocTops[i] - railDocTop}px`
    })
    lines.forEach((line, i) => {
      const top = dotDocTops[i] + DOT_SIZE + LINE_GAP
      const height = Math.max(0, dotDocTops[i + 1] - dotDocTops[i] - DOT_SIZE - LINE_GAP * 2)
      line.style.top = `${top - railDocTop}px`
      line.style.height = `${height}px`
    })
  }

  const apply = () => {
    const middle = window.scrollY + window.innerHeight / 2
    dots.forEach((dot, i) => dot.toggleAttribute(REACHED_ATTR, middle >= dotDocTops[i]))
    fills.forEach((fill, i) => {
      const span = Math.max(0, dotDocTops[i + 1] - dotDocTops[i] - DOT_SIZE - LINE_GAP * 2)
      const raw = middle - (dotDocTops[i] + DOT_SIZE + LINE_GAP)
      fill.style.height = `${Math.min(Math.max(raw, 0), span)}px`
    })
  }

  let frame = 0
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; apply() })
  }

  const remeasure = () => {
    measure()
    apply()
  }

  measure()
  apply()

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', remeasure)
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(remeasure) : null
  resizeObserver?.observe(root)
  void document.fonts?.ready.then(remeasure)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', remeasure)
    resizeObserver?.disconnect()
  }
}
