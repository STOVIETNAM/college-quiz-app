import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)