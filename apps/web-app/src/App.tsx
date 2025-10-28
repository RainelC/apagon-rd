import { Route, Routes } from 'react-router-dom'
import './styles/globals.css'
import { Construction } from './pages/construction/Contruction'
import Recover from './pages/auth/recover/Recover'
import SendRecover from './pages/auth/recover/SendRecover'
import { NotFound } from './pages/error/NotFound'

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
          element={<NotFound />}
        />
      </Routes>
    </div>
  )
}

export default App
