import { ChatWidget } from './ChatWidget'
import { Gallery } from './Gallery'
import { StoreProvider } from './store'
import { About, FAQ, Footer, Header, Hero, Menu, Offers, Reviews } from './sections'
import { BackToTop, BottomNav, CartIsland, FlyLayer, Toast } from './cart'
import { Sheets } from './sheets'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    // После загрузки шрифтов переносы в длинном меню могут измениться.
    // Повторно выравниваем прямой якорь, пока пользователь сам не начал листать.
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    let cancelled = false
    const cancel = () => { cancelled = true }
    const align = () => { if (!cancelled) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }) }
    const frame = requestAnimationFrame(align)
    window.addEventListener('wheel', cancel, { passive: true, once: true })
    window.addEventListener('touchstart', cancel, { passive: true, once: true })
    window.addEventListener('pointerdown', cancel, { once: true })
    void document.fonts.ready.then(align)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
    }
  }, [])
  return (
    <StoreProvider>
      <a href="#menu" className="fixed top-[-60px] left-3 z-[100] rounded-xl bg-ink px-4 py-3 text-white focus:top-3">К меню</a>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Menu />
        <About />
        <Reviews />
        <Gallery />
        <FAQ />
      </main>
      <Footer />
      <CartIsland />
      <Toast />
      <BottomNav />
      <BackToTop />
      <ChatWidget />
      <FlyLayer />
      <Sheets />
    </StoreProvider>
  )
}
