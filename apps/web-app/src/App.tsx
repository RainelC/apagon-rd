import { Route, Routes } from 'react-router-dom'
import './styles/globals.css'
import { Construction } from './components/Contruction'
import NotFoundPage from './components/NotFoundPage'
import Recover from './auth/recover/Recover'
import SendRecover from './auth/recover/SendRecover'

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <div className='bg-[#a2dafb]'>
              <Construction />
            </div>
          }
        />
        <Route
          path='/auth/recover'
          element={<Recover />}
        />
         <Route
          path='/auth/recover/send'
          element={<SendRecover />}
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </div>
  )
}

export default App
