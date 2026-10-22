import { StoreProvider } from './store'
import { About, Footer, Header, Hero, Menu, Today } from './sections'
import { BottomNav, CartIsland, FlyLayer, Toast } from './cart'
import { Sheets } from './sheets'

export default function App() {
  return (
    <StoreProvider>
      <a href="#menu" className="fixed top-[-60px] left-3 z-[100] rounded-xl bg-ink px-4 py-3 text-white focus:top-3">К меню</a>
      <Header />
      <main>
        <Hero />
        <Today />
        <Menu />
        <About />
      </main>
      <Footer />
      <CartIsland />
      <Toast />
      <BottomNav />
      <FlyLayer />
      <Sheets />
    </StoreProvider>
  )
}
