import { Container } from '../Container/Container'
import { Logo } from '../Logo/Logo'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <Container className="footer__inner">
        <div className="footer__logos">
          <Logo name="textruBrand102" className="footer__logo footer__logo--textru" />
          <Logo name="vkWhite220" className="footer__logo footer__logo--vk" />
        </div>
        <p className="footer__copyright t-description">Все права защищены © 2026</p>
      </Container>
    </footer>
  )
}
