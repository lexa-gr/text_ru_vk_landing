import { useRef } from 'react'

import { Container } from '../../components/Container/Container'
import { PriceCard } from '../../components/PriceCard/PriceCard'
import type { PriceFeatureItem } from '../../components/PriceFeature/PriceFeature'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { useCardEffects } from '../../hooks/useCardEffects'
import './Pricing.css'

const proFeatures: PriceFeatureItem[] = [
  { title: '100 000 символов в сутки', shortTitle: '100 000 сим/сутки', text: 'На проверку уникальности' },
  {
    title: '5 000 нейросимволов в сутки',
    shortTitle: '5 000 нейросим/сутки',
    text: 'На использование всех нейроинструментов. Неиспользованный объём накапливается',
  },
  { title: 'Безлимитный анализ текста', text: 'Проверяйте уровень заспамленности, удобочитаемости и «воды» в тексте' },
  { title: 'Все форматы проверки', text: 'Включая API' },
  { title: 'Приоритетная поддержка', text: 'Быстрее получайте помощь по работе с сервисом' },
]

const premiumFeatures: PriceFeatureItem[] = [
  { title: 'Сравнение с рынком', text: 'Сопоставляйте свои CPM, CPC и CTR со средними показателями в вашей категории' },
  { title: 'Анализ конкурентов', text: 'Следите за рекламной активностью и показателями выбранных конкурентов' },
  { title: 'Проверка креативов экспертом', text: 'Получайте рекомендации по объявлениям до запуска' },
  { title: 'Ускоренная модерация', text: 'Быстрее отправляйте кампании в работу' },
  {
    title: 'А также до 10 000 ₽ бонусами',
    text: 'Для новых пользователей VK Рекламы – пополните рекламный кабинет и получите такую же сумму бонусами*',
    highlighted: true,
  },
]

export function Pricing() {
  const cardsRef = useRef<HTMLDivElement>(null)

  // Tilt + spotlight + parallax на обеих карточках; каждая живёт независимо
  useCardEffects(cardsRef, '.price-card')

  return (
    <section id="pricing" className="pricing">
      <Container className="pricing__inner">
        <SectionTitle
          block="pricing"
          title={
            <>
              Текст.ру и VK Реклама
              <br />
              на специальных условиях
            </>
          }
          text="Все необходимое для работы с контентом и контроля рекламных кампаний в двух подписках со скидкой."
          textWidth={886}
        />

        {/* Карточки + сноска к «бонусами*» — отдельной группой, чтобы сноска не отъезжала на gap секции */}
        <div className="pricing__body">
          <div className="pricing__cards" ref={cardsRef}>
            <PriceCard
              variant="pro"
              logo="textruWhite102"
              title="ПРО-аккаунт"
              subtitle="Для работы с контентом"
              oldPrice="2 900 ₽"
              price="2 320 ₽"
              discount="-20%"
              features={proFeatures}
              href="#activation"
            />
            <PriceCard
              variant="premium"
              logo="vkWhite161"
              title="Премиум-подписка"
              subtitle="Для работы с рекламой"
              oldPrice="990 ₽"
              price="495 ₽"
              discount="-50%"
              features={premiumFeatures}
              href="#activation"
            />
          </div>

          <p className="pricing__note">
            * Правила акции: бонусы начисляются новым пользователям VK&nbsp;Рекламы по промокоду
            <br />
            при пополнении рекламного кабинета, максимальная сумма бонусов&nbsp;—&nbsp;10&nbsp;000&nbsp;₽.
          </p>
        </div>
      </Container>
    </section>
  )
}
