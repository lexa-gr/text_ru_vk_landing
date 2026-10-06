import { useRef } from 'react'

import { ActivationCard } from '../../components/ActivationCard/ActivationCard'
import { Container } from '../../components/Container/Container'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { useCardEffects } from '../../hooks/useCardEffects'
import './Activation.css'

export function Activation() {
  const cardsRef = useRef<HTMLDivElement>(null)

  // Tilt + spotlight + parallax на обеих карточках; каждая живёт независимо
  useCardEffects(cardsRef, '.activation-card')

  return (
    <section id="activation" className="activation">
      <Container className="activation__inner">
        <SectionTitle
          block="activation"
          title="Подключите за 2 шага"
          text="Вы можете выбрать любой способ – состав скидок от этого не&nbsp;изменится. Оформляйте, где удобнее вам."
          textWidth={755}
        />

        <div className="activation__cards" ref={cardsRef}>
          <ActivationCard
            variant="textru"
            logo="textruWhite163"
            href="https://text.ru/promo/YHbNUfTq"
            steps={[
              {
                title: 'Оформите тариф Текст.ру',
                text: (
                  <>
                    Перейдите по кнопке и активируйте промокод{' '}
                    <span className="step-block__highlight">ВКПРЕМИУМ</span>, чтобы подключить ПРО-аккаунт со скидкой
                    20%.
                  </>
                ),
              },
              {
                title: 'Получите предложение VK Рекламы',
                text: 'После оплаты вам откроется ссылка на подключение Премиум-подписки VK Рекламы и промокод на бонус для новых пользователей.',
              },
            ]}
          />
          <ActivationCard
            variant="vk"
            logo="vkWhite226"
            href="https://ads.vk.ru/hq/overview?modal=premium&ref=partner_text_ru"
            steps={[
              {
                title: 'Оформите Премиум-подписку VK Рекламы',
                text: 'Перейдите по кнопке и оформите первый месяц подписки со скидкой 50%.',
              },
              {
                title: 'Получите предложение Текст.ру',
                text: 'После оплаты мы отправим вам на почту ссылку на подключение тарифов Текст.ру со скидкой 20%.',
              },
            ]}
          />
        </div>
      </Container>
    </section>
  )
}
