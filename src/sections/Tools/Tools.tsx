import { useRef } from 'react'

import documentImage from '../../assets/images/tool-document.png'
import rocketImage from '../../assets/images/tool-rocket.png'
import { Container } from '../../components/Container/Container'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { ToolCard } from '../../components/ToolCard/ToolCard'
import { useCardEffects } from '../../hooks/useCardEffects'
import './Tools.css'

export function Tools() {
  const gridRef = useRef<HTMLDivElement>(null)

  // Tilt + spotlight + parallax на всех карточках блока; иллюстрации — слои внутри своих карточек
  useCardEffects(gridRef, '.tool-card')

  return (
    <section id="tools" className="tools">
      <SectionTitle
        block="tools"
        tone="light"
        title={
          <>
            Сокращайте время
            <br />
            на{' '}каждом этапе
          </>
        }
      />

      <Container className="tools__grid" ref={gridRef}>
        <div className="tools__column tools__column--textru">
          <ToolCard
            variant="create-content"
            logo="textruColor95"
            title="Превращайте тексты в инструмент продаж."
            text="Создавайте материалы с нуля или улучшайте готовые: меняйте стиль и тон, делайте рерайт, гуманизируйте тексты нейросетей и дорабатывайте их под свою задачу."
          />
          <ToolCard
            variant="polish-text"
            grow
            logo="textruColor95"
            title="Усиливайте поисковое продвижение"
            text="Повышайте уникальность, исправляйте ошибки, убирайте переспам и лишнюю «воду», улучшайте читаемость и готовьте тексты к поисковому продвижению."
            illustration={{ name: 'document', src: documentImage }}
          />
        </div>

        <div className="tools__column tools__column--vk">
          <ToolCard
            variant="launch-ads"
            grow
            logo="vkColor149"
            title="Готовьте рекламные материалы с ИИ"
            text="Создавайте и редактируйте тексты, изображения и видео для объявлений с помощью ИИ-инструментов Креативной студии — и сразу используйте в кампаниях."
            illustration={{ name: 'rocket', src: rocketImage }}
          />
          <ToolCard
            variant="ai-materials"
            logo="vkColor149"
            title="Запускайте рекламу под бизнес-цель"
            text="Выбирайте цель — охват, трафик, заявки, продажи, подписчики, — а платформа сама подберёт механику и оптимизацию, включая ставки и бюджет."
          />
        </div>
      </Container>
    </section>
  )
}
