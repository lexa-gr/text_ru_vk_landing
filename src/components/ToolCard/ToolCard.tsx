import { getLogoBrand, type LogoName } from '../../assets/logos'
import { cx } from '../../utils/cx'
import { Logo } from '../Logo/Logo'
import './ToolCard.css'

type ToolCardIllustration = {
  /** rocket — ракета у «Запускайте рекламу…», document — документ у «Доводите текст…»; отвечает за раскладку в CSS. */
  name: 'rocket' | 'document'
  src: string
}

type ToolCardProps = {
  variant: 'create-content' | 'polish-text' | 'launch-ads' | 'ai-materials'
  logo: LogoName
  title: string
  text: string
  grow?: boolean
  /** Иллюстрация, выходящая за границы карточки: часть карточки, лежит ПЕРЕД оболочкой. */
  illustration?: ToolCardIllustration
}

/*
 * Интерактив карточки (tilt + spotlight + parallax) подключается снаружи через useCardEffects,
 * см. src/effects; все числа эффекта — в effects/parallax.config.ts. Слои — от самого дальнего к самому
 * ближнему (порядок в DOM важен, см. styles/parallax.css):
 *
 *  - .tool-card__base         фон карточки, самый глубокий слой (plate);
 *  - .tool-card__content      логотип + заголовок + текст — ОДИН слой, лежит под оболочкой (back);
 *  - .tool-card__spotlight    «стекло» — оболочка со световым бликом (без слоя параллакса);
 *  - .tool-card__image        иллюстрация — ПЕРЕД оболочкой (front), поэтому в DOM после стекла.
 *
 * Разница глубины между иллюстрацией (вперёд) и текстом (назад) — это и есть усиленный параллакс.
 */
export function ToolCard({ variant, logo, title, text, grow, illustration }: ToolCardProps) {
  return (
    <article className={cx('tool-card', `tool-card--${variant}`, grow && 'tool-card--grow')} data-parallax-card>
      <span className="tool-card__base" aria-hidden="true" data-parallax="plate" />

      <div className="tool-card__content" data-parallax="back">
        <div className="tool-card__brand">
          <Logo name={logo} className={`tool-card__logo-${getLogoBrand(logo)}`} />
        </div>
        <h3 className="tool-card__title t-h3">{title}</h3>
        <p className="tool-card__text t-body">{text}</p>
      </div>

      <span className="tool-card__spotlight" aria-hidden="true">
        <span className="tool-card__glow" />
      </span>

      {illustration && (
        /* Внешний слой — только для параллакса (JS перезаписывает его transform), рамка с поворотом и обрезкой — внутри */
        <div
          className={cx('tool-card__image', `tool-card__image--${illustration.name}`)}
          aria-hidden="true"
          data-parallax="front"
        >
          <div className="tool-card__frame">
            <img className="tool-card__picture" src={illustration.src} alt="" loading="lazy" />
          </div>
        </div>
      )}
    </article>
  )
}
