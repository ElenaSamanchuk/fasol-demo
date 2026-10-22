import { motion, useMotionValueEvent, useScroll, LayoutGroup } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CATS, DISH, minsk, nb, NB, openState, dishes } from './data'
import { Icon } from './icons'
import { Logo } from './logo'
import { useStore } from './store'
import { EASE_IO, Price, Reveal, Stepper } from './ui'

/* ---------- шапка: прозрачная на фото → матовая; прячется при прокрутке вниз ---------- */
export function Header() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const { open } = useStore()
  useMotionValueEvent(scrollY, 'change', (y) => { const s = y > window.innerHeight * 0.6; if (s !== solid) setSolid(s) })
  const nav = [['Меню', '#menu'], ['Хоспер-гриль', '#cat-grill'], ['Бизнес-ланч', '#cat-lunch'], ['О ресторане', '#about'], ['Контакты', '#contacts']]
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ease-[cubic-bezier(.45,0,.2,1)] ${solid ? 'bg-porc text-ink shadow-[0_1px_0_var(--color-line)]' : 'text-white'}`}>
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-8 px-4 lg:h-20 lg:px-10">
        <a href="#top" aria-label="Фасоль — наверх" className={`transition-colors ${solid ? 'text-crimson' : 'text-white'}`}><Logo className="h-9 w-auto lg:h-11" /></a>
        <nav className="hidden gap-7 text-sm font-semibold lg:flex" aria-label="Разделы">
          {nav.map(([t, h]) => <a key={h} href={h} className="relative py-2 opacity-90 transition hover:opacity-100 after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100">{t}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <a href="tel:+375447903333" className={`hidden h-11 items-center gap-2 rounded-full px-4 text-sm font-bold ring-[1.5px] ring-current ring-inset transition xl:inline-flex ${solid ? 'ring-ink/15' : ''}`}><Icon n="phone" s={17} />+375 44 790-33-33</a>
          <a href="tel:+375447903333" aria-label="Позвонить" className={`grid size-9 place-items-center rounded-full ring-1 ring-inset transition-colors duration-500 xl:hidden ${solid ? 'text-crimson ring-crimson/25' : 'ring-white/60'}`}><Icon n="phone" s={15} /></a>
          <button type="button" onClick={() => open({ kind: 'book' })} className="hidden h-11 items-center gap-2 rounded-full bg-crimson px-5 text-sm font-bold text-white transition hover:bg-crimson-d lg:inline-flex"><Icon n="cal" s={17} />Забронировать стол</button>
        </div>
      </div>
    </header>
  )
}

/* ---------- первый экран: фото на весь экран, при прокрутке сжимается в скруглённую карточку ---------- */
export function Hero() {
  const st = openState()
  const line = (t: string, i: number, em?: boolean) => (
    <motion.span className={`block ${em ? 'font-normal italic' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: EASE_IO, delay: 0.2 + i * 0.15 }}>{t}</motion.span>
  )
  return (
    <section id="top" className="relative h-[92svh] min-h-[600px] lg:h-[100svh] lg:max-h-[960px]">
      <div className="absolute inset-0 overflow-hidden bg-[#2A1E1B]">
        <motion.img src="img/own-banner.webp" alt="Фирменная тарелка «Фасоли» со стейком на углях" fetchPriority="high"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE_IO }}
          className="absolute inset-0 size-full object-cover object-[34%_50%] lg:object-[50%_62%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,10,.55)_0%,rgba(20,12,10,0)_22%,rgba(20,12,10,0)_42%,rgba(20,12,10,.66)_72%,rgba(20,12,10,.82)_100%)] lg:bg-[linear-gradient(180deg,rgba(20,12,10,.5)_0%,rgba(20,12,10,0)_24%),linear-gradient(90deg,rgba(20,12,10,0)_36%,rgba(20,12,10,.7)_66%,rgba(20,12,10,.84)_100%)]" />
        <div className="absolute inset-x-4 bottom-24 text-white lg:inset-x-auto lg:top-1/2 lg:right-10 lg:bottom-auto lg:left-[54%] lg:-translate-y-[42%]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_IO }} className="text-xs font-bold tracking-[.18em] uppercase lg:text-sm"><span className="lg:hidden">Международная кухня · Гомель</span><span className="hidden lg:inline">Ресторан международной кухни · Гомель</span></motion.div>
          <h1 className="mt-4 font-serif text-[clamp(38px,10.5vw,46px)] leading-[1.02] font-medium tracking-[-.02em] lg:mt-6 lg:text-[clamp(56px,5.4vw,84px)]">
            {line('Завтраки, обеды', 0)}{line(`и${NB}ужин с${NB}огнём`, 1, true)}
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_IO, delay: 0.45 }} className="mt-5 hidden max-w-[460px] text-lg leading-relaxed text-white/90 lg:block">{nb('Два этажа в сердце города и печь-гриль Хоспер на древесных углях')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_IO, delay: 0.6 }} className="mt-6 flex gap-2.5 lg:mt-9">
            <BookBtn />
            <a href="#menu" className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-base font-semibold ring-1 ring-white/70 ring-inset transition-colors duration-300 hover:bg-white/10 lg:h-14 lg:px-7">Меню<Icon n="arrow" s={18} /></a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
          className="absolute inset-x-4 bottom-5 flex items-center gap-x-4 gap-y-1 border-t border-white/25 pt-3.5 text-sm font-semibold text-white lg:inset-x-10 lg:bottom-7 lg:gap-6 lg:pt-5 lg:text-sm">
          <span className="inline-flex items-center gap-2 whitespace-nowrap"><i className={`size-2 rounded-full ${st.open ? 'bg-[#5BD27A] shadow-[0_0_0_4px_rgba(91,210,122,.25)]' : 'bg-[#E9A23B]'}`} />{st.text}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon n="star" s={14} className="text-[#F4C04E]" /><b>5,0</b><span className="opacity-80">на{NB}Яндексе<span className="hidden lg:inline"> · 5{NB}651 оценка</span></span></span>
          <span className="ml-auto hidden lg:inline">Советская, 36</span>
        </motion.div>
      </div>
    </section>
  )
}
function BookBtn() {
  const { open } = useStore()
  return <button type="button" onClick={() => open({ kind: 'book' })} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-crimson px-6 text-base font-semibold text-white transition-colors duration-300 hover:bg-crimson-d lg:h-14 lg:flex-none lg:px-8"><Icon n="cal" s={18} /><span className="lg:hidden">Забронировать</span><span className="hidden lg:inline">Забронировать стол</span></button>
}

