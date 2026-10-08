import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import classificheData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'

const COMPETIZIONE_ID = 5

// Struttura ufficiale: l'ordine delle partite nel JSON è l'ordine nel tabellone
// (la partita i degli ottavi alimenta il quarto floor(i / 2), e così via)
const FORMATO = [
    { nome: 'Preliminari', n: 8 },
    { nome: 'Ottavi', n: 8 },
    { nome: 'Quarti', n: 4 },
    { nome: 'Semifinali', n: 2 },
    { nome: 'Finale', n: 1 },
]

const VISTE = [
    { id: 'tabellone', label: 'Tabellone' },
    { id: 'calendario', label: 'Calendario' },
]

/* ---------- UTILITÀ ---------- */

const vincitore = (m) => {
    if (!m?.conclusa) return null
    if (m.golCasa !== m.golOspite) return m.golCasa > m.golOspite ? 'casa' : 'ospite'
    if (m.rigoriCasa != null && m.rigoriCasa !== m.rigoriOspite) {
        return m.rigoriCasa > m.rigoriOspite ? 'casa' : 'ospite'
    }
    return null
}

function Logo({ sq, className }) {
    const [errore, setErrore] = useState(false)
    const src = sq?.logo ?? (sq?.id != null ? `../images/logos/${sq.id}.png` : null)

    if (!src || errore) {
        return (
            <span className={`${className} shrink-0 flex items-center justify-center rounded-full bg-sky-100 text-sky-700 text-[9px] font-black`}>
                {sq?.nome?.slice(0, 2).toUpperCase() ?? '?'}
            </span>
        )
    }
    return (
        <img
            src={src}
            alt=""
            onError={() => setErrore(true)}
            className={`${className} shrink-0 rounded-full object-contain bg-white`}
        />
    )
}

