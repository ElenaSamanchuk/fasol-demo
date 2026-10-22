import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from './icons'
import { money, NB } from './data'

export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_IO = [0.45, 0, 0.2, 1] as const

export function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const mq = matchMedia(q), f = () => setM(mq.matches)
    mq.addEventListener('change', f); return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}
export const useDesktop = () => useMedia('(min-width: 1024px)')

// Появление блока один раз при входе в экран: мягкое начало и завершение
export function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} initial={reduce ? { opacity: 0 } : { opacity: 0, y: y / 3 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }} transition={{ duration: 0.7, ease: EASE_IO, delay: delay / 2 }}>
      {children}
    </motion.div>
  )
}

export function Price({ v, per100, className = '' }: { v: number; per100?: boolean; className?: string }) {
  return (
    <span className={'whitespace-nowrap font-bold tabular-nums ' + className}>
      {money(v)}<small className="ml-0.5 text-[0.68em] font-extrabold tracking-wide">BYN</small>
      {per100 && <span className="text-[0.8em] font-semibold text-mute">/{NB}100{NB}г</span>}
    </span>
  )
}

// Число, которое мягко «перекатывается» при изменении
export function Roll({ value, className = '' }: { value: string | number; className?: string }) {
  return (
    <span className={'relative inline-flex overflow-hidden ' + className}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={String(value)} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Stepper({ q, onDec, onInc, light, label, size = 'md' }: { q: number; onDec: () => void; onInc: () => void; light?: boolean; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-14' : size === 'sm' ? 'h-10' : 'h-11'
  const b = size === 'lg' ? 'size-12' : size === 'sm' ? 'size-9' : 'size-10'
  return (
    <span className={`inline-flex items-center rounded-full px-0.5 ${h} ${light ? 'bg-porc text-ink' : 'bg-ink text-white'}`}>
      <button type="button" onClick={(e) => { e.stopPropagation(); onDec() }} aria-label={`Меньше: ${label}`} className={`${b} grid place-items-center rounded-full transition active:scale-90 ${light ? 'hover:bg-ink/8' : 'hover:bg-white/15'}`}><Icon n="minus" s={18} w={2.2} /></button>
      <b className="min-w-5 text-center text-[15px] font-extrabold tabular-nums"><Roll value={q} /></b>
      <button type="button" onClick={(e) => { e.stopPropagation(); onInc() }} aria-label={`Больше: ${label}`} className={`${b} grid place-items-center rounded-full transition active:scale-90 ${light ? 'hover:bg-ink/8' : 'hover:bg-white/15'}`}><Icon n="plus" s={18} w={2.2} /></button>
    </span>
  )
}

export function Chip({ on, children, onClick, sub }: { on?: boolean; children: ReactNode; onClick?: () => void; sub?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!on}
      className={`shrink-0 rounded-full px-4 text-[14px] font-bold transition duration-200 active:scale-95 ${sub ? 'h-14' : 'h-11'} ${on ? 'bg-ink text-white' : 'bg-porc text-ink hover:bg-plate'}`}>
      {children}{sub && <small className="mt-0.5 block text-[11px] font-semibold opacity-70">{sub}</small>}
    </button>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="mt-6 mb-2.5 text-[12px] font-extrabold uppercase tracking-[.1em] text-mute">{children}</div>
}

// Маска +375 (29) 123-45-67: скобки и дефисы появляются только когда есть следующая цифра
export function telMask(v: string) {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('375')) d = d.slice(3); else if (d.startsWith('80')) d = d.slice(2)
  d = d.slice(0, 9)
  let o = d.length ? '+375 (' + d.slice(0, 2) : ''
  if (d.length > 2) o += ') ' + d.slice(2, 5)
  if (d.length > 5) o += '-' + d.slice(5, 7)
  if (d.length > 7) o += '-' + d.slice(7, 9)
  return { v: o, ok: d.length === 9 && /^(25|29|33|44)/.test(d) }
}

export function PhoneField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <>
      <label className="flex h-13 items-center gap-2.5 rounded-2xl bg-porc px-4 text-mute ring-crimson/0 transition focus-within:ring-[1.5px] focus-within:ring-crimson">
        <Icon n="phone" s={18} />
        <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 (29) 123-45-67" value={value}
          onChange={(e) => onChange(telMask(e.target.value).v)} aria-invalid={!!error} aria-describedby="tel-err"
          className="min-w-0 flex-1 bg-transparent text-[16px] font-bold tracking-wide text-ink outline-none placeholder:font-semibold placeholder:text-mute/70" />
      </label>
      <p id="tel-err" role="alert" className="mt-2 min-h-4 text-[13px] font-semibold text-crimson">{error}</p>
    </>
  )
}
