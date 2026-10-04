import { useMemo, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import trofeiData from '../assets/data/trofei.json'

function TrofeoLogo({ idComp, nome, className }) {
    const [errore, setErrore] = useState(false)

    if (errore) {
        return <span className={`flex items-center justify-center ${className}`}>🏆</span>
    }
    return (
        <img
            src={`/images/trofei/${idComp}.png`}
            alt={nome}
            onError={() => setErrore(true)}
            className={`object-contain ${className}`}
        />
    )
}

export default function TrofeiModale({ isOpen, onClose, squad }) {
    // Dettaglio: dalla stagione più recente; a parità di stagione, per idComp
    const palmares = useMemo(() => {
        if (!squad) return []
        const voce = trofeiData.trofei.find((t) => String(t.id) === String(squad.id))
        return [...(voce?.palmares ?? [])].sort(
            (a, b) => b.stagione.localeCompare(a.stagione) || a.idComp - b.idComp
        )
    }, [squad])

    // Bacheca: un trofeo per competizione, con il numero di vittorie
    const vinti = useMemo(() => {
        const mappa = new Map()
        palmares.forEach((p) => {
            const corrente = mappa.get(p.idComp)
            mappa.set(p.idComp, {
                idComp: p.idComp,
                nome: p.competizione,
                n: (corrente?.n || 0) + 1,
            })
        })
        return [...mappa.values()].sort((a, b) => a.idComp - b.idComp)
    }, [palmares])

    if (!squad) return null

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
                            <DialogPanel className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                                {/* Header: bacheca */}
                                <div
                                    className="relative z-10 px-5 pt-5 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-800 border-t-8"
                                    style={{ borderTopColor: squad.border }}
                                >
                                    <button
                                        onClick={onClose}
                                        className="absolute top-2 right-2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold touch-manipulation transition cursor-pointer"
                                        aria-label="Chiudi"
                                    >
                                        ✕
                                    </button>

                                    <p className="text-[11px] uppercase tracking-widest font-semibold text-sky-300">
                                        Sala Trofei
                                    </p>
                                    <DialogTitle className="text-2xl font-extrabold text-white pr-10">
                                        {squad.nome}
                                    </DialogTitle>

                                    <div className="flex items-end justify-center gap-5 flex-wrap min-h-24 pt-6 pb-1">
                                        {vinti.length === 0 && (
                                            <p className="text-sm text-slate-400 pb-3">Bacheca ancora vuota</p>
                                        )}
                                        {vinti.map((c) => (
                                            <div key={c.idComp} className="relative">
                                                <TrofeoLogo
                                                    idComp={c.idComp}
                                                    nome={c.nome}
                                                    className="h-16 w-16 text-5xl drop-shadow-[0_6px_6px_rgba(0,0,0,0.7)]"
                                                />
                                                {c.n > 1 && (
                                                    <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-[11px] font-black rounded-full px-1.5 py-0.5 shadow">
                                                        x{c.n}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-2.5 -mx-5 bg-gradient-to-b from-slate-200/70 to-slate-400/20 border-t border-white/40 shadow-[0_8px_12px_rgba(0,0,0,0.5)]" />
                                </div>

                                {/* Tabella */}
                                <div className="relative z-0 max-h-[45vh] overflow-y-auto">
                                    <div className="grid grid-cols-[3rem_5.5rem_1fr] gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 sticky top-0">
                                        <span>Trofeo</span>
                                        <span>Stagione</span>
                                        <span>Competizione</span>
                                    </div>

                                    {palmares.length === 0 ? (
                                        <p className="text-center text-gray-400 py-10 text-sm">
                                            Nessun trofeo in bacheca per ora
                                        </p>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {palmares.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className="grid grid-cols-[3rem_5.5rem_1fr] gap-2 items-center px-4 py-2 text-sm hover:bg-gray-50 transition"
                                                >
                                                    <TrofeoLogo idComp={p.idComp} nome={p.competizione} className="h-8 w-8 text-2xl" />
                                                    <span className="font-semibold text-sky-700">{p.stagione}</span>
                                                    <span className="font-bold text-gray-800">{p.competizione}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}