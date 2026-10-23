import { motion, useMotionValueEvent, useScroll, LayoutGroup, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CATS, DISH, DELIVERY_URL, MAP_URL, ROUTE_URL, nb, NB, openState, dishes } from './data'
import { Icon } from './icons'
import { useCarousel } from './useCarousel'
import { MenuTools, DEFAULT_MENU_TOOLS, hasMenuFilters } from './MenuTools'
import { Logo } from './logo'
import { useStore } from './store'
import { EASE_IO, Price, Reveal, Stepper } from './ui'

/* ---------- шапка: прозрачная на фото → матовая; прячется при прокрутке вниз ---------- */
export function Header() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const { open } = useStore()
  useMotionValueEvent(scrollY, 'change', (y) => { const s = y > window.innerHeight * 0.6; if (s !== solid) setSolid(s) })
  const nav = [['Меню', '#menu'], ['Бизнес-ланч', '#cat-lunch'], ['Хоспер-гриль', '#cat-grill'], ['Контакты', '#about']]
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ease-[cubic-bezier(.45,0,.2,1)] ${solid ? 'bg-porc text-ink shadow-[0_1px_0_var(--color-line)]' : 'text-white'}`}>
      <div className="mx-auto flex h-16 max-w-page items-center gap-8 px-4 lg:h-20 lg:px-10">
        <a href="#top" aria-label="Фасоль — наверх" className={`transition-colors ${solid ? 'text-crimson' : 'text-white'}`}><Logo className="h-9 w-auto lg:h-11" /></a>
        <nav className="hidden gap-7 text-sm font-semibold lg:flex" aria-label="Разделы">
          {nav.map(([t, h]) => <a key={h} href={h} className="relative py-2 opacity-90 transition hover:opacity-100 after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100">{t}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <a href="tel:+375447903333" className={`button-control hidden h-11 items-center gap-2 rounded-full px-4 text-sm font-bold ring-[1.5px] ring-current ring-inset transition xl:inline-flex ${solid ? 'ring-ink/15' : ''}`}><Icon n="phone" s={17} /><span className="button-label">+375 44 790-33-33</span></a>
          <a href="tel:+375447903333" aria-label="Позвонить" className={`grid size-9 place-items-center rounded-full ring-1 ring-inset transition-colors duration-500 xl:hidden ${solid ? 'text-crimson ring-crimson/25' : 'ring-white/60'}`}><Icon n="phone" s={15} /></a>
          <button type="button" onClick={() => open({ kind: 'book' })} className="button-control hidden h-11 items-center gap-2 rounded-full bg-crimson px-5 text-sm font-bold text-white transition hover:bg-crimson-d lg:inline-flex"><Icon n="cal" s={17} /><span className="button-label">Забронировать стол</span></button>
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
    <section id="top" className="hero relative h-[80svh] min-h-[580px] lg:h-[100svh] lg:max-h-[960px]">
      <div className="absolute inset-0 overflow-hidden bg-hero-surface">
        <motion.img src="img/own-banner.webp" alt="Фирменная тарелка «Фасоли» со стейком на углях" fetchPriority="high"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE_IO }}
          className="hero-photo absolute inset-0 size-full object-cover object-[48%_62%] lg:object-[50%_62%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,10,.55)_0%,rgba(20,12,10,0)_22%,rgba(20,12,10,0)_42%,rgba(20,12,10,.66)_72%,rgba(20,12,10,.82)_100%)] lg:bg-[linear-gradient(180deg,rgba(20,12,10,.5)_0%,rgba(20,12,10,0)_24%),linear-gradient(90deg,rgba(20,12,10,0)_36%,rgba(20,12,10,.7)_66%,rgba(20,12,10,.84)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-4 bottom-24 text-white lg:inset-x-auto lg:top-1/2 lg:right-10 lg:bottom-auto lg:left-[54%] lg:-translate-y-[42%]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_IO }} className="text-xs font-bold tracking-[.18em] uppercase lg:text-sm"><span className="lg:hidden">Международная кухня · Гомель</span><span className="hidden lg:inline">Ресторан международной кухни · Гомель</span></motion.div>
          <h1 className="mt-4 font-serif text-[clamp(38px,10.5vw,46px)] leading-[1.02] font-medium tracking-[-.02em] lg:mt-6 lg:text-[clamp(56px,5.4vw,84px)]">
            {line('Завтраки, обеды', 0)}{line(`и${NB}ужин с${NB}огнём`, 1, true)}
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_IO, delay: 0.45 }} className="mt-5 hidden max-w-[460px] text-lg leading-relaxed text-white/90 lg:block">{nb('Два этажа в сердце города и печь-гриль Хоспер на древесных углях')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_IO, delay: 0.6 }} className="mt-6 flex gap-2.5 lg:mt-9">
            <a href="#menu" className="button-control inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-crimson px-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-crimson-d lg:h-14 lg:flex-none lg:px-7 lg:text-base"><span className="button-label">Меню</span><Icon n="arrow" s={17} /></a>
            <BookBtn />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
          className="absolute inset-x-4 bottom-5 flex items-center gap-x-4 gap-y-1 border-t border-white/25 pt-3.5 text-sm font-semibold text-white lg:inset-x-10 lg:bottom-7 lg:gap-6 lg:pt-5 lg:pr-16 lg:text-sm">
          <span className="inline-flex items-center gap-2 whitespace-nowrap"><i className={`size-2 rounded-full ${st.open ? 'bg-positive shadow-[0_0_0_4px_rgba(91,210,122,.25)]' : 'bg-warning'}`} />{st.text}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon n="star" s={14} className="text-star-on-dark" /><b>5,0</b><span className="opacity-80">на{NB}Яндексе<span className="hidden lg:inline"> · более 5{NB}600 оценок</span></span></span>
          <span className="ml-auto hidden lg:inline">Советская, 36</span>
        </motion.div>
      </div>
    </section>
  )
}
function BookBtn() {
  const { open } = useStore()
  return <button type="button" onClick={() => open({ kind: 'book' })} className="button-control inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-white ring-1 ring-white/60 ring-inset transition-colors duration-300 hover:bg-white/10 lg:h-14 lg:flex-none lg:px-7 lg:text-base"><Icon n="cal" s={18} /><span className="button-label lg:hidden">Забронировать</span><span className="hidden lg:inline"><span className="button-label">Забронировать стол</span></span></button>
}

/* ---------- предложение перед меню ---------- */
const OFFERS = [
  { amount: '−20', unit: '%', note: 'на основное меню с собой', title: 'Любимые блюда — с собой', text: 'Выбирайте в меню и забирайте заказ на Советской, 36', fine: 'Условия и исключения уточнит администратор', action: 'Выбрать блюда', href: '#menu' },
  { amount: '12:00', unit: '', note: 'завтраки до полудня', title: 'Завтрак в центре Гомеля', text: 'Сырники и налистники — каждый день с самого утра', fine: 'В будни с 9:00, в выходные с 10:00', action: 'Выбрать завтрак', href: '#cat-breakfast' },
  { amount: '12–15', unit: '', note: 'обеды по будням', title: 'Обеденный перерыв в «Фасоли»', text: 'Суп дня и горячие блюда для спокойного перерыва в центре города', fine: 'Понедельник — пятница, с 12:00 до 15:00', action: 'Выбрать обед', href: '#cat-lunch' },
  { amount: 'Вместе', unit: '', note: 'в команде «Фасоли»', title: 'Хотите работать у нас?', text: 'Будем рады познакомиться с теми, кто любит гостей и своё дело', fine: 'Расскажем об открытых позициях и условиях', action: 'Связаться', href: 'tel:+375447903333' },
  { amount: 'Ваше', unit: '', note: 'мнение важно', title: 'Были у нас? Поделитесь впечатлениями', text: 'Расскажите, что понравилось и что мы можем сделать лучше', fine: 'Демонстрация формы — отзыв никуда не отправляется', action: 'Оставить отзыв', href: '#review-form' },
] as const

export function Offers() {
  const { open } = useStore()
  const { ref, index, paused, focused, reduce, setPaused, prev, next, bind } = useCarousel(OFFERS.length, 9000)
  const offer = OFFERS[index]
  return (
    <section ref={ref} {...bind} id="offers" aria-label="Предложения ресторана" aria-roledescription="карусель" className="mx-auto max-w-page px-4 pt-8 lg:px-10 lg:pt-12">
      <div className="relative grid items-center gap-5 rounded-2xl bg-crimson-d px-6 py-6 text-white md:grid-cols-[190px_minmax(0,1fr)_200px] lg:grid-cols-[220px_minmax(0,1fr)_220px] md:gap-8 lg:px-10 lg:py-8">
        <span aria-label={`Предложение ${index + 1} из ${OFFERS.length}`} className="absolute top-6 right-6 text-[11px] leading-4 tabular-nums text-white/70 lg:hidden">{index + 1} / {OFFERS.length}</span>
        <div className="grid min-w-0 pr-10 md:border-r md:border-white/20 md:pr-6" aria-live={paused || focused ? 'polite' : 'off'}>
          {OFFERS.map((item, i) => <motion.div key={item.title} aria-hidden={i !== index} className="col-start-1 row-start-1" animate={{ opacity: i === index ? 1 : 0 }} initial={false} transition={{ duration: reduce ? 0 : .2, delay: !reduce && i === index ? .2 : 0 }}>
            <p className="whitespace-nowrap font-serif text-4xl leading-none tracking-[-.04em] md:text-5xl">{item.amount}<span className="ml-1 text-2xl">{item.unit}</span></p>
            <p className="mt-2 text-sm text-white/80">{item.note}</p>
          </motion.div>)}
        </div>
        <div className="grid min-w-0" aria-live={paused || focused ? 'polite' : 'off'}>
          {OFFERS.map((item, i) => <motion.div key={item.title} aria-hidden={i !== index} className="col-start-1 row-start-1" animate={{ opacity: i === index ? 1 : 0 }} initial={false} transition={{ duration: reduce ? 0 : .2, delay: !reduce && i === index ? .2 : 0 }}>
            <h2 className="font-serif text-xl font-medium md:text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm leading-[1.5] text-white/80">{item.text}</p>
            <p className="mt-3 hidden text-xs leading-[1.4] text-white/75 md:block">{item.fine}</p>
          </motion.div>)}
        </div>
        <div>
          <a href={offer.href} onClick={e => { if (offer.href === '#review-form') { e.preventDefault(); open({ kind: 'review' }) } }} className="button-control h-12 w-full gap-3 rounded-full bg-white px-6 text-sm font-semibold text-crimson-d hover:bg-white/85"><span className="button-label">{offer.action}</span><Icon n="arrow" s={18} /></a>
          <div className="mt-2 hidden items-center gap-0 lg:flex lg:justify-center">
            <span className="mr-3 shrink-0 whitespace-nowrap text-xs tabular-nums text-white/75">{index + 1} / {OFFERS.length}</span>
            <button type="button" aria-label="Предыдущее предложение" onClick={prev} className="carousel-control text-white/80 hover:bg-white/10 hover:text-white"><Icon n="back" s={16} w={1.5} /></button>
            <button type="button" aria-label={paused ? 'Включить смену предложений' : 'Остановить смену предложений'} aria-pressed={paused} onClick={() => setPaused(v => !v)} className="carousel-control text-white/80 hover:bg-white/10 hover:text-white"><Icon n={paused ? 'play' : 'pause'} s={15} w={1.4} /></button>
            <button type="button" aria-label="Следующее предложение" onClick={next} className="carousel-control text-white/80 hover:bg-white/10 hover:text-white"><Icon n="arrow" s={16} w={1.5} /></button>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => setPaused(v => !v)} className="sr-only focus:not-sr-only lg:hidden">{paused ? 'Включить смену предложений' : 'Остановить смену предложений'}</button>
    </section>
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
        {d.tag && <span className="absolute top-2 left-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[9px] leading-4 font-medium tracking-[.08em] text-ink/80 uppercase lg:top-3 lg:left-3 lg:px-2.5 lg:py-1 lg:text-[11px]">{d.tag}</span>}
        {d.stop && <span className="absolute bottom-2 left-2 z-10 rounded-full bg-white/95 px-2 py-0.5 text-[10px] leading-4 text-mute lg:bottom-3 lg:left-3 lg:text-xs">Сегодня нет</span>}
        {d.full
          ? <img ref={imgRef} src={d.img} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover ${d.stop ? 'opacity-50 grayscale' : ''}`} />
          : <img ref={imgRef} src={d.img} alt="" loading="lazy" className={`plate-img w-[86%] ${d.stop ? 'opacity-45 grayscale' : ''}`} />}
      </button>
      <div className="flex flex-1 flex-col pt-3 lg:pt-4">
        <button type="button" onClick={() => open({ kind: 'dish', id })} className="text-left">
          <h3 className="line-clamp-2 min-h-[2.5em] text-sm leading-[1.25] font-medium lg:text-base">{nb(d.name)}</h3>
          <span className="mt-1 block text-xs text-mute">{d.per100 ? 'цена за 100 г' : d.weight}</span>
        </button>
        <div className="mt-auto flex min-h-11 flex-nowrap items-center justify-between gap-1.5 pt-2">
          <Price v={d.price} className={`shrink-0 whitespace-nowrap text-sm font-semibold lg:text-base ${d.stop ? 'text-mute' : ''}`} />
          {d.stop ? null
            : q ? <motion.div className="shrink-0 overflow-visible rounded-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3, ease: EASE_IO }}><Stepper q={q} onDec={() => changeById(id, -1)} onInc={() => changeById(id, 1)} label={d.name} size="compact" /></motion.div>
              : <button type="button" onClick={plus} aria-label={`Добавить: ${d.name}`} className="relative grid size-9 shrink-0 place-items-center rounded-full after:absolute after:-inset-1 after:content-[''] text-ink ring-1 ring-ink/20 ring-inset transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(.45,0,.2,1)] hover:bg-crimson hover:text-white hover:ring-crimson"><Icon n="plus" s={16} w={2} /></button>}
        </div>
      </div>
    </article>
  )
}

