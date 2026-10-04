import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerC from '../assets/image/header_preliminariCE.png'

const COMPETIZIONE_ID = 10
const GIRONI = ['A', 'B', 'C', 'D']

const ZONE = [
    { da: 1, a: 2, nome: 'Champions League', logo: 'champions.png', riga: 'bg-sky-50', punti: 'bg-sky-200 text-sky-950', pallino: 'bg-sky-400' },
    { da: 3, a: 4, nome: 'Europa League', logo: 'europaLeague.png', riga: 'bg-amber-50', punti: 'bg-amber-200 text-amber-950', pallino: 'bg-amber-400' },
    { da: 5, a: 6, nome: 'Conference League', logo: 'conference.png', riga: 'bg-lime-50', punti: 'bg-lime-200 text-lime-950', pallino: 'bg-lime-500' },
]

const STATS = [
    { key: 'giocate', label: 'G' },
    { key: 'vinte', label: 'V' },
    { key: 'pari', label: 'N' },
    { key: 'perso', label: 'P' },
    { key: 'gf', label: 'GF' },
    { key: 'gs', label: 'GS' },
]

const getZona = (posizione) => ZONE.find((z) => posizione >= z.da && posizione <= z.a)

function SquadraRow({ squadra, posizione }) {
    const zona = getZona(posizione)

    return (
        <div
            className={`group min-w-0 rounded-2xl border-l-8 border-r-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-3 ${
                zona?.riga ?? 'bg-white'
            }`}
            style={{ borderLeftColor: squadra.border, borderRightColor: squadra.border }}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white shadow-inner">
                        {zona ? (
                            <img src={`../images/${zona.logo}`} alt={zona.nome} className="w-7 h-7 object-contain" />
                        ) : (
                            <span className="font-bold text-gray-400">{posizione}</span>
                        )}
                    </span>
                    <span className="truncate font-bold text-lg text-gray-800 group-hover:text-sky-700 transition-colors">
                        {squadra.nome}
                    </span>
                </div>
                <span className={`text-2xl font-black tabular-nums px-3 py-1 rounded-xl ${zona?.punti ?? 'bg-gray-100 text-sky-950'}`}>
                    {squadra.punteggio || 0}
                </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mt-3">
                {STATS.map(({ key, label }) => (
                    <div key={key} className="bg-white/80 rounded-xl py-1 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{squadra[key] ?? 0}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Girone({ nome, squadre }) {
    return (
        <section className="space-y-3">
            <div className="bg-linear-to-r from-sky-950 via-sky-800 to-sky-950 text-amber-50 rounded-2xl px-5 py-3 shadow-md flex justify-between items-center">
                <h2 className="text-2xl font-extrabold tracking-wide">GIRONE {nome}</h2>
                <span className="text-sm font-semibold uppercase tracking-wider">Punti</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {squadre.map((s, i) => (
                    <SquadraRow key={s.id ?? i} squadra={s} posizione={i + 1} />
                ))}
            </div>
        </section>
    )
}

export default function PreliminariCE() {
    const preliminari = squadreData.classifiche.find((c) => c.id === COMPETIZIONE_ID)
    const competizione = competizioniData.competizioni.find((c) => c.id === COMPETIZIONE_ID)

    const gironi = useMemo(() => {
        const partecipanti = preliminari?.partecipanti ?? []
        return GIRONI.map((nome) => ({
            nome,
            squadre: partecipanti
                .filter((p) => p.girone === nome)
                .sort((a, b) => a.posizione - b.posizione),
        }))
    }, [preliminari])

    if (!preliminari || !competizione) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1
                    className="py-6 px-2 rounded-tl-4xl rounded-br-4xl text-sky-50 shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.3)), url(${headerC})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'bottom',
                    }}
                >
                    <span className="flex flex-col items-center gap-3">
                        <span className="flex items-center gap-3">
                            {ZONE.map((z) => (
                                <img key={z.logo} src={`../images/${z.logo}`} alt={z.nome} className="w-10 h-10 object-contain drop-shadow" />
                            ))}
                        </span>
                        <span className="text-3xl font-bold text-center drop-shadow">Preliminari Coppe Europee</span>
                    </span>
                </h1>
            </Link>

            <div className="flex justify-center">
                <span className="bg-sky-900 text-sky-50 text-sm font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow">
                    {competizione.giornata}ª giornata
                </span>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-semibold text-gray-600">
                {ZONE.map((z) => (
                    <span key={z.nome} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${z.pallino}`} />
                        {z.nome} (posizioni {z.da}-{z.a})
                    </span>
                ))}
            </div>

            {/* Gironi */}
            {gironi.map((g) => (
                <Girone key={g.nome} nome={g.nome} squadre={g.squadre} />
            ))}
        </div>
    )
}