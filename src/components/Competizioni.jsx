import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import competizioniData from '../assets/data/competizioni.json'

const STATI = {
    Attivo: {
        pill: 'bg-green-100 text-green-800 border-green-400',
        accent: 'border-green-500',
        bar: 'bg-green-500',
        dot: 'bg-green-500',
        attivo: 'bg-green-100 text-green-900 border-green-500',
    },
    'In attesa': {
        pill: 'bg-yellow-100 text-yellow-800 border-yellow-400',
        accent: 'border-yellow-400',
        bar: 'bg-yellow-400',
        dot: 'bg-yellow-400',
        attivo: 'bg-yellow-100 text-yellow-900 border-yellow-500',
    },
    Terminata: {
        pill: 'bg-red-100 text-red-800 border-red-400',
        accent: 'border-red-400',
        bar: 'bg-red-500',
        dot: 'bg-red-500',
        attivo: 'bg-red-100 text-red-900 border-red-500',
    },
}

const STATO_DEFAULT = {
    pill: 'bg-gray-100 text-gray-700 border-gray-300',
    accent: 'border-gray-300',
    bar: 'bg-gray-400',
    dot: 'bg-gray-400',
}

const FILTRI = Object.keys(STATI)

const calcAvanzamento = (comp) => {
    if (!comp.totale) return 0
    return Math.min(100, Math.max(0, (comp.giornata * 100) / comp.totale))
}

function CompetizioneCard({ comp }) {
    const stile = STATI[comp.stato] ?? STATO_DEFAULT
    const perc = calcAvanzamento(comp)
    const consultabile = comp.stato === 'Attivo' || comp.stato === 'Terminata'

    return (
        <article
            className={`group min-w-0 flex flex-col gap-4 bg-white rounded-2xl border-t-8 ${stile.accent} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5`}
        >
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{comp.nome}</h2>
                <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${stile.pill}`}>
                    {comp.stato}
                </span>
            </div>

            <p className="text-sm text-gray-600">
                <span className="font-bold text-sky-800 text-base">{comp.squadre}</span> squadre partecipanti
            </p>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50 rounded-xl p-3">
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-sky-600">Inizio</p>
                    <p className="text-sm font-bold text-gray-800">{comp.inizio}</p>
                </div>
                {comp.fine !== undefined && (
                    <div className="bg-sky-50 rounded-xl p-3">
                        <p className="text-[11px] uppercase tracking-wide font-semibold text-sky-600">Fine</p>
                        <p className="text-sm font-bold text-gray-800">{comp.fine}</p>
                    </div>
                )}
            </div>

            {comp.avanzamento !== undefined && (
                <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-gray-500 uppercase tracking-wide">Avanzamento</span>
                        <span className="text-sky-800">{perc.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`${stile.bar} h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${perc}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="mt-auto">
                {consultabile ? (
                    <Link
                        to={`/competizioni${comp.link}`}
                        className="block w-full bg-sky-700 text-white text-center font-semibold py-2 rounded-xl hover:bg-sky-800 active:scale-95 transition"
                    >
                        Vedi classifica
                    </Link>
                ) : (
                    <p className="text-center text-sm text-gray-400 font-medium py-2">Non ancora iniziata</p>
                )}
            </div>
        </article>
    )
}

export default function Competizioni() {
    const competizioni = competizioniData.competizioni || competizioniData
    const [selectedFilter, setSelectedFilter] = useState(null)

    const valide = useMemo(
        () => competizioni.filter((c) => c.stato !== 'None'),
        [competizioni]
    )

    const filtrate = useMemo(
        () =>
            valide
                .filter((c) => !selectedFilter || c.stato === selectedFilter)
                .sort((a, b) => a.nome.localeCompare(b.nome)),
        [valide, selectedFilter]
    )

    const toggleFilter = (stato) => setSelectedFilter((prev) => (prev === stato ? null : stato))

    return (
        <div className="max-w-5xl mx-auto space-y-8 px-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-sky-900">Competizioni</h1>

                <div className="flex flex-wrap gap-2">
                    {FILTRI.map((stato) => {
                        const count = valide.filter((c) => c.stato === stato).length
                        const isActive = selectedFilter === stato

                        return (
                            <button
                                key={stato}
                                onClick={() => toggleFilter(stato)}
                                aria-pressed={isActive}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? `${STATI[stato].attivo} shadow-md scale-105`
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${STATI[stato].dot}`} />
                                <span>{stato}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-black/10">{count}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtrate.map((comp) => (
                    <CompetizioneCard key={comp.id} comp={comp} />
                ))}
            </div>

            {filtrate.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-medium">
                    Nessuna competizione trovata per questo stato.
                </div>
            )}
        </div>
    )
}