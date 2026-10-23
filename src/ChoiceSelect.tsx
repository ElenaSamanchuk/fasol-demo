import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Drawer } from 'vaul'
import { Icon } from './icons'
import { EASE_IO, useDesktop } from './ui'

type Option = { value: string; label: string }
export function ChoiceSelect({ value, options, onChange, label, className = '' }: { value: string; options: Option[]; onChange: (v: string) => void; label: string; className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0, width: 240 })
  const desk = useDesktop()
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const id = useId()
  const change = (next: string) => { onChange(next); setExpanded(false); trigger.current?.focus() }
  const show = () => {
    if (desk && trigger.current) {
      const r = trigger.current.getBoundingClientRect(), width = Math.min(innerWidth - 16, Math.max(220, r.width)), height = Math.min(300, options.length * 44 + 16)
      setPosition({ width, left: Math.min(innerWidth - width - 8, Math.max(8, r.left)), top: r.bottom + height + 6 > innerHeight ? Math.max(8, r.top - height - 6) : r.bottom + 6 })
    }
    setExpanded(v => !v)
  }
  useEffect(() => {
    if (!expanded || !desk) return
    list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus()
    const outside = (e: PointerEvent) => { if (!list.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) setExpanded(false) }
    const scrolled = (e: Event) => { if (!list.current?.contains(e.target as Node)) setExpanded(false) }
    document.addEventListener('pointerdown', outside)
    window.addEventListener('scroll', scrolled, true)
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('scroll', scrolled, true) }
  }, [expanded, desk])
  const choices = <div ref={list} id={id} role="listbox" aria-label={label} onKeyDown={e => {
    const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]')]
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') { e.preventDefault(); setExpanded(false); trigger.current?.focus() }
    if (e.key === 'Tab' && desk) setExpanded(false)
    if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (current + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length; buttons[next]?.focus() }
  }} className="max-h-[min(55svh,340px)] overflow-y-auto overscroll-contain p-2">
    {options.map(o => <button key={o.value} type="button" role="option" aria-selected={o.value === value} onClick={() => change(o.value)} className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm ${o.value === value ? 'bg-crimson-50 font-semibold text-crimson' : 'text-ink hover:bg-porc'}`}><span>{o.label}</span>{o.value === value && <Icon n="check" s={16} w={1.6} />}</button>)}
  </div>
  return <>
    <button ref={trigger} type="button" aria-label={label} aria-haspopup="listbox" aria-expanded={expanded} aria-controls={expanded ? id : undefined} onClick={show} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); if (!expanded) show() } }} className={`flex min-w-0 items-center justify-between gap-3 text-left ${className}`}><span className="min-w-0 truncate">{options.find(o => o.value === value)?.label ?? 'Выбрать'}</span><Icon n="down" s={15} w={1.5} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} /></button>
    {desk ? createPortal(<AnimatePresence>{expanded && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .2, ease: EASE_IO }} style={position} className="fixed z-[70] rounded-xl bg-white shadow-lg ring-1 ring-line">{choices}</motion.div>}</AnimatePresence>, document.body) : <Drawer.Root open={expanded} onOpenChange={setExpanded} repositionInputs={false}><Drawer.Portal><Drawer.Overlay className="fixed inset-0 z-[60] bg-ink/35" /><Drawer.Content aria-describedby={undefined} className="fixed inset-x-0 bottom-0 z-[60] rounded-t-sheet bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] outline-none"><div className="mx-auto mt-2 h-1 w-9 rounded-full bg-line" /><div className="flex items-center justify-between px-3 pt-5 pb-2"><Drawer.Title className="font-serif text-2xl">{label}</Drawer.Title><Drawer.Close aria-label="Закрыть список" className="grid size-9 place-items-center rounded-full hover:bg-plate"><Icon n="close" s={17} w={1.5} /></Drawer.Close></div>{choices}</Drawer.Content></Drawer.Portal></Drawer.Root>}
  </>
}
