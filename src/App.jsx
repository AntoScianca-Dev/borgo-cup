// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Competizioni from './components/Competizioni'
import Regolamento from './components/Regolamento'
import './index.css'
import ScrollToTop from './components/ScrollToTop'
import Squadre from './components/Squadre'
import Campionato from './components/Campionato'
import SerieABC from './components/SerieABC'
import PunteggioTop from './components/PunteggioTop'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <ScrollToTop/>
        <main className="container mx-auto px-4 py-8 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competizioni" element={<Competizioni />} />
            <Route path="/regolamento" element={<Regolamento />} />
            <Route path='/squadre' element={<Squadre/> } />
            <Route path='/competizioni/campionato' element={<Campionato/> } />
            <Route path='/competizioni/serieA' element={<SerieABC id={18}/> } />
            <Route path='/competizioni/serieB' element={<SerieABC id={19}/> } />
            <Route path='/competizioni/serieC' element={<SerieABC id={20}/> } />
            <Route path='/competizioni/punteggio' element={<PunteggioTop/> } />
          </Routes>
        </main>
        <Footer
          giornata={1} 
        />
      </div>
    </Router>
  )
}