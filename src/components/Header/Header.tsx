import { useEffect, useState } from 'react'

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
  // Меню — только для узкой раскладки и только пока шапка видна: на десктопе оно всегда закрыто, а без шапки
  // (и её крестика) открытое меню было бы не закрыть
  const open = menuOpen && !desktop && scrolled

  // Закрытие по Escape; страница под полноэкранным меню не прокручивается
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = prevOverflow
    }
  }, [open])

  const hidden = !scrolled
  const close = () => setOpen(false)

  return (
    <>
      <header
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
      </header>

      {/* Полноэкранное меню — соседом шапки, а не внутри: transform и backdrop-filter шапки иначе
          ограничили бы position: fixed её рамками и погасили бы собственный blur меню */}
      <nav
        id="header-menu"
        className={cx('header-menu', open && 'header-menu--open')}
        aria-label="Разделы страницы"
        inert={!open}
        onClick={(event) => {
          // Касание размытой страницы вокруг панели закрывает меню
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="header-menu__panel">
          <div className="header-menu__links">
            {MENU_LINKS.map((link) => (
              <a key={link.href} className="header-menu__link t-body" href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
          </div>
          <Button className="header-menu__button" href="#pricing" variant="fill" size="lg" fullWidth onClick={close}>
            Получить предложение
          </Button>
        </div>
      </nav>
    </>
  )
}
