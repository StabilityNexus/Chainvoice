import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@aossie-org/social-share-button/src/social-share-button.css'
import '@aossie-org/social-share-button'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    <div className='bg-[#161920]'>
    <App />
    </div>
  </StrictMode>,
)
