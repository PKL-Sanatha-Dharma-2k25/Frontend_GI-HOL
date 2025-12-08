import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'    // ← Ubah ke path yang benar
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)