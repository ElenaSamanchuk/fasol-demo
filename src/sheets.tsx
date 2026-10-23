import { Drawer } from 'vaul'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ADDS, ADDS_BY, CAT_OF, DISH, PAIRS, dishes, kbju, minsk, money, nb, NB, plural } from './data'
import { Icon } from './icons'
import { lineUnit, useStore, type InfoTopic } from './store'
import { Chip, EASE, Label, PhoneField, Price, Stepper, telMask, useDesktop } from './ui'

/* Шторка на телефоне (vaul, тянется пальцем) и окно по центру на компьютере */
function Sheet({ open, onClose, title, children, footer, wide, side }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean; side?: boolean }) {
  const desk = useDesktop()
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!desk || !open) return
    const previous = document.activeElement as HTMLElement | null
    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') ?? []).filter((el) => el.getClientRects().length > 0)
    focusable()[0]?.focus({ preventScroll: true })
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const items = focusable(), first = items[0], last = items[items.length - 1]
      if (!first) { e.preventDefault(); return }
      if (!dialog.current?.contains(document.activeElement) || (e.shiftKey && document.activeElement === first)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', k)
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [desk, open, onClose])

  if (!desk) {
    return (
      <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()} repositionInputs={false}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50" />
          <Drawer.Content aria-describedby={undefined} className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-sheet bg-white outline-none">
            <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-ink/15" aria-hidden />
            <Drawer.Title className="sr-only">{title}</Drawer.Title>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-5"
              onFocus={(e) => { const t = e.target as HTMLElement; if (t.tagName === 'INPUT') setTimeout(() => t.scrollIntoView({ block: 'center', behavior: 'smooth' }), 350) }}>{children}</div>
            {footer && <div className="shrink-0 border-t border-line bg-white px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]">{footer}</div>}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }
  if (side) {
    return (
      <AnimatePresence>
        {open && (
          <div ref={dialog} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
            <motion.div className="absolute inset-0 bg-[rgb(20_12_10/.36)]" onClick={onClose}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.45, 0, 0.2, 1] }} />
            <motion.div className="absolute inset-y-0 right-0 flex w-[460px] flex-col bg-white shadow-[-24px_0_60px_-30px_rgba(31,23,21,.35)]"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.45, ease: [0.45, 0, 0.2, 1] }}>
              <div className="flex-1 overflow-y-auto overscroll-contain px-7 pt-6 pb-6">{children}</div>
              {footer && <div className="shrink-0 border-t border-line bg-white px-7 py-5">{footer}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
  return (
    <AnimatePresence>
      {open && (
        <div ref={dialog} className="fixed inset-0 z-50 grid place-items-center p-6" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-[rgb(20_12_10/.42)] backdrop-blur-[3px]" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          <motion.div className={`relative flex max-h-[min(860px,calc(100svh-48px))] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg ${wide ? 'max-w-[920px]' : 'max-w-[520px]'}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.45, 0, 0.2, 1] }}>
            <div className="flex-1 overflow-y-auto overscroll-contain p-6">{children}</div>
            {footer && <div className="shrink-0 border-t border-line bg-white px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function CloseBtn({ onClick, light }: { onClick: () => void; light?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-label="Закрыть" className={`relative grid size-10 shrink-0 place-items-center rounded-full after:absolute after:-inset-0.5 after:content-[''] transition-colors duration-300 ${light ? 'bg-white/90 shadow-[0_2px_10px_rgba(31,23,21,.12)] hover:bg-white' : 'bg-plate hover:bg-plate-hover'}`}>
      <Icon n="close" s={16} w={2.2} />
    </button>
  )
}

function DishPic({ id, big }: { id: string; big?: boolean }) {
  const d = DISH[id]
  return d.full
    ? <img src={d.img} alt="" className="absolute inset-0 size-full object-cover" />
    : <img src={d.img} alt="" className={`plate-img relative ${big ? 'w-[90%]' : 'w-[88%]'}`} />
}

/* ---------- блюдо ---------- */
function DishSheet({ id }: { id: string }) {
  const { close, add, open } = useStore()
  const desk = useDesktop()
  const d = DISH[id], cat = CAT_OF[id]
  const [q, setQ] = useState(1)
  const [adds, setAdds] = useState<string[]>([])
  useEffect(() => { setQ(1); setAdds([]) }, [id])
  const k = kbju(d)
  const unit = d.price + adds.reduce((a, x) => a + ADDS[x].price, 0)
  const picRef = useRef<HTMLDivElement>(null)

  const doAdd = () => {
    const img = picRef.current?.querySelector('img')
    add(id, adds, q, img ? { src: d.img, rect: img.getBoundingClientRect() } : undefined)
    close()
  }

  const pic = (
    <div ref={picRef} className={`relative grid place-items-center overflow-hidden rounded-3xl bg-plate ${desk ? 'aspect-square self-start' : 'h-[230px]'}`}>
      {d.tag && <span className="absolute top-3 left-3 z-10 rounded-full bg-crimson px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.08em] text-white">{d.tag}</span>}
      <motion.div className="grid size-full place-items-center" initial={{ scale: 0.86, rotate: -14, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>
        <DishPic id={id} big />
      </motion.div>
      {!desk && <div className="absolute top-3 right-3 z-10"><CloseBtn onClick={close} light /></div>}
    </div>
  )

  const body = (
    <div>
      {desk && <div className="mb-2 flex justify-end"><CloseBtn onClick={close} /></div>}
      <h2 className="font-serif text-2xl leading-[1.15] font-medium tracking-[-.015em]">{nb(d.name)}</h2>
      <div className="mt-2 flex items-baseline gap-3"><Price v={d.price} per100={d.per100} className="text-xl" /><span className="text-sm font-semibold text-mute">{d.per100 ? 'на вес' : d.weight}</span></div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink2">{nb(d.desc)}</p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {[[k.kcal, 'ккал'], [k.p, 'белки'], [k.f, 'жиры'], [k.c, 'углев.']].map(([v, l]) => (
          <div key={l} className="rounded-xl bg-plate py-3 text-center"><b className="block text-lg font-extrabold">{v}</b><span className="text-xs font-semibold text-mute">{l}</span></div>
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold text-mute">КБЖУ на порцию — пример, настоящие цифры возьмём из таблицы меню</p>

      {(ADDS_BY[cat] || []).length > 0 && <>
        <Label>Добавить</Label>
        <div className="flex flex-wrap gap-2">
          {ADDS_BY[cat].map((a) => {
            const on = adds.includes(a)
            return (
              <button key={a} type="button" aria-pressed={on} onClick={() => setAdds(on ? adds.filter((x) => x !== a) : [...adds, a])}
                className="inline-flex h-11 items-center gap-2.5 rounded-full bg-porc pr-4 pl-2.5 text-sm font-bold transition hover:bg-plate">
                <i className={`grid size-6 place-items-center rounded-lg transition ${on ? 'bg-crimson text-white' : 'bg-white text-transparent ring-[1.5px] ring-ink/15 ring-inset'}`}><Icon n="check" s={16} w={2.6} /></i>
                {ADDS[a].name} <em className="font-semibold text-mute not-italic">+{money(ADDS[a].price)}</em>
              </button>
            )
          })}
        </div>
      </>}

      <Label>С этим берут</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(PAIRS[cat] || []).filter((p) => p !== id).map((p) => (
          <button key={p} type="button" onClick={() => open({ kind: 'dish', id: p })} className="group grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl bg-porc p-2 text-left transition hover:bg-plate">
            <span className="relative grid size-14 place-items-center overflow-hidden rounded-xl bg-white"><DishPic id={p} /></span>
            <span><b className="block text-sm leading-tight font-bold">{nb(DISH[p].name)}</b><Price v={DISH[p].price} className="mt-1 block text-sm" /></span>
            <Icon n="chev" s={18} className="mr-1 text-mute" />
          </button>
        ))}
      </div>
    </div>
  )

  const footer = d.stop
    ? <div className="flex h-12 lg:h-14 items-center justify-center rounded-full bg-porc font-bold text-mute">Сегодня закончилось — загляните завтра</div>
    : <div className="flex items-center gap-2.5">
        <Stepper q={q} onDec={() => setQ(Math.max(1, q - 1))} onInc={() => setQ(Math.min(20, q + 1))} light label={d.name} size={desk ? 'lg' : 'md'} />
        <button type="button" onClick={doAdd} className="flex h-12 lg:h-14 min-w-0 flex-1 items-center justify-between gap-3 rounded-full bg-crimson px-5 text-base font-semibold whitespace-nowrap text-white transition-colors duration-300 hover:bg-crimson-d">
          <span className="button-label">Добавить</span><span className="button-label"><Price v={unit * q} /></span>
        </button>
      </div>

  return { pic, body, footer, desk }
}

/* ---------- корзина и имитация заказа ---------- */
function slots() {
  const t = minsk(), now = t.h * 60 + t.m, open = (t.weekend ? 10 : 9) * 60
  const out: string[] = []
  const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
  if (now + 40 > 22 * 60 + 30) {
    const o2 = ((t.wd + 1) % 7 >= 5 ? 10 : 9) * 60
    for (let m = o2 + 30; out.length < 5; m += 30) out.push('Завтра ' + fmt(m))
    return { asap: false, list: out }
  }
  for (let m = Math.ceil(Math.max(now + 50, open + 30) / 30) * 30; m <= 22 * 60 + 30 && out.length < 6; m += 30) out.push(fmt(m))
  return { asap: now >= open, list: out }
}

const STEPS = [
  { t: 'Заказ принят', d: 'Администратор получил заказ' },
  { t: 'Готовим', d: 'Повар уже у плиты и Хоспера' },
  { t: 'Готов к выдаче', d: 'Ждём вас на Советской, 36' },
]

function CartSheet() {
  const { lines, total, takeawayTotal, count, change, clear, close } = useStore()
  const sl = useMemo(slots, [])
  const [slot, setSlot] = useState(sl.asap ? 'Через 40 мин' : sl.list[0])
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [order, setOrder] = useState<null | { n: number; slot: string; count: number; sum: number }>(null)
  const [step, setStep] = useState(0)
  const disc = takeawayTotal

  useEffect(() => {
    if (!order) return
    const a = setTimeout(() => setStep(1), 2200), b = setTimeout(() => setStep(2), 5200)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [order])

  const submit = () => {
    if (!telMask(phone).ok) { setErr('Введите номер полностью — перезвоним, чтобы подтвердить'); setTimeout(() => document.getElementById('tel-err')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50); return }
    setOrder({ n: 1000 + Math.floor(Math.random() * 8999), slot, count, sum: disc }); setStep(0); clear()
  }

  if (order) {
    return {
      body: (
        <div className="pt-2">
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-sm font-semibold text-mute">Заказ №{order.n}</div>
              <h2 className="mt-1.5 font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">{STEPS[step].t}</h2></div>
            <CloseBtn onClick={close} />
          </div>
          <div className="mt-6 grid gap-0">
            {STEPS.map((s, i) => (
              <div key={s.t} className="grid grid-cols-[32px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <motion.span className="grid size-8 place-items-center rounded-full" animate={{ backgroundColor: i <= step ? '#AE163D' : '#F3EFEB', color: i <= step ? '#fff' : '#77706C', scale: i === step ? [1, 1.12, 1] : 1 }} transition={{ duration: 0.5 }}>
                    {i < step ? <Icon n="check" s={16} w={2.6} /> : <b className="text-sm">{i + 1}</b>}
                  </motion.span>
                  {i < 2 && <span className="my-1 w-0.5 flex-1 rounded bg-plate"><motion.span className="block w-full rounded bg-crimson" initial={{ height: 0 }} animate={{ height: i < step ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE }} /></span>}
                </div>
                <div className="pb-6"><b className={`text-base ${i <= step ? 'text-ink' : 'text-mute'}`}>{s.t}</b><p className="text-sm text-mute">{s.d}</p></div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-porc p-4 text-sm">
            <div className="flex justify-between"><span className="text-mute">Заберёте</span><b>{order.slot}</b></div>
            <div className="mt-2 flex justify-between"><span className="text-mute">Состав</span><b>{dishes(order.count)}</b></div>
            <div className="mt-2 flex justify-between"><span className="text-mute">К оплате на месте</span><Price v={order.sum} /></div>
            <div className="mt-2 flex justify-between"><span className="text-mute">Адрес</span><b>Советская, 36</b></div>
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-mute">Демо: заказ никуда не отправлен, статусы показаны для примера</p>
        </div>
      ),
      footer: <a href="tel:+375447903333" className="button-control flex h-12 lg:h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-bold text-white"><Icon n="phone" s={18} /><span className="button-label">Позвонить в ресторан</span></a>,
    }
  }

  if (!lines.length) {
    return {
      body: (
        <div className="py-8 text-center">
          <div className="flex justify-end"><CloseBtn onClick={close} /></div>
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-porc text-crimson"><Icon n="bag" s={32} w={1.8} /></div>
          <h2 className="mt-5 font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">Здесь появится ваш заказ</h2>
          <p className="mx-auto mt-2 max-w-[300px] text-sm text-ink2">{nb('Нажмите «+» у блюда — соберём заказ с собой, оплата на месте')}</p>
        </div>
      ),
      footer: <button type="button" onClick={() => { close(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }) }} className="button-control h-12 lg:h-14 w-full rounded-full bg-crimson text-base font-bold text-white"><span className="button-label">Открыть меню</span></button>,
    }
  }

  return {
    body: (
      <div>
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">Ваш заказ</h2><p className="mt-1 text-sm font-medium text-mute">С собой · {dishes(count)}</p></div>
          <CloseBtn onClick={close} />
        </div>
        <ul className="mt-3">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.li key={l.key} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, x: 40, height: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-3">
                  <span className="relative grid size-12 place-items-center overflow-hidden rounded-2xl bg-plate"><DishPic id={l.id} /></span>
                  <div className="min-w-0"><b className="block text-sm leading-tight font-bold">{nb(DISH[l.id].name)}</b>
                    {l.adds.length > 0 && <span className="mt-0.5 block text-xs font-semibold text-mute">+ {l.adds.map((a) => ADDS[a].name).join(', ')}</span>}
                    <span className="mt-1 block text-sm"><Price v={lineUnit(l)} />{DISH[l.id].per100 && <span className="text-xs font-semibold text-mute"> × 100{NB}г</span>}</span></div>
                  <Stepper q={l.q} onDec={() => change(l.key, -1)} onInc={() => change(l.key, 1)} light label={DISH[l.id].name} size="compact" />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <Label>Когда заберёте</Label>
        {!sl.asap && <p className="mb-2.5 rounded-xl bg-plate px-3.5 py-3 text-sm font-medium text-ink2">{nb('Сейчас закрыто — приготовим к открытию')}</p>}
        <div className="flex flex-wrap gap-2">
          {(sl.asap ? ['Через 40 мин', ...sl.list] : sl.list).map((s) => <Chip key={s} on={slot === s} onClick={() => setSlot(s)}>{s}</Chip>)}
        </div>
        <Label>Имя</Label>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" placeholder="Как к вам обращаться" maxLength={40} className="h-12 w-full rounded-xl bg-white px-4 text-base font-medium outline-none ring-1 ring-inset ring-control-line transition-shadow placeholder:text-mute/70 focus:ring-[1.5px] focus:ring-crimson" />
        <Label>Телефон</Label>
        <PhoneField value={phone} onChange={(v) => { setPhone(v); if (telMask(v).ok) setErr('') }} error={err} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-t border-line pt-5">
          <div><b className="block text-sm font-semibold">К оплате на месте</b><span className="mt-1 block text-xs leading-[1.4] text-mute">−20{NB}% на основное меню · пример</span></div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">{disc < total && <s className="text-xs font-medium leading-none text-mute">{money(total)}</s>}<Price v={disc} className="text-2xl leading-tight [&_small]:ml-1 [&_small]:text-[11px] [&_small]:font-semibold" /></div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mute">Расчёт для демо. Условия скидки и итоговую стоимость подтвердит администратор</p>
      </div>
    ),
    footer: <button type="button" onClick={submit} className="button-control flex h-12 lg:h-14 w-full items-center justify-center gap-2 rounded-full bg-crimson text-base font-bold text-white transition hover:bg-crimson-d active:scale-[.98]"><span className="button-label">Отправить заказ</span><Icon n="arrow" s={18} /></button>,
  }
}

/* ---------- бронь ---------- */
function BookSheet() {
  const { close } = useStore()
  const days = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const x = new Date(Date.now() + i * 864e5)
    return {
      i,
      top: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : x.toLocaleDateString('ru-RU', { weekday: 'short', timeZone: 'Europe/Minsk' }).replace('.', ''),
      sub: x.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', timeZone: 'Europe/Minsk' }).replace('.', ''),
    }
  }), [])
  const [day, setDay] = useState(0)
  const times = useMemo(() => {
    const t = minsk(), wd = (t.wd + day) % 7, start = (wd >= 5 ? 10 : 9) * 60, out: string[] = []
    for (let m = start; m <= 21 * 60 + 30; m += 30) { if (day === 0 && m < t.h * 60 + t.m + 60) continue; out.push(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`) }
    return out
  }, [day])
  const [chosenTime, setTime] = useState('19:00')
  const time = times.includes(chosenTime) ? chosenTime : times.includes('19:00') ? '19:00' : times[0] ?? null
  const [g, setG] = useState(2)
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const gw = plural(g, ['гость', 'гостя', 'гостей'])

  if (done) {
    return {
      body: (
        <div className="py-6 text-center">
          <div className="flex justify-end"><CloseBtn onClick={close} /></div>
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="mx-auto grid size-22 place-items-center rounded-full bg-crimson text-white"><Icon n="check" s={44} w={2.4} /></motion.div>
          <h2 className="mt-5 font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">Заявка на бронь принята</h2>
          <div className="mt-3 inline-block rounded-full bg-porc px-4 py-2 text-sm font-bold">{days[day].top}, {days[day].sub} · {time} · {g}{NB}{gw}</div>
          <p className="mx-auto mt-3 max-w-[320px] text-sm text-ink2">{nb('Администратор перезвонит и подтвердит дату, время и стол')}</p>
          <p className="mt-3 text-xs font-semibold text-mute">Демо: бронь никуда не отправлена</p>
        </div>
      ),
      footer: <button type="button" onClick={close} className="button-control h-12 lg:h-14 w-full rounded-full bg-ink text-base font-bold text-white"><span className="button-label">Готово</span></button>,
    }
  }
  return {
    body: (
      <div>
        <div className="flex items-start justify-between gap-3"><h2 className="font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">Бронь стола</h2><CloseBtn onClick={close} /></div>
        <p className="mt-3 max-w-[340px] text-sm leading-relaxed text-ink2">{nb('Оставьте заявку — администратор перезвонит и подтвердит стол')}</p>
        <Label>Дата</Label>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 no-scrollbar">{days.map((d) => <Chip key={d.i} on={day === d.i} onClick={() => setDay(d.i)} sub={d.sub}>{d.top}</Chip>)}</div>
        <label htmlFor="booking-time" className="mt-5 mb-2 block text-sm font-semibold text-ink">Время</label>
        {times.length ? <div className="relative h-12 rounded-xl bg-white ring-1 ring-control-line ring-inset focus-within:ring-crimson"><select id="booking-time" value={time ?? ''} onChange={(e) => setTime(e.target.value)} className="h-full w-full appearance-none rounded-xl bg-transparent px-4 pr-11 text-base font-medium text-ink outline-none">
          {times.map((t) => <option key={t} value={t}>{t}</option>)}
        </select><Icon n="down" s={17} w={1.5} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-mute" /></div>
          : <p className="rounded-xl bg-plate px-3.5 py-3 text-sm font-medium text-ink2">{nb('На сегодня бронь уже не принимаем — выберите другой день')}</p>}
        <Label>Гостей</Label>
        <div className="flex h-12 items-center justify-between rounded-xl bg-white pr-1 pl-4 text-sm font-semibold ring-1 ring-control-line ring-inset">
          <span>{g}{NB}{gw}</span>
          <Stepper q={g} onDec={() => setG(Math.max(1, g - 1))} onInc={() => setG(Math.min(30, g + 1))} light label="гости" size="compact" />
        </div>
        {g >= 9 && <p className="mt-2.5 rounded-xl bg-plate px-3.5 py-3 text-sm font-medium text-ink2">{nb('Для компании от 9 гостей лучше позвонить: +375 44 790-33-33')}</p>}
        <Label>Телефон</Label>
        <PhoneField value={phone} onChange={(v) => { setPhone(v); if (telMask(v).ok) setErr('') }} error={err} />
        <Label>Пожелания</Label>
        <input placeholder="У окна, детский стул" maxLength={140} aria-label="Пожелания" className="h-12 w-full rounded-xl bg-white px-4 text-base font-medium outline-none ring-1 ring-inset ring-control-line transition-shadow placeholder:text-mute/70 focus:ring-[1.5px] focus:ring-crimson" />
      </div>
    ),
    footer: <div><p className="mb-3 text-center text-xs text-mute">Демо: заявка никуда не отправляется</p><button type="button" disabled={!time} onClick={() => { if (!telMask(phone).ok) { setErr('Введите номер полностью — перезвоним, чтобы подтвердить'); setTimeout(() => document.getElementById('tel-err')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50); return } setDone(true) }}
      className="flex h-12 lg:h-14 w-full items-center justify-center gap-2 rounded-full bg-crimson text-base font-bold text-white transition hover:bg-crimson-d disabled:opacity-40"><Icon n="cal" s={18} /><span className="button-label">Оставить заявку{time ? ` · ${time}` : ''}</span></button></div>,
  }
}

function InfoSheet({ topic }: { topic: InfoTopic }) {
  const { close } = useStore()
  const content = {
    details: { title: 'Реквизиты ресторана', paragraphs: [
      'Общество с ограниченной ответственностью «Орион Холл»',
      'УНП 490858051',
      'Государственная регистрация: Гомельский городской исполнительный комитет, 20.10.2010, свидетельство № 0032623',
      'Юридический и почтовый адрес: Республика Беларусь, г. Гомель, ул. Крестьянская, 16',
      'Ресторан: г. Гомель, ул. Советская, 36',
      'Электронная почта: orionholl@yandex.by',
    ] },
    terms: { title: 'Заказ и самовывоз', paragraphs: [
      'Соберите заказ в меню и укажите телефон. Администратор подтвердит состав, стоимость и время готовности',
      'Забрать заказ можно самостоятельно на Советской, 36. Оплата — в ресторане',
      'Скидка 20 % действует на основное меню навынос. Условия и исключения уточняйте у администратора',
      'Доставку оформляйте отдельно в Яндекс Еде. Стоимость и условия покажет сервис',
      'Этот сайт — демо: цены и расчёты приведены для примера, заказ никуда не отправляется',
    ] },
    demo: { title: 'О демо и данных', paragraphs: [
      'Это демонстрация сайта ресторана. Заказы и заявки на бронь никуда не отправляются',
      'Имя, телефон и пожелания используются только для показа работы формы и исчезают после перезагрузки страницы',
      'Состав корзины сохраняется в этом браузере, чтобы выбранные блюда не пропадали при перезагрузке',
      'Карта загружается с Яндекса. При открытии внешних ссылок действуют правила соответствующих сервисов',
    ] },
  }[topic]
  return {
    body: (
      <div>
        <div className="flex items-start justify-between gap-4"><h2 className="font-serif text-2xl lg:text-3xl leading-tight font-medium tracking-[-.015em]">{content.title}</h2><CloseBtn onClick={close} /></div>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink2">{content.paragraphs.map((p) => <p key={p}>{nb(p)}</p>)}</div>
        {topic === 'details' && <a href="https://fasol.orionhall.by/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block py-3 text-sm font-semibold text-crimson underline underline-offset-4">Сведения на текущем сайте ресторана</a>}
      </div>
    ),
    footer: <button type="button" onClick={close} className="button-control h-12 w-full rounded-full bg-ink text-base font-semibold text-white"><span className="button-label">Понятно</span></button>,
  }
}

function ReviewSheet() {
  const { close } = useStore()
  const [rating, setRating] = useState(0)
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  if (done) return {
    body: <div className="py-8"><h2 className="font-serif text-2xl lg:text-3xl">Спасибо за впечатления</h2><p className="mt-4 text-sm leading-[1.5] text-ink2">Это демонстрация формы — отзыв никуда не отправлен и не влияет на рейтинг Яндекса</p></div>,
    footer: <button type="button" onClick={close} className="button-control h-12 w-full rounded-full bg-crimson text-sm font-semibold text-white hover:bg-crimson-d"><span className="button-label">Готово</span></button>,
  }
  return {
    body: <form id="demo-review" onSubmit={e => { e.preventDefault(); if (!rating) { setError(true); return } setDone(true) }}>
      <div className="flex items-center justify-between gap-4"><h2 className="font-serif text-2xl lg:text-3xl">Ваши впечатления</h2><CloseBtn onClick={close} /></div>
      <p className="mt-3 text-sm leading-[1.5] text-ink2">Расскажите о визите в «Фасоль»</p>
      <fieldset className="mt-6"><legend className="text-sm font-semibold">Ваша оценка</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map(value => <button type="button" key={value} aria-label={`${value} из 5`} aria-pressed={rating === value} onClick={() => { setRating(value); setError(false) }} className={`grid size-11 place-items-center rounded-full hover:bg-plate ${value <= rating ? 'text-star' : 'text-mute'}`}><Icon n="star" s={25} /></button>)}</div>{error && <p role="alert" className="mt-2 text-xs text-crimson">Выберите оценку</p>}</fieldset>
      <label className="mt-5 block text-sm font-semibold" htmlFor="review-name">Ваше имя <span className="font-normal text-mute">· необязательно</span></label>
      <input id="review-name" maxLength={60} placeholder="Как к вам обращаться" className="mt-2 h-12 w-full rounded-xl bg-porc px-4 text-sm outline-none ring-1 ring-line focus:ring-crimson" />
      <label className="mt-5 block text-sm font-semibold" htmlFor="review-text">Отзыв</label>
      <textarea id="review-text" required minLength={10} maxLength={1000} rows={4} placeholder="Что понравилось или что можно улучшить" className="mt-2 w-full resize-none rounded-xl bg-porc p-4 text-sm outline-none ring-1 ring-line focus:ring-crimson" />
      <p className="mt-3 text-xs leading-[1.5] text-mute">Демо: данные не сохраняются и никуда не отправляются</p>
    </form>,
    footer: <button type="submit" form="demo-review" className="button-control h-12 w-full rounded-full bg-crimson text-sm font-semibold text-white hover:bg-crimson-d"><span className="button-label">Отправить отзыв</span></button>,
  }
}

/* ---------- все шторки ---------- */
export function Sheets() {
  const { sheet, close } = useStore()
  const desk = useDesktop()
  // последняя шторка остаётся смонтированной, пока доигрывает анимация закрытия; n — новое состояние на каждое открытие
  const [last, setLast] = useState(sheet)
  const [n, setN] = useState(0)
  useEffect(() => { if (sheet) { setLast(sheet); setN((x) => x + 1) } }, [sheet])
  const s = sheet || last
  const open = !!sheet
  if (s?.kind === 'dish') return <DishWrap key={'d' + s.id + n} id={s.id} open={open} onClose={close} desk={desk} />
  if (s?.kind === 'cart') return <Wrap key={'c' + n} open={open} onClose={close} title="Ваш заказ" use={CartSheet} side />
  if (s?.kind === 'book') return <Wrap key={'b' + n} open={open} onClose={close} title="Бронь стола" use={BookSheet} side />
  if (s?.kind === 'review') return <Wrap key={'r' + n} open={open} onClose={close} title="Оставить отзыв" use={ReviewSheet} />
  if (s?.kind === 'info') return <Wrap key={'i' + s.topic + n} open={open} onClose={close} title="Информация" use={() => InfoSheet({ topic: s.topic })} />
  return null
}

function Wrap({ open, onClose, title, use, side }: { open: boolean; onClose: () => void; title: string; use: () => { body: ReactNode; footer?: ReactNode }; side?: boolean }) {
  const c = use()
  return <Sheet open={open} onClose={onClose} title={title} footer={c.footer} side={side}>{c.body}</Sheet>
}

function DishWrap({ id, open, onClose, desk }: { id: string; open: boolean; onClose: () => void; desk: boolean }) {
  const c = DishSheet({ id })
  if (desk) {
    return (
      <Sheet open={open} onClose={onClose} title={DISH[id].name} wide footer={<div className="ml-auto max-w-[440px]">{c.footer}</div>}>
        <div className="grid grid-cols-[1.05fr_1fr] gap-7">{c.pic}{c.body}</div>
      </Sheet>
    )
  }
  return <Sheet open={open} onClose={onClose} title={DISH[id].name} footer={c.footer}>{c.pic}<div className="mt-4">{c.body}</div></Sheet>
}
