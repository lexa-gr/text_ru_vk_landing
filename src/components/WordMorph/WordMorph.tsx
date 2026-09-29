import { useEffect, useRef } from 'react'

import { initWordMorph } from '../../effects/word-morph'
import { cx } from '../../utils/cx'
import './WordMorph.css'

type WordMorphProps = {
  /** Слова по кругу. Первое показывается изначально (и при prefers-reduced-motion). Передавайте стабильную ссылку (константу). */
  words: readonly string[]
  /** Класс блока-родителя (микс), например `hero__title-word`. */
  className?: string
}

/*
 * Слово, которое по кругу меняется с эффектом blur-morph (логика — src/effects/word-morph.ts).
 *
 * Ширина контейнера не зависит от текущего слова и всегда равна самому длинному из списка:
 * все слова кладутся в одну ячейку CSS Grid, а невидимые «призраки» (.word-morph__sizer) задают
 * ширину. Ничего не нужно менять вручную при замене слов, шрифта или размера текста.
 */
export function WordMorph({ words, className }: WordMorphProps) {
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = wordRef.current
    return element ? initWordMorph(element, words) : undefined
  }, [words])

  return (
    <span className={cx('word-morph', className)}>
      {words.map((word) => (
        <span key={word} className="word-morph__sizer" aria-hidden="true">
          {word}
        </span>
      ))}
      {/* Видимое слово: текст внутри меняет initWordMorph */}
      <span ref={wordRef} className="word-morph__word">
        {words[0]}
      </span>
    </span>
  )
}
