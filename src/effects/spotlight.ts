/**
 * SPOTLIGHT — световое пятно под курсором.
 *
 * JS отвечает только за данные: позицию курсора и размер пятна кладёт в CSS-переменные карточки,
 * а также включает/выключает класс наведения. Сам вид (radial-gradient, blur, обрезка по
 * border-radius, fade in/out) описан в ActionCard.css — слои `.action-card__spotlight` и
 * `.action-card__glow`.
 *
 * Переменные:
 *   --x, --y    позиция курсора внутри карточки, px
 *   --spot-r    радиус пятна, px (доля от меньшей стороны карточки)
 */

/** Класс наведения: по нему CSS плавно показывает пятно (fade-in 200ms, fade-out 300ms). */
export const HOVERED_CLASS = 'action-card--hovered'

/** Радиус пятна — 100% меньшей стороны карточки (диаметр = 2× высоты), работает при любых размерах. */
const SPOT_RADIUS_RATIO = 1

export function updateSpotlight(card: HTMLElement, rect: DOMRect, event: MouseEvent): void {
  card.style.setProperty('--x', `${event.clientX - rect.left}px`)
  card.style.setProperty('--y', `${event.clientY - rect.top}px`)
  card.style.setProperty('--spot-r', `${Math.min(rect.width, rect.height) * SPOT_RADIUS_RATIO}px`)
}

export function showSpotlight(card: HTMLElement): void {
  card.classList.add(HOVERED_CLASS)
}

export function hideSpotlight(card: HTMLElement): void {
  card.classList.remove(HOVERED_CLASS)
}

/** Убираем переменные при отключении эффекта. */
export function clearSpotlight(card: HTMLElement): void {
  card.classList.remove(HOVERED_CLASS)
  card.style.removeProperty('--x')
  card.style.removeProperty('--y')
  card.style.removeProperty('--spot-r')
}
