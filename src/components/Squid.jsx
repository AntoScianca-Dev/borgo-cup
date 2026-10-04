import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerS from '../assets/image/header_squid.png'

// Unica fonte di verità per gli step
const STEPS = [
    { key: 'step1', soglia: 70 },
    { key: 'step2', soglia: 73 },
    { key: 'step3', soglia: 75 },
    { key: 'step4', soglia: 78 },
    { key: 'step5', soglia: 80 },
]

// Eliminati: chi è arrivato più lontano sta più in alto (si confronta dall'ultimo step)
const confrontaEliminati = (a, b) => {
    for (let i = STEPS.length - 1; i >= 0; i--) {
        const k = STEPS[i].key
        const diff = (b[k] || 0) - (a[k] || 0)
        if (diff !== 0) return diff
    }
    return 0
}

function StepPills({ squadra, eliminata }) {
    return (
        <div className="grid grid-cols-5 gap-1.5 mt-3">
            {STEPS.map(({ key, soglia }) => {
                const valore = squadra[key] || 0
                const stile = !valore
                    ? 'bg-gray-100 text-gray-400'
                    : valore >= soglia
                    ? 'bg-lime-100 text-lime-800'
                    : eliminata
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-amber-100 text-amber-800'
                return (
                    <div key={key} className={`text-center text-xs sm:text-sm font-semibold rounded-full py-1 ${stile}`}>
                        {valore ? valore.toFixed(1) : '–'}
                    </div>
                )
            })}
        </div>
    )
}

function SquadraRow({ squadra, posizione, eliminata = false }) {
    const accento = eliminata ? 'border-pink-500' : 'border-lime-500'

    return (
        <div className={`group min-w-0 bg-white rounded-2xl border-l-8 ${accento} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-3`}>
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
            <StepPills squadra={squadra} eliminata={eliminata} />
        </div>
    )
}

export default function Squid({ id }) {
    const serie = squadreData.classifiche.find((c) => c.id === id)
    const competizione = competizioniData.competizioni.find((c) => c.id === id)

    const { attivi, eliminati } = useMemo(() => {
        const partecipanti = serie?.partecipanti ?? []
        return {
            attivi: partecipanti
                .filter((p) => p.attivo === 'SI')
                .sort((a, b) => b.punteggio - a.punteggio),
            eliminati: partecipanti.filter((p) => p.attivo === 'NO').sort(confrontaEliminati),
        }
    }, [serie])

    if (!serie || !competizione) return null

    const giornata = competizione.giornata
    const vincitore = competizione.stato === 'Terminata' ? attivi[0] : null

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1
                    className="py-6 rounded-tl-4xl rounded-br-4xl text-sky-50 text-4xl font-medium tracking-tight shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.35), rgba(131, 24, 67, 0.35)), url(${headerS})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <span className="flex flex-col items-center gap-1">
                        <img src="../images/squid.png" alt="Logo Squid Game" className="w-16 h-16 object-contain rounded-full" />
                        <span className="drop-shadow">{serie.nome}</span>
                    </span>
                </h1>
            </Link>

            {/* Vincitore */}
            {vincitore && (
                <div
                    className="relative overflow-hidden rounded-3xl p-6 text-white border border-pink-500/60 shadow-2xl shadow-pink-600/30"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(131, 24, 67, 0.55)), url(${headerS})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="relative shrink-0 pt-4">
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl drop-shadow">👑</span>
                                <img
                                    src={`../images/logos/${vincitore.id}.png`}
                                    alt={`Logo ${vincitore.nome}`}
                                    className="w-20 h-20 rounded-2xl object-contain bg-white/90 p-1 ring-4 ring-pink-400/70"
                                />
                            </div>
                            <div className="min-w-0">
                                <span className="inline-block text-[11px] font-black uppercase tracking-widest text-pink-300 bg-pink-950/80 border border-pink-500/50 px-3 py-0.5 rounded-full">
                                    Vincitore
                                </span>
                                <h2 className="text-3xl font-black tracking-tight truncate mt-1">{vincitore.nome}</h2>
                            </div>
                        </div>
                        <div className="text-center bg-black/40 border border-pink-500/40 px-5 py-2 rounded-2xl">
                            <span className="block text-[10px] font-bold tracking-widest text-pink-300 uppercase">Punti</span>
                            <span className="text-3xl font-black text-lime-400">
                                {(vincitore.punteggio || 0).toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Legenda step */}
            <div className="bg-linear-to-r from-pink-800 via-pink-700 to-pink-800 text-amber-50 rounded-2xl px-4 py-3 shadow-md">
                <div className="flex justify-between text-sm font-semibold uppercase tracking-wider">
                    <span>Squadra</span>
                    <span>Punti</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mt-2 text-center">
                    {STEPS.map(({ key, soglia }, i) => (
                        <div key={key} className={i < giornata ? 'font-bold' : 'font-light opacity-70'}>
                            <p className="text-xs sm:text-sm">STEP {i + 1}</p>
                            <p className="text-xs">≥{soglia}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Attivi */}
            <div className="grid grid-cols-1 gap-3">
                {attivi.map((s, i) => (
                    <SquadraRow key={s.id} squadra={s} posizione={i + 1} />
                ))}
            </div>

            {/* Separatore eliminati */}
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