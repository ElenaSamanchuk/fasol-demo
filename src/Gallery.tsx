import { useRef, useState } from 'react'
import { Icon } from './icons'
import { useCarousel } from './useCarousel'

const PHOTOS = [
  { src: 'img/story-hall.webp', title: 'Зал', alt: 'Двухуровневый зал Фасоли с деревянной лестницей' },
  { src: 'img/story-kids.webp', title: 'Детский уголок', alt: 'Детский уголок с игрушками и цветным ковриком' },
  { src: 'img/story-terrace.webp', title: 'Терраса', alt: 'Летняя терраса Фасоли с красным навесом' },
  { src: 'img/story-hall-detail.webp', title: 'Второй ракурс зала', alt: 'Лестница и столики на двух уровнях ресторана' },
  { src: 'img/story-screen.webp', title: 'Концерты на экране', alt: 'Столики в зале и запись концерта на большом экране' },
]

// Постоянные слои: предыдущий кадр остаётся непрозрачным до конца появления нового
// Ничего не размонтируем при перелистывании, включая переход с последнего фото на первое
function PhotoStack({ index, reduce, caption = false }: { index: number; reduce: boolean; caption?: boolean }) {
  const [frame, setFrame] = useState({ current: index, previous: index })
  if (frame.current !== index) setFrame({ current: index, previous: frame.current })
  return PHOTOS.map((photo, i) => {
    const active = i === frame.current
    const behind = i === frame.previous
    return <span key={photo.src} className="story-frame" aria-hidden={!active} style={{
      opacity: active || behind ? 1 : 0,
      zIndex: active ? 2 : behind ? 1 : 0,
      transition: active && !reduce ? 'opacity 600ms cubic-bezier(.45,0,.2,1)' : 'none',
    }} onTransitionEnd={e => {
      if (e.target === e.currentTarget && e.propertyName === 'opacity' && active) setFrame(v => v.current === i ? { current: i, previous: i } : v)
    }}>
      <img src={photo.src} alt={active ? photo.alt : ''} loading="eager" decoding="async" width="720" height="1280" className="size-full object-cover" />
      {caption && <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-4 pt-12 pb-5 text-left text-sm font-medium text-white">{photo.title}</span>}
    </span>
  })
}

export function Gallery() {
  const { ref, index, paused, reduce, setPaused, select, prev, next, bind } = useCarousel(PHOTOS.length, 6500)
  const dialog = useRef<HTMLDialogElement>(null)
  const wasPaused = useRef(false)
  const show = (i: number) => { wasPaused.current = paused; setPaused(true); select(i); dialog.current?.showModal() }
  const close = () => dialog.current?.close()
  return (
    <section ref={ref} {...bind} id="gallery" aria-labelledby="gallery-title" aria-roledescription="карусель" className="mx-auto mt-12 max-w-page px-4 lg:mt-24 lg:px-10">
      <div className="mb-5 flex items-center lg:mb-8 justify-between gap-4">
        <h2 id="gallery-title" className="font-serif text-2xl font-medium lg:text-3xl">Атмосфера «Фасоли»</h2>
        <span aria-label={`Фото ${index + 1} из ${PHOTOS.length}`} className="shrink-0 whitespace-nowrap text-[11px] leading-4 tabular-nums text-mute lg:hidden">{index + 1} / {PHOTOS.length}</span>
        <div className="hidden shrink-0 items-center lg:flex"><span className="mr-2 shrink-0 whitespace-nowrap text-xs tabular-nums text-mute">{index + 1} / {PHOTOS.length}</span><button type="button" aria-label="Предыдущее фото галереи" onClick={prev} className="carousel-control"><Icon n="back" s={16} w={1.5} /></button><button type="button" aria-label={paused ? 'Включить смену фото' : 'Остановить смену фото'} aria-pressed={paused} onClick={() => setPaused(v => !v)} className="carousel-control text-crimson"><Icon n={paused ? 'play' : 'pause'} s={15} w={1.4} /></button><button type="button" aria-label="Следующее фото галереи" onClick={next} className="carousel-control"><Icon n="arrow" s={16} w={1.5} /></button></div>
      </div>
      <div className="story-track" data-reduced={!!reduce}>
        {[-2, -1, 0, 1, 2].map(offset => {
          const i = (index + offset + PHOTOS.length) % PHOTOS.length, p = PHOTOS[i]
          return <div key={offset} className="story-slot" style={{ transform: `translateX(calc(-50% + ${offset} * (100% + 20px))) scale(${offset === 0 ? 1 : .94})`, opacity: offset === 0 ? 1 : .82, zIndex: offset === 0 ? 2 : 1 }}>
            <button type="button" onClick={() => show(i)} aria-label={'Посмотреть: ' + p.title} tabIndex={offset === 0 ? 0 : -1} className="story-card">
              <PhotoStack index={i} reduce={!!reduce} caption />
            </button>
          </div>
        })}
      </div>
      <button type="button" onClick={() => setPaused(v => !v)} className="sr-only focus:not-sr-only lg:hidden">{paused ? 'Включить смену фото' : 'Остановить смену фото'}</button>
      <dialog ref={dialog} onClose={() => setPaused(wasPaused.current)} aria-label="Истории Фасоли" onClick={e => { if (e.target === e.currentTarget) close() }} onKeyDown={e => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }} className="gallery-dialog story-dialog m-auto overflow-hidden rounded-2xl bg-ink text-white backdrop:bg-ink/70 backdrop:backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 z-10 bg-linear-to-b from-black/60 to-transparent p-4 pb-12">
          <div className="mb-3 flex gap-1">{PHOTOS.map((p,i) => <span key={p.src} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= index ? 'bg-white' : 'bg-white/35'}`} />)}</div>
          <div className="flex items-center justify-between"><p className="text-sm font-semibold">{PHOTOS[index].title}</p><button type="button" aria-label="Закрыть фотографии" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-white/15"><Icon n="close" s={19} w={1.5} /></button></div>
        </div>
        <PhotoStack index={index} reduce={!!reduce} />
        <button type="button" aria-label="Предыдущее фото" onClick={prev} className="absolute z-10 top-1/2 left-1 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/15 text-white hover:bg-black/30"><Icon n="back" s={20} w={1.5} /></button>
        <button type="button" aria-label="Следующее фото" onClick={next} className="absolute z-10 top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/15 text-white hover:bg-black/30"><Icon n="arrow" s={20} w={1.5} /></button>
      </dialog>
    </section>
  )
}
