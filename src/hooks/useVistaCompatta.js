import { useState } from 'react'

// La scelta viene ricordata e vale per tutte le classifiche
export default function useVistaCompatta() {
    const [compatta, setCompatta] = useState(() => {
        try {
            return localStorage.getItem('vistaCompatta') === 'true'
        } catch {
            return false
        }
    })

    const imposta = (valore) => {
        setCompatta(valore)
        try {
            localStorage.setItem('vistaCompatta', String(valore))
        } catch {
            /* storage non disponibile: la scelta vale solo per questa pagina */
        }
    }

    return [compatta, imposta]
}