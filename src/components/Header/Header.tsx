import { useEffect, useRef, useState } from 'react'

import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cx } from '../../utils/cx'
import { Button } from '../Button/Button'
import { LogoGroup } from '../LogoGroup/LogoGroup'
import './Header.css'

const MENU_LINKS = [
  { href: '#tools', label: 'Инструменты' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#activation', label: 'Подключение' },
]

/** ✏ Через сколько пикселей прокрутки появляется шапка. */
const HEADER_SHOW_SCROLL = 60

/*
 * Десктоп (≥ 1200px): плашка с логотипами и кнопкой, появляется после HEADER_SHOW_SCROLL px прокрутки.
 * Ниже: то же появление, но плашка компактная, а кнопка «Получить предложение» уходит в меню-бургер.
 */
export function Header() {
  const scrolled = useScrolledPast(HEADER_SHOW_SCROLL)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const [menuOpen, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Меню — только для узкой раскладки и только пока шапка видна: на десктопе оно всегда закрыто, а у скрытой
  // шапки открытое меню (visibility: visible у потомка) торчало бы само по себе
  const open = menuOpen && !desktop && scrolled

  // Закрытие по Escape и по клику/касанию вне шапки
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const hidden = !scrolled
  const close = () => setOpen(false)

  return (
    <header
      ref={headerRef}
      className={cx('header', scrolled && 'header--visible', open && 'header--open')}
      aria-hidden={hidden}
    >
      <LogoGroup className="header__logos" />
      <Button className="header__button" href="#pricing" size="sm">
        Получить предложение
      </Button>

      <button
        className="header__burger"
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="header-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="header__burger-line" />
        <span className="header__burger-line" />
        <span className="header__burger-line" />
      </button>

      <nav id="header-menu" className="header__menu" aria-label="Разделы страницы" inert={!open}>
        {MENU_LINKS.map((link) => (
          <a key={link.href} className="header__menu-link t-body" href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <Button className="header__menu-button" href="#pricing" size="lg" fullWidth onClick={close}>
          Получить предложение
        </Button>
      </nav>
    </header>
  )
}
