import competizioniData from '../assets/data/competizioni.json'
import { Link } from 'react-router-dom'

export default function Competizioni() {
    // Gestione dell'import del JSON (default export)
    const competizioni = competizioniData.competizioni || competizioniData

    const statusStyles = {
    Attivo: 'bg-green-200 text-green-900',
    'In attesa': 'bg-yellow-200 text-yellow-900',
    Terminata: 'bg-red-200 text-red-900',
    }

    const calcAvanzamento = (competizioni) => {
        return ((competizioni.giornata*100)/competizioni.totale).toFixed(1)
    }

    // Somma tutte le quotazioni da una rosa arricchita
    // const calculateSquadValue = (rosa) => {
    //     if (!rosa || !rosa[0]) return 0
    //     return Object.entries(rosa[0]).reduce((total, [, value]) => {
    //         const giocatore = value[0]
    //         return total + (giocatore.quotazione || 0)
    //     }, 0)
    // }
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Competizioni</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
            {competizioni.filter((comp) => comp.stato != "None")
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
                        <div className='flex flex-col'>
                            <span className="font-semibold">Inizio competizione:</span> 
                            <span className="pl-4">{comp.inizio}</span>
                        </div>
                        {comp.fine !== undefined && (
                            <div className='flex flex-col'>
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
                                
                                {/* Traccia di sfondo */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    {/* Barra di riempimento dinamica */}
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
                            <div className="w-30" /> /* Spacer per mantenere il layout flex */
                        )}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}