/* ---------- «Сегодня в Фасоли»: бенто-сетка ---------- */
const TOD = {
  morning: { name: 'Утро', icon: 'sun', title: 'Завтраки до 12:00', text: 'В будни с 9:00, в выходные с 10:00', items: ['syrniki', 'nalistniki', 'cheesecake-blue'] },
  day: { name: 'День', icon: 'clock', title: 'Бизнес-ланч', text: 'Пн–пт 12:00–15:00 · суп + горячее + напиток — 12 BYN', items: ['soup-day', 'kotleta', 'gulyash'] },
  evening: { name: 'Вечер', icon: 'flame', title: 'Хоспер и концерты', text: 'Стейки на углях и музыкальные вечера на большом экране', items: ['steak-ny', 'salmon', 'ribeye'] },
} as const
type TodK = keyof typeof TOD
function nowTod(): TodK { const t = minsk(); return t.h < 12 ? 'morning' : t.h < 15 && !t.weekend ? 'day' : 'evening' }

export function Today() {
  const [k, setK] = useState<TodK>(nowTod)
  const cur = useMemo(nowTod, [])
  const { open } = useStore()
  const T = TOD[k]
  return (
    <section className="mx-auto max-w-[1320px] px-4 pt-14 lg:px-10 lg:pt-24" aria-labelledby="today-h">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div><div className="text-[11px] font-semibold tracking-[.2em] text-crimson uppercase">Сегодня в Фасоли</div>
          <h2 id="today-h" className="mt-3 font-serif text-4xl leading-[1.04] font-medium tracking-[-.02em] lg:text-6xl">Утро, день <em className="font-normal">и вечер</em></h2></div>
        <div role="tablist" aria-label="Время дня" className="relative flex gap-5">
          <LayoutGroup id="tod">
            {(Object.keys(TOD) as TodK[]).map((x) => (
              <button key={x} role="tab" aria-selected={k === x} type="button" onClick={() => setK(x)} className={`relative h-11 text-sm font-medium transition-colors duration-300 ${k === x ? 'text-ink' : 'text-mute hover:text-ink'}`}>
                {k === x && <motion.span layoutId="tod-pill" className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-crimson" transition={{ duration: 0.4, ease: [0.45, 0, 0.2, 1] }} />}
                <span className="relative inline-flex items-center gap-1.5"><Icon n={TOD[x].icon} s={15} />{TOD[x].name}{x === cur && <i className="size-1.5 rounded-full bg-crimson" aria-label="сейчас" />}</span>
              </button>
            ))}
          </LayoutGroup>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-12 lg:gap-5">
        <Reveal className="lg:col-span-7">
          <div className="h-full border-t border-ink/10 pt-6 lg:pt-8">
            <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE_IO }}>
              <div className="text-xs font-extrabold tracking-[.14em] text-crimson uppercase">{k === cur ? 'Сейчас' : TOD[k].name}</div>
              <h3 className="mt-2 font-serif text-2xl font-medium tracking-[-.015em] lg:text-4xl">{T.title}</h3>
              <p className="mt-1.5 text-sm text-ink2">{nb(T.text)}</p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {T.items.map((id, i) => (
                  <motion.button key={id} type="button" onClick={() => open({ kind: 'dish', id })} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_IO, delay: i * 0.05 }}
                    className="group flex items-center gap-3 text-left sm:flex-col sm:items-start">
                    <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-plate sm:aspect-square sm:size-auto sm:w-full">{DISH[id].full ? <img src={DISH[id].img} alt="" className="absolute inset-0 size-full object-cover" /> : <img src={DISH[id].img} alt="" loading="lazy" className="plate-img w-[86%]" />}</span>
                    <span className="sm:pt-1"><b className="block font-serif text-base leading-tight font-medium">{nb(DISH[id].name)}</b><Price v={DISH[id].price} per100={DISH[id].per100} className="mt-1 block text-sm" /></span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5">
          <a href="#cat-grill" className="group relative block h-[300px] overflow-hidden rounded-3xl bg-ink text-white lg:h-full lg:min-h-[420px]">
            <img src="img/sq-steak-ny.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,12,10,.9)_0%,rgba(20,12,10,.2)_55%,rgba(20,12,10,0)_100%)]" />
            <span className="absolute top-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-black/35 px-3.5 text-sm font-extrabold backdrop-blur-md"><Icon n="flame" s={15} className="text-[#FF9A5C]" />350°</span>
            <div className="absolute inset-x-5 bottom-5 lg:inset-x-7 lg:bottom-7">
              <div className="text-xs font-extrabold tracking-[.16em] uppercase opacity-85">Хоспер-гриль</div>
              <h3 className="mt-2 font-serif text-3xl leading-[1.05] font-medium lg:text-5xl">Фа, соль и{NB}немного <em className="font-normal">огня</em></h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold">Меню гриля<Icon n="arrow" s={16} className="transition-transform group-hover:translate-x-1" /></span>
            </div>
          </a>
        </Reveal>
        <Reveal delay={0.04} className="lg:col-span-4">
          <div className="flex h-full flex-col justify-between border-t border-ink/10 pt-6 lg:pt-8">
            <div className="text-xs font-bold tracking-[.16em] text-crimson uppercase">Яндекс Карты</div>
            <div className="mt-6 flex items-end gap-3"><b className="font-serif text-6xl leading-none font-medium">5,0</b><span className="mb-3 flex gap-0.5 text-[#F4C04E]">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} n="star" s={16} />)}</span></div>
            <p className="mt-3 text-sm text-ink2">{nb('5 651 оценка. Гости чаще всего хвалят суп из красной фасоли, стейки и наш хлеб')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-4">
          <Tile img="img/int-kids.webp" kick="Для семьи" title="Детская комната" text="Игровая с аниматором: взрослые ужинают, дети играют" />
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-4">
          <Tile img="img/int-screen.webp" kick="Пт и сб с 19:00" title="Музыкальные вечера" text="Концерты на большом экране в нашем зале" />
        </Reveal>
      </div>
    </section>
  )
}
function Tile({ img, kick, title, text }: { img: string; kick: string; title: string; text: string }) {
  return (
    <div className="group relative h-[260px] overflow-hidden rounded-3xl bg-ink text-white lg:h-[300px]">
      <img src={img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,12,10,.88)_0%,rgba(20,12,10,.15)_60%,rgba(20,12,10,0)_100%)]" />
      <div className="absolute inset-x-5 bottom-5 lg:inset-x-6 lg:bottom-6">
        <div className="text-xs font-extrabold tracking-[.14em] uppercase opacity-85">{kick}</div>
        <h3 className="mt-1.5 font-serif text-2xl leading-tight font-medium">{title}</h3>
        <p className="mt-1 text-sm text-white/85">{nb(text)}</p>
      </div>
    </div>
  )
}

