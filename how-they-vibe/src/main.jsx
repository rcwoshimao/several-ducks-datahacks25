import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ResultProvider } from './ResultContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ResultProvider>
      <App />
    </ResultProvider>
  </StrictMode>,
)