export function Menu() {
  const [active, setActive] = useState(CATS[0].id)
  const [q, setQ] = useState('')
  const [search, setSearch] = useState(false)
  const [tools, setTools] = useState(DEFAULT_MENU_TOOLS)
  const jumping = useRef(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((es) => { if (jumping.current) return; es.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(4))) }, { rootMargin: '-30% 0px -65% 0px' })
    const top = () => { const f = document.getElementById('cat-' + CATS[0].id); if (f && f.getBoundingClientRect().top > window.innerHeight * 0.35 && !jumping.current) setActive(CATS[0].id) }
    window.addEventListener('scroll', top, { passive: true })
    CATS.forEach((c) => { const el = document.getElementById('cat-' + c.id); if (el) io.observe(el) })
    return () => { io.disconnect(); window.removeEventListener('scroll', top) }
  }, [q, tools])
  useEffect(() => {
    const b = bar.current, el = b?.querySelector<HTMLElement>(`[data-c="${active}"]`)
    if (b && el) b.scrollTo({ left: el.offsetLeft - b.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  const go = (id: string) => {
    setTools(DEFAULT_MENU_TOOLS); setQ(''); setActive(id); jumping.current = true
    requestAnimationFrame(() => { const el = document.getElementById('cat-' + id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 196 : 180), behavior: 'smooth' }) })
    setTimeout(() => { jumping.current = false }, 900)
  }
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
  const searchResults = q.trim().length > 1 ? Object.values(DISH).filter((d) => {
    const hay = norm(d.name + ' ' + d.desc + (CATS.find((c) => c.items.includes(d.id))?.id === 'grill' ? ' хоспер гриль стейк' : ''))
    return norm(q).split(/\s+/).every((w) => hay.includes(w) || (w.length > 3 && hay.split(/\s+/).some((t) => lev(w, t.slice(0, w.length)) <= 1)))
  }) : null
  const invalidRange = tools.from !== '' && tools.to !== '' && Number(tools.from) > Number(tools.to)
  const matchesFilter = (d: (typeof DISH)[string]) => !invalidRange
    && (!tools.vegetarian || d.vegetarian)
    && (tools.from === '' || d.price >= Number(tools.from)) && (tools.to === '' || d.price <= Number(tools.to))
    && (tools.category === 'all' || CATS.find(c => c.id === tools.category)?.items.includes(d.id))
    && (!tools.available || !d.stop)
  const found = searchResults || hasMenuFilters(tools) || tools.sort !== 'recommended'
    ? (searchResults ?? Object.values(DISH)).filter(matchesFilter).sort((a, b) => tools.sort === 'price-asc' ? a.price - b.price : tools.sort === 'price-desc' ? b.price - a.price : tools.sort === 'name' ? a.name.localeCompare(b.name, 'ru') : 0)
    : null


  return (
    <section id="menu" className="mt-12 lg:mt-28" aria-label="Меню">
      <div className="mx-auto max-w-page px-4 lg:px-10">
        <Reveal><div className="text-xs font-semibold tracking-[.2em] text-crimson uppercase">Меню</div>
          <h2 className="mt-3 font-serif text-4xl leading-[1.04] font-medium tracking-[-.02em] lg:text-6xl">Меню и заказ с{NB}собой</h2>
          <p className="mt-3 max-w-[560px] text-sm text-ink2 lg:text-lg">{nb('Выбирайте блюда для визита или соберите заказ с собой. Самовывоз — после подтверждения по телефону, оплата в ресторане')}</p>
          <p className="mt-3 text-sm text-ink2">Нужна доставка? <a href={DELIVERY_URL} target="_blank" rel="noopener noreferrer" className="inline-block min-h-8 font-semibold text-crimson underline decoration-crimson/30 underline-offset-4">Заказать в Яндекс Еде</a></p></Reveal>
      </div>
      <div className="menu-bar sticky top-0 z-30 mt-6 border-b border-line bg-porc">
        <div className="mx-auto flex h-14 max-w-page items-center gap-2 px-4 lg:px-10">
          <AnimatePresence mode="wait" initial={false}>{search ? (
            <motion.label key="search" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: .2, ease: EASE_IO }} className="flex h-11 w-full items-center gap-2 rounded-full bg-white px-4 text-mute shadow-[inset_0_0_0_1px_var(--color-line)]">
              <Icon n="search" s={18} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Например, лосось" aria-label="Поиск по меню" className="min-w-0 flex-1 bg-transparent text-base font-semibold text-ink outline-none" />
              <button type="button" onClick={() => { setSearch(false); setQ('') }} aria-label="Закрыть поиск" className="grid size-8 place-items-center rounded-full bg-porc text-ink"><Icon n="close" s={16} /></button>
            </motion.label>
          ) : <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2, ease: EASE_IO }} className="flex min-w-0 flex-1 items-center gap-2">
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
          </motion.div>}</AnimatePresence>
        </div>
        <MenuTools value={tools} onChange={setTools} />
      </div>
      <div className="mx-auto grid max-w-page gap-8 px-4 lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-10">
        <div>
          {found ? (
            <div className="pt-6">
              <p className="mb-4 text-sm font-semibold text-ink2" aria-live="polite">{found.length ? `Нашли ${dishes(found.length)}` : 'Нет блюд по этим условиям. Измените фильтр или поисковый запрос'}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-12">{found.map((d, i) => <DishCard key={d.id} id={d.id} i={i} />)}</div>
            </div>
          ) : CATS.map((c) => (
            <div key={c.id} id={'cat-' + c.id} className="pt-12 lg:pt-20">
              <div className="mb-4 flex items-baseline gap-3 lg:mb-6"><h3 className="font-serif text-2xl font-medium tracking-[-.015em] lg:text-4xl">{c.name}</h3>{c.note && <span className="text-sm font-bold text-mute">{c.note}</span>}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-12">{c.items.map((id, i) => <DishCard key={id} id={id} i={i} />)}</div>
            </div>
          ))}
        </div>
        <CartPanelSlot filtered={!!found} />
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
function CartPanelSlot({ filtered }: { filtered: boolean }) { return <div className={`hidden lg:block ${filtered ? 'pt-[60px]' : 'pt-36'}`}><div className="sticky top-[200px]"><CartPanel /></div></div> }

