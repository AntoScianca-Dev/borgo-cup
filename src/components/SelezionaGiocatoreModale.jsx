import { useMemo, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const RUOLO_ORDER = { P: 1, D: 2, C: 3, A: 4 }

// Un'unica griglia condivisa da intestazione e righe: ruolo | nome | squadra | quotazione.
// Colonne fisse per ruolo/squadra/quotazione, nome flessibile (min-w-0 permette il truncate),
// così ogni giocatore sta su una sola riga e le colonne restano allineate.
const GRID = 'flex gap-3 items-center'

const getQuot = (p) => Number(p.quotazione ?? p.quotazioneAttuale ?? 0)

// Ordinamenti di partenza
const DEFAULT_SORT_A = { key: 'quotazione', dir: 'desc' } // acquisto: quotazione dalla più alta
const DEFAULT_SORT_V = { key: 'ruolo', dir: 'asc' } // vendita: per ruolo

// dir = verso di partenza al primo click su una colonna
const COLONNE = [
    { key: 'ruolo', label: 'R', dir: 'asc', align: 'text-center w-10' },
    { key: 'nome', label: 'Giocatore', dir: 'asc', align: 'w-80' },
    { key: 'squadraA', label: 'Sq.', dir: 'asc', align: 'w-15' },
    { key: 'quotazione', label: 'Q.A.', dir: 'desc', align: 'w-15 text-right' },
]

const confronta = (a, b, key) => {
    if (key === 'quotazione') return getQuot(a) - getQuot(b)
    if (key === 'ruolo') return (RUOLO_ORDER[a.ruolo] || 99) - (RUOLO_ORDER[b.ruolo] || 99)
    return String(a[key] || '').localeCompare(String(b[key] || ''), 'it')
}

/*
 * Il contenuto vive in un componente a parte: Transition lo smonta alla chiusura,
 * quindi a ogni apertura ordinamento e ricerca ripartono dai valori iniziali
 * senza bisogno di useEffect.
 */
function ContenutoModale({ onClose, onSelect, giocatori, titolo, sottotitolo, colore, showRuolo, renderRuolo }) {
    const [sort, setSort] = useState(showRuolo ? DEFAULT_SORT_V : DEFAULT_SORT_A)
    const [search, setSearch] = useState('')

    const toggleSort = (col) => {
        setSort((prev) =>
            prev.key === col.key
                ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                : { key: col.key, dir: col.dir }
        )
    }

    const lista = useMemo(() => {
        const q = search.trim().toLowerCase()
        const filtrata = q
            ? giocatori.filter(
                  (p) =>
                      (p.nome || '').toLowerCase().includes(q) ||
                      (p.squadraA || '').toLowerCase().includes(q)
              )
            : giocatori
        const verso = sort.dir === 'asc' ? 1 : -1

        return [...filtrata].sort((a, b) => {
            const res = confronta(a, b, sort.key)
            if (res !== 0) return res * verso
            // spareggio stabile: quotazione desc, poi nome
            return getQuot(b) - getQuot(a) || (a.nome || '').localeCompare(b.nome || '', 'it')
        })
    }, [giocatori, search, sort])

    return (
        <>
            {/* Header */}
            <div
                className="relative z-10 px-5 pt-5 pb-5 text-white"
                style={{ background: `linear-gradient(135deg, ${colore}, ${colore}99)` }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/40 text-white font-bold touch-manipulation transition cursor-pointer"
                    aria-label="Chiudi"
                >
                    ✕
                </button>
                {sottotitolo && (
                    <p className="text-[11px] uppercase tracking-widest font-semibold opacity-80">{sottotitolo}</p>
                )}
                <DialogTitle className="text-2xl font-extrabold drop-shadow pr-10">{titolo}</DialogTitle>

                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cerca per nome o squadra..."
                    className="mt-4 w-full px-4 py-2.5 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
            </div>

            {/* Intestazione ordinabile (stessa griglia delle righe) */}
            <div className={`${GRID} justify-between px-5 py-2 bg-sky-100 text-sky-900 border-b border-sky-200`}>
                {COLONNE.map((c) => {
                    const attiva = sort.key === c.key
                    return (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => toggleSort(c)}
                            aria-sort={attiva ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                            className={`flex ${c.align} items-center gap-0.5 whitespace-nowrap text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-sky-600 transition ${attiva ? 'text-sky-600' : ''}`}
                        >
                            {c.label}
                            <span className="inline-block w-2.5 text-[9px]">
                                {attiva ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Righe */}
            <div className="max-h-[50vh] overflow-y-auto divide-y divide-gray-100">
                {lista.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 italic py-8">
                        Nessun calciatore trovato.
                    </p>
                ) : (
                    lista.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                                onSelect(p)
                                onClose()
                            }}
                            className={`${GRID} justify-between w-full px-5 py-2.5 text-left hover:bg-sky-50 active:bg-sky-100 transition cursor-pointer`}
                        >
                            <span className="flex justify-center">
                                {renderRuolo ? renderRuolo(p.ruolo) : p.ruolo}
                            </span>
                            <span className="text-base w-80 font-semibold text-gray-800 truncate">{p.nome}</span>
                            <span className="text-left text-xs w-15 font-semibold text-gray-500 uppercase">
                                {(p.squadraA || '').slice(0, 3)}
                            </span>
                            <span className="text-right w-15 text-base text-sky-700 font-bold tabular-nums">
                                {getQuot(p)}
                            </span>
                        </button>
                    ))
                )}
            </div>

            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 text-right">
                {lista.length} calciatori
            </div>
        </>
    )
}

export default function SelezionaGiocatoreModale({
    isOpen,
    onClose,
    onSelect,
    giocatori = [],
    titolo,
    sottotitolo,
    colore = '#075985',
    showRuolo = false,
    renderRuolo,
}) {
    return (
        <Transition show={isOpen}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/70" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto p-4">
                    <div className="flex min-h-full items-center justify-center">
                        <TransitionChild
                            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                                <ContenutoModale
                                    onClose={onClose}
                                    onSelect={onSelect}
                                    giocatori={giocatori}
                                    titolo={titolo}
                                    sottotitolo={sottotitolo}
                                    colore={colore}
                                    showRuolo={showRuolo}
                                    renderRuolo={renderRuolo}
                                />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}