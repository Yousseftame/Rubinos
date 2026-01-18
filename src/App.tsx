
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { useEffect } from 'react'
import AOS from 'aos'
import { RubinosToaster } from './components/shared/toastConfig'




function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,     
      easing: 'ease-out-cubic',
      once: true,       
    })
  }, [])

  return (
    <>
    
    <RouterProvider   router={routes}/>
    <RubinosToaster/>




    



     
    </>
  )
}

export default App
