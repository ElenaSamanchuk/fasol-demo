import { AnimatePresence, motion, useAnimationControls, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { ADDS, DISH, dishes, money, nb, NB } from './data'
import { Icon } from './icons'
import { lineUnit, useStore } from './store'
import { EASE, Price, Roll, Stepper, useDesktop } from './ui'

/* Боковая корзина на компьютере — как в Яндекс Еде: всегда видно, что в заказе и сколько */
export function CartPanel() {
  const { lines, count, total, change, open } = useStore()
  return (
    <div id="cart-target-desk" className="rounded-[28px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-[26px] font-medium">Ваш заказ</h3>
        {count > 0 && <span className="text-[13px] font-bold text-mute">{dishes(count)}</span>}
      </div>
      {!lines.length ? (
        <div className="py-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-porc text-crimson"><Icon n="bag" s={26} w={1.8} /></div>
          <p className="mx-auto mt-4 max-w-[230px] text-[14px] text-mute">{nb('Нажмите «+» у блюда — здесь появится заказ с собой')}</p>
        </div>
      ) : (
        <>
          <ul className="mt-3 max-h-[46vh] overflow-y-auto overscroll-contain pr-1">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.li key={l.key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                  <div className="grid grid-cols-[48px_1fr] gap-3 border-b border-line py-3">
                    <span className="relative grid size-12 place-items-center overflow-hidden rounded-xl bg-plate">
                      {DISH[l.id].full ? <img src={DISH[l.id].img} alt="" className="absolute inset-0 size-full object-cover" /> : <img src={DISH[l.id].img} alt="" className="w-[92%]" />}
                    </span>
                    <div className="min-w-0">
                      <b className="block truncate text-[14px] font-bold">{DISH[l.id].name}</b>
                      {l.adds.length > 0 && <span className="block truncate text-[12px] font-semibold text-mute">+ {l.adds.map((a) => ADDS[a].name).join(', ')}</span>}
                      <div className="mt-1.5 flex items-center justify-between"><Price v={lineUnit(l) * l.q} className="text-[14px]" /><Stepper q={l.q} onDec={() => change(l.key, -1)} onInc={() => change(l.key, 1)} light label={DISH[l.id].name} size="sm" /></div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[13px] font-semibold text-mute">С собой −20{NB}%<br />оплата на месте</span>
            <div className="text-right"><s className="block text-[13px] font-semibold text-mute">{money(total)}</s><Price v={Math.round(total * 80) / 100} className="text-[24px]" /></div>
          </div>
          <button type="button" onClick={() => open({ kind: 'cart' })} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-crimson text-[16px] font-bold text-white transition hover:bg-crimson-d active:scale-[.98]">Оформить<Icon n="arrow" s={18} /></button>
        </>
      )}
    </div>
  )
}

/* Плавающий остров корзины на телефоне */
export function CartIsland() {
  const { count, total, open, sheet, fly } = useStore()
  const desk = useDesktop()
  const ctl = useAnimationControls()
  // на первом экране остров не показываем — он закрыл бы текст и кнопки
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => { const v = y > window.innerHeight * 0.55; if (v !== past) setPast(v) })
  useEffect(() => { if (fly) setTimeout(() => ctl.start({ scale: [1, 1.03, 1], transition: { duration: 0.45, ease: [0.45, 0, 0.2, 1] } }), 700) }, [fly, ctl])
  if (desk) return null
  return (
    <AnimatePresence>
      {count > 0 && !sheet && past && (
        <motion.button type="button" onClick={() => open({ kind: 'cart' })} initial={{ y: 90, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed inset-x-4 bottom-[calc(76px+env(safe-area-inset-bottom))] z-40">
          <motion.span animate={ctl} className="flex h-14 items-center gap-3 rounded-full bg-ink pr-5 pl-2 text-white shadow-float">
            <span id="cart-target-mob" className="grid size-10 place-items-center rounded-full bg-crimson text-[15px] font-extrabold"><Roll value={count} /></span>
            <span className="text-[15px] font-bold">Ваш заказ</span>
            <span className="ml-auto text-[15px] font-extrabold tabular-nums"><Roll value={money(Math.round(total * 80) / 100)} />{NB}BYN</span>
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* Тарелка «прилетает» в корзину по дуге */
export function FlyLayer() {
  const { fly } = useStore()
  const [shot, setShot] = useState<null | { src: string; x0: number; y0: number; x1: number; y1: number; s: number; n: number }>(null)
  useEffect(() => {
    if (!fly || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => {
      const target = document.getElementById(matchMedia('(min-width: 1024px)').matches ? 'cart-target-desk' : 'cart-target-mob')
      if (!target) return
      const b = target.getBoundingClientRect(), a = fly.from
      const s = Math.min(a.width * 0.6, 72)
      setShot({ src: fly.src, x0: a.left + a.width / 2 - s / 2, y0: a.top + a.height / 2 - s / 2, x1: b.left + (b.width > 200 ? 48 : b.width / 2) - s / 2, y1: b.top + (b.width > 200 ? 36 : b.height / 2) - s / 2, s, n: fly.n })
    }, 60)
    return () => clearTimeout(t)
  }, [fly])
  return (
    <AnimatePresence>
      {shot && (
        <motion.img key={shot.n} src={shot.src} alt="" aria-hidden className="pointer-events-none fixed top-0 left-0 z-[70] object-contain"
          style={{ width: shot.s, height: shot.s, filter: 'drop-shadow(0 12px 14px rgba(31,23,21,.3))' }}
          initial={{ x: shot.x0, y: shot.y0, scale: 1, opacity: 0 }}
          animate={{ x: [shot.x0, shot.x0 + (shot.x1 - shot.x0) * 0.5, shot.x1], y: [shot.y0, Math.min(shot.y0, shot.y1) - 40, shot.y1], scale: [1, 0.75, 0.35], opacity: [0, 1, 0] }}
          transition={{ duration: 0.75, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
          onAnimationComplete={() => setShot(null)} />
      )}
    </AnimatePresence>
  )
}

export function Toast() {
  const { toast, open, sheet } = useStore()
  const desk = useDesktop()
  return (
    <AnimatePresence>
      {toast && !sheet && !desk && (
        <motion.div role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-x-4 bottom-[calc(142px+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-2xl bg-white p-3 pl-3 shadow-float">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-crimson text-white"><Icon n="check" s={15} w={2.6} /></span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{toast} — в заказе</span>
          <button type="button" onClick={() => open({ kind: 'cart' })} className="h-9 shrink-0 rounded-full bg-porc px-3.5 text-[13px] font-bold">Оформить</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* Нижняя навигация телефона */
export function BottomNav() {
  const { open } = useStore()
  const item = 'flex flex-col items-center gap-1 text-[11px] font-bold text-mute active:scale-95 transition'
  return (
    <nav aria-label="Быстрые действия" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white/90 px-2 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <a href="#top" className={item}><Icon n="fork" s={22} w={1.8} />Главная</a>
      <a href="#menu" className={item}><Icon n="search" s={22} w={1.8} />Меню</a>
      <button type="button" onClick={() => open({ kind: 'book' })} className={item}><Icon n="cal" s={22} w={1.8} />Бронь</button>
      <a href="#contacts" className={item}><Icon n="pin" s={22} w={1.8} />Контакты</a>
    </nav>
  )
}
