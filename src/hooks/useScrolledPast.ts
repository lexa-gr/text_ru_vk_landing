import { useEffect, useState } from 'react'

/** true, когда страница прокручена на `offset` px и больше. */
export function useScrolledPast(offset: number): boolean {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const update = () => setPassed(window.scrollY >= offset)

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [offset])

  return passed
}
