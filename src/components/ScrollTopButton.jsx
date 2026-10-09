import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'

const SOGLIA = 400 // px di scroll dopo cui compare il bottone

export default function ScrollTopButton() {
    const [visibile, setVisibile] = useState(false)

    useEffect(() => {
        const aggiorna = () => setVisibile(window.scrollY > SOGLIA)
        aggiorna()
        window.addEventListener('scroll', aggiorna, { passive: true })
        return () => window.removeEventListener('scroll', aggiorna)
    }, [])

    const vaiSu = () => {
        const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: ridotto ? 'auto' : 'smooth' })
    }

    return (
        <button
            type="button"
            onClick={vaiSu}
            aria-label="Torna all'inizio della pagina"
            tabIndex={visibile ? 0 : -1}
            style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
            className={`fixed right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-sky-700/30 text-white shadow-lg shadow-sky-900/30 hover:bg-sky-800 active:scale-90 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                visibile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <ArrowUpIcon className="w-5 h-5" />
        </button>
    )
}