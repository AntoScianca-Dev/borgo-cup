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
import Squid from './components/Squid'
import PreliminariCE from './components/PreliminariCE'
import Survivor from './components/Survivor'
import CoppaItalia from './components/CoppaItalia'

export default function App() {
  const giornataA =  2

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
            <Route path='/competizioni/campionato' element={<Campionato giornata={giornataA}/> } />
            <Route path='/competizioni/serieA' element={<SerieABC id={18} giornata={giornataA}/> } />
            <Route path='/competizioni/serieB' element={<SerieABC id={19} giornata={giornataA}/> } />
            <Route path='/competizioni/serieC' element={<SerieABC id={20} giornata={giornataA}/> } />
            <Route path='/competizioni/punteggio' element={<PunteggioTop/> } />
            <Route path='/competizioni/squidGame1' element={<Squid id={14}/> } />
            <Route path='/competizioni/preliminari' element={<PreliminariCE/> } />
            <Route path='/competizioni/survivor' element={<Survivor /> } />
            <Route path='/competizioni/coppaIta' element={<CoppaItalia /> } />
          </Routes>
        </main>
        <Footer
          giornata={giornataA} 
        />
      </div>
    </Router>
  )
}