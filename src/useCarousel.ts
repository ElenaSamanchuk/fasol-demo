import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type TouchEvent } from 'react'
import { useReducedMotion } from 'motion/react'

// Общая логика полос: автосмена только пока полоса видна и с ней не взаимодействуют.
export function useCarousel(length: number, interval = 7000) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touching, setTouching] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const gesture = useRef<{ x: number; y: number } | null>(null)
  const suppressClickUntil = useRef(0)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 })
    if (ref.current) observer.observe(ref.current)
    const change = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', change) }
  }, [])
  useEffect(() => {
    if (paused || touching || hovered || focused || !visible || !tabVisible || reduce) return
    const timer = setTimeout(() => setIndex(i => (i + 1) % length), interval)
    return () => clearTimeout(timer)
  }, [paused, touching, hovered, focused, visible, tabVisible, reduce, length, interval, index])
  return { ref, index, paused, focused, reduce, setPaused, select: setIndex,
    prev: () => setIndex(i => (i + length - 1) % length),
    next: () => setIndex(i => (i + 1) % length),
    bind: {
      onMouseEnter: () => { if (matchMedia('(hover: hover)').matches) setHovered(true) }, onMouseLeave: () => setHovered(false),
      style: { touchAction: 'pan-y pinch-zoom' },
      onTouchStart: (e: TouchEvent<HTMLElement>) => {
        if (e.touches.length !== 1) { gesture.current = null; setTouching(false); return }
        const t = e.touches[0]
        gesture.current = { x: t.clientX, y: t.clientY }
        setTouching(true)
      },
      onTouchMove: (e: TouchEvent<HTMLElement>) => {
        if (e.touches.length !== 1) { gesture.current = null; setTouching(false); return }
        const start = gesture.current, t = e.touches[0]
        // Вертикальная прокрутка не должна переключать карточку при отпускании пальца
        if (start && Math.abs(t.clientY - start.y) > 12 && Math.abs(t.clientY - start.y) > Math.abs(t.clientX - start.x)) gesture.current = null
      },
      onTouchEnd: (e: TouchEvent<HTMLElement>) => {
        const start = gesture.current
        gesture.current = null
        setTouching(false)
        if (!start || !e.changedTouches.length) return
        const t = e.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y
        if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          suppressClickUntil.current = Date.now() + 450
          setIndex(i => (i + (dx < 0 ? 1 : length - 1)) % length)
        }
      },
      onTouchCancel: () => { gesture.current = null; setTouching(false) },
      onClickCapture: (e: MouseEvent<HTMLElement>) => {
        // После свайпа не открывать фото или ссылку, на которых начался жест
        if (e.detail !== 0 && Date.now() < suppressClickUntil.current) { e.preventDefault(); e.stopPropagation() }
      },
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (e: FocusEvent<HTMLElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) },
    },
  }
}
