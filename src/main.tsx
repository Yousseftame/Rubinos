import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'aos/dist/aos.css'
import { AuthProvider } from './store/AuthContext/AuthContext.tsx'
import { MessagesProvider } from './store/MessagesContext/MessagesContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MessagesProvider>
    <App />
    </MessagesProvider>
    </AuthProvider>
  </StrictMode>,
)
