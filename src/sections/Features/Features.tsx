import { useRef } from 'react'

import analyticsImage from '../../assets/images/feature-analytics.png'
import textruImage from '../../assets/images/feature-textru.png'
import vkImage from '../../assets/images/feature-vk.png'
import { Container } from '../../components/Container/Container'
import { Feature } from '../../components/Feature/Feature'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { useFeaturesRail } from '../../hooks/useFeaturesRail'
import { cx } from '../../utils/cx'
import './Features.css'

/** Шаги секции: n-й элемент ↔ n-я точка рельсы (см. effects/features-rail.ts) — порядок задаёт и то, и другое. */
const FEATURE_STEPS = [
  {
    variant: 'content',
    logo: 'textruColor125',
    title: 'Подготовьте контент',
    text: 'Проверьте текст перед публикацией: уникальность помогает странице продвигаться в поиске, а ошибки, избыток ключевых слов, повторов и «воды» могут снизить качество материала. Доработайте текст так, чтобы он раскрывал тему, отвечал на запрос пользователя и легко читался.',
    image: { src: textruImage, width: 600, height: 543, framed: true },
  },
  {
    variant: 'reach',
    logo: 'vkColor166',
    title: 'Расширяйте охват',
    text: 'Дополняйте органическое продвижение платным и не ждите, пока пользователи найдут бизнес сами. Запускайте рекламу и направляйте аудиторию на сайты, в сообщества, мобильные приложения, на товары или услуги, расширяя охват.',
    image: { src: vkImage, width: 600, height: 469, framed: true },
  },
  {
    variant: 'sales',
    title: (
      <>
        Получайте заявки
        <br />и продажи
      </>
    ),
    text: 'Когда реклама попадает в потребность, а контент раскрывает предложение, клиенту проще перейти к целевому действию.',
    image: { src: analyticsImage, width: 600, height: 465, framed: false },
  },
] as const

export function Features() {
  const listRef = useRef<HTMLDivElement>(null)
  useFeaturesRail(listRef)

  return (
    <section className="features">
      <Container className="features__inner">
        <SectionTitle
          block="features"
          title={
            <>
              Работайте с продвижением
              <br />
              комплексно
            </>
          }
          text="Чтобы не упускать существующий спрос и выходить к новой аудитории"
        />

        <div className="features__list" ref={listRef}>
          {/* Декоративная рельса-таймлайн: точка + отрезок на каждый шаг, кроме последнего (без отрезка) */}
          <div className="features__rail" aria-hidden="true">
            {FEATURE_STEPS.map((step, index) => (
              <span
                key={step.variant}
                className={cx('features__rail-dot', index === FEATURE_STEPS.length - 1 && 'features__rail-dot--check')}
                data-rail-dot
              />
            ))}
            {FEATURE_STEPS.slice(1).map((step) => (
              <span key={step.variant} className="features__rail-line" data-rail-line>
                <span className="features__rail-fill" data-rail-fill />
              </span>
            ))}
          </div>

          <div className="features__steps">
            {FEATURE_STEPS.map((step) => (
              <Feature
                key={step.variant}
                variant={step.variant}
                logo={'logo' in step ? step.logo : undefined}
                title={step.title}
                text={step.text}
                image={step.image}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
