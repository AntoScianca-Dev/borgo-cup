import { useMemo } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import campo from "../assets/image/campo.png"

// Moduli ammessi al Fantacalcio
const MODULI_VALIDI = [
  { d: 3, c: 4, a: 3 }, // 3-4-3
  { d: 3, c: 5, a: 2 }, // 3-5-2
  { d: 4, c: 3, a: 3 }, // 4-3-3
  { d: 4, c: 4, a: 2 }, // 4-4-2
  { d: 4, c: 5, a: 1 }, // 4-5-1
  { d: 5, c: 3, a: 2 }, // 5-3-2
  { d: 5, c: 4, a: 1 }, // 5-4-1
]

function calcolaMigliorTop11(rosaObject) {
    // 1. Appiattiamo la rosa in un array ordinato per quotazione
    const tuttiGiocatori = Object.entries(rosaObject).map(([key, value]) => {
        const giocatore = value[0]
        const ruoloCode = key.charAt(0).toLowerCase() // 'p', 'd', 'c', 'a'
        return { ...giocatore, ruolo: ruoloCode }
    })

    // 2. Raggruppiamo e ordiniamo per quotazione (escludendo gli svincolati)
    const perRuolo = { p: [], d: [], c: [], a: [] }
    tuttiGiocatori.forEach((g) => {
        if (g.stato !== 'svincolato' && perRuolo[g.ruolo]) {
        perRuolo[g.ruolo].push(g)
        }
    })

    Object.keys(perRuolo).forEach((r) => {
        perRuolo[r].sort((a, b) => (b.quotazione || 0) - (a.quotazione || 0))
    })

    const migliorPortiere = perRuolo.p.slice(0, 1)

    let miglioreFormazione = []
    let maxValoreTotale = -1
    let migliorModuloStr = ''

    // 3. Troviamo il modulo con la quotazione totale più alta
    MODULI_VALIDI.forEach((mod) => {
        const difensori = perRuolo.d.slice(0, mod.d)
        const centrocampisti = perRuolo.c.slice(0, mod.c)
        const attaccanti = perRuolo.a.slice(0, mod.a)

        if (
        migliorPortiere.length === 1 &&
        difensori.length === mod.d &&
        centrocampisti.length === mod.c &&
        attaccanti.length === mod.a
        ) {
        const formazione = [...migliorPortiere, ...difensori, ...centrocampisti, ...attaccanti]
        const valoreTotale = formazione.reduce((sum, g) => sum + (g.quotazione || 0), 0)

        if (valoreTotale > maxValoreTotale) {
            maxValoreTotale = valoreTotale
            miglioreFormazione = formazione
            migliorModuloStr = `${mod.d}-${mod.c}-${mod.a}`
        }
        }
    })

    return { top11Giocatori: miglioreFormazione, modulo: migliorModuloStr, valoreTotale: maxValoreTotale }
}
// Ordine dall'alto al basso: come sul campo
const REPARTI = [
    { codice: 'p', bg: 'bg-amber-500' },
    { codice: 'd', bg: 'bg-green-500' },
    { codice: 'c', bg: 'bg-blue-500' },
    { codice: 'a', bg: 'bg-red-500' },
]

export default function Top11Modale({ isOpen, onClose, squad }) {
    const { top11Giocatori, modulo, valoreTotale } = useMemo(
        () => calcolaMigliorTop11(squad?.rosa?.[0] || {}),
        [squad]
    )

    if (!squad) return null

    return (
        <Transition show={isOpen}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto p-4">
                    <div className="flex min-h-full items-center justify-center">
                        <TransitionChild
                            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div
                                    className="relative z-10 px-5 pt-5 pb-8 text-white"
                                    style={{ background: `linear-gradient(135deg, ${squad.border}, ${squad.border}99)` }}
                                >
                                    <button
                                        onClick={onClose}
                                        className="absolute top-2 right-2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/40 text-white font-bold touch-manipulation transition cursor-pointer"
                                        aria-label="Chiudi"
                                    >
                                        ✕
                                    </button>
                                    <p className="text-sm uppercase tracking-widest font-semibold opacity-80">Top 11 per fc</p>
                                    <DialogTitle className="text-2xl font-extrabold drop-shadow">{squad.nome}</DialogTitle>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-white/25 backdrop-blur px-3 py-0.5 rounded-full text-xs font-bold">
                                            {modulo || 'N/D'}
                                        </span>
                                        <span className="bg-white/25 backdrop-blur px-3 py-0.5 rounded-full text-xs font-bold">
                                            {valoreTotale > 0 ? valoreTotale : 0} cr
                                        </span>
                                    </div>
                                </div>

                                {/* Campo */}
                                <div
                                    className="-mt-4 z-0 rounded-2xl shadow-inner min-h-104 py-6 flex flex-col justify-around"
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${campo})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {top11Giocatori.length === 0 && (
                                        <p className="text-center text-white/80 text-sm px-6">
                                            Rosa incompleta: impossibile comporre un modulo valido.
                                        </p>
                                    )}

                                    {REPARTI.map((r) => {
                                        const giocatori = top11Giocatori.filter((g) => g.ruolo === r.codice)
                                        if (giocatori.length === 0) return null

                                        return (
                                            <div key={r.codice} className="flex justify-evenly items-start px-2">
                                                {giocatori.map((g, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-1 w-18">
                                                        <div
                                                            className={`w-8 h-8 rounded-full ${r.bg} ring-2 ring-white shadow-lg flex items-center justify-center text-xs font-black text-white`}
                                                        >
                                                            {g.quotazione || 0}
                                                        </div>
                                                        <span className="max-w-full truncate text-[10px] font-bold text-white bg-black/50 rounded-md px-1.5 py-0.5">
                                                            {g.nome}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}