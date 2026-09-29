import { useEffect, useRef, useState } from 'react'

import {
  HERO_INTRO_ALWAYS_REPLAY,
  HERO_INTRO_FONTS_TIMEOUT_MS,
  HERO_INTRO_SESSION_KEY,
  HERO_INTRO_TOTAL_MS,
} from '../effects/hero-intro'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/*
 * document.fonts.status на САМОМ первом синхронном рендере ненадёжен: браузер ещё не успел
 * обнаружить, что только что смонтированному тексту нужен Unbounded (это происходит на следующем
 * layout/paint), поэтому status в этот момент часто уже/ещё 'loaded', хотя загрузка вот-вот начнётся.
 * Безопасный дефолт — всегда «не готово», если API вообще есть; сам document.fonts.ready ниже
 * резолвится почти мгновенно, если шрифт уже в кеше, так что лишнего ожидания на практике нет.
 */
function getInitialFontsReady(): boolean {
  return !('fonts' in document)
}

/** sessionStorage может быть недоступен (приватный режим Safari и т.п.) — тогда просто не запоминаем. */
function readSeen(): boolean {
  if (HERO_INTRO_ALWAYS_REPLAY) return false
  try {
    return sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen(): void {
  if (HERO_INTRO_ALWAYS_REPLAY) return
  try {
    sessionStorage.setItem(HERO_INTRO_SESSION_KEY, '1')
  } catch {
    // недоступно — не критично, просто интро повторится при следующей загрузке
  }
}

/** Решение принимается синхронно при первом рендере — без этого был бы кадр с «неправильным» состоянием. */
function getInitialShowIntro(): boolean {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false
  return !readSeen()
}

/**
 * Состояние hero-интро: единственный источник правды — булево `showIntro`. Оно решает, смонтированы
 * ли декоративные слои (экраны 1–2, шторки, белые логотипы) И идёт ли каскад у реального контента
 * (см. класс `.hero--intro` в Hero.tsx/Hero.css) — оба места читают один и тот же флаг, рассинхрона
 * быть не может. Сама последовательность анимаций — в CSS (animation-delay из hero-intro.ts);
 * здесь только ОДИН таймер на весь сценарий (без вложенных setTimeout) плюс ручной пропуск.
 */
export function useHeroIntro(): { showIntro: boolean; fontsReady: boolean; skip: () => void } {
  const [showIntro, setShowIntro] = useState(getInitialShowIntro)
  const [fontsReady, setFontsReady] = useState(getInitialFontsReady)
  const timeoutRef = useRef(0)

  const finish = () => {
    window.clearTimeout(timeoutRef.current)
    markSeen()
    setShowIntro(false)
  }

  /*
   * Пока шрифт не подтянулся, весь каскад анимаций стоит на паузе (класс `.hero--fonts-pending` в
   * Hero.tsx/Hero.css) — первый кадр интро иначе мелькает фолбэк-шрифтом до подмены на нужный.
   * Таймаут — страховка на случай, если шрифты не загрузятся вовсе (сломанный CDN и т.п.).
   */
  useEffect(() => {
    if (fontsReady || !('fonts' in document)) return
    let cancelled = false
    const markReady = () => {
      if (!cancelled) setFontsReady(true)
    }
    void Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, HERO_INTRO_FONTS_TIMEOUT_MS)),
    ]).then(markReady)
    return () => {
      cancelled = true
    }
  }, [fontsReady])

  // Основной таймер стартует только вместе с уже идущей (не приостановленной) CSS-анимацией — иначе
  // обгонит её и снимет декоративный слой раньше времени. Переживает двойной вызов эффектов в StrictMode.
  useEffect(() => {
    if (!showIntro || !fontsReady) return
    timeoutRef.current = window.setTimeout(finish, HERO_INTRO_TOTAL_MS)
    return () => window.clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finish стабильна по смыслу, пересоздавать эффект не нужно
  }, [showIntro, fontsReady])

  // Живой переключатель reduced-motion во время интро — сразу показываем финал.
  useEffect(() => {
    if (!showIntro) return
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = () => {
      if (query.matches) finish()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro])

  return { showIntro, fontsReady, skip: finish }
}
