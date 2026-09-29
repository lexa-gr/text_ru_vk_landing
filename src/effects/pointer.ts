/**
 * Общие для всех эффектов карточки утилиты: нормализация позиции курсора и проверка, поддерживает ли
 * устройство наведение вообще (эффект не имеет смысла на тач-экране, где нет «курсора у края»).
 */

/** Есть точный указатель, который умеет наводиться без клика (мышь, трекпад) — не true на тач-устройствах. */
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

/** Пользователь попросил ОС/браузер уменьшить анимации. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** Эффект включаем только при точном указателе и если анимации не отключены в настройках. */
export function isCardEffectsSupported(): boolean {
  return window.matchMedia(FINE_POINTER_QUERY).matches && !window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export type NormalizedPointer = {
  /** −1 — левый край карточки, 0 — центр, 1 — правый край. */
  x: number
  /** −1 — верхний край карточки, 0 — центр, 1 — нижний край. */
  y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Позиция курсора относительно центра карточки, нормализованная в −1…1 по обеим осям. */
export function getNormalizedPointer(rect: DOMRect, event: MouseEvent): NormalizedPointer {
  const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
  const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
  return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) }
}
