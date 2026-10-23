import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from './icons'
import { useStore } from './store'
import { EASE_IO, useDesktop } from './ui'

const TOPICS = [
  { title: 'Завтраки и обеды', answer: 'Завтраки — каждый день до 12:00. В будни открываемся в 9:00, в выходные — в 10:00. Обеденное меню — по будням с 12:00 до 15:00' },
  { title: 'Заказ с собой', answer: 'Выберите блюда в меню и соберите заказ. Забрать его можно на Советской, 36. На основное меню с собой действует скидка 20%, условия и итоговую стоимость подтвердит администратор' },
  { title: 'С детьми', answer: 'В «Фасоли» есть детский уголок для игр. В демо также можно посмотреть пример детского меню' },
  { title: 'Забронировать стол', answer: 'Оставьте дату, время, число гостей и телефон в форме брони. Администратор подтвердит стол. Если планируете прийти скоро, позвоните +375 44 790-33-33' },
] as const

export function ChatWidget() {
  const [expanded, setExpanded] = useState(false)
  const [contactsInView, setContactsInView] = useState(false)
  const [messages, setMessages] = useState<{ role: 'bot' | 'guest'; text: string }[]>([
    { role: 'bot', text: 'Здравствуйте! Я демо-помощник «Фасоли». Подскажу по меню, бронированию и визиту. Что вас интересует?' },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feed = useRef<HTMLDivElement>(null)
  const send = (text: string) => {
    const question = text.trim()
    if (!question || typing) return
    setMessages(v => [...v, { role: 'guest', text: question }])
    setDraft('')
    setTyping(true)
    const q = question.toLowerCase()
    let answer = 'В демо я отвечаю на вопросы о меню, самовывозе, бронировании и контактах. Для точной информации позвоните в ресторан: +375 44 790-33-33'
    if (/завтрак|обед|ланч|час|время|открыт/.test(q)) answer = TOPICS[0].answer
    else if (/собой|заказ|скидк|достав/.test(q)) answer = /достав/.test(q) ? 'Доставку можно оформить через Яндекс Еду. На сайте можно собрать заказ с собой — забрать его после подтверждения администратора' : TOPICS[1].answer
    else if (/дет|реб[её]н|малыш/.test(q)) answer = TOPICS[2].answer
    else if (/брон|стол|заброни/.test(q)) answer = TOPICS[3].answer
    else if (/адрес|где|добрат|контакт/.test(q)) answer = 'Ждём вас в Гомеле на Советской, 36, рядом с цирком. Карта и маршрут — в разделе «Контакты»'
    else if (/меню|блюд|посовет|порекомен|поесть/.test(q)) answer = 'Начните с раздела «Меню»: там есть завтраки, бизнес-ланч, блюда Хоспер-гриля и детское меню. Поиск и фильтры помогут выбрать по цене и предпочтениям. Цены и составы в этой версии демонстрационные'
    else if (/привет|здравств/.test(q)) answer = 'Здравствуйте! Помочь выбрать блюда, рассказать о завтраках или подсказать, как забронировать стол?'
    else if (/спасибо|благодар/.test(q)) answer = 'Пожалуйста! Будем рады видеть вас в «Фасоли»'
    timer.current = setTimeout(() => {
      setMessages(v => [...v, { role: 'bot', text: answer }])
      setTyping(false)
      timer.current = null
    }, 700)
  }
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); send(draft) }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (feed.current) feed.current.scrollTop = feed.current.scrollHeight
  }, [messages, typing, expanded])
  const { count, sheet, open, toast } = useStore()
  const desk = useDesktop()
  const launcher = useRef<HTMLButtonElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const base = desk ? 24 : count > 0 ? 124 : 70
  useEffect(() => {
    const contacts = document.getElementById('about')
    if (!contacts) return
    const observer = new IntersectionObserver(([entry]) => setContactsInView(entry.isIntersecting))
    observer.observe(contacts)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!expanded) return
    close.current?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setExpanded(false); launcher.current?.focus() } }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [expanded])
  return (
    <AnimatePresence>
      {!sheet && !(!desk && (toast || (contactsInView && !expanded))) && <motion.div key="chat-widget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28, ease: EASE_IO }}>
        <AnimatePresence>
          {expanded && <motion.aside key="panel" id="demo-chat" role="dialog" aria-label="Помощник Фасоли — демо" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: .3, ease: EASE_IO }} style={{ bottom: `calc(${base + 112}px + env(safe-area-inset-bottom))`, maxHeight: `calc(100svh - ${base + 140}px)` }} className="fixed right-4 left-4 z-50 overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-float ring-1 ring-line sm:left-auto sm:w-[340px] lg:right-6">
            <div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl">Помощник «Фасоли»</h2><p className="mt-1 text-xs text-mute">Демо · сообщения не отправляются</p></div><button ref={close} type="button" aria-label="Закрыть помощника" onClick={() => { setExpanded(false); launcher.current?.focus() }} className="relative grid size-8 shrink-0 place-items-center rounded-full after:absolute after:-inset-1.5 after:content-[''] hover:bg-plate"><Icon n="close" s={17} w={1.5} /></button></div>
            <div ref={feed} role="log" aria-label="Переписка с демо-помощником" aria-live="polite" aria-relevant="additions text" className="mt-4 flex max-h-[min(40svh,320px)] min-h-32 flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
              {messages.map((message, i) => <motion.p key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, ease: EASE_IO }} className={`max-w-[94%] rounded-xl px-3 py-2 text-[13px] leading-[1.4] ${message.role === 'guest' ? 'self-end rounded-br-sm bg-crimson text-white' : 'self-start rounded-bl-sm bg-porc text-ink2'}`}><span className="sr-only">{message.role === 'guest' ? 'Вы: ' : 'Помощник: '}</span>{message.text}</motion.p>)}
              {typing && <p role="status" className="self-start px-2 text-xs text-mute">Помощник печатает…</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Подсказки для сообщения">{['Посоветуй блюда', ...TOPICS.map(t => t.title), 'Как добраться?'].map(title => <button key={title} type="button" disabled={typing} onClick={() => send(title)} className="min-h-8 rounded-xl bg-porc px-2.5 py-1.5 text-xs font-medium text-ink2 transition-colors hover:bg-plate disabled:opacity-50">{title}</button>)}</div>
            <form onSubmit={submit} className="mt-4 flex items-end gap-2 border-t border-line pt-3">
              <label className="min-w-0 flex-1"><span className="sr-only">Ваше сообщение</span><input value={draft} onChange={e => setDraft(e.target.value)} maxLength={600} placeholder="Напишите сообщение" autoComplete="off" className="h-11 w-full rounded-xl bg-porc px-3 text-base outline-none focus:ring-1 focus:ring-crimson" /></label>
              <button type="submit" disabled={!draft.trim() || typing} aria-label="Отправить сообщение" className="grid size-11 shrink-0 place-items-center rounded-xl bg-crimson text-white hover:bg-crimson-d disabled:bg-plate disabled:text-mute"><Icon n="arrow" s={19} w={1.6} /></button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2"><p className="text-[11px] leading-snug text-mute">Автоответы для демо · без связи с администратором</p><button type="button" onClick={() => { setExpanded(false); open({ kind: 'book' }) }} className="min-h-8 shrink-0 text-xs font-semibold text-crimson">Бронь стола</button></div>
          </motion.aside>}
        </AnimatePresence>
        <button ref={launcher} type="button" aria-label={expanded ? 'Закрыть помощника' : 'Открыть помощника'} aria-expanded={expanded} aria-controls="demo-chat" onClick={() => setExpanded(v => !v)} style={{ bottom: `calc(${base}px + env(safe-area-inset-bottom))` }} className="fixed right-4 z-40 grid size-11 place-items-center rounded-full bg-crimson text-white shadow-md hover:bg-crimson-d lg:right-6"><Icon n={expanded ? 'close' : 'chat'} s={21} w={1.6} /></button>
      </motion.div>}
    </AnimatePresence>
  )
}
