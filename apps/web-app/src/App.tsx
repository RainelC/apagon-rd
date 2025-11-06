import { Route, Routes } from 'react-router-dom'
import './styles/globals.css'
import './styles/App.css'
import Recover from './pages/auth/recover/Recover'
import SendRecover from './pages/auth/recover/SendRecover'
import { NotFound } from './pages/error/NotFound'
import About from './components/About'
import DownloadLinks from './components/DownloadLinks'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Contact from './components/Contact'

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <div className='app'>
              <Navbar />
              <Hero />
              <About />
              <FAQ />
              <DownloadLinks />
              <Contact />
              <Footer />
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
