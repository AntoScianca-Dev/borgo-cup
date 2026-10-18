import { useState } from 'react'
import { vincitore, codice } from '../hooks/partiteUtils'

// Se la squadra non è ancora nota mostra l'etichetta dello slot (es. "1A", "V1")
function Lato({ sq, etichetta, vince, perde, grande }) {
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
                    perde ? 'text-gray-400' : sq ? 'text-gray-800' : 'text-sky-400'
                }`}
            >
                {sq ? codice(sq) : etichetta ?? 'N/D'}
            </span>
        </div>
    )
}

export function Partita({ match, etichette, grande = false, titolo }) {
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
                    <Lato sq={match?.squadraCasa} etichetta={etichette?.[0]} vince={v === 'casa'} perde={v === 'ospite'} grande={grande} />
                    <Lato sq={match?.squadraOspite} etichetta={etichette?.[1]} vince={v === 'ospite'} perde={v === 'casa'} grande={grande} />
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
                        <span className="text-[10px] sm:text-xs font-semibold text-sky-600">{match?.orario || '–'}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

// Una riga di 4, 2 o 1 card sulla stessa griglia a 4 colonne
export function Fila({ partite, etichette }) {
    const n = partite.length
    return (
        <div className="grid grid-cols-4">
            {partite.map((m, i) => (
                <div key={i} className="flex justify-center" style={{ gridColumn: `span ${4 / n}` }}>
                    <div className="px-1" style={{ width: `${n * 25}%` }}>
                        <Partita match={m} etichette={etichette?.[i]} />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Switch a N opzioni: [{ id, label }]
export function SwitchVista({ opzioni, valore, onChange }) {
    const n = opzioni.length
    const indice = Math.max(0, opzioni.findIndex((o) => o.id === valore))

    return (
        <div
            role="group"
            aria-label="Vista"
            className="relative mx-auto grid w-full max-w-md p-1 bg-sky-100 rounded-tl-2xl rounded-br-2xl shadow-inner"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
            <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-1 rounded-tl-xl rounded-br-xl bg-sky-700 shadow-md transition-transform duration-300"
                style={{ width: `calc((100% - 0.5rem) / ${n})`, transform: `translateX(${indice * 100}%)` }}
            />
            {opzioni.map(({ id, label, Icona }) => (
                <button
                    key={id}
                    type="button"
                    aria-pressed={id === valore}
                    onClick={() => onChange(id)}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer rounded-tl-xl rounded-br-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 ${
                        id === valore ? 'text-white' : 'text-sky-800'
                    }`}
                >
                    {Icona && <Icona className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />}
                    {label}
                </button>
            ))}
        </div>
    )
}

// turni = [{ id, nome, partite: [match | null] }]
export function Calendario({ turni }) {
    // Parte dal primo turno con partite da giocare, altrimenti dall'ultimo con dati
    const [indice, setIndice] = useState(() => {
        const daGiocare = turni.findIndex((t) => t.partite.some((m) => m && !m.conclusa))
        if (daGiocare !== -1) return daGiocare
        const conDati = turni.map((t, i) => (t.partite.some(Boolean) ? i : -1)).filter((i) => i !== -1)
        return conDati.at(-1) ?? 0
    })

    const turno = turni[indice]
    const partite = turno.partite.filter(Boolean)

    return (
        <div className="space-y-4">
            <div className="flex gap-1 flex-wrap justify-evenly p-2 bg-sky-100 rounded-2xl shadow-inner">
                {turni.map((t, i) => (
                    <button
                        key={t.id}
                        onClick={() => setIndice(i)}
                        aria-pressed={i === indice}
                        className={`snap-start shrink-0 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                            i === indice ? 'bg-sky-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-sky-200'
                        }`}
                    >
                        {t.nome}
                    </button>
                ))}
            </div>

            {partite.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">Turno da definire</p>
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
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700">
                                        {m.girone ? `Girone ${m.girone}` : turno.nome}
                                    </span>
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

export function Logo({ sq, className }) {
    const [errore, setErrore] = useState(false)
    const src = sq?.logo ?? (sq?.id != null ? `/images/logos/${sq.id}.png` : null)

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

export function Squadra({ sq, gol, rigori, conclusa, vince, grande = false }) {
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

export const Chip = ({ children, className = '' }) => (
    <span
        className={`rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-sky-700 ${className}`}
    >
        {children}
    </span>
)

const centro = (i, n) => ((i + 0.5) / n) * 100

// Collega una riga con "da" card (turno precedente) a una con "a" card (turno successivo).
// Nella metà bassa "invertito" ribalta il disegno: il turno precedente sta sotto.
export function Raccordo({ da, a, invertito = false, etichetta }) {
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