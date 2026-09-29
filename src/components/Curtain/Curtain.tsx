import { cx } from '../../utils/cx'
import './Curtain.css'

type CurtainProps = { className?: string }

/**
 * Декоративная «шторка» hero-интро: слой на всю секцию, выезжающий снизу вверх
 * (translateY(100%) → 0). Сама ничего не анимирует и не красит — цвет, z-index, тайминг
 * (задержка/длительность через CSS-переменные) задаёт вызывающий код через className, см. Hero.css.
 */
export function Curtain({ className }: CurtainProps) {
  return <div className={cx('curtain', className)} aria-hidden="true" />
}
