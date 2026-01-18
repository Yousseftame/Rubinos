import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'aos/dist/aos.css'
import { AuthProvider } from './store/AuthContext/AuthContext.tsx'
import { MessagesProvider } from './store/MessagesContext/MessagesContext.tsx'
import { CategoriesProvider } from './store/CategoriesContext/CategoriesContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
      <MessagesProvider>
    <App />
    </MessagesProvider>
    </CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)
