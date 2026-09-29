import { useId, useState } from 'react'

import chevronDown from '../../assets/icons/chevron-down.svg'
import chevronUp from '../../assets/icons/chevron-up.svg'
import { getLogoBrand, type LogoName } from '../../assets/logos'
import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { cx } from '../../utils/cx'
import { Button } from '../Button/Button'
import { Logo } from '../Logo/Logo'
import { PriceFeature, type PriceFeatureItem } from '../PriceFeature/PriceFeature'
import './PriceCard.css'

type PriceCardProps = {
  /** pro — ПРО-аккаунт Текст.ру (красная), premium — Премиум-подписка VK Рекламы (синяя). */
  variant: 'pro' | 'premium'
  logo: LogoName
  title: string
  subtitle: string
  oldPrice: string
  price: string
  discount: string
  features: PriceFeatureItem[]
  href: string
}

/*
 * Интерактив карточки (tilt + spotlight + parallax) подключается снаружи через useCardEffects,
 * см. src/effects; все числа эффекта — в effects/parallax.config.ts. Слои — от самого дальнего к самому
 * ближнему (порядок в DOM важен, см. styles/parallax.css):
 *
 *  - .price-card__base       фон карточки: белый + цветной фон шапки, самый глубокий слой (plate);
 *  - .price-card__heading    логотип, заголовок, подзаголовок — под оболочкой (back);
 *  - .price-card__price      цена — под оболочкой, вместе с текстом (back);
 *  - .price-card__body       преимущества и кнопка — на нулевом уровне (mid): наклоняются только вместе с карточкой;
 *  - .price-card__spotlight  «стекло» — оболочка со световым бликом (без слоя параллакса);
 *  - .price-card__discount   плашка скидки — ПЕРЕД оболочкой (front), усиливает параллакс.
 *
 * Плашка стоит в DOM внутри шапки, но в 3D сортируется по глубине: промежуточные блоки шапки помечены
 * data-parallax-group и в режиме наклона получают preserve-3d (см. styles/parallax.css).
 *
 * Мобильная / планшетная раскладка (< 1200px): список преимуществ скрыт под кнопкой «Подробнее» и раскрывается по
 * ней (плавно, см. CSS); на десктопе список всегда открыт, а кнопки-переключателя нет.
 */
export function PriceCard({ variant, logo, title, subtitle, oldPrice, price, discount, features, href }: PriceCardProps) {
  const [expanded, setExpanded] = useState(false)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const featuresId = useId()

  return (
    <article className={cx('price-card', `price-card--${variant}`, expanded && 'price-card--expanded')} data-parallax-card>
      <span className="price-card__base" aria-hidden="true" data-parallax="plate">
        <span className="price-card__base-head" />
      </span>

      <div className="price-card__head" data-parallax-group>
        <div className="price-card__heading" data-parallax="back">
          <div className="price-card__brand">
            <Logo name={logo} className={`price-card__logo-${getLogoBrand(logo)}`} />
            <h3 className="price-card__title t-h3">{title}</h3>
          </div>
          <p className="price-card__subtitle t-body">{subtitle}</p>
        </div>
        <div className="price-card__pricing" data-parallax-group>
          <div className="price-card__price" data-parallax="back">
            <p className="price-card__price-old t-description">{oldPrice}</p>
            <p className="price-card__price-current">
              <span className="price-card__price-value">{price}</span>
              <span className="price-card__price-period">/ мес</span>
            </p>
          </div>
          <span className="price-card__discount" data-parallax="front">
            <span className="price-card__discount-value">{discount}</span>
          </span>
        </div>
      </div>

      <div className="price-card__body" data-parallax="mid">
        <div className="price-card__collapse" id={featuresId} inert={!desktop && !expanded}>
          <ul className="price-card__features">
            {features.map((feature) => (
              <PriceFeature key={feature.title} className="price-card__feature" {...feature} />
            ))}
          </ul>
        </div>
        <Button className="price-card__button" href={href} size="lg" fullWidth>
          Получить предложение
        </Button>
        <button
          className="price-card__toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={featuresId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Скрыть' : 'Подробнее'}
          <img className="price-card__toggle-icon" src={expanded ? chevronUp : chevronDown} width={24} height={24} alt="" />
        </button>
      </div>

      <span className="price-card__spotlight" aria-hidden="true">
        <span className="price-card__glow" />
      </span>
    </article>
  )
}
