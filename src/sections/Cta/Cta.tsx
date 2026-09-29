import { useRef } from 'react'

import crossIcon from '../../assets/icons/cross-white.svg'
import glowIcon from '../../assets/icons/glow.svg'
import textruTile from '../../assets/images/cta-textru-tile.png'
import vkTile from '../../assets/images/cta-vk-tile.png'
import { Container } from '../../components/Container/Container'
import { Logo } from '../../components/Logo/Logo'
import { useCardEffects } from '../../hooks/useCardEffects'
import './Cta.css'

/*
 * Баннер — карточка с эффектом tilt + spotlight + parallax (ядро — src/effects, подключается хуком).
 * Все числа эффекта — в effects/parallax.config.ts. Слои от самого дальнего к самому ближнему:
 *
 *  - .cta__base        фон баннера вместе со свечением, самый глубокий слой (plate);
 *  - .cta__content     логотипы, заголовок, текст — ОДИН слой под оболочкой (back);
 *  - .cta__spotlight   «стекло» — оболочка со световым бликом (без слоя параллакса);
 *  - .cta__image       плитки-иконки — ПЕРЕД оболочкой (front), часть баннера и выходят за его края.
 *
 * Плитки стоят в DOM после стекла: порядок совпадает с глубиной и в плоском состоянии. Плитка Текст.ру лежит чуть
 * ближе к стеклу, чем плитка VK, — исключение задано точечно (data-parallax-depth), см. ниже.
 */
export function Cta() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Хук ищет карточки среди потомков контейнера, поэтому ref — на обёртке баннера
  useCardEffects(containerRef, '.cta__banner')

  return (
    <section className="cta">
      <Container ref={containerRef}>
        <div className="cta__banner" data-parallax-card>
          <div className="cta__base" aria-hidden="true" data-parallax="plate">
            <div className="cta__glow">
              <div className="cta__glow-rotated">
                <img className="cta__glow-image" src={glowIcon} alt="" />
              </div>
            </div>
          </div>

          <div className="cta__content" data-parallax="back">
            <div className="cta__logos">
              <Logo name="vkWhite145" className="cta__logo cta__logo--vk" />
              <img className="cta__cross" src={crossIcon} width={15.016} height={15.016} alt="" />
              <Logo name="textruWhite95" className="cta__logo cta__logo--textru" />
            </div>

            <h2 className="cta__title t-h2">
              Текст.ру и VK Реклама
              <br />
              на специальных условиях
            </h2>
            <p className="cta__text t-body">
              Все необходимое для работы с контентом и контроля рекламных кампаний в двух подписках со скидкой.
            </p>
          </div>

          <span className="cta__spotlight" aria-hidden="true">
            <span className="cta__spotlight-glow" />
          </span>

          <div className="cta__image cta__image--textru" aria-hidden="true" data-parallax="front" data-parallax-depth="30">
            <img className="cta__picture" src={textruTile} alt="" loading="lazy" />
          </div>
          <div className="cta__image cta__image--vk" aria-hidden="true" data-parallax="front">
            <div className="cta__frame">
              <img className="cta__picture" src={vkTile} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
