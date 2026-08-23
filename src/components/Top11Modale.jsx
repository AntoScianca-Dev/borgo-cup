import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import campo from "../assets/image/campo.png"

export default function Top11Modale({ isOpen, onClose, squad }) {
    if (!squad) return null

    const rosaObject = squad.rosa?.[0] || {}

    // Estraiamo solo i giocatori che hanno top === "SI"
    const top11Giocatori = Object.entries(rosaObject)
        .flatMap(([key, value]) => {
            const player = value?.[0]
            if (!player || player.top !== 'SI') return []
            return [{
                ...player,
                ruolo: key.charAt(0).toLowerCase(),
            }]
        })

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
                                        <span>Top 11 per <span className='font-serif'>fc</span></span> 
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Contenuto Top 11 */}
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

                                        // Se sono 4 giocatori, dividiamo in 2 righe da 2 (2 centrali sopra, 2 esterni sotto)
                                        const is4 = titolariRuolo.length === 4
                                        const primaRiga = is4 ? titolariRuolo.slice(0, 2) : titolariRuolo
                                        const secondaRiga = is4 ? titolariRuolo.slice(2, 4) : []

                                        return (
                                            <div key={r.codice} className="w-full flex flex-col items-center gap-2">
                                                {/* Prima riga (o riga unica per 1, 2, 3 o 5+ giocatori) */}
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

                                                {/* Seconda riga (esclusiva per il layout da 4: posizionati agli estremi) */}
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