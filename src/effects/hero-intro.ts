/**
 * ТАЙМЛАЙН hero-интро (общее время ≈ 3,9 с). Единственное место с таймингами: значения ниже
 * превращаются в CSS-переменные (`heroIntroCssVars`) и читаются в Hero.css через `var(--hero-t-*)` /
 * `var(--hero-d-*)`; JS использует только `HERO_INTRO_TOTAL_MS` — момент, когда сценарий закончен
 * и декоративные слои можно убрать из DOM. Сама последовательность выполняется CSS-анимациями
 * (`animation` + `animation-delay`), а не через JS — см. useHeroIntro.
 *
 * Все времена — в секундах от начала интро (t = 0 = момент монтирования Hero).
 */
export const HERO_INTRO = {
  /** Группа белых логотипов: появление (снизу + fade). */
  logosWhite: { start: 0, duration: 0.35 },
  /** Экран 1 (текст + картинка вместе). */
  screen1: { start: 0.45, duration: 0.5 },
  /** Шторка 1 (синяя): выезжает снизу, закрывая экран 1. */
  curtain1: { start: 1.2, duration: 0.55 },
  /** Экран 2 (текст + картинка) — появляется сразу после того, как шторка 1 доехала. */
  screen2: { start: 1.75, duration: 0.5 },
  /** Шторка 2 (цвет фона страницы): закрывает экран 2 и белые логотипы. */
  curtain2: { start: 2.6, duration: 0.55 },
  /** Группа цветных логотипов реального контента: только opacity, без сдвига. */
  logosColor: { start: 3.15, duration: 0.3 },
  /**
   * Каскад экрана 3 (реальный контент): картинка+заголовок → описание → кнопка →
   * карточка «Премиум-подписка» → карточка «PRO-аккаунт». 5 групп со сдвигом `stagger` между ними.
   */
  cascade: { start: 3.15, duration: 0.45, stagger: 0.07, steps: 5 },
} as const

/** Момент, когда каскад экрана 3 полностью завершён (3.15 + 4×0.07 + 0.45 = 3.88 с). */
const HERO_INTRO_END_S =
  HERO_INTRO.cascade.start + (HERO_INTRO.cascade.steps - 1) * HERO_INTRO.cascade.stagger + HERO_INTRO.cascade.duration

/** Таймер JS ждёт чуть дольше конца последней CSS-анимации — запас, чтобы не обрезать её на лету. */
export const HERO_INTRO_TOTAL_MS = Math.round(HERO_INTRO_END_S * 1000) + 80

/** Ключ sessionStorage: интро показывается один раз за вкладку/сессию, дальше — сразу финальный экран. */
export const HERO_INTRO_SESSION_KEY = 'hero-intro-seen'

/**
 * Максимум ожидания шрифтов перед стартом интро, мс. Без этой страховки сломанный шрифтовый CDN
 * заморозил бы интро (и весь hero) навсегда на невидимом первом кадре — лучше показать интро с
 * чуть заметным «мельканием» шрифта, чем не показать вообще ничего.
 */
export const HERO_INTRO_FONTS_TIMEOUT_MS = 1500

/**
 * ⚠ ВРЕМЕННО, на время настройки: true — правило «один раз за сессию» ВЫКЛЮЧЕНО, интро проигрывается
 * при каждом обновлении страницы (sessionStorage не читается и не пишется). Когда всё настроите,
 * поставьте false — тогда интро снова будет показываться один раз за вкладку.
 * (prefers-reduced-motion и кнопка «Пропустить» работают как обычно.)
 */
export const HERO_INTRO_ALWAYS_REPLAY = true

const s = (value: number) => `${value}s`

/** CSS-переменные тайминга для инлайн-style корня `.hero` (см. Hero.tsx/Hero.css). */
export function heroIntroCssVars(): Record<string, string> {
  const { logosWhite, screen1, curtain1, screen2, curtain2, logosColor, cascade } = HERO_INTRO
  return {
    '--hero-t-logos-white': s(logosWhite.start),
    '--hero-d-logos-white': s(logosWhite.duration),
    '--hero-t-screen1': s(screen1.start),
    '--hero-t-curtain1': s(curtain1.start),
    '--hero-t-screen2': s(screen2.start),
    '--hero-t-curtain2': s(curtain2.start),
    '--hero-d-screen': s(screen1.duration),
    '--hero-d-curtain': s(curtain1.duration),
    '--hero-t-logos-color': s(logosColor.start),
    '--hero-d-logos-color': s(logosColor.duration),
    '--hero-t-cascade-1': s(cascade.start),
    '--hero-t-cascade-2': s(cascade.start + cascade.stagger),
    '--hero-t-cascade-3': s(cascade.start + cascade.stagger * 2),
    '--hero-t-cascade-4': s(cascade.start + cascade.stagger * 3),
    '--hero-t-cascade-5': s(cascade.start + cascade.stagger * 4),
    '--hero-d-cascade': s(cascade.duration),
  }
}
