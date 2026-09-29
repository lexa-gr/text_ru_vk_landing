import { useEffect, useState } from 'react'

/** Ширина десктопной раскладки. ⚠ Совпадает с порогом 1200px в tokens.css. */
export const DESKTOP_QUERY = '(min-width: 1200px)'

/** Всё, что уже десктопа (для `<source media>` и подобного, где нужен именно «мобильный» запрос). */
export const MOBILE_QUERY = '(max-width: 1199.98px)'

/** Реагирует на смену media-запроса (ресайз окна, поворот планшета). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}
