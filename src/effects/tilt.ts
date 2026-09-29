/**
 * TILT — наклон карточки вслед за курсором вокруг СВОЕГО центра.
 *
 * Карточка «продавливается» в точке под курсором: у правого края курсора правая сторона уходит
 * вглубь, у нижнего — нижняя. `perspective()` задана прямо в transform самой карточки (а не у
 * общего родителя), поэтому каждая карточка наклоняется независимо, вокруг собственного центра.
 *
 * TILTING_CLASS — публичный хук для точечных состояний конкретных карточек (используется по мере
 * надобности в CSS компонентов, напр. `.tool-card.action-card--tilting`); сам 3D-режим слоёв
 * (preserve-3d/will-change) от него не зависит — он включён постоянно, см. styles/parallax.css.
 */

import { PARALLAX } from './parallax.config'

/** Класс «карточка в 3D»: живёт от входа курсора до полного возврата в состояние покоя. */
export const TILTING_CLASS = 'action-card--tilting'

export function beginTilt(card: HTMLElement): void {
  card.classList.add(TILTING_CLASS)
}

/** x, y — нормализованная позиция курсора (−1…1). */
export function applyTilt(card: HTMLElement, x: number, y: number): void {
  // rotateX с минусом: курсор внизу (y > 0) должен уводить нижнюю кромку вглубь, а не поднимать её
  const rotateX = -y * PARALLAX.maxAngle
  const rotateY = x * PARALLAX.maxAngle
  card.style.transform = `perspective(${PARALLAX.perspective}px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`
}

/** Снимает класс отдельно от transform — card-effects.ts делает это только когда transition возврата реально доиграл. */
export function endTilt(card: HTMLElement): void {
  card.classList.remove(TILTING_CLASS)
}

/** Жёсткий, синхронный сброс (используется при отключении эффекта — там доигрывать transition не нужно). */
export function resetTilt(card: HTMLElement): void {
  card.style.transform = ''
  endTilt(card)
}
