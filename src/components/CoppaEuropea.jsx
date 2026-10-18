import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import classificheData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import { Calendario, Chip, Fila, Logo, Partita, Raccordo, SwitchVista } from './PartiteUI'
import { vincitore } from '../hooks/partiteUtils'
import { CalendarDaysIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import IconaTabellone from './IconaTabellone'

const GIRONI = ['A', 'B']
const NOMI_GIORNATE = ['Andata · 1ª', 'Andata · 2ª', 'Andata · 3ª', 'Ritorno · 1ª', 'Ritorno · 2ª', 'Ritorno · 3ª']

const VISTE = [
    { id: 'classifica', label: 'Classifica', Icona: TableCellsIcon },
    { id: 'calendario', label: 'Calendario', Icona: CalendarDaysIcon },
    { id: 'tabellone', label: 'Tabellone', Icona: IconaTabellone },
]

const STATS = [
    { key: 'giocate', label: 'G' },
    { key: 'vinte', label: 'V' },
    { key: 'pari', label: 'N' },
    { key: 'perso', label: 'P' },
    { key: 'gf', label: 'GF' },
    { key: 'gs', label: 'GS' },
]

// Etichette degli slot dei turni successivi: V1 = vincente della partita 1 del turno prima
const vincenti = (n) => Array.from({ length: n }, (_, k) => [`V${2 * k + 1}`, `V${2 * k + 2}`])

const ZONA = {
    qualificata: { riga: 'bg-emerald-50', chip: 'bg-emerald-500 text-emerald-800', pallino: 'bg-emerald-500' },
    europa: { riga: 'bg-amber-50', chip: 'bg-amber-400 text-amber-800', pallino: 'bg-amber-400' },
}

// Per ogni competizione: chi si qualifica dai gironi e struttura del tabellone (slot del primo turno = posizioni di girone)
const CONFIG = {
    11: {
        qualifica: [
            { da: 1, a: 2, nome: 'Qualificata fase finale', ...ZONA.qualificata },
            { da: 3, a: 3, nome: 'Qualificata fase finale Europa League', ...ZONA.europa },
        ],
        tabellone: [
            { nome: 'Semifinali', slot: [['1A', '2B'], ['1B', '2A']] },
            { nome: 'Finale', slot: vincenti(1) },
        ],
    },
    12: {
        qualifica: [{ da: 1, a: 3, nome: 'Qualificata fase finale', ...ZONA.qualificata }],
        tabellone: [
            { nome: 'Quarti di finale', slot: [['1A', '3B'], ['3CHA', '2B'], ['1B', '3A'], ['3CHB', '2A']] },
            { nome: 'Semifinali', slot: vincenti(2) },
            { nome: 'Finale', slot: vincenti(1) },
        ],
    },
    13: {
        qualifica: [{ da: 1, a: 2, nome: 'Qualificata fase finale', ...ZONA.qualificata }],
        tabellone: [
            { nome: 'Semifinali', slot: [['1A', '2B'], ['1B', '2A']] },
            { nome: 'Finale', slot: vincenti(1) },
        ],
    },
}

// "1A" -> squadra prima del girone A, ma solo a girone concluso (tutte le giornate giocate)
const risolvi = (etichetta, gironi) => {
    const m = /^([1-9])([A-Z])$/.exec(etichetta ?? '')
    const squadre = m && gironi[m[2]]
    if (!squadre?.length) return null
    const giornateTotali = (squadre.length - 1) * 2
    if (squadre.some((s) => (s.giocate ?? 0) < giornateTotali)) return null
    return squadre.find((s) => s.posizione === Number(m[1])) ?? null
}

/* ---------- CLASSIFICA ---------- */

function RigaClassifica({ squadra, posizione, zona }) {
    return (
        <div
            className={`min-w-0 rounded-2xl border-l-8 border-r-2 shadow-md p-3 ${zona?.riga ?? 'bg-white'}`}
            style={{ borderLeftColor: squadra.border, borderRightColor: squadra.border }}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="relative shrink-0">
                        <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white shadow-inner font-black text-gray-700">
                            {posizione}
                        </span>
                        {zona && (
                            <span
                                className={`absolute -top-0.5 -right-0.5 w-3 h-3 flex items-center justify-center rounded-full text-white shadow-2xl ${zona.chip}`}
                            >
                            </span>
                        )}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate font-bold text-lg text-gray-800">{squadra.nome}</p>
                    </div>
                </div>
                <span className="text-2xl font-black tabular-nums text-sky-950">{squadra.punteggio || 0}</span>
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

function Classifica({ gironi, qualifica }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-semibold text-gray-600">
                {qualifica.map((z) => (
                    <span key={z.nome} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${z.pallino}`} />
                        {z.nome} (posizioni {z.da === z.a ? z.da : `${z.da}-${z.a}`})
                    </span>
                ))}
            </div>

            {GIRONI.map((nome) => (
                <section key={nome} className="space-y-3">
                    <div className="bg-linear-to-r from-sky-950 via-sky-800 to-sky-950 text-amber-50 rounded-2xl px-5 py-3 shadow-md flex justify-between items-center">
                        <h2 className="text-2xl font-extrabold tracking-wide">GIRONE {nome}</h2>
                        <span className="text-sm font-semibold uppercase tracking-wider">Punti</span>
                    </div>

                    {gironi[nome].length === 0 ? (
                        <p className="text-center text-gray-400 py-6 text-sm">Nessuna squadra inserita</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {gironi[nome].map((s, i) => (
                                <RigaClassifica
                                    key={s.id ?? i}
                                    squadra={s}
                                    posizione={i + 1}
                                    zona={qualifica.find((z) => i + 1 >= z.da && i + 1 <= z.a)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            ))}
        </div>
    )
}

/* ---------- TABELLONE ---------- */

// turni = [{ nome, partite: [{ match, etichette }] }], l'ultimo è la finale
function Tabellone({ turni }) {
    const prima = turni.slice(0, -1)
    const finale = turni.at(-1).partite[0]

    return (
        <div className="rounded-3xl bg-white border border-sky-100 shadow-md p-3 sm:p-5">
            <div className="max-w-md mx-auto">
                {prima.map((t, i) => (
                    <Fragment key={t.nome}>
                        {i > 0 && (
                            <Raccordo da={prima[i - 1].partite.length} a={t.partite.length} etichetta={t.nome} />
                        )}
                        {i === 0 && (
                            <div className="flex justify-center pb-2">
                                <Chip>{t.nome}</Chip>
                            </div>
                        )}
                        <Fila partite={t.partite.map((p) => p.match)} etichette={t.partite.map((p) => p.etichette)} />
                    </Fragment>
                ))}

                <Raccordo da={prima.at(-1).partite.length} a={1} etichetta="Finale" />

                <div className="relative flex justify-center">
                    <span aria-hidden="true" className="absolute left-[6%] top-1/2 -translate-y-1/2 text-5xl drop-shadow">
                        🏆
                    </span>
                    <div className="w-36 sm:w-52">
                        <Partita match={finale.match} etichette={finale.etichette} grande titolo="Finale" />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---------- PAGINA ---------- */

export default function CoppaEuropea({ id }) {
    const config = CONFIG[id]
    const coppa = classificheData.classifiche.find((c) => c.id === id)
    const competizione = competizioniData.competizioni.find((c) => c.id === id)

    // Se il tabellone ha già dati si apre quello, altrimenti la classifica
    const [vista, setVista] = useState(() =>
        (coppa?.turni ?? []).some((t) => t.fase === 'tabellone' && t.partite?.length) ? 'tabellone' : 'classifica'
    )

    const gironi = useMemo(() => {
        const partecipanti = coppa?.partecipanti ?? []
        return Object.fromEntries(
            GIRONI.map((g) => [g, partecipanti.filter((p) => p.girone === g).sort((a, b) => a.posizione - b.posizione)])
        )
    }, [coppa])

    // Tabellone normalizzato sulla struttura ufficiale; gli slot vuoti mostrano le etichette (1A, V1…)
    const tabellone = useMemo(() => {
        const dati = (coppa?.turni ?? []).filter((t) => t.fase === 'tabellone')
        return (config?.tabellone ?? []).map((turno, i) => ({
            nome: turno.nome,
            partite: turno.slot.map((etichette, k) => {
                const m = dati[i]?.partite?.[k] ?? null
                const casa = m?.squadraCasa ?? risolvi(etichette[0], gironi)
                const ospite = m?.squadraOspite ?? risolvi(etichette[1], gironi)
                const match = m
                    ? { ...m, squadraCasa: casa, squadraOspite: ospite }
                    : casa || ospite
                    ? { squadraCasa: casa, squadraOspite: ospite, conclusa: false }
                    : null
                return { match, etichette }
            }),
        }))
    }, [coppa, config, gironi])

    // Calendario: 6 giornate dei gironi + i turni del tabellone
    const calendario = useMemo(() => {
        const turniGironi = (coppa?.turni ?? []).filter((t) => t.fase === 'gironi')
        return [
            ...NOMI_GIORNATE.map((nome, i) => ({ id: `g${i + 1}`, nome, partite: turniGironi[i]?.partite ?? [] })),
            ...tabellone.map((t) => ({ id: t.nome, nome: t.nome, partite: t.partite.map((p) => p.match) })),
        ]
    }, [coppa, tabellone])

    if (!config || !coppa) return null

    const finale = tabellone.at(-1).partite[0].match
    const v = vincitore(finale)
    const campione = v === 'casa' ? finale.squadraCasa : v === 'ospite' ? finale.squadraOspite : null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3 pb-6">
            <Link to="/competizioni" className="block">
                <h1 className="py-6 rounded-tl-4xl rounded-br-4xl bg-linear-to-br from-sky-900 via-sky-700 to-sky-500 text-sky-50 shadow-lg">
                    <span className="flex flex-col items-center gap-1">
                        {competizione?.img && <img src={competizione.img} alt="" className="w-16 h-16 object-contain" />}
                        <span className="text-3xl sm:text-4xl font-medium tracking-tight drop-shadow">{coppa.nome}</span>
                        {coppa.stagione && <span className="text-sm font-semibold text-sky-100">Stagione {coppa.stagione}</span>}
                    </span>
                </h1>
            </Link>

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

            <SwitchVista opzioni={VISTE} valore={vista} onChange={setVista} />

            {vista === 'classifica' && <Classifica gironi={gironi} qualifica={config.qualifica} />}
            {vista === 'calendario' && <Calendario turni={calendario} />}
            {vista === 'tabellone' && <Tabellone turni={tabellone} />}
        </div>
    )
}