/* ---------- о ресторане и подвал ---------- */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto mt-12 max-w-page px-4 lg:mt-32 lg:px-10">
      <div className="grid items-center gap-7 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <div id="location" className="order-last flex min-w-0 flex-col overflow-hidden rounded-2xl bg-plate lg:order-first lg:self-stretch">
          <iframe src="https://yandex.by/map-widget/v1/?ol=biz&oid=1326321013&z=16" title="Фасоль на карте — Гомель, Советская, 36" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="min-h-[300px] w-full flex-1 border-0 lg:min-h-[490px]" />
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="button-control flex min-h-12 items-center justify-between px-5 text-sm font-semibold text-crimson hover:bg-plate-hover"><span className="button-label">Открыть в Яндекс Картах</span><Icon n="arrow" s={17} /></a>
        </div>
        <div>
          <h2 id="about-title" className="max-w-[420px] font-serif text-3xl font-medium tracking-[-.02em] lg:text-4xl">В центре города,<br />в кругу близких</h2>
          <p className="mt-4 max-w-[430px] text-base leading-[1.5] text-ink2">Два этажа, летняя терраса и кухня на углях Хоспера. Завтраки, обеды и неспешные ужины на Советской, 36</p>
          <dl className="mt-6 grid gap-5 border-t border-line pt-5 grid-cols-2">
            <div><Icon n="teddy" s={28} w={1.35} className="mb-3 text-crimson" /><dt className="text-sm font-semibold">С детьми</dt><dd className="mt-1.5 max-w-[230px] text-sm leading-[1.5] text-ink2">Детский уголок для игр</dd></div>
            <div><Icon n="clef" s={28} w={1.35} className="mb-3 text-crimson" /><dt className="text-sm font-semibold">С любимой музыкой</dt><dd className="mt-1.5 max-w-[230px] text-sm leading-[1.5] text-ink2">Записи концертов на большом экране проектора</dd></div>
          </dl>
          <div className="mt-6 border-t border-line pt-5">
            <h3 className="font-serif text-2xl font-medium">Заглядывайте в гости</h3>
            <p className="mt-3 text-base font-semibold">Гомель, Советская, 36</p>
            <p className="mt-1 text-sm text-ink2">В центре города, рядом с цирком</p>
            <p className="mt-3 text-sm leading-[1.5] text-ink2">Пн–пт 9:00–23:00<br />Сб–вс 10:00–23:00</p>
            <div className="mt-4 flex flex-nowrap gap-2 lg:gap-3">
              <a href={ROUTE_URL} target="_blank" rel="noopener noreferrer" className="button-control relative inline-flex h-10 min-h-10 after:absolute after:inset-x-0 after:-inset-y-0.5 lg:h-11 lg:min-h-11 items-center justify-center gap-1.5 rounded-full bg-crimson px-3 text-[12px] font-semibold whitespace-nowrap text-white hover:bg-crimson-d sm:px-4 sm:text-sm lg:gap-2 lg:px-5"><Icon n="nav" s={17} /><span className="button-label">Построить маршрут</span></a>
              <a href="tel:+375447903333" className="button-control relative inline-flex flex-1 lg:flex-none h-10 min-h-10 after:absolute after:inset-x-0 after:-inset-y-0.5 lg:h-11 lg:min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-semibold whitespace-nowrap ring-1 ring-ink/15 ring-inset hover:bg-plate sm:px-4 sm:text-sm lg:gap-2 lg:px-5"><Icon n="phone" s={17} /><span className="button-label">Позвонить</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const GUEST_REVIEWS = [
  { text: 'Лазанья напоминала настоящую итальянскую, с насыщенным вкусом и идеальной текстурой', author: 'Юля К', date: '19 мая' },
  { text: 'Нам спокойно нашли столик', author: 'Даша Дем', date: '11 августа' },
  { text: 'Очень приятный интерьер', author: 'Ольга Раутенко', date: '29 июля' },
  { text: 'Ресторан поразил и интерьером и вкусной разнообразной едой', author: 'Дмитрий Жогов', date: '19 мая' },
  { text: 'Все заказанные блюда очень понравились', author: 'Павел Татур', date: '15 июня' },
] as const

