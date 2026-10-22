import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// фото проявляются мягко, когда загрузились, — без вспышек и «прыжков»
document.addEventListener('load', (e) => { const t = e.target as HTMLElement; if (t.tagName === 'IMG') t.classList.add('is-in') }, true)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
