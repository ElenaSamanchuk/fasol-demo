// Меню «Фасоли» для демо. Названия и вес — из меню на Яндекс Картах (сентябрь 2026), цены — примеры
// в пределах реальных вилок. Фото — студийные фото ресторана (тарелки вырезаны), интерьер — карточка на картах

export type Dish = {
  id: string
  name: string
  weight: string
  price: number
  per100?: boolean
  desc: string
  img: string
  full?: boolean // фото целиком, а не вырезанная тарелка
  tag?: string
  vegetarian?: boolean
  stop?: boolean
}

const cut = (id: string) => `img/cut-${id}.webp`

export const MAP_URL = 'https://yandex.by/maps/org/fasol/1326321013/'
export const ROUTE_URL = 'https://yandex.by/maps/?rtext=~' + encodeURIComponent('Гомель, Советская улица, 36') + '&rtt=auto'
// Ссылка из каталога ресторана; перед запуском сверить с кабинетом Яндекс Еды.
export const DELIVERY_URL = 'https://eda.yandex.ru/r/fasol_by'

const D: Dish[] = [
  { id: 'syrniki', name: 'Сырники со сметаной', weight: '180 г', price: 9.5, desc: 'Творог, сметана, ягодный соус', img: 'img/catalog-syrniki.webp', tag: 'Завтрак' },
  { id: 'nalistniki', name: 'Налистники с лососем', weight: '150 г', price: 6.7, desc: 'Блинчики с лососем и сливочным сыром', img: cut('nalistniki') },
  { id: 'soup-day', name: 'Суп дня', weight: '250 г', price: 3.9, desc: 'Каждый будний день новый — спросите официанта', img: 'img/catalog-vishisuaz.webp', tag: 'Сегодня' },
  { id: 'kotleta', name: 'Котлета пожарская', weight: '120 г', price: 5.5, desc: 'Рубленая куриная котлета в панировке', img: cut('kotleta') },
  { id: 'gulyash', name: 'Гуляш из свинины', weight: '200 г', price: 8.9, desc: 'Свинина, паприка, томаты', img: cut('gulyash') },
  { id: 'holodnik', name: 'Холодник', weight: '230 г', price: 4.3, desc: 'Свёкла, огурец, яйцо, укроп', img: 'img/catalog-holodnik.webp' },
  { id: 'steak-ny', name: 'Бифстейк New York', weight: '410 г', price: 48, desc: 'Вырезка, фри, демиглас', img: cut('steak-ny'), tag: 'Хоспер' },
  { id: 'ribeye', name: 'Рибай стейк', weight: '100 г', price: 59, per100: true, desc: 'Мраморная говядина на углях', img: 'img/catalog-ribeye.webp' },
  { id: 'antrekot', name: 'Антрекот', weight: '370 г', price: 42, desc: 'Пюре, томатная сальса', img: cut('antrekot') },
  { id: 'salmon', name: 'Стейк из лосося', weight: '420 г', price: 47, desc: 'Шпинатный соус, пюре', img: 'img/catalog-salmon.webp' },
  { id: 'bifshteks', name: 'Бифштекс с чеддером', weight: '375 г', price: 35, desc: 'Чеддер, соус тартар', img: cut('bifshteks'), stop: true },
  { id: 'shashlyk', name: 'Шашлык из свиной вырезки', weight: '430 г', price: 29, desc: 'Свиная вырезка на углях, лук, соус', img: cut('shashlyk') },
  { id: 'rebra', name: 'Свиные рёбрышки', weight: '410 г', price: 36, desc: 'Медово-горчичный глейз', img: cut('rebra') },
  { id: 'korejka', name: 'Свиная корейка с травами', weight: '370 г', price: 23, desc: 'Розмарин, чеснок, печёный картофель', img: cut('korejka') },
  { id: 'bean-soup', name: 'Суп из красной фасоли', weight: '330 г', price: 17, desc: 'Пряный и густой: говядина, балык, картофель, зелень', img: cut('bean-soup'), tag: 'Фирменный' },
  { id: 'vishisuaz', name: 'Вишисуаз', weight: '265 г', price: 14, desc: 'Крем-суп из лука-порея и картофеля', img: 'img/catalog-vishisuaz.webp' },
  { id: 'forshmak', name: 'Форшмак', weight: '230 г', price: 11, desc: 'Сельдь, яблоко, ржаные гренки', img: 'img/catalog-forshmak.webp' },
  { id: 'hummus', name: 'Хумус', weight: '255 г', price: 12, desc: 'Нут, тахини, оливковое масло, лепёшка', img: 'img/catalog-hummus.webp' },
  { id: 'tartar', name: 'Тартар из говядины', weight: '245 г', price: 30, desc: 'Говяжья вырезка, желток, каперсы', img: cut('tartar') },
  { id: 'salad-fasol', name: 'Салат «Фасоль» с говядиной', weight: '280 г', price: 33, desc: 'Тёплая говядина, фасоль, овощи', img: cut('salad-fasol'), tag: 'Фирменный' },
  { id: 'caesar-salmon', name: 'Цезарь с лососем', weight: '300 г', price: 38, desc: 'Романо, пармезан, соус цезарь', img: cut('caesar-salmon') },
  { id: 'kinoa', name: 'Киноа с тигровыми креветками', weight: '220 г', price: 29, desc: 'Киноа, авокадо, креветки', img: cut('kinoa') },
  { id: 'greek', name: 'Греческий салат', weight: '310 г', price: 25, desc: 'Овощи, фета, маслины', img: cut('greek') },
  { id: 'lasagna', name: 'Лазанья', weight: '340 г', price: 29, desc: 'Болоньезе, бешамель, пармезан', img: cut('lasagna'), tag: 'Хит' },
  { id: 'tagliatelle', name: 'Тальятелле с лососем', weight: '365 г', price: 35, desc: 'Лосось, сливочный соус', img: cut('tagliatelle') },
  { id: 'carbonara', name: 'Спагетти карбонара', weight: '320 г', price: 17, desc: 'Бекон, сливки, пармезан, желток', img: cut('carbonara') },
  { id: 'shchyochki', name: 'Говяжьи щёчки', weight: '350 г', price: 25, desc: 'Томлёные щёчки, пюре, соус', img: 'img/catalog-shchyochki.webp' },
  { id: 'befstroganov', name: 'Бефстроганов', weight: '430 г', price: 32, desc: 'Говядина, сливочный соус, картофель', img: cut('befstroganov') },
  { id: 'napoleon', name: 'Наполеон с клубничным муссом', weight: '150 г', price: 7.5, desc: 'Слоёные коржи, клубничный мусс', img: cut('napoleon') },
  { id: 'cheesecake-mango', name: 'Чизкейк манго-каламанси', weight: '150 г', price: 12, desc: 'Манго и каламанси', img: cut('cheesecake-mango') },
  { id: 'cheesecake-blue', name: 'Чизкейк с голубикой', weight: '150 г', price: 11, desc: 'Голубика, песочная основа', img: cut('cheesecake-blue') },
  { id: 'choco-cake', name: 'Шоколадный торт', weight: '150 г', price: 12, desc: 'Тёмный шоколад, ганаш', img: cut('choco-cake') },
  { id: 'kids-syrniki', name: 'Сырники для маленьких гостей', weight: '120 г', price: 7, desc: 'Небольшая порция сырников со сметаной и ягодным соусом. Пример детского меню для демо', img: 'img/catalog-syrniki.webp', tag: 'Детям' },
  { id: 'kids-kotleta', name: 'Куриная котлетка', weight: '100 г', price: 5, desc: 'Нежная куриная котлета в хрустящей панировке. Пример детского меню для демо', img: cut('kotleta'), tag: 'Детям' },
  { id: 'kids-cheesecake', name: 'Маленький чизкейк', weight: '100 г', price: 7, desc: 'Чизкейк с голубикой для маленьких гостей. Пример детского меню для демо', img: cut('cheesecake-blue'), tag: 'Детям' },
  { id: 'carrot-cake', name: 'Морковный торт', weight: '120 г', price: 7.5, desc: 'Морковь, грецкий орех, сливочный крем', img: cut('carrot-cake') },
]

