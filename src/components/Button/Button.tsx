import type { ReactNode } from 'react'

import { cx } from '../../utils/cx'
import './Button.css'

type ButtonProps = {
  href: string
  children: ReactNode
  /** Цвет из Figma-компонента Button: Black / White. */
  color?: 'black' | 'white'
  /** Стиль из Figma-компонента Button: Outline / Fill. */
  variant?: 'outline' | 'fill'
  /** Вертикальные отступы: sm — 12px (хедер), md — 16px (первый экран), lg — 20px. */
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  /** Класс блока-родителя (микс), например `hero__button`. */
  className?: string
  onClick?: () => void
}

export function Button({
  href,
  children,
  color = 'black',
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <a
      className={cx(
        'button',
        `button--${color}`,
        `button--${variant}`,
        `button--${size}`,
        fullWidth && 'button--full',
        className,
      )}
      href={href}
      onClick={onClick}
    >
      <span className="button__label">{children}</span>
    </a>
  )
}
