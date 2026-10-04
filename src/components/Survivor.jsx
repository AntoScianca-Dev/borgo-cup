import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import squadreData from '../assets/data/classifiche.json'
import headerS from '../assets/image/header_survivor.png'

const COMPETIZIONE_ID = 7

function SquadraRow({ squadra, posizione, eliminata = false }) {
    const accento = eliminata ? 'border-pink-500' : 'border-lime-500'

    return (
        <div
            className={`group min-w-0 bg-white rounded-2xl border-l-8 ${accento} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-3 ${
                eliminata ? 'opacity-90' : ''
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-gray-50 shadow-inner text-base font-bold text-gray-700">
                        {eliminata ? '❌' : posizione}
                    </span>
                    <span
                        className="truncate font-bold text-lg text-gray-800 border-l-8 rounded-2xl pl-2"
                        style={{ borderColor: squadra.border }}
                    >
                        {squadra.nome}
                    </span>
                </div>
                <span className="text-2xl font-black text-sky-950 tabular-nums">
                    {(squadra.punteggio || 0).toFixed(1)}
                </span>
            </div>
        </div>
    )
}

export default function Survivor() {
    const serie = squadreData.classifiche.find((c) => c.id === COMPETIZIONE_ID)

    const { attivi, eliminati } = useMemo(() => {
        const partecipanti = serie?.partecipanti ?? []
        return {
            attivi: partecipanti
                .filter((p) => p.stato === 'attivo')
                .sort((a, b) => b.punteggio - a.punteggio),
            eliminati: partecipanti
                .filter((p) => p.stato === 'eliminato')
                .sort((a, b) => b.totale2 - a.totale2),
        }
    }, [serie])

    if (!serie) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1
                    className="py-6 rounded-tl-4xl rounded-br-4xl text-4xl font-medium tracking-tight shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerS})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <span className="flex items-center justify-center gap-2 text-sky-900 text-shadow-2xs text-shadow-sky-50">
                        <img src="../images/survivor.png" alt="Logo Survivor" className="w-16 h-16 object-contain" />
                        <span>{serie.nome}</span>
                    </span>
                </h1>
            </Link>

            {/* Intestazione tabella */}
            <div className="bg-linear-to-r from-lime-800 via-lime-700 to-lime-800 text-amber-50 rounded-2xl px-5 py-3 shadow-md flex justify-between items-center text-sm font-semibold uppercase tracking-wider">
                <span>Squadra</span>
                <span>Punti</span>
            </div>

            {/* Attivi */}
            <div className="grid grid-cols-1 gap-3">
                {attivi.map((s, i) => (
                    <SquadraRow key={s.id} squadra={s} posizione={i + 1} />
                ))}
            </div>

            {/* Eliminati */}
            {eliminati.length > 0 && (
                <>
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-px bg-pink-300" />
                        <span className="text-sm font-black tracking-widest text-pink-700">❌ ELIMINATI ❌</span>
                        <div className="flex-1 h-px bg-pink-300" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 pb-4">
                        {eliminati.map((s) => (
                            <SquadraRow key={s.id} squadra={s} eliminata />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}