import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import squadreData from '../assets/data/classifiche.json'
import headerP from '../assets/image/header_punteggio.png'

const CLASSIFICA_ID = 9

function Logo({ id, nome }) {
    const [errore, setErrore] = useState(false)

    if (errore) {
        return (
            <span className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-inner text-3xl">
                🏅
            </span>
        )
    }
    return (
        <img
            src={`../images/logos/${id}.png`}
            alt={`Logo ${nome}`}
            onError={() => setErrore(true)}
            className="w-16 h-16 object-contain rounded-2xl bg-white p-1 shadow-inner"
        />
    )
}

function RecordCard({ squad }) {
    return (
        <div className="group min-w-0 bg-white rounded-tr-3xl rounded-bl-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Fascia con il titolo del record */}
            <div
                className="px-4 py-2.5 text-center"
                style={{ background: `linear-gradient(135deg, ${squad.border}, ${squad.border}99)` }}
            >
                <h2 className="text-sm font-black uppercase tracking-widest text-white drop-shadow">
                    {squad.titolo}
                </h2>
            </div>

            <div className="p-4 flex items-center gap-3">
                <Logo id={squad.id_S} nome={squad.nome} />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-extrabold text-sky-950">{squad.nome}</h3>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">Punteggio</p>
                </div>
            </div>

            <div className="mx-4 mb-4 rounded-xl bg-sky-50 py-2 text-center">
                <span className="text-4xl font-black text-sky-900 tabular-nums">
                    {(squad.punteggio || 0).toFixed(1)}
                </span>
            </div>
        </div>
    )
}

export default function PunteggioTop() {
    const classifica = squadreData.classifiche.find((c) => c.id === CLASSIFICA_ID)

    const partecipanti = useMemo(
        () => [...(classifica?.partecipanti ?? [])].sort((a, b) => a.id - b.id),
        [classifica]
    )

    if (!classifica) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1
                    className="min-h-40 flex items-end justify-center px-4 pb-5 rounded-tl-4xl rounded-br-4xl text-sky-50 text-3xl sm:text-4xl font-medium tracking-tight text-center shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.35)), url(${headerP})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                    }}
                >
                    <span className="drop-shadow">Punteggio Più Alto di Giornata</span>
                </h1>
            </Link>

            {partecipanti.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">Nessun dato disponibile</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                    {partecipanti.map((squad) => (
                        <RecordCard key={squad.id} squad={squad} />
                    ))}
                </div>
            )}
        </div>
    )
}