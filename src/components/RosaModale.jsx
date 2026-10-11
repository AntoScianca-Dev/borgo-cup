import { useMemo } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const RUOLI = [
    { titolo: 'Portieri', codice: 'p', accent: 'border-amber-400', head: 'bg-amber-100 text-amber-900' },
    { titolo: 'Difensori', codice: 'd', accent: 'border-green-400', head: 'bg-green-100 text-green-900' },
    { titolo: 'Centrocampisti', codice: 'c', accent: 'border-blue-400', head: 'bg-blue-100 text-blue-900' },
    { titolo: 'Attaccanti', codice: 'a', accent: 'border-red-400', head: 'bg-red-100 text-red-900' },
]

// Stessa griglia per intestazione e righe: nome flessibile + 3 colonne numeriche
const GRID = 'grid grid-cols-[1fr_3rem_3rem_2.5rem] gap-1 items-center'

export default function RosaModale({ isOpen, onClose, squad }) {
    const tuttiGiocatori = useMemo(() => {
        const rosaObject = squad?.rosa?.[0] || {}
        return Object.entries(rosaObject).map(([key, value]) => ({
            ...value[0],
            ruolo: key.charAt(0).toLowerCase(),
        }))
    }, [squad])

    const totali = useMemo(() => ({
        giocatori: tuttiGiocatori.length,
        costo: tuttiGiocatori.reduce((s, g) => s + (parseInt(g.costo) || 0), 0),
        quotazione: tuttiGiocatori.reduce((s, g) => s + (g.quotazione || 0), 0),
    }), [tuttiGiocatori])

    if (!squad) return null

    const variazioneTot = totali.quotazione - totali.costo
    const haMercato = tuttiGiocatori.some((g) => g.statoM > 0)

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
                                {/* Header */}
                                <div
                                    className="relative z-10 px-5 pt-5 pb-6 text-white"
                                    style={{ background: `linear-gradient(135deg, ${squad.border}, ${squad.border}99)` }}
                                >
                                    <button
                                        onClick={onClose}
                                        className="absolute top-2 right-2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/40 text-white font-bold touch-manipulation transition cursor-pointer"
                                        aria-label="Chiudi"
                                    >
                                        ✕
                                    </button>
                                    <p className="text-[11px] uppercase tracking-widest font-semibold opacity-80">Rosa completa</p>
                                    <DialogTitle className="text-2xl font-extrabold drop-shadow pr-10">{squad.nome}</DialogTitle>

                                    {/* Riepilogo */}
                                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                        <div className="bg-black/20 rounded-xl py-2">
                                            <p className="text-lg font-black">{totali.giocatori}</p>
                                            <p className="text-[10px] uppercase tracking-wide opacity-80">Giocatori</p>
                                        </div>
                                        <div className="bg-black/20 rounded-xl py-2">
                                            <p className="text-lg font-black">{totali.quotazione}</p>
                                            <p className="text-[10px] uppercase tracking-wide opacity-80">Valore Q.A.</p>
                                        </div>
                                        <div className="bg-black/20 rounded-xl py-2">
                                            <p className="text-lg font-black">
                                                {variazioneTot > 0 ? '+' : ''}{variazioneTot}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-wide opacity-80">Vs. costo</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Elenco per ruolo */}
                                <div className="relative z-0 max-h-[55vh] overflow-y-auto p-4 space-y-4">
                                    {RUOLI.map((r) => {
                                        const lista = tuttiGiocatori
                                            .filter((g) => g.ruolo === r.codice)
                                            .sort((a, b) => (b.quotazione || 0) - (a.quotazione || 0))
                                        if (lista.length === 0) return null

                                        return (
                                            <section key={r.codice} className={`border-l-4 ${r.accent} rounded-lg overflow-hidden bg-gray-50/60`}>
                                                <div className={`${GRID} px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${r.head}`}>
                                                    <h4>{r.titolo} ({lista.length})</h4>
                                                    <span className="text-right">Costo</span>
                                                    <span className="text-right">Q.A.</span>
                                                    <span className="text-right">+/-</span>
                                                </div>

                                                <div className="divide-y divide-gray-100">
                                                    {lista.map((g, idx) => (
                                                        <div key={idx} className={`${GRID} px-3 py-2 text-sm hover:bg-white transition`}>
                                                            <span className="flex min-w-0 items-center gap-1.5">
                                                                <span className="truncate font-semibold text-gray-800">
                                                                    {g.nome}
                                                                    {g.stato === 'svincolato' && (
                                                                        <span className="ml-0.5 font-bold text-red-600" title="Calciatore svincolato / fuori lista">*</span>
                                                                    )}
                                                                </span>
                                                                {g.statoM > 0 && (
                                                                    <span
                                                                        title={`Acquistato nella ${g.statoM}ª sessione di mercato`}
                                                                        className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800"
                                                                    >
                                                                        M{g.statoM}
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="text-right text-gray-600">{g.costo}</span>
                                                            <span className="text-right text-sky-700 font-bold">{g.quotazione}</span>
                                                            <span
                                                                className={`text-right font-bold ${
                                                                    g.variazione > 0 ? 'text-green-600'
                                                                    : g.variazione < 0 ? 'text-red-600'
                                                                    : 'text-gray-400'
                                                                }`}
                                                            >
                                                                {g.variazione > 0 ? '+' : ''}{g.variazione}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )
                                    })}
                                </div>

                                {/* LEGENDA */}
                                {haMercato && (
                                    <div className="flex py-4 px-4 gap-2 flex-wrap">
                                        <p className="text-xs text-gray-500">
                                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-black text-emerald-800">M1</span>{' '}
                                            acquistato nella 1ª sessione di mercato
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-black text-emerald-800">M2</span>{' '}
                                            acquistato nella 2ª sessione di mercato
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-black text-emerald-800">M3</span>{' '}
                                            acquistato nella 3ª sessione di mercato
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <span className="ml-0.5 font-bold text-red-600" title="Calciatore svincolato / fuori lista">*</span>{' '}
                                            Calciatore svincolato / fuori lista
                                        </p>                            
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}