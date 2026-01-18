import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'aos/dist/aos.css'
import { AuthProvider } from './store/AuthContext/AuthContext.tsx'
import { MessagesProvider } from './store/MessagesContext/MessagesContext.tsx'
import { CategoriesProvider } from './store/CategoriesContext/CategoriesContext.tsx'
import { MenusProvider } from './store/MenusContext/MenusContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
        <MenusProvider>
      <MessagesProvider>
    <App />

    </MessagesProvider>
    </MenusProvider>
    </CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)