const DEMO_VEGETARIAN = new Set(['syrniki', 'kids-syrniki', 'kids-cheesecake', 'vishisuaz', 'soup-day', 'hummus', 'greek', 'cheesecake-mango', 'cheesecake-blue', 'carrot-cake', 'choco-cake', 'napoleon'])
export const DISH: Record<string, Dish> = Object.fromEntries(D.map((d) => [d.id, { ...d, vegetarian: DEMO_VEGETARIAN.has(d.id) }]))

export type Cat = { id: string; name: string; note?: string; items: string[] }
export const CATS: Cat[] = [
  { id: 'breakfast', name: 'Завтраки', note: 'до 12:00', items: ['syrniki', 'nalistniki', 'cheesecake-blue'] },
  { id: 'lunch', name: 'Бизнес-ланч', note: 'пн–пт 12–15', items: ['soup-day', 'kotleta', 'gulyash', 'holodnik'] },
  { id: 'grill', name: 'Хоспер-гриль', note: 'на углях', items: ['steak-ny', 'ribeye', 'antrekot', 'salmon', 'shashlyk', 'rebra', 'korejka', 'bifshteks'] },
  { id: 'starters', name: 'Супы и закуски', items: ['bean-soup', 'vishisuaz', 'forshmak', 'hummus', 'tartar'] },
  { id: 'salads', name: 'Салаты', items: ['salad-fasol', 'caesar-salmon', 'kinoa', 'greek'] },
  { id: 'hot', name: 'Паста и горячее', items: ['lasagna', 'tagliatelle', 'carbonara', 'shchyochki', 'befstroganov'] },
  { id: 'kids', name: 'Детское меню', note: 'пример для демо', items: ['kids-syrniki', 'kids-kotleta', 'kids-cheesecake'] },
  { id: 'desserts', name: 'Десерты', items: ['napoleon', 'cheesecake-mango', 'cheesecake-blue', 'choco-cake', 'carrot-cake'] },
]
export const CAT_OF: Record<string, string> = {}
CATS.forEach((c) => c.items.forEach((id) => (CAT_OF[id] ??= c.id)))

