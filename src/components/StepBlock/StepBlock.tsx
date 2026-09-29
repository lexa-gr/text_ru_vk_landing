import type { ReactNode } from 'react'

import { cx } from '../../utils/cx'
import './StepBlock.css'

type StepBlockProps = {
  /** active — текущий шаг (зелёная точка), default — следующий (серая точка). */
  state: 'active' | 'default'
  title: string
  text: ReactNode
  /** Линия к следующему шагу (у последнего шага её нет). */
  withLine?: boolean
  /** Галочка (icons/check.svg) внутри точки — у последнего шага сценария. */
  showCheck?: boolean
  /** Класс блока-родителя (микс), например `activation-card__step`. */
  className?: string
}

export function StepBlock({ state, title, text, withLine = false, showCheck = false, className }: StepBlockProps) {
  return (
    <li className={cx('step-block', `step-block--${state}`, className)}>
      <div className="step-block__rail">
        <span className={cx('step-block__dot', showCheck && 'step-block__dot--check')} aria-hidden="true" />
        {withLine && <div className="step-block__line" />}
      </div>
      <div className="step-block__content">
        <h3 className="step-block__title t-body-bold">{title}</h3>
        <div className="step-block__description">
          <p className="step-block__text t-description">{text}</p>
        </div>
      </div>
    </li>
  )
}
