import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ADDS, CAT_OF, DISH } from './data'

// Позиция корзины: одно блюдо с одним набором добавок — отдельная строка
export type Line = { key: string; id: string; q: number; adds: string[] }
export type InfoTopic = 'details' | 'terms' | 'demo'
export type Sheet = { kind: 'dish'; id: string; from?: DOMRect } | { kind: 'cart' } | { kind: 'book' } | { kind: 'info'; topic: InfoTopic } | { kind: 'review' } | null

type Fly = { src: string; from: DOMRect; n: number }

type Ctx = {
  lines: Line[]
  count: number
  total: number
  takeawayTotal: number
  qty: (id: string) => number
  add: (id: string, adds?: string[], q?: number, from?: { src: string; rect: DOMRect }) => void
  change: (key: string, d: number) => void
  changeById: (id: string, d: number) => void
  clear: () => void
  sheet: Sheet
  open: (s: Sheet) => void
  close: () => void
  fly: Fly | null
  toast: string | null
}

const C = createContext<Ctx>(null as unknown as Ctx)
export const useStore = () => useContext(C)

const unit = (l: Line) => DISH[l.id].price + l.adds.reduce((a, k) => a + ADDS[k].price, 0)
export const lineTotal = (l: Line) => unit(l) * l.q
export const lineUnit = unit
// Для демо скидка только на основное меню; завтраки и ланч не включаем.
// Точные исключения ресторан подтвердит до запуска.
export const lineTakeawayTotal = (l: Line) => {
  const eligible = !['breakfast', 'lunch'].includes(CAT_OF[l.id])
  return Math.round(lineTotal(l) * (eligible ? 80 : 100)) / 100
}

function load(): Line[] {
  try {
    const v = JSON.parse(localStorage.getItem('fasol:cart') || '[]') as Line[]
    return Array.isArray(v) ? v.filter((l) => DISH[l.id] && l.q > 0) : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(load)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [fly, setFly] = useState<Fly | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const close = useCallback(() => setSheet(null), [])

  useEffect(() => {
    try { localStorage.setItem('fasol:cart', JSON.stringify(lines)) } catch { /* приватный режим */ }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const add = useCallback<Ctx['add']>((id, adds = [], q = 1, from) => {
    const key = id + '|' + [...adds].sort().join(',')
    setLines((ls) => {
      const i = ls.findIndex((l) => l.key === key)
      if (i < 0) return [...ls, { key, id, q, adds }]
      const n = [...ls]; n[i] = { ...n[i], q: n[i].q + q }; return n
    })
    if (from) setFly({ src: from.src, from: from.rect, n: Date.now() })
    setToast(DISH[id].name)
  }, [])

  const change = useCallback((key: string, d: number) => {
    setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : l.q + d > 0 ? [{ ...l, q: l.q + d }] : [])))
  }, [])

  // «+ / −» на карточке меняют последнюю добавленную строку этого блюда
  const changeById = useCallback((id: string, d: number) => {
    setLines((ls) => {
      const i = ls.map((l) => l.id).lastIndexOf(id)
      if (i < 0) return d > 0 ? [...ls, { key: id + '|', id, q: 1, adds: [] }] : ls
      const n = [...ls], q = n[i].q + d
      if (q <= 0) n.splice(i, 1); else n[i] = { ...n[i], q }
      return n
    })
  }, [])

  const value = useMemo<Ctx>(() => ({
    lines,
    count: lines.reduce((a, l) => a + l.q, 0),
    total: lines.reduce((a, l) => a + lineTotal(l), 0),
    takeawayTotal: Math.round(lines.reduce((a, l) => a + lineTakeawayTotal(l), 0) * 100) / 100,
    qty: (id) => lines.filter((l) => l.id === id).reduce((a, l) => a + l.q, 0),
    add, change, changeById,
    clear: () => setLines([]),
    sheet, open: setSheet, close,
    fly, toast,
  }), [lines, sheet, fly, toast, add, change, changeById, close])

  return <C.Provider value={value}>{children}</C.Provider>
}
