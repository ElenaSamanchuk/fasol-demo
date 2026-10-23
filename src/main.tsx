import { StrictMode } from 'react'
import { MotionConfig } from 'motion/react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// типографика: неразрывный пробел после коротких слов (в, и, с, на…) и перед тире — для всего текста страницы
const NBSP = '\u00A0'
const fixText = (n: Node) => {
  const t = n.nodeValue
  if (!t || !/\s/.test(t)) return
  let v = t
  for (let k = 0; k < 2; k++) v = v.replace(/(^|[\s(«\u00A0])([А-Яа-яЁёA-Za-z]{1,2})\s/g, (_m, a, b) => a + b + NBSP)
  v = v.replace(/\s—/g, NBSP + '—').replace(/(\d)\s(?=(г|BYN|мин|%)(\s|$|[^А-Яа-я]))/g, '$1' + NBSP)
  if (v !== t) n.nodeValue = v
}
const walk = (root: Node) => {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement?.closest('input, textarea, script, style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) })
  for (let n = w.nextNode(); n; n = w.nextNode()) fixText(n)
}
new MutationObserver((ms) => ms.forEach((m) => { if (m.type === 'characterData') fixText(m.target); m.addedNodes.forEach((n) => (n.nodeType === 3 ? fixText(n) : walk(n))) }))
  .observe(document.body, { subtree: true, childList: true, characterData: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user"><App /></MotionConfig>
  </StrictMode>,
)
