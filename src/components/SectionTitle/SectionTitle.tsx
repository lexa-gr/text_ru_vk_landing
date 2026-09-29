import type { ReactNode } from 'react'

import { cx } from '../../utils/cx'
import './SectionTitle.css'

type SectionTitleProps = {
  /** Блок-родитель: даёт классы `<block>__heading`, `<block>__title`, `<block>__subtitle`. */
  block: string
  title: ReactNode
  text?: ReactNode
  /** Максимальная ширина абзаца под заголовком, px. */
  textWidth?: number
  tone?: 'dark' | 'light'
}

export function SectionTitle({ block, title, text, textWidth, tone = 'dark' }: SectionTitleProps) {
  return (
    <div className={cx('section-title', tone === 'light' && 'section-title--light', `${block}__heading`)}>
      <h2 className={cx('section-title__title', 't-h2', `${block}__title`)}>{title}</h2>
      {text && (
        <p className={cx('section-title__subtitle', 't-body', `${block}__subtitle`)} style={{ maxWidth: textWidth }}>
          {text}
        </p>
      )}
    </div>
  )
}