/* ---------- витрина меню ---------- */
export function DishCard({ id }: { id: string; i?: number }) {
  const d = DISH[id]
  const { qty, changeById, add, open } = useStore()
  const q = qty(id)
  const imgRef = useRef<HTMLImageElement>(null)
  const plus = (e: React.MouseEvent) => {
    e.stopPropagation()
    const r = imgRef.current?.getBoundingClientRect()
    add(id, [], 1, r ? { src: d.img, rect: r } : undefined)
  }
  return (
    <article className="group relative flex flex-col">
      <button type="button" onClick={() => open({ kind: 'dish', id })} className={`photo relative grid aspect-square place-items-center overflow-hidden rounded-card bg-plate text-left ${q ? 'on' : ''}`} aria-label={`${d.name}, подробнее`}>
        {d.tag && <span className="absolute top-3 left-3 z-10 text-[11px] font-semibold tracking-[.14em] text-ink/70 uppercase">{d.tag}</span>}
        {d.full
          ? <img ref={imgRef} src={d.img} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover ${d.stop ? 'opacity-50 grayscale' : ''}`} />
          : <img ref={imgRef} src={d.img} alt="" loading="lazy" className={`plate-img w-[86%] ${d.stop ? 'opacity-45 grayscale' : ''}`} />}
      </button>
      <div className="flex flex-1 flex-col pt-3 lg:pt-4">
        <button type="button" onClick={() => open({ kind: 'dish', id })} className="text-left">
          <h3 className="line-clamp-2 text-sm leading-[1.25] font-medium lg:text-base">{nb(d.name)}</h3>
          <span className="mt-1 block text-xs text-mute">{d.per100 ? 'цена за 100 г' : d.weight}</span>
        </button>
        <div className="mt-auto flex min-h-10 flex-wrap items-center justify-between gap-x-2 gap-y-2 pt-2">
          <Price v={d.price} className={`text-base font-semibold ${d.stop ? 'text-mute' : ''}`} />
          {d.stop ? <span className="text-xs text-mute">Сегодня нет</span>
            : q ? <motion.div className="shrink-0 overflow-hidden rounded-full" initial={{ opacity: 0, width: 34 }} animate={{ opacity: 1, width: 'auto' }} transition={{ duration: 0.4, ease: [0.45, 0, 0.2, 1] }}><Stepper q={q} onDec={() => changeById(id, -1)} onInc={() => changeById(id, 1)} label={d.name} size="xs" /></motion.div>
              : <button type="button" onClick={plus} aria-label={`Добавить: ${d.name}`} className="grid size-9 shrink-0 place-items-center rounded-full text-ink ring-1 ring-ink/20 ring-inset transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(.45,0,.2,1)] hover:bg-crimson hover:text-white hover:ring-crimson"><Icon n="plus" s={16} w={2} /></button>}
        </div>
      </div>
    </article>
  )
}

export function Menu() {
  const [active, setActive] = useState(CATS[0].id)
  const [q, setQ] = useState('')
  const [search, setSearch] = useState(false)
  const jumping = useRef(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((es) => { if (jumping.current) return; es.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(4))) }, { rootMargin: '-30% 0px -65% 0px' })
    CATS.forEach((c) => { const el = document.getElementById('cat-' + c.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [q])
  useEffect(() => {
    const b = bar.current, el = b?.querySelector<HTMLElement>(`[data-c="${active}"]`)
    if (b && el) b.scrollTo({ left: el.offsetLeft - b.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  const go = (id: string) => {
    setActive(id); jumping.current = true
    { const el = document.getElementById('cat-' + id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 140 : 124), behavior: 'smooth' }) }
    setTimeout(() => { jumping.current = false }, 900)
  }
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
  const found = q.trim().length > 1 ? Object.values(DISH).filter((d) => {
    const hay = norm(d.name + ' ' + d.desc + (CATS.find((c) => c.items.includes(d.id))?.id === 'grill' ? ' хоспер гриль стейк' : ''))
    return norm(q).split(/\s+/).every((w) => hay.includes(w) || (w.length > 3 && hay.split(/\s+/).some((t) => lev(w, t.slice(0, w.length)) <= 1)))
  }) : null

  return (
    <section id="menu" className="mt-20 lg:mt-28" aria-label="Меню">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-10">
        <Reveal><div className="text-[11px] font-semibold tracking-[.2em] text-crimson uppercase">Меню</div>
          <h2 className="mt-3 font-serif text-4xl leading-[1.04] font-medium tracking-[-.02em] lg:text-6xl">Закажите с{NB}собой <em className="font-normal">или{NB}за{NB}столом</em></h2>
          <p className="mt-3 max-w-[560px] text-sm text-ink2 lg:text-lg">{nb('Соберите заказ — администратор перезвонит и подтвердит. Оплата на месте, с собой −20 %')}</p></Reveal>
      </div>
      <div className="menu-bar sticky top-0 z-30 mt-6 border-b border-line bg-porc">
        <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-4 lg:px-10">
          {search ? (
            <motion.label initial={{ opacity: 0, width: '40%' }} animate={{ opacity: 1, width: '100%' }} className="my-2 flex h-11 items-center gap-2 rounded-full bg-white px-4 text-mute shadow-[inset_0_0_0_1px_var(--color-line)]">
              <Icon n="search" s={18} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Например, лосось" aria-label="Поиск по меню" className="min-w-0 flex-1 bg-transparent text-base font-semibold text-ink outline-none" />
              <button type="button" onClick={() => { setSearch(false); setQ('') }} aria-label="Закрыть поиск" className="grid size-8 place-items-center rounded-full bg-porc text-ink"><Icon n="close" s={16} /></button>
            </motion.label>
          ) : <>
            <div ref={bar} className="flex flex-1 gap-6 overflow-x-auto no-scrollbar lg:gap-8 [mask-image:linear-gradient(90deg,#000_90%,transparent)]">
              <LayoutGroup id="cats">
                {CATS.map((c) => (
                  <button key={c.id} data-c={c.id} type="button" onClick={() => go(c.id)} aria-current={active === c.id} className={`relative h-12 shrink-0 px-1 text-sm font-medium transition-colors duration-300 ${active === c.id ? 'text-ink' : 'text-mute hover:text-ink'}`}>
                    {active === c.id && <motion.span layoutId="cat-pill" className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-crimson" transition={{ duration: 0.4, ease: [0.45, 0, 0.2, 1] }} />}
                    <span className="relative">{c.name}</span>
                  </button>
                ))}
              </LayoutGroup>
            </div>
            <button type="button" onClick={() => setSearch(true)} aria-label="Поиск по меню" className="grid size-10 shrink-0 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-plate"><Icon n="search" s={18} /></button>
          </>}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-10">
        <div>
          {found ? (
            <div className="pt-6">
              <p className="mb-4 text-sm font-semibold text-ink2" aria-live="polite">{found.length ? `Нашли ${dishes(found.length)}` : 'Ничего не нашли. Попробуйте «стейк», «суп» или «десерт»'}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-12">{found.map((d, i) => <DishCard key={d.id} id={d.id} i={i} />)}</div>
            </div>
          ) : CATS.map((c) => (
            <div key={c.id} id={'cat-' + c.id} className="pt-12 lg:pt-20">
              <div className="mb-4 flex items-baseline gap-3 lg:mb-6"><h3 className="font-serif text-2xl font-medium tracking-[-.015em] lg:text-4xl">{c.name}</h3>{c.note && <span className="text-sm font-bold text-mute">{c.note}</span>}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-12">{c.items.map((id, i) => <DishCard key={id} id={id} i={i} />)}</div>
            </div>
          ))}
        </div>
        <CartPanelSlot />
      </div>
    </section>
  )
}
function lev(a: string, b: string) {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}
// место под боковую корзину на компьютере — сам компонент в cart.tsx
import { CartPanel } from './cart'
function CartPanelSlot() { return <div className="hidden lg:block"><div className="sticky top-24 pt-14"><CartPanel /></div></div> }

/* ---------- о ресторане и подвал ---------- */
export function About() {
  return (
    <section id="about" className="mx-auto mt-24 max-w-[1320px] px-4 lg:mt-36 lg:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7"><div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><img src="img/int-hall.webp" alt="Зал ресторана" loading="lazy" className="size-full object-cover" /></div></Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="text-[11px] font-semibold tracking-[.2em] text-crimson uppercase">О ресторане</div>
          <h2 className="mt-3 font-serif text-4xl leading-[1.06] font-medium tracking-[-.02em] lg:text-5xl">Два этажа в{NB}сердце <em className="font-normal">Гомеля</em></h2>
          <p className="mt-4 text-base leading-relaxed text-ink2 lg:text-lg">{nb('Международная кухня, свой хлеб и печь-гриль Хоспер. Днём — завтраки и бизнес-ланчи, вечером — стейки и музыка. Детская комната с аниматором, летом — терраса')}</p>
          <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-line pt-6">
            {[['5,0', 'на Яндексе'], ['15', 'лет группе'], ['350°', 'в Хоспере']].map(([v, l]) => <div key={l}><dt className="font-serif text-4xl leading-none font-medium lg:text-5xl">{v}</dt><dd className="mt-1.5 text-sm font-semibold text-mute">{l}</dd></div>)}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const { open } = useStore()
  return (
    <footer id="contacts" className="mt-24 bg-ink pt-16 pb-[calc(140px+env(safe-area-inset-bottom))] text-white lg:mt-36 lg:pb-14">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><Logo className="h-14 w-auto lg:h-16" /><p className="mt-4 max-w-[320px] text-sm text-white/70">Ресторан международной кухни в сердце Гомеля</p></div>
          <div className="flex gap-2.5"><BookBtnLight /></div>
        </div>
        <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Адрес</h3><p className="mt-3 text-base font-semibold">Советская, 36<br /><span className="font-medium text-white/75">Гомель, центр</span></p></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Часы</h3><p className="mt-3 text-base font-semibold">Пн–пт 9:00–23:00<br />Сб–вс 10:00–23:00<br /><span className="font-medium text-white/75">Бизнес-ланч пн–пт 12–15</span></p></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Телефоны</h3><p className="mt-3 text-base font-semibold"><a href="tel:+375447903333">+375 44 790-33-33</a><br /><a href="tel:+375232221468" className="font-medium text-white/75">+375 232 22-14-68</a></p></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Ещё</h3>
            <div className="mt-3 flex flex-col items-start gap-2 text-base font-semibold">
              <button type="button" onClick={() => open({ kind: 'info', topic: 'cert' })} className="hover:text-white/80">Подарочные сертификаты</button>
              <button type="button" onClick={() => open({ kind: 'info', topic: 'office' })} className="hover:text-white/80">Обеды в офис</button>
              <a href="https://instagram.com/fasol.gomel" target="_blank" rel="noopener" className="hover:text-white/80">Instagram @fasol.gomel</a>
            </div></div>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-white/60">
          <span>© Фасоль, ООО «Орион Холл»</span><span className="ml-auto">Сайт — Елена Саманчук</span>
          <span className="w-full text-xs text-white/70">Демо-версия: цены, вес и КБЖУ — примеры, заказы и брони никуда не отправляются</span>
        </div>
      </div>
    </footer>
  )
}
function BookBtnLight() {
  const { open } = useStore()
  return <button type="button" onClick={() => open({ kind: 'book' })} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-crimson transition-colors duration-300 hover:bg-porc lg:h-12 lg:px-6 lg:text-sm"><Icon n="cal" s={16} />Забронировать стол</button>
}
