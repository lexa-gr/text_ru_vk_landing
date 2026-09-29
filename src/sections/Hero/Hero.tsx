import { useRef, type CSSProperties } from 'react'

import introTextImage from '../../assets/images/hero-image--text.png'
import introVkImage from '../../assets/images/hero-image--vk.png'
import heroImage from '../../assets/images/image-hero.png'
import heroImageMobile from '../../assets/images/image-hero-mobile.png'
import { ActionCard } from '../../components/ActionCard/ActionCard'
import { Button } from '../../components/Button/Button'
import { Container } from '../../components/Container/Container'
import { Curtain } from '../../components/Curtain/Curtain'
import { LogoGroup } from '../../components/LogoGroup/LogoGroup'
import { WordMorph } from '../../components/WordMorph/WordMorph'
import { heroIntroCssVars } from '../../effects/hero-intro'
import { useCardEffects } from '../../hooks/useCardEffects'
import { MOBILE_QUERY } from '../../hooks/useMediaQuery'
import { useHeroIntro } from '../../hooks/useHeroIntro'
import { cx } from '../../utils/cx'
import { HeroIntroScreen } from './HeroIntroScreen'
import './Hero.css'

/**
 * ✏ Слова, которые по кругу подставляются в заголовок после «От контента до ».
 * Меняйте порядок и состав здесь; ширина заголовка подстроится под самое длинное слово сама.
 * Скорость и сила эффекта — WORD_MORPH в src/effects/word-morph.ts.
 */
const HERO_WORDS = ['заявок', 'продаж', 'клиентов', 'результата'] as const

/* CSS-переменные тайминга не зависят от состояния компонента — вычисляются один раз на модуль. */
const HERO_INTRO_STYLE = heroIntroCssVars() as CSSProperties

/*
 * Hero = короткая интро-заставка (~3,9 с) поверх РЕАЛЬНОГО первого экрана лендинга.
 *
 * Экран 3 (заголовок, текст, кнопка, карточки, картinka-лента) — самый обычный, всегда в DOM,
 * в финальной вёрстке: h1, реальные <a>. Он не спрятан conditional-рендерингом/display/visibility —
 * только opacity/transform через модификатор `.hero--intro` (см. Hero.css), поэтому виден поисковикам
 * и скринридерам с первого кадра. Экраны 1–2, обе шторки и белые логотипы — декоративный слой
 * `.hero__timeline`, целиком `aria-hidden` и полностью убирается из DOM, когда интро закончилось
 * или его пропустили.
 *
 * Последовательность — в CSS (`animation` + `animation-delay` из hero-intro.ts), JS решает только
 * ОДНО: показывать ли интро вообще (`useHeroIntro`) — reduced motion и повтор в той же сессии
 * (sessionStorage) сразу дают финальный экран 3 без единого кадра анимации.
 *
 * Пока веб-шрифт не подтянулся, весь каскад анимаций стоит на паузе (`.hero--fonts-pending`, см.
 * Hero.css): иначе текст экрана 1 на красном фоне успевал мелькнуть фолбэк-шрифтом до подмены на
 * нужный. `animation-delay` при паузе не тикает, поэтому снятие паузы просто сдвигает весь
 * таймлайн на момент готовности шрифтов — тайминги в hero-intro.ts менять не нужно.
 */
export function Hero() {
  const cardsRef = useRef<HTMLDivElement>(null)
  // Tilt + spotlight + parallax для каждой карточки блока (только устройства с курсором, десктоп)
  useCardEffects(cardsRef, '.action-card')

  const { showIntro, fontsReady, skip } = useHeroIntro()

  return (
    <section
      className={cx('hero', showIntro && 'hero--intro', showIntro && !fontsReady && 'hero--fonts-pending')}
      style={HERO_INTRO_STYLE}
    >
      {/* Без JS — реальный экран 3 и так виден по умолчанию (базовый CSS = финальное состояние),
          этот блок на всякий случай глушит декоративный слой и снимает анимацию явно. */}
      <noscript>
        <style>{`
          .hero__timeline, .hero__skip-overlay { display: none !important; }
          .hero--intro .hero__logos--color, .hero--intro .hero__image, .hero--intro .hero__title,
          .hero--intro .hero__text, .hero--intro .hero__button, .hero--intro .hero__cards .action-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </noscript>

      {showIntro && (
        <>
          <div className="hero__timeline" aria-hidden="true">
            <HeroIntroScreen className="hero__screen--1" title="Создавайте контент" image={introTextImage} />
            <Curtain className="hero__curtain hero__curtain--1" />
            <HeroIntroScreen className="hero__screen--2" title="Запускайте рекламу" image={introVkImage} />
            <Container className="hero__logos-slot">
              <LogoGroup variant="white" className="hero__logos hero__logos--white" />
            </Container>
            <Curtain className="hero__curtain hero__curtain--2" />
          </div>

          <button
            className="hero__skip-overlay"
            type="button"
            onClick={skip}
            aria-label="Пропустить вступление"
          />
        </>
      )}

      <Container className="hero__inner">
        <LogoGroup variant="color" className="hero__logos hero__logos--color" />

        {/* Контент экрана 3 (заголовок, карточки, лента) — общий блок: иллюстрация отсчитывает своё положение
            от его верха, а сам блок на десктопе прижат к низу первого экрана (см. Hero.css) */}
        <div className="hero__content">
          <div className="hero__intro">
            <h1 className="hero__title t-h1">
              {/* Статичная часть — не меняется и не анимируется */}
              <span className="hero__title-static">
                От контента
                <br />
                до{' '}
              </span>
              {/* Динамическое слово */}
              <WordMorph className="hero__title-word" words={HERO_WORDS} />
            </h1>
            <p className="hero__text t-body">
              Используйте инструменты Текст.ру для создания, редактуры и проверки контента, а VK Рекламы — для
              подготовки рекламных текстов, изображений и видео.
            </p>
            <Button className="hero__button" href="#pricing">
              Получить предложение
            </Button>
          </div>

          <div className="hero__cards" ref={cardsRef}>
            <ActionCard
              href="#pricing"
              variant="premium"
              logo="vkWhite165"
              title="Премиум-подписка"
              badge="х2 к бюджету"
            />
            <ActionCard
              href="#pricing"
              variant="pro"
              logo="textruWhite107"
              title="ПРО-аккаунт"
              text="Доступ ко всему функционалу сервиса для работы с контентом."
            />
          </div>

          {/* На мобильном — свой рисунок из макета (квадрат, растянутый на рамку 385×333), см. Hero.css */}
          <div className="hero__image">
            <picture>
              <source media={MOBILE_QUERY} srcSet={heroImageMobile} />
              <img className="hero__picture" src={heroImage} width={749} height={648} alt="" />
            </picture>
          </div>
        </div>
      </Container>
    </section>
  )
}
