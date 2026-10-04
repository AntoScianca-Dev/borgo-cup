import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid'
import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerC from '../assets/image/header_campionato.png'

const COMPETIZIONE_ID = 1

const BADGE = {
    1: 'from-amber-400 to-yellow-300 text-amber-950 shadow-amber-300/60',
    2: 'from-gray-300 to-gray-100 text-gray-800 shadow-gray-300/60',
    3: 'from-amber-700 to-amber-600 text-amber-50 shadow-amber-700/40',
    4: 'from-yellow-300 to-yellow-100 text-yellow-800 shadow-yellow-300/50',
    5: 'from-sky-700 to-sky-600 text-sky-50 shadow-sky-500/40',
}

function PosizioneBadge({ posizione }) {
    const stile = BADGE[posizione] ?? 'from-gray-50 to-white text-gray-500 shadow-gray-200'
    return (
        <span className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-linear-to-tr font-black text-lg shadow-md ${stile}`}>
            {posizione}
        </span>
    )
}

function Trend({ delta }) {
    if (delta > 0) {
        return (
            <span className="flex items-center text-emerald-500 text-xs font-bold w-8">
                <ArrowUpIcon className="w-3.5 h-3.5" />{delta}
            </span>
        )
    }
    if (delta < 0) {
        return (
            <span className="flex items-center text-red-500 text-xs font-bold w-8">
                <ArrowDownIcon className="w-3.5 h-3.5" />{Math.abs(delta)}
            </span>
        )
    }
    return (
        <span className="flex items-center w-8">
            <MinusIcon className="w-3.5 h-3.5 text-gray-300" />
        </span>
    )
}

function SquadraRow({ squadra, posizione }) {
    const isPrimo = posizione === 1
    // Se manca "variazione" nessun cambio
    const delta = (squadra.variazione ?? squadra.posizione) - squadra.posizione

    return (
        <div
            className={`group min-w-0 flex items-center justify-between gap-3 rounded-2xl border-l-8 border-r-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-3 ${
                isPrimo ? 'bg-amber-50' : 'bg-white'
            }`}
            style={{ borderLeftColor: squadra.border, borderRightColor: squadra.border }}
        >
            <div className="flex items-center gap-2 min-w-0">
                <PosizioneBadge posizione={posizione} />
                <Trend delta={delta} />
                <span className={`truncate font-bold group-hover:text-sky-700 transition-colors ${
                    isPrimo ? 'text-xl text-amber-900' : 'text-lg text-gray-800'
                }`}>
                    {squadra.nome}
                </span>
            </div>

            <span className={`text-2xl font-black tabular-nums px-3 py-1 rounded-xl ${
                isPrimo ? 'bg-amber-400/25 text-amber-900' : 'bg-gray-100 text-sky-950'
            }`}>
                {(squadra.punteggio || 0).toFixed(1)}
            </span>
        </div>
    )
}

export default function Classifica() {
    const campionato = squadreData.classifiche.find((c) => c.id === COMPETIZIONE_ID)
    const competizione = competizioniData.competizioni.find((c) => c.id === COMPETIZIONE_ID)

    const classifica = useMemo(
        () => [...(campionato?.partecipanti ?? [])].sort((a, b) => a.posizione - b.posizione),
        [campionato]
    )

    if (!campionato || !competizione) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1
                    className="py-6 rounded-tl-4xl rounded-br-4xl text-sky-50 text-4xl font-medium tracking-tight shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerC})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <span className="flex items-center justify-center gap-3 px-4">
                        <img src="../images/campionato.png" alt="Logo campionato" className="w-16 h-16 object-contain" />
                        <span className="drop-shadow">Classifica Campionato</span>
                    </span>
                </h1>
            </Link>

            <div className="flex justify-center">
                <span className="bg-sky-900 text-sky-50 text-sm font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow">
                    {competizione.giornata}ª giornata
                </span>
            </div>

            {/* Intestazione */}
            <div className="bg-linear-to-r from-sky-950 via-sky-800 to-sky-950 text-amber-50 rounded-2xl px-5 py-3 shadow-md flex justify-between items-center text-sm font-semibold uppercase tracking-wider">
                <span>Squadra</span>
                <span>Punti</span>
            </div>

            {/* Classifica */}
            <div className="grid grid-cols-1 gap-3 pb-4">
                {classifica.map((s, i) => (
                    <SquadraRow key={s.id ?? i} squadra={s} posizione={i + 1} />
                ))}
            </div>
        </div>
    )
}