export function Reviews() {
  const { open } = useStore()
  const { ref, index, paused, focused, reduce, setPaused, prev, next, bind } = useCarousel(GUEST_REVIEWS.length)
  const review = GUEST_REVIEWS[index]
  return (
    <section ref={ref} id="reviews" aria-label="Отзывы гостей" aria-roledescription="карусель" className="mx-auto mt-12 max-w-page px-4 lg:mt-20 lg:px-10"
      {...bind}>
      <div className="grid gap-5 border-y border-line py-6 lg:grid-cols-[240px_1fr] lg:gap-12 lg:py-7">
        <div>
          <div className="flex items-center justify-between gap-4"><h2 className="text-sm font-semibold">Гости о Фасоли</h2><span aria-label={`Отзыв ${index + 1} из ${GUEST_REVIEWS.length}`} className="shrink-0 whitespace-nowrap text-[11px] leading-4 tabular-nums text-mute lg:hidden">{index + 1} / {GUEST_REVIEWS.length}</span></div>
          <div className="mt-2 flex items-center gap-3"><b className="font-serif text-4xl font-medium">5,0</b><span className="flex text-star" aria-label="5 звёзд">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} n="star" s={15} />)}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4"><a href={MAP_URL + 'reviews/'} target="_blank" rel="noopener noreferrer" className="button-control inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-crimson hover:text-crimson-d lg:text-sm"><span className="button-label">Отзывы на Яндексе</span><Icon n="arrow" s={16} /></a><button type="button" onClick={() => open({ kind: 'review' })} className="button-control min-h-11 text-[13px] font-medium text-crimson hover:text-crimson-d lg:text-sm"><span className="button-label">Оставить отзыв</span></button></div>
        </div>
        <div className="flex min-w-0 flex-col justify-between lg:flex-row lg:items-center lg:gap-6">
          <div aria-live={focused || paused ? 'polite' : 'off'} aria-atomic="true" className="lg:flex-1">
            <AnimatePresence mode="wait" initial={false}><motion.figure key={index} initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .3 }}>
              <blockquote className="font-serif text-lg leading-[1.35] lg:text-xl lg:leading-[1.35]">«{review.text}»</blockquote>
              <figcaption className="mt-2 text-xs text-mute">{review.author} · {review.date} · фрагмент отзыва</figcaption>
            </motion.figure></AnimatePresence>
          </div>
          <div className="mt-3 hidden items-center gap-2 lg:mt-0 lg:flex lg:shrink-0">
            <span className="mr-auto shrink-0 whitespace-nowrap text-xs tabular-nums text-mute lg:hidden">{index + 1} / {GUEST_REVIEWS.length}</span>
            <button type="button" aria-label="Предыдущий отзыв" onClick={prev} className="carousel-control"><Icon n="back" s={16} w={1.5} /></button>
            <button type="button" aria-label={paused ? 'Включить смену отзывов' : 'Остановить смену отзывов'} aria-pressed={paused} onClick={() => setPaused((v) => !v)} className="carousel-control text-crimson"><Icon n={paused ? 'play' : 'pause'} s={15} w={1.4} /></button>
            <button type="button" aria-label="Следующий отзыв" onClick={next} className="carousel-control"><Icon n="arrow" s={17} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  ['Как забронировать стол?', 'Нажмите «Забронировать» и оставьте дату, время, число гостей и телефон. Администратор перезвонит и подтвердит стол. Если стол нужен в ближайшее время, позвоните +375 44 790-33-33'],
  ['Как заказать с собой?', 'Выберите блюда в меню, добавьте их в заказ и укажите телефон. Время готовности и итоговую стоимость подтвердит администратор. Забрать заказ можно на Советской, 36, оплата — в ресторане'],
  ['Есть ли доставка?', 'Доставку оформляют отдельно через Яндекс Еду. Адрес, стоимость и доступное время доставки покажет сервис. На этом сайте собирается заказ для самовывоза'],
  ['Во сколько завтраки и обеды?', 'Завтраки — до 12:00: в будни с 9:00, в выходные с 10:00. Обеденное меню — по будням с 12:00 до 15:00'],
  ['Можно прийти с детьми?', 'Да, для маленьких гостей есть детский уголок для игр'],
] as const

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto mt-12 max-w-page px-4 lg:mt-28 lg:px-10">
      <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:gap-12">
        <h2 id="faq-title" className="font-serif text-3xl font-medium tracking-[-.02em] lg:text-4xl">Перед визитом</h2>
        <div className="border-t border-line">
          {FAQ_ITEMS.map(([q, a]) => <details key={q} name="fasol-faq" className="faq-item group border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden">{q}<Icon n="plus" s={18} className="text-crimson transition-transform group-open:rotate-45" /></summary>
            <p className="max-w-[620px] pb-5 pr-6 text-sm leading-relaxed text-ink2">{nb(a)}</p>
          </details>)}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { open } = useStore()
  return (
    <footer id="contacts" className="mt-12 bg-ink pt-12 pb-[calc(140px+env(safe-area-inset-bottom))] text-white lg:mt-20 lg:pb-12">
      <div className="mx-auto max-w-page px-4 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><Logo className="h-14 w-auto lg:h-16" /><p className="mt-4 max-w-[320px] text-sm text-white/70">Ресторан международной кухни в сердце Гомеля</p></div>
          <div className="flex gap-2.5"><BookBtnLight /></div>
        </div>
        <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Адрес</h3><a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 block py-1 text-base font-semibold">Советская, 36<br /><span className="font-medium text-white/75">Гомель, центр</span></a><a href={ROUTE_URL} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-sm text-white/75 underline underline-offset-4">Как добраться</a></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Часы</h3><p className="mt-3 text-base font-semibold">Пн–пт 9:00–23:00<br />Сб–вс 10:00–23:00<br /><span className="font-medium text-white/75">Бизнес-ланч пн–пт 12–15</span></p></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Телефоны</h3><p className="mt-3 text-base font-semibold"><a href="tel:+375447903333">+375 44 790-33-33</a><br /><a href="tel:+375232221468" className="font-medium text-white/75">+375 232 22-14-68</a></p></div>
          <div><h3 className="text-xs font-extrabold tracking-[.16em] text-white/55 uppercase">Гостям</h3>
            <div className="mt-1 flex flex-col items-start text-base font-semibold [&>*]:py-2">
              <a href="#menu" className="hover:text-white/80">Меню и самовывоз</a>
              <a href={DELIVERY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white/80">Доставка через Яндекс Еду</a>
              <a href="https://instagram.com/fasol.gomel" target="_blank" rel="noopener" className="hover:text-white/80">Instagram @fasol.gomel</a>
            </div></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/75 [&>*]:min-h-11 [&>*]:py-3">
          <button type="button" onClick={() => open({ kind: 'info', topic: 'details' })}>Реквизиты</button>
          <button type="button" onClick={() => open({ kind: 'info', topic: 'terms' })}>Заказ и самовывоз</button>
          <button type="button" onClick={() => open({ kind: 'info', topic: 'demo' })}>О демо и данных</button>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-white/60">
          <span>© Фасоль, ООО «Орион Холл»</span><span className="w-full lg:ml-auto lg:w-auto">Сайт — Елена Саманчук</span>
          <span className="w-full text-xs text-white/70">Демо-версия: цены, вес и КБЖУ — примеры, заказы и брони никуда не отправляются</span>
        </div>
      </div>
    </footer>
  )
}
function BookBtnLight() {
  const { open } = useStore()
  return <button type="button" onClick={() => open({ kind: 'book' })} className="button-control inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-crimson transition-colors duration-300 hover:bg-porc lg:h-12 lg:px-6 lg:text-sm"><Icon n="cal" s={16} /><span className="button-label">Забронировать стол</span></button>
}
