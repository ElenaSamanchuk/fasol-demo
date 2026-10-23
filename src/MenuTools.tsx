import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CATS } from './data'
import { Icon } from './icons'
import { ChoiceSelect } from './ChoiceSelect'
import { EASE_IO } from './ui'

export type MenuToolsValue = { sort: string; from: string; to: string; category: string; vegetarian: boolean; available: boolean }
export const DEFAULT_MENU_TOOLS: MenuToolsValue = { sort: 'recommended', from: '', to: '', category: 'all', vegetarian: false, available: false }
export const hasMenuFilters = (v: MenuToolsValue) => v.from !== '' || v.to !== '' || v.category !== 'all' || v.vegetarian || v.available

export function MenuTools({ value: v, onChange }: { value: MenuToolsValue; onChange: (v: MenuToolsValue) => void }) {
  const [expanded, setExpanded] = useState(false)
  const patch = (p: Partial<MenuToolsValue>) => onChange({ ...v, ...p })
  const active = hasMenuFilters(v)
  const invalid = v.from !== '' && v.to !== '' && Number(v.from) > Number(v.to)
  return <div className="mx-auto max-w-page px-4 pb-2 lg:px-10">
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Настройки меню">
      <button type="button" aria-expanded={expanded} aria-controls="menu-filters" onClick={() => setExpanded(x => !x)} className={`button-control min-h-10 gap-1.5 rounded-xl px-2 text-[13px] sm:px-3 sm:text-sm font-medium hover:bg-plate ${active ? 'text-crimson' : 'text-ink2'}`}><Icon n="filter" s={17} w={1.5} /><span className="button-label">Фильтры</span>{active && <span aria-label="Фильтры включены" className="size-1.5 rounded-full bg-crimson" />}</button>
      <div className="ml-auto flex min-h-10 min-w-0 items-center gap-2 text-mute"><Icon n="sort" s={17} w={1.5} className="hidden sm:block" /><ChoiceSelect label="Сортировка блюд" value={v.sort} onChange={sort => patch({ sort })} options={[{ value: 'recommended', label: 'По умолчанию' }, { value: 'price-asc', label: 'Сначала дешевле' }, { value: 'price-desc', label: 'Сначала дороже' }, { value: 'name', label: 'По названию' }]} className="h-10 w-[160px] text-[13px] sm:w-[170px] sm:text-sm font-medium text-ink" /></div>
    </div>
    <AnimatePresence initial={false}>{expanded && <motion.div key="filters" id="menu-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3, ease: EASE_IO }} className="overflow-hidden">
      <div className="mt-2 grid max-h-[min(38svh,300px)] gap-5 overflow-y-auto overscroll-contain border-y border-line py-5 sm:grid-cols-2 lg:max-h-none lg:grid-cols-3">
        {active && <button type="button" onClick={() => onChange({ ...DEFAULT_MENU_TOOLS, sort: v.sort })} className="min-h-9 justify-self-start text-xs text-crimson sm:col-span-2 lg:col-span-3">Сбросить фильтры</button>}
        <fieldset><legend className="mb-3 text-xs font-semibold text-ink2">Цена, BYN</legend><div className="grid grid-cols-2 gap-3"><label className="block"><span className="mb-1.5 block text-xs text-mute">От</span><input type="number" min="0" step="0.5" aria-label="Цена от" value={v.from} onChange={e => patch({ from: e.target.value })} placeholder="0" className="h-11 w-full min-w-0 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-control-line focus:ring-crimson" /></label><label className="block"><span className="mb-1.5 block text-xs text-mute">До</span><input type="number" min="0" step="0.5" aria-label="Цена до" value={v.to} onChange={e => patch({ to: e.target.value })} placeholder="Любая" className="h-11 w-full min-w-0 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-control-line focus:ring-crimson" /></label></div>{invalid && <p role="alert" className="mt-2 text-xs text-crimson">Цена «от» должна быть не выше цены «до»</p>}</fieldset>
        <div><p className="mb-3 text-xs font-semibold text-ink2">Раздел меню</p><ChoiceSelect label="Раздел меню" value={v.category} onChange={category => patch({ category })} options={[{ value: 'all', label: 'Все разделы' }, ...CATS.map(c => ({ value: c.id, label: c.name }))]} className="h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-control-line" /></div>
        <fieldset><legend className="mb-2 text-xs font-semibold text-ink2">Предпочтения</legend><label className="flex min-h-9 items-center gap-2 text-sm text-ink2"><input type="checkbox" checked={v.vegetarian} onChange={e => patch({ vegetarian: e.target.checked })} className="size-4 accent-crimson" />Вегетарианское</label><label className="flex min-h-9 items-center gap-2 text-sm text-ink2"><input type="checkbox" checked={v.available} onChange={e => patch({ available: e.target.checked })} className="size-4 accent-crimson" />Только доступные блюда</label></fieldset>
      </div>
    </motion.div>}</AnimatePresence>
  </div>
}
