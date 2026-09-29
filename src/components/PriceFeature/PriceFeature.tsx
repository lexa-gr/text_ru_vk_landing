import checkIcon from '../../assets/icons/check.svg'
import { cx } from '../../utils/cx'
import './PriceFeature.css'

export type PriceFeatureItem = {
  title: string
  /** Короткая форма заголовка для мобильной раскладки («100 000 сим/сутки»); без неё везде показывается `title`. */
  shortTitle?: string
  text: string
  /** Выделенный пункт (бонусы) — на подсвеченной плашке с синей галочкой. */
  highlighted?: boolean
}

type PriceFeatureProps = PriceFeatureItem & {
  /** Класс блока-родителя (микс), например `price-card__feature`. */
  className?: string
}

export function PriceFeature({ title, shortTitle, text, highlighted = false, className }: PriceFeatureProps) {
  return (
    <li className={cx('price-feature', highlighted && 'price-feature--highlighted', className)}>
      <div className="price-feature__content">
        <div className="price-feature__head">
          <span className="price-feature__icon">
            <img className="price-feature__tick" src={checkIcon} width={6.167} height={5.167} alt="" />
          </span>
          <h4 className="price-feature__title t-body-bold">
            <span className={cx(shortTitle && 'price-feature__title-full')}>{title}</span>
            {shortTitle && <span className="price-feature__title-short">{shortTitle}</span>}
          </h4>
        </div>
        <div className="price-feature__description">
          <p className="price-feature__text t-description">{text}</p>
        </div>
      </div>
    </li>
  )
}
