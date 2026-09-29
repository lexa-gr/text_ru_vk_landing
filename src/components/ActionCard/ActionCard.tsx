import type { ReactNode } from 'react'

import arrowIcon from '../../assets/icons/arrow.svg'
import arrowIconSm from '../../assets/icons/arrow-sm.svg'
import squareIcon from '../../assets/icons/square.svg'
import squareIconSm from '../../assets/icons/square-sm.svg'
import { getLogoBrand, type LogoName } from '../../assets/logos'
import { MOBILE_QUERY } from '../../hooks/useMediaQuery'
import { cx } from '../../utils/cx'
import { Logo } from '../Logo/Logo'
import './ActionCard.css'

type ActionCardProps = {
  href: string
  /** premium — Премиум-подписка VK Рекламы (синяя), pro — PRO-аккаунт Текст.ру (красная). */
  variant: 'premium' | 'pro'
  logo: LogoName
  title: string
  /** Плашка под заголовком (например «х2 к бюджету») */
  badge?: string
  /** Описание под заголовком */
  text?: ReactNode
}

/*
 * Интерактив карточки (tilt + spotlight + parallax) подключается снаружи через useCardEffects,
 * см. src/effects; все числа эффекта — в effects/parallax.config.ts. Слои карточки — от самого дальнего к самому
 * ближнему (порядок в DOM важен, см. styles/parallax.css):
 *
 *  - .action-card__base       фон карточки, самый глубокий слой (plate);
 *  - .action-card__content    логотип + текст — ОДИН слой, лежит под оболочкой (back);
 *  - .action-card__arrow      кнопка-стрелка — тот же слой, что и текст (back);
 *  - .action-card__spotlight  «стекло» — оболочка со световым бликом, всегда спереди.
 */
export function ActionCard({ href, variant, logo, title, badge, text }: ActionCardProps) {
  return (
    <a className={cx('action-card', `action-card--${variant}`)} href={href} data-parallax-card>
      <span className="action-card__base" aria-hidden="true" data-parallax="plate" />

      <div className="action-card__content" data-parallax="back">
        <div className="action-card__brand">
          <Logo name={logo} className={`action-card__logo-${getLogoBrand(logo)}`} />
        </div>
        <div className="action-card__info">
          <h3 className="action-card__title t-h3">{title}</h3>
          {badge && (
            <span className="action-card__badge">
              <span className="action-card__badge-text">{badge}</span>
            </span>
          )}
          {text && <p className="action-card__text t-body">{text}</p>}
        </div>
      </div>

      {/* На мобильном — своя иконка 48×48 из макета (линия та же 1,5px, поэтому это не просто уменьшенная копия) */}
      <span className="action-card__arrow" data-parallax="back">
        <picture>
          <source media={MOBILE_QUERY} srcSet={squareIconSm} />
          <img className="action-card__arrow-square" src={squareIcon} width={68} height={68} alt="" />
        </picture>
        <picture>
          <source media={MOBILE_QUERY} srcSet={arrowIconSm} />
          <img className="action-card__arrow-glyph" src={arrowIcon} width={68} height={68} alt="" />
        </picture>
      </span>

      <span className="action-card__spotlight" aria-hidden="true">
        <span className="action-card__glow" />
      </span>
    </a>
  )
}
