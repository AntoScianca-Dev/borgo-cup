import { useState } from 'react'
import competizioniData from '../assets/data/competizioni.json'
import { Link } from 'react-router-dom'

export default function Competizioni() {
    // Gestione dell'import del JSON (default export)
    const competizioni = competizioniData.competizioni || competizioniData

    // Stato per il filtro attivo (null o 'Tutti' significa nessun filtro applicato)
    const [selectedFilter, setSelectedFilter] = useState(null)

    const statusStyles = {
        Attivo: 'bg-green-200 text-green-900 border-green-500',
        'In attesa': 'bg-yellow-200 text-yellow-900 border-yellow-500',
        Terminata: 'bg-red-200 text-red-900 border-red-500',
    }

    const borderStyle = {
        Attivo: 'border-green-500',
        'In attesa': 'border-yellow-500',
        Terminata: 'border-red-500',
    }


    const calcAvanzamento = (competizioni) => {
        return ((competizioni.giornata * 100) / competizioni.totale).toFixed(1)
    }

    // Lista competizioni valide (escludendo "None")
    const competizioniValide = competizioni.filter((comp) => comp.stato !== 'None')

    // Se un filtro è selezionato mostra solo quelle, altrimenti mostra tutte
    const competizioniFiltrate = selectedFilter
        ? competizioniValide.filter((comp) => comp.stato === selectedFilter)
        : competizioniValide

    // Gestione del click sugli opzioni di filtro
    const handleFilterClick = (status) => {
        // Se si clicca sul filtro già attivo, si deseleziona (torna a null = tutti)
        if (selectedFilter === status) {
            setSelectedFilter(null)
        } else {
            setSelectedFilter(status)
        }
    }

    const filterOptions = ['Attivo', 'In attesa', 'Terminata']

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Competizioni</h1>

                {/* Pulsanti Filtro Rapido Toggle con statusStyles */}
                <div className="flex flex-wrap justify-evenly">
                    {filterOptions.map((status) => {
                        const count = competizioniValide.filter((c) => c.stato === status).length
                        const isActive = selectedFilter === status

                        return (
                            <button
                                key={status}
                                onClick={() => handleFilterClick(status)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-evenly gap-1.5 border ${
                                    isActive
                                        ? `${statusStyles[status]} shadow-md scale-105 border-2`
                                        : `${borderStyle[status]} border-2 bg-white text-gray-600 hover:bg-gray-100 border-gray-200`
                                }`}
                            >
                                <span>{status}</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                        isActive
                                            ? 'bg-black/10 text-current'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Griglia Competizioni */}
            <div className="grid md:grid-cols-2 gap-6">
                {competizioniFiltrate
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((comp) => (
                        <div
                            key={comp.id}
                            className="bg-sky-50 rounded-lg shadow shadow-sky-600 p-6 border-l-6 border-sky-600"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{comp.nome}</h2>

                            <div className="flex flex-col gap-2 text-gray-700">
                                <div>
                                    <span className="font-semibold">Squadre partecipanti:</span> {comp.squadre}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold">Inizio competizione:</span>
                                    <span className="pl-4">{comp.inizio}</span>
                                </div>
                                {comp.fine !== undefined && (
                                    <div className="flex flex-col">
                                        <span className="font-semibold">Fine competizione:</span>
                                        <span className="pl-4">{comp.fine}</span>
                                    </div>
                                )}

                                {comp.avanzamento !== undefined && (
                                    <div className="mt-1">
                                        <div className="flex justify-between items-center text-sm font-semibold mb-1">
                                            <span className="text-gray-600">Avanzamento</span>
                                            <span className="text-sky-800">{calcAvanzamento(comp)}%</span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-sky-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${Math.min(100, Math.max(0, calcAvanzamento(comp)))}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-4 font-semibold text-sky-900">
                                {statusStyles[comp.stato] && (
                                    <span className={`w-30 rounded-full px-3 py-1.5 text-center ${statusStyles[comp.stato]}`}>
                                        {comp.stato}
                                    </span>
                                )}

                                {comp.stato === 'Attivo' || comp.stato === 'Terminata' ? (
                                    <Link
                                        to={`/competizioni${comp.link}`}
                                        className="w-30 bg-sky-700 text-white px-4 py-1.5 rounded-full hover:bg-sky-800 transition text-center"
                                    >
                                        Info
                                    </Link>
                                ) : (
                                    <div className="w-30" />
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            {competizioniFiltrate.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-medium">
                    Nessuna competizione trovata per questo stato.
                </div>
            )}
        </div>
    )
}