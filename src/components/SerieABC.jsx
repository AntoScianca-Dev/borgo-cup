import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerC from '../assets/image/header_campionato.png'
import ToggleVista from './ToggleVista'
import useVistaCompatta from '../hooks/useVistaCompatta'

const STATS = [
    { key: 'giocate', label: 'G' },
    { key: 'vinte', label: 'V' },
    { key: 'pari', label: 'N' },
    { key: 'perso', label: 'P' },
    { key: 'gf', label: 'GF' },
    { key: 'gs', label: 'GS' },
]

const MEDAGLIE = {
    1: 'from-amber-400 to-yellow-300 text-amber-950 shadow-amber-300/60',
    2: 'from-gray-300 to-gray-100 text-gray-800 shadow-gray-300/60',
    3: 'from-amber-700 to-amber-600 text-amber-50 shadow-amber-700/40',
}

// Zone in base al campionato: 'promozione' | 'retrocessione' | null
const getZona = (posizione, nomeCampionato) => {
    if (posizione <= 3 && nomeCampionato !== 'Serie A') return 'promozione'
    if (posizione >= 6 && posizione <= 8 && nomeCampionato !== 'Serie C') return 'retrocessione'
    return null
}

function PosizioneBadge({ posizione, zona }) {
    const stile = zona === 'retrocessione'
        ? 'from-pink-700 to-pink-500 text-white shadow-pink-400/50'
        : MEDAGLIE[posizione] ?? 'from-sky-50 to-white text-sky-950 shadow-sky-200'

    return (
        <span className="relative shrink-0">
            <span className={`w-10 h-10 flex items-center justify-center rounded-full bg-linear-to-tr font-black text-lg shadow-md ${stile}`}>
                {posizione}
            </span>
            {zona && (
                <span
                    className={`absolute -top-1 -right-1 w-4.5 h-4.5 flex items-center justify-center rounded-full text-white ring-2 ring-white ${
                        zona === 'promozione' ? 'bg-emerald-500' : 'bg-pink-600'
                    }`}
                >
                    {zona === 'promozione'
                        ? <ArrowUpIcon className="w-3 h-3" />
                        : <ArrowDownIcon className="w-3 h-3" />}
                </span>
            )}
        </span>
    )
}

function SquadraRow({ squadra, posizione, nomeCampionato, compatta }) {
    const zona = getZona(posizione, nomeCampionato)
    const isPrimo = posizione === 1

    return (
        <div
            className={`group min-w-0 rounded-2xl border-l-8 border-r-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${
                compatta ? 'p-2' : 'p-3'
            } ${isPrimo ? 'bg-amber-50' : 'bg-white'}`}
            style={{ borderLeftColor: squadra.border, borderRightColor: squadra.border }}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <PosizioneBadge posizione={posizione} zona={zona} />
                    <span className={`truncate font-bold group-hover:text-sky-700 transition-colors ${
                        isPrimo ? 'text-xl text-amber-900' : 'text-lg text-gray-800'
                    }`}>
                        {squadra.nome}
                    </span>
                </div>
                <span className={`text-2xl font-black tabular-nums px-3 py-1 rounded-xl ${
                    isPrimo ? 'bg-amber-400/25 text-amber-900' : 'bg-gray-100 text-sky-950'
                }`}>
                    {squadra.punteggio || 0}
                </span>
            </div>

            {!compatta && (
                <div className="grid grid-cols-6 gap-1.5 mt-3">
                    {STATS.map(({ key, label }) => (
                        <div key={key} className="bg-sky-50 rounded-xl py-1 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">{label}</p>
                            <p className="text-sm font-bold text-gray-800">{squadra[key] ?? 0}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function SerieABC({ id }) {
    const serie = squadreData.classifiche.find((c) => c.id === id)
    const competizione = competizioniData.competizioni.find((c) => c.id === id)
    const [compatta, setCompatta] = useVistaCompatta()

    const classifica = useMemo(
        () => [...(serie?.partecipanti ?? [])].sort((a, b) => a.posizione - b.posizione),
        [serie]
    )

    if (!serie || !competizione) return null

    const imgsrc = serie.nome.replaceAll(' ', '').replace('S', 's').concat('.png')

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
                    <span className="flex items-center justify-center gap-4">
                        <img src={`../images/${imgsrc}`} alt="Logo campionato" className="w-16 h-16 object-contain rounded-full" />
                        <span className="drop-shadow">
                            Classifica <br />{serie.nome}
                        </span>
                    </span>
                </h1>
            </Link>

            <div className="flex justify-center">
                <span className="bg-sky-900 text-sky-50 text-sm font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow">
                    {competizione.giornata}ª giornata
                </span>
            </div>

            <ToggleVista compatta={compatta} onChange={setCompatta} />

            {/* Intestazione */}
            <div className="bg-linear-to-r from-sky-950 via-sky-800 to-sky-950 text-amber-50 rounded-2xl px-5 py-3 shadow-md flex justify-between items-center text-sm font-semibold uppercase tracking-wider">
                <span>Squadra</span>
                <span>Punti</span>
            </div>

            {/* Classifica */}
            <div className={`grid grid-cols-1 pb-4 ${compatta ? 'gap-2' : 'gap-3'}`}>
                {classifica.map((s, i) => (
                    <SquadraRow
                        key={s.id ?? i}
                        squadra={s}
                        posizione={i + 1}
                        nomeCampionato={serie.nome}
                        compatta={compatta}
                    />
                ))}
            </div>
        </div>
    )
}