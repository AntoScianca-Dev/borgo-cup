import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export default function RosaModale({ isOpen, onClose, squad }) {
  if (!squad) return null

  // 1. Estraiamo l'oggetto contenente tutti i ruoli (p1, d1, ecc.)
  const rosaObject = squad.rosa?.[0] || {}

  // 2. Appiattiamo l'oggetto in un singolo array di giocatori aggiungendo il ruolo
  const tuttiGiocatori = Object.entries(rosaObject).map(([key, value]) => {
    const giocatore = value[0] // Prende l'oggetto del giocatore
    const ruoloCode = key.charAt(0).toLowerCase() // 'p', 'd', 'c', 'a'
    return { ...giocatore, ruolo: ruoloCode }
  })

  // 3. Helper per filtrare per ruolo
  const getGiocatoriPerRuolo = (codiceRuolo) =>
    tuttiGiocatori.filter((g) => g.ruolo === codiceRuolo)

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
              <DialogPanel className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                  <DialogTitle className="text-xl flex flex-col text-sky-800">
                      <span className="text-2xl font-bold">{squad.nome}</span>
                      <span>Rosa completa</span> 
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Elenco divisi per Ruolo */}
                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                  {ruoli.map((r) => {
                    const lista = getGiocatoriPerRuolo(r.codice)
                    if (lista.length === 0) return null

                    return (
                      <div key={r.codice} className="space-y-2">
                        <div className={`flex justify-between gap-1 items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${r.color}`}>
                          <h4 className="w-50">
                            {r.titolo}
                          </h4>
                          <div className='w-15 text-center'>Costo</div>
                          <div className='w-10 text-center'>Qt.A</div>
                          <div className='w-10 text-center'>+/-</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {lista.map((g, idx) => (
                            <div key={idx} className="flex justify-between gap-1 items-center py-1.5 px-2 text-sm hover:bg-gray-50 rounded">
                              <span className="font-medium w-30 text-gray-800">{g.nome}</span>
                              <div className='w-15 text-right'>{g.costo}</div>
                              <div className='w-8 text-right'>{g.quotazione}</div>
                              <div className={`w-8 text-right font-bold ${
                                    g.variazione > 0 
                                      ? 'text-green-600' 
                                      : g.variazione < 0 
                                      ? 'text-red-600' 
                                      : 'text-gray-500'
                                  }`}>
                                    {g.variazione}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="border-t pt-3 text-right">
                  <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-300 transition font-semibold cursor-pointer"
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