export const ADDS: Record<string, { name: string; price: number }> = {
  bread: { name: 'Хлеб', price: 0.5 },
  sour: { name: 'Сметана', price: 1.1 },
  pepper: { name: 'Перечный соус', price: 2.5 },
  bearn: { name: 'Беарнез', price: 2.5 },
  fries: { name: 'Фри', price: 4.5 },
  cream: { name: 'Шарик мороженого', price: 3 },
}
export const ADDS_BY: Record<string, string[]> = {
  kids: ['sour'], breakfast: ['sour', 'cream'], lunch: ['bread', 'sour'], grill: ['pepper', 'bearn', 'fries'],
  starters: ['bread', 'sour'], salads: ['bread'], hot: ['bread'], desserts: ['cream'],
}
export const PAIRS: Record<string, string[]> = {
  breakfast: ['cheesecake-blue', 'carrot-cake'], lunch: ['holodnik', 'kotleta'], grill: ['greek', 'bean-soup'],
  starters: ['forshmak', 'hummus'], salads: ['bean-soup', 'lasagna'], hot: ['caesar-salmon', 'napoleon'], desserts: ['napoleon', 'cheesecake-mango'],
}

// условные КБЖУ — «пример», настоящие придут из таблицы меню
export function kbju(d: Dish) {
  const w = parseInt(d.weight, 10) || 200
  let h = 0
  for (const ch of d.id) h = (h * 31 + ch.charCodeAt(0)) % 997
  const k = Math.round(w * (1.1 + (h % 13) / 10))
  return { kcal: k, p: Math.round(k * 0.07), f: Math.round(k * 0.055), c: Math.round(k * 0.1) }
}

export const NB = ' '
export const money = (p: number) => p.toFixed(2).replace('.', ',')
// неразрывные пробелы после коротких слов и перед тире
export function nb(s: string) {
  for (let k = 0; k < 2; k++) s = s.replace(/(^|[\s(«])([А-Яа-яЁёA-Za-z]{1,2})\s/g, (_m, a, b) => a + b + NB)
  return s.replace(/\s—/g, NB + '—').replace(/(\d)\s(?=(г|BYN|мин)\b)/g, '$1' + NB)
}
export function plural(n: number, f: [string, string, string]) {
  const a = n % 10, b = n % 100
  return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]
}
export const dishes = (n: number) => `${n}${NB}${plural(n, ['блюдо', 'блюда', 'блюд'])}`

// время ресторана — Гомель
export function minsk() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Minsk', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? ''
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday'))
  return { wd, weekend: wd >= 5, h: +g('hour'), m: +g('minute') }
}
export function openState() {
  const t = minsk(), now = t.h + t.m / 60, opens = t.weekend ? 10 : 9
  if (now >= opens && now < 23) return { open: true, text: 'Открыто до 23:00' }
  const next = now >= 23 ? ((t.wd + 1) % 7 >= 5 ? 10 : 9) : opens
  return { open: false, text: `Закрыто · откроемся в ${next}:00` }
}
