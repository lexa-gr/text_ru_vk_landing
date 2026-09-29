import type { ReactNode } from 'react'

import { getLogoBrand, type LogoName } from '../../assets/logos'
import { cx } from '../../utils/cx'
import { Button } from '../Button/Button'
import { Logo } from '../Logo/Logo'
import { StepBlock } from '../StepBlock/StepBlock'
import './ActivationCard.css'

export type ActivationStep = {
  title: string
  text: ReactNode
}

type ActivationCardProps = {
  /** textru — сначала тариф Текст.ру (красная), vk — сначала Премиум-подписка VK Рекламы (синяя). */
  variant: 'textru' | 'vk'
  logo: LogoName
  steps: ActivationStep[]
  href: string
}

/*
 * Интерактив карточки (tilt + spotlight + parallax) подключается снаружи через useCardEffects,
 * см. src/effects; все числа эффекта — в effects/parallax.config.ts. Слои — от самого дальнего к самому
 * ближнему (порядок в DOM важен, см. styles/parallax.css):
 *
 *  - .activation-card__base       фон карточки: белый + цветной фон шапки, самый глубокий слой (plate);
 *  - .activation-card__head       шапка с логотипом — под оболочкой (back), параллакс на цветном фоне;
 *  - .activation-card__body       шаги и кнопка — нулевой уровень (mid): наклоняются только вместе с карточкой;
 *  - .activation-card__spotlight  «стекло» — оболочка со световым бликом (без слоя параллакса).
 */
export function ActivationCard({ variant, logo, steps, href }: ActivationCardProps) {
  return (
    <article className={cx('activation-card', `activation-card--${variant}`)} data-parallax-card>
      <span className="activation-card__base" aria-hidden="true" data-parallax="plate">
        <span className="activation-card__base-head" />
      </span>

      <div className="activation-card__head" data-parallax="back">
        <Logo name={logo} className={`activation-card__logo-${getLogoBrand(logo)}`} />
      </div>

      <div className="activation-card__body" data-parallax="mid">
        <ol className="activation-card__steps">
          {steps.map((step, index) => (
            <StepBlock
              key={step.title}
              className="activation-card__step"
              state={index === 0 ? 'active' : 'default'}
              withLine={index < steps.length - 1}
              showCheck={index === steps.length - 1}
              title={step.title}
              text={step.text}
            />
          ))}
        </ol>
        <Button className="activation-card__button" href={href} size="lg" fullWidth>
          Активировать
        </Button>
      </div>

      <span className="activation-card__spotlight" aria-hidden="true">
        <span className="activation-card__glow" />
      </span>
    </article>
  )
}
