import { cx } from '../../utils/cx'
import { Container } from '../../components/Container/Container'
import glowImage from '../../assets/images/hero-glow.svg'

type HeroIntroScreenProps = {
  /** Модификатор `.hero__screen--*`: задаёт задержку показа, фон и позиции картинки/блика (см. Hero.css). */
  className: string
  title: string
  image: string
}

/**
 * Один «слайд» интро (экран 1 или 2): блик, заголовок (тот же стиль h1 и то же место, что у настоящего
 * заголовка экрана 3) и 3D-картинка. Полностью декоративный — родитель (`.hero__timeline` в Hero.tsx)
 * помечен `aria-hidden`, поэтому здесь обычный `<p>`, а не `<h1>`/`<h2>`.
 */
export function HeroIntroScreen({ className, title, image }: HeroIntroScreenProps) {
  return (
    <div className={cx('hero__screen', className)}>
      <Container className="hero__screen-inner">
        <div className="hero__screen-glow">
          <img className="hero__screen-glow-image" src={glowImage} alt="" />
        </div>
        <p className="hero__screen-title t-h1">{title}</p>
        <img className="hero__screen-picture" src={image} width={500} height={500} alt="" />
      </Container>
    </div>
  )
}
