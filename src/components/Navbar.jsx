import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logoBorgoCup from '../assets/image/logoBorgoCup.jpg'
import navbarBg from '../assets/image/sfondoNav.png'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    
    const toggleMenu = () => setIsOpen(!isOpen)
    
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Competizioni', path: '/competizioni' },
        { label: 'Squadre', path: '/squadre' },
        { label: 'Regolamento', path: '/regolamento' },
    ]
    
    return (
        <nav 
        className="sticky top-0 left-0 right-0 w-full z-50 text-amber-50 text-xl shadow-lg shadow-sky-800"
        style={{ 
            backgroundImage: `linear-gradient(rgba(7, 89, 133, 0.7), rgba(7, 89, 133, 0.7)), url(${navbarBg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
        }}
        >
        <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 ">
            <img 
                src={logoBorgoCup} 
                alt="Logo 9' edizione Borgo Cup" 
                className="w-12 h-12 rounded-full object-cover shadow shadow-amber-50"
            />
            <span className="text-2xl text-amber-50 text-shadow-sky-950 font-bold hover:text-amber-100">Borgo Cup</span>
        </Link>
        
        {/* Menu Desktop */}
        <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
            <Link
            key={item.path}
            to={item.path}
            className="hover:text-amber-100 transition font-medium"
            >
            {item.label}
            </Link>
        ))}
        </div>
        
        {/* Menu Mobile */}
        <button
        className="md:hidden p-2"
        onClick={toggleMenu}
        >
        {isOpen ? (
            <XMarkIcon className="w-8 h-8" />
        ) : (
            <Bars3Icon className="w-8 h-8" />
        )}
        </button>
        </div>
        
        {/* Menu Mobile Dropdown */}
        {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 hover:bg-sky-800 rounded transition"
                onClick={() => setIsOpen(false)}
                >
                {item.label}
                </Link>
            ))}
            </div>
        )}
        </div>
        </nav>
    )
}