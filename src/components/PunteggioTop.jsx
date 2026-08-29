import squadreData from '../assets/data/classifiche.json'
import headerP from '../assets/image/header_punteggio.png'
import { Link } from 'react-router-dom'

export default function PunteggioTop() {
    // 1. Estrai la classifica del "Campionato" (id: 1)
    const campionatoObj = squadreData.classifiche.find(
        (item) => item.id === 9 // oppure item.id === 1
    )

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    const partecipantiRaw = campionatoObj?.partecipanti || []

    // 3. Ordina i partecipanti per posizione crescente (1°, 2°, 3°, ...)
    const classificaOrdinata = [...partecipantiRaw].sort((a, b) => a.id - b.id)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Schermata */}
        <div className="text-center space-y-2 text-sky-50">
            <Link to='/competizioni'>
                <h1 className="text-4xl tracking-tight flex items-center justify-center gap-3 py-6 rounded-tl-4xl rounded-br-4xl font-medium mb-2"
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerP})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'top' 
                }}>
                    <span className='flex justify-center items-center px-4'>
                        <span className='pt-14'>
                        Punteggio Più Alto di Giornata
                        </span>
                    </span>
                </h1>
            </Link>
        </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classificaOrdinata.map((squad) => (
                <div
                    key={squad.id}
                    className="bg-sky-50 rounded-tr-2xl rounded-bl-2xl shadow shadow-sky-600 p-6 border-l-8"
                    style={{borderLeftColor: squad.border}}
                >

                    <h2 className="text-2xl font-medium text-sky-800 mb-2 text-center">{squad.titolo}</h2>
                    <h3 className="text-2xl font-medium text-sky-950 mb-2">{squad.nome}</h3>
                    <span className="text-2xl font-light">Punteggio: {(squad.punteggio || 0).toFixed(1)}</span>
                    
                </div>
            ))}
            </div>
        </div>
    )
}