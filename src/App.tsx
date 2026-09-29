import './App.css'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { Activation } from './sections/Activation/Activation'
import { Cta } from './sections/Cta/Cta'
import { Features } from './sections/Features/Features'
import { Hero } from './sections/Hero/Hero'
import { Pricing } from './sections/Pricing/Pricing'
import { Tools } from './sections/Tools/Tools'

export default function App() {
  return (
    <div className="landing">
      <Header />
      <main className="landing__content">
        <Hero />
        <Features />
        <Tools />
        <Pricing />
        <Activation />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