function Squadra({ sq, gol, rigori, conclusa, vince, grande = false }) {
    return (
        <div className={`flex items-center gap-2 px-2.5 ${grande ? 'py-2' : 'py-1'} ${vince ? 'bg-emerald-50' : ''}`}>
            <Logo sq={sq} className={grande ? 'w-8 h-8' : 'w-5 h-5'} />
            <span
                className={`flex-1 min-w-0 truncate ${grande ? 'text-sm sm:text-base' : 'text-xs'} ${
                    !sq
                        ? 'italic text-gray-400'
                        : vince
                        ? 'font-extrabold text-gray-900'
                        : 'font-semibold text-gray-600'
                }`}
            >
                {sq?.nome ?? 'Da definire'}
            </span>
            {conclusa && (
                <span className="flex items-baseline gap-1 tabular-nums">
                    {rigori != null && <span className="text-[10px] text-gray-400">({rigori})</span>}
                    <span className={`font-black ${grande ? 'text-xl' : 'text-sm'} ${vince ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {gol}
                    </span>
                </span>
            )}
        </div>
    )
}

/* ---------- TABELLONE ---------- */

const codice = (sq) => (sq ? sq.codice || sq.nome?.slice(0, 3).toUpperCase() || '?' : 'N/D')

const Chip = ({ children, className = '' }) => (
    <span
        className={`rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-sky-700 ${className}`}
    >
        {children}
    </span>
)

function Lato({ sq, vince, perde, grande }) {
    return (
        <div className="flex flex-col items-center gap-0.5 min-w-0">
            <Logo
                sq={sq}
                className={`${grande ? 'w-11 h-11 sm:w-14 sm:h-14' : 'w-7 h-7 sm:w-9 sm:h-9'} ${
                    vince ? 'ring-2 ring-emerald-400' : ''
                } ${perde ? 'opacity-50 grayscale' : ''} ${!sq ? 'opacity-60' : ''}`}
            />
            <span
                className={`max-w-full truncate font-bold ${grande ? 'text-xs' : 'text-[9px] sm:text-[11px]'} ${
                    perde ? 'text-gray-400' : sq ? 'text-gray-800' : 'text-gray-300'
                }`}
            >
                {codice(sq)}
            </span>
        </div>
    )
}

function Partita({ match, grande = false, titolo }) {
    const v = vincitore(match)

    return (
        <div
            className={`rounded-xl border shadow-sm overflow-hidden ${
                match ? 'border-sky-200 bg-white' : 'border-dashed border-sky-200 bg-sky-50/60'
            } ${grande && v ? 'ring-2 ring-amber-400' : ''}`}
        >
            {titolo && (
                <div className="bg-amber-400 text-amber-950 text-center text-[10px] font-black uppercase tracking-widest py-0.5">
                    {titolo}
                </div>
            )}
            <div className="p-1.5 sm:p-2">
                <div className="grid grid-cols-2 gap-1">
                    <Lato sq={match?.squadraCasa} vince={v === 'casa'} perde={v === 'ospite'} grande={grande} />
                    <Lato sq={match?.squadraOspite} vince={v === 'ospite'} perde={v === 'casa'} grande={grande} />
                </div>

                <div className="mt-1 border-t border-sky-100 pt-0.5 text-center">
                    {match?.conclusa ? (
                        <>
                            <p className={`font-black tabular-nums leading-tight ${grande ? 'text-2xl' : 'text-sm sm:text-base'}`}>
                                <span className={v === 'ospite' ? 'text-gray-400' : 'text-gray-900'}>{match.golCasa}</span>
                                <span className="text-gray-300"> : </span>
                                <span className={v === 'casa' ? 'text-gray-400' : 'text-gray-900'}>{match.golOspite}</span>
                            </p>
                            {match.rigoriCasa != null && (
                                <p className="text-[9px] sm:text-[10px] text-gray-500">
                                    rig. {match.rigoriCasa}-{match.rigoriOspite}
                                </p>
                            )}
                        </>
                    ) : (
                        <span className="text-[10px] sm:text-xs font-semibold text-sky-600">
                            {match?.orario || '–'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// Una riga di partite: 4, 2 o 1 card, sempre centrate sulla stessa griglia a 4 colonne
function Fila({ partite }) {
    const n = partite.length
    return (
        <div className="grid grid-cols-4">
            {partite.map((m, i) => (
                <div key={i} className="flex justify-center" style={{ gridColumn: `span ${4 / n}` }}>
                    <div className="px-1" style={{ width: `${n * 25}%` }}>
                        <Partita match={m} />
                    </div>
                </div>
            ))}
        </div>
    )
}

const centro = (i, n) => ((i + 0.5) / n) * 100

// Collega una riga con "da" card (turno precedente) a una con "a" card (turno successivo).
// Nella metà bassa "invertito" ribalta il disegno: il turno precedente sta sotto.
function Raccordo({ da, a, invertito = false, etichetta }) {
    const tratti = []
    if (da === a) {
        for (let i = 0; i < a; i++) tratti.push(`M${centro(i, a)} 0V20`)
    } else {
        for (let k = 0; k < a; k++) {
            tratti.push(
                `M${centro(2 * k, da)} 0V10H${centro(2 * k + 1, da)}V0M${centro(k, a)} 10V20`
            )
        }
    }

    return (
        <div className="relative h-10">
            <svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full"
                style={invertito ? { transform: 'scaleY(-1)' } : undefined}
            >
                <path
                    d={tratti.join('')}
                    className="fill-none stroke-sky-300"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            {etichetta && (
                <Chip className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{etichetta}</Chip>
            )}
        </div>
    )
}

function Tabellone({ turni }) {
    const turniPrecedenti = turni.slice(0, -1) // tutto tranne la finale
    const finale = turni.at(-1).partite[0]

    // Metà alta: prima metà di ogni turno, dal primo turno in giù.
    // Metà bassa: seconda metà di ogni turno, dalla finale verso l'ultimo turno.
    const alto = turniPrecedenti.map((t) => ({
        nome: t.nome,
        partite: t.partite.slice(0, t.partite.length / 2),
    }))
    const basso = turniPrecedenti
        .map((t) => ({ nome: t.nome, partite: t.partite.slice(t.partite.length / 2) }))
        .reverse()

    return (
        <div className="rounded-3xl bg-white border border-sky-100 shadow-md p-3 sm:p-5">
            <div className="max-w-md mx-auto">
                {/* Metà alta */}
                <div className="flex justify-center pb-2">
                    <Chip>{alto[0].nome}</Chip>
                </div>
                {alto.map((r, i) => (
                    <Fragment key={r.nome}>
                        {i > 0 && (
                            <Raccordo
                                da={alto[i - 1].partite.length}
                                a={r.partite.length}
                                etichetta={r.nome}
                            />
                        )}
                        <Fila partite={r.partite} />
                    </Fragment>
                ))}

                <Raccordo da={alto.at(-1).partite.length} a={1} />

                {/* Finale */}
                <div className="relative flex justify-center">
                    <span
                        aria-hidden="true"
                        className="absolute left-[6%] top-1/2 -translate-y-1/2 text-5xl drop-shadow"
                    >
                        🏆
                    </span>
                    <div className="w-36 sm:w-52">
                        <Partita match={finale} grande titolo="Finale" />
                    </div>
                </div>

                <Raccordo da={basso[0].partite.length} a={1} invertito />

                {/* Metà bassa (speculare) */}
                {basso.map((r, i) => (
                    <Fragment key={r.nome}>
                        {i > 0 && (
                            <Raccordo
                                da={r.partite.length}
                                a={basso[i - 1].partite.length}
                                invertito
                                etichetta={basso[i - 1].nome}
                            />
                        )}
                        <Fila partite={r.partite} />
                    </Fragment>
                ))}
                <div className="flex justify-center pt-2">
                    <Chip>{basso.at(-1).nome}</Chip>
                </div>
            </div>
        </div>
    )
}
/* ---------- CALENDARIO ---------- */

function Calendario({ turni }) {
    // Parte dal primo turno ancora da completare (o dall'ultimo)
    const [indice, setIndice] = useState(() => {
        const i = turni.findIndex((t) => t.partite.some((m) => !m?.conclusa))
        return i === -1 ? turni.length - 1 : i
    })

    const partite = turni[indice].partite.filter(Boolean)

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-evenly gap-2 p-2 bg-sky-100 rounded-2xl shadow-inner">
                {turni.map((t, i) => (
                    <button
                        key={t.id}
                        onClick={() => setIndice(i)}
                        aria-pressed={i === indice}
                        className={` px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                            i === indice ? 'bg-sky-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-sky-200'
                        }`}
                    >
                        {t.nome}
                    </button>
                ))}
            </div>

            {partite.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-2xl">Turno da definire</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partite.map((m, k) => {
                        const v = vincitore(m)
                        return (
                            <div
                                key={m.id ?? k}
                                className={`min-w-0 rounded-2xl bg-white shadow-md border-l-8 overflow-hidden ${
                                    m.conclusa ? 'border-emerald-500' : 'border-amber-400'
                                }`}
                            >
                                <div className="flex items-center justify-between px-3 pt-2">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700">{turni[indice].nome}</span>
                                    <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                            m.conclusa ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {m.conclusa ? 'Conclusa' : m.orario || 'Da giocare'}
                                    </span>
                                </div>
                                <Squadra grande sq={m.squadraCasa} gol={m.golCasa} rigori={m.rigoriCasa} conclusa={m.conclusa} vince={v === 'casa'} />
                                <div className="mx-3 h-px bg-sky-100" />
                                <Squadra grande sq={m.squadraOspite} gol={m.golOspite} rigori={m.rigoriOspite} conclusa={m.conclusa} vince={v === 'ospite'} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/* ---------- CONTROLLO VISTA ---------- */

function SwitchVista({ valore, onChange }) {
    const indice = VISTE.findIndex((v) => v.id === valore)

    return (
        <div
            role="group"
            aria-label="Vista"
            className="relative mx-auto grid grid-cols-2 w-72 p-1 bg-sky-100 rounded-tl-2xl rounded-br-2xl shadow-inner"
        >
            <span
                aria-hidden="true"
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-tl-xl rounded-br-xl bg-sky-700 shadow-md transition-transform duration-300 ${
                    indice === 1 ? 'translate-x-full' : ''
                }`}
            />
            {VISTE.map((v) => (
                <button
                    key={v.id}
                    type="button"
                    aria-pressed={v.id === valore}
                    onClick={() => onChange(v.id)}
                    className={`relative z-10 py-1.5 text-sm font-bold transition-colors duration-300 cursor-pointer rounded-tl-xl rounded-br-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 ${
                        v.id === valore ? 'text-white' : 'text-sky-800'
                    }`}
                >
                    {v.label}
                </button>
            ))}
        </div>
    )
}

/* ---------- PAGINA ---------- */

export default function CoppaItalia() {
    const [vista, setVista] = useState('tabellone')

    const coppa = classificheData.classifiche.find((c) => c.id === COMPETIZIONE_ID)
    const competizione = competizioniData.competizioni.find((c) => c.id === COMPETIZIONE_ID)

    // Normalizza i turni sul formato ufficiale e completa le partite mancanti con null
    const turni = useMemo(() => {
        const dati = coppa?.partecipanti ?? []
        return FORMATO.map((f, i) => ({
            id: dati[i]?.id ?? f.nome,
            nome: dati[i]?.nome ?? f.nome,
            partite: Array.from({ length: f.n }, (_, k) => dati[i]?.partite?.[k] ?? null),
        }))
    }, [coppa])

    if (!coppa) return null

    const finale = turni.at(-1).partite[0]
    const v = vincitore(finale)
    const campione = v === 'casa' ? finale.squadraCasa : v === 'ospite' ? finale.squadraOspite : null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3 pb-6">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1 className="py-6 rounded-tl-4xl rounded-br-4xl bg-linear-to-br from-sky-900 via-sky-700 to-sky-500 text-sky-50 shadow-lg">
                    <span className="flex justify-evenly items-center gap-1">
                        {competizione?.img && (
                            <img src={competizione.img} alt="" className="w-16 h-16 object-contain" />
                        )}
                        <span className="text-3xl sm:text-4xl font-medium tracking-tight drop-shadow">{coppa.nome}</span>
                        {coppa.stagione && (
                            <span className="text-sm font-semibold text-sky-100">Stagione {coppa.stagione}</span>
                        )}
                    </span>
                </h1>
            </Link>

            {competizione?.giornata != null && (
                <div className="flex justify-center">
                    <span className="bg-sky-900 text-sky-50 text-sm font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow">
                        {competizione.giornata}ª giornata
                    </span>
                </div>
            )}

            {/* Vincitrice */}
            {campione && (
                <div className="flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-amber-400 to-yellow-300 text-amber-950 p-4 shadow-lg">
                    <span className="text-3xl">🏆</span>
                    <Logo sq={campione} className="w-12 h-12" />
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest">Vincitrice</p>
                        <p className="text-2xl font-black leading-tight">{campione.nome}</p>
                    </div>
                </div>
            )}

            <SwitchVista valore={vista} onChange={setVista} />

            {vista === 'tabellone' ? <Tabellone turni={turni} /> : <Calendario turni={turni} />}
        </div>
    )
}