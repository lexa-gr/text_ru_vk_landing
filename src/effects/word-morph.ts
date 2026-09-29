/**
 * WORD MORPH — смена слова с «расфокусом» (blur-morph).
 *
 * Модуль управляет ОДНИМ элементом со словом: меняет в нём текст и переключает класс
 * MORPHING_CLASS. Сам вид перехода (blur + opacity) описан в WordMorph.css; тайминги и сила
 * размытия задаются ЗДЕСЬ, в WORD_MORPH, и передаются в CSS через переменные — поэтому менять
 * скорость анимации нужно в одном месте.
 *
 * Хронология одного шага (значения по умолчанию, мс):
 *
 *   0 ─────────── слово чёткое (holdMs = 2200) ───────────┐
 *                                                          ▼
 *   растворение: blur 0→10px, opacity 1→0 (outMs = 350, ease-in)
 *   ── слово невидимо: подставляем следующее в DOM ──
 *   пауза (gapMs = 120), чтобы слова не слились в один рывок
 *   сборка:     blur 10→0px, opacity 0→1 (inMs = 350, ease-out)
 *   … и снова слово чёткое holdMs
 */

/** ⚙ Настройки: единственное место, где меняются скорость и сила эффекта. */
export const WORD_MORPH = {
  /** Сколько слово стоит чётким и читаемым, мс (2000–2500). */
  holdMs: 2200,
  /** Растворение старого слова, мс (300–400). */
  outMs: 350,
  /** Пауза между исчезновением старого и появлением нового, мс (100–150). */
  gapMs: 120,
  /** «Сборка» нового слова из расфокуса, мс (300–400). */
  inMs: 350,
  /** Сила размытия в скрытом состоянии, px (8–12). */
  blurPx: 10,
} as const

/** Класс «слово растворено» (blur + opacity 0). Стили — в WordMorph.css. */
const MORPHING_CLASS = 'word-morph__word--morphing'

/** Пользователь просит отключить анимации в системе. */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Запускает смену слов в `element`. Слова берутся из `words` (первое — то, что показано
 * изначально). Возвращает функцию очистки: снимает таймеры и слушатели, возвращает первое слово.
 */
export function initWordMorph(element: HTMLElement, words: readonly string[]): () => void {
  if (words.length < 2) return () => {}

  // Меняем текст «на месте» в существующем текстовом узле — DOM-структуру элемента не трогаем
  const firstChild = element.firstChild
  const textNode = firstChild instanceof Text ? firstChild : element.appendChild(document.createTextNode(words[0]))

  // Тайминги и размытие — в CSS-переменные (см. WordMorph.css), чтобы JS и CSS не разъезжались
  element.style.setProperty('--morph-out', `${WORD_MORPH.outMs}ms`)
  element.style.setProperty('--morph-in', `${WORD_MORPH.inMs}ms`)
  element.style.setProperty('--morph-blur', `${WORD_MORPH.blurPx}px`)

  const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  let index = 0
  let timerId = 0

  /** Единственный активный таймер: новый вызов всегда заменяет предыдущий — утечек нет. */
  const later = (callback: () => void, delay: number) => {
    window.clearTimeout(timerId)
    timerId = window.setTimeout(callback, delay)
  }

  const stop = () => window.clearTimeout(timerId)

  const showWord = (nextIndex: number) => {
    index = nextIndex
    textNode.data = words[index]
  }

  // ───────────── ЛОГИКА ЦИКЛА ─────────────
  // Цепочка рекурсивных setTimeout: каждый шаг планирует следующий только после срабатывания.

  /** Ждём `delay` мс чёткого слова, затем запускаем растворение. */
  const scheduleNext = (delay: number) => {
    later(dissolve, delay)
  }

  /** Шаг 1. Текущее слово растворяется (класс включает blur + opacity 0). */
  const dissolve = () => {
    element.classList.add(MORPHING_CLASS)
    later(swap, WORD_MORPH.outMs)
  }

  /** Шаг 2. Слово уже невидимо — подставляем следующее по кругу (после последнего снова первое). */
  const swap = () => {
    showWord((index + 1) % words.length)
    later(assemble, WORD_MORPH.gapMs)
  }

  /** Шаг 3. Новое слово «собирается» из расфокуса; затем ждём inMs + holdMs и повторяем. */
  const assemble = () => {
    element.classList.remove(MORPHING_CLASS)
    scheduleNext(WORD_MORPH.inMs + WORD_MORPH.holdMs)
  }

  // ───────────── СОСТОЯНИЯ: старт / пауза / доступность ─────────────

  /** Запускаем цикл с чёткого текущего слова. Если слово было растворено — оно плавно проявится. */
  const start = () => {
    element.classList.remove(MORPHING_CLASS)
    scheduleNext(WORD_MORPH.holdMs)
  }

  /** Reduced motion: первое слово статично, без смены и без переходов. */
  const showStatic = () => {
    stop()
    element.classList.remove(MORPHING_CLASS)
    showWord(0)
  }

  /**
   * Единая точка решения, что сейчас делать. Вызывается при старте, при смене вкладки и при
   * смене настройки reduced motion.
   * — Вкладка скрыта: таймеры браузер замедляет, а переходы могут не отрисоваться — останавливаемся.
   * — Вкладка снова видна: начинаем цикл заново с чёткого слова, поэтому «на середине перехода»
   *   анимация зависнуть не может.
   */
  const sync = () => {
    if (motionQuery.matches) showStatic()
    else if (document.hidden) stop()
    else start()
  }

  document.addEventListener('visibilitychange', sync)
  motionQuery.addEventListener('change', sync)
  sync()

  return () => {
    stop()
    document.removeEventListener('visibilitychange', sync)
    motionQuery.removeEventListener('change', sync)
    element.classList.remove(MORPHING_CLASS)
    showWord(0)
    element.style.removeProperty('--morph-out')
    element.style.removeProperty('--morph-in')
    element.style.removeProperty('--morph-blur')
  }
}
