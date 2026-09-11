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

export default function Top11Modale({ isOpen, onClose, squad }) {
    if (!squad) return null

    const rosaObject = squad.rosa?.[0] || {}
    const { top11Giocatori, modulo, valoreTotale } = calcolaMigliorTop11(rosaObject)

    const ruoli = [
        { titolo: 'Portieri', codice: 'p', color: 'bg-amber-200 text-amber-900 border-amber-400' },
        { titolo: 'Difensori', codice: 'd', color: 'bg-green-200 text-green-900 border-green-400' },
        { titolo: 'Centrocampisti', codice: 'c', color: 'bg-blue-200 text-blue-900 border-blue-400' },
        { titolo: 'Attaccanti', codice: 'a', color: 'bg-red-200 text-red-900 border-red-400' },
    ]

    return (
        <Transition show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
                <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <DialogPanel className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 transform transition-all">
                    {/* Header */}
                    <div 
                    className="flex justify-between items-center border-b border-t-8 pt-2 rounded-t-2xl pb-3" 
                    style={{ borderTopColor: squad.border }}
                    >
                    <DialogTitle className="text-xl flex flex-col text-sky-800">
                        <span className="text-2xl font-bold">{squad.nome}</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <span>Top 11 ({modulo || 'Dinamica'})</span>
                        <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded-full font-bold">
                            {valoreTotale} cr
                        </span>
                        </div>
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
                    >
                        ✕
                    </button>
                    </div>

                    {/* Contenuto Campo */}
                    <div 
                    className="max-h-[60vh] overflow-y-auto space-y-4 rounded-2xl flex justify-center items-center flex-col py-6"
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(${campo})`, 
                        backgroundSize: 'cover', 
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center' 
                    }}
                    >
                    {ruoli.map((r) => {
                        const titolariRuolo = top11Giocatori.filter((g) => g.ruolo === r.codice)
                        if (titolariRuolo.length === 0) return null

                        const is4 = titolariRuolo.length === 4
                        const primaRiga = is4 ? titolariRuolo.slice(0, 2) : titolariRuolo
                        const secondaRiga = is4 ? titolariRuolo.slice(2, 4) : []

                        return (
                        <div key={r.codice} className="w-full flex flex-col items-center gap-2">
                            <div className="flex flex-wrap justify-center items-center gap-2 w-full px-2">
                            {primaRiga.map((g, idx) => (
                                <span
                                key={idx}
                                className={`px-2.5 py-1 rounded-md text-sm font-semibold text-gray-800 shadow-sm border border-gray-100 ${r.color}`}
                                >
                                {g.nome}
                                </span>
                            ))}
                            </div>

                            {is4 && (
                            <div className="flex justify-between items-center w-full px-4">
                                {secondaRiga.map((g, idx) => (
                                <span
                                    key={idx}
                                    className={`px-2.5 py-1 rounded-md text-sm font-semibold text-gray-800 shadow-sm border border-gray-100 ${r.color}`}
                                >
                                    {g.nome}
                                </span>
                                ))}
                            </div>
                            )}
                        </div>
                        )
                    })}
                    </div>

                    {/* Footer */}
                    <div 
                    className="border-t pt-3 text-right border-b-6 pb-2 rounded-b-2xl"
                    style={{ borderBottomColor: squad.border }}
                    >
                    <button
                        onClick={onClose}
                        className="bg-amber-600 text-white px-4 py-1.5 rounded-full hover:bg-amber-700 transition font-semibold cursor-pointer"
                    >
                        Chiudi
                    </button>
                    </div>
                </DialogPanel>
                </TransitionChild>
            </div>
            </div>
        </Dialog>
        </Transition>
    )
}