import type { ReactNode } from 'react'

import { getLogoBrand, type LogoName } from '../../assets/logos'
import { cx } from '../../utils/cx'
import { Logo } from '../Logo/Logo'
import './Feature.css'

type FeatureImage = {
  src: string
  width: number
  height: number
  /** Скругление + тень поверх картинки — у последнего шага в макете их нет (только тень). */
  framed?: boolean
}

type FeatureProps = {
  /** content — подготовка контента, reach — охват, sales — заявки и продажи. */
  variant: 'content' | 'reach' | 'sales'
  logo?: LogoName
  title: ReactNode
  text: string
  image: FeatureImage
}

/*
 * Шаг секции «Работайте с продвижением комплексно»: текст слева, его картинка справа (на мобильном —
 * текст сверху, картинка снизу, см. Features.css). Рельса-таймлайн слева от списка — отдельный элемент
 * (features-rail.ts), точка на шаг измеряет положение .feature__content этого компонента.
 */
export function Feature({ variant, logo, title, text, image }: FeatureProps) {
  return (
    <div className={cx('feature', `feature--${variant}`)}>
      <div className="feature__content">
        {logo && <Logo name={logo} className={cx('feature__logo', `feature__logo--${getLogoBrand(logo)}`)} />}
        <h3 className="feature__title t-h3">{title}</h3>
        <p className="feature__text t-body">{text}</p>
      </div>
      <img
        className={cx('feature__image', image.framed && 'feature__image--framed')}
        src={image.src}
        width={image.width}
        height={image.height}
        alt=""
        loading="lazy"
      />
    </div>
  )
}
