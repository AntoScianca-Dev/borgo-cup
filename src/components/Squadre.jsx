import { useState, useMemo } from 'react'
import squadreData from '../assets/data/squadre.json'
import roseData from '../assets/data/rose.json'
import calciatoriData from '../assets/data/calciatori.json'
import RosaModale from './RosaModale'
import Top11Modale from './Top11Modale'
import headerS from '../assets/image/header_squadre.png'

export default function Squadre() {
    const squadre = squadreData.squadre || squadreData

    const [activeModal, setActiveModal] = useState(null) // 'rosa' | 'top11' | null
    const [selectedSquad, setSelectedSquad] = useState(null)

    // Helper per arricchire i giocatori con dati da calciatori
    const enrichGiocatore = (giocatore) => {
        const calciatore = calciatoriData.calciatori.find(
            c => c.nome === giocatore.nome
        )
        return {
            ...giocatore,
            quotazione: calciatore?.quotazione || 0,
            variazione: (calciatore?.quotazione || 0) - (parseInt(giocatore.costo) || 0)
        }
    }

    // Somma tutte le quotazioni da una rosa arricchita
    const calculateSquadValue = (rosa) => {
        if (!rosa || !rosa[0]) return 0
        return Object.entries(rosa[0]).reduce((total, [, value]) => {
            const giocatore = value[0]
            return total + (giocatore.quotazione || 0)
        }, 0)
    }

    const squadreConValori = useMemo(() => {
        return squadre.map(squad => {
            const rosa = roseData.rose.find(r => r.id === squad.id)
            if (!rosa) return squad
            
            const rosaEnriched = [{
                ...Object.entries(rosa.rosa[0]).reduce((acc, [key, value]) => {
                    acc[key] = [enrichGiocatore(value[0])]
                    return acc
                }, {})
            }]
            
            const valoreSuQuotazione = calculateSquadValue(rosaEnriched)
            
            return {
                ...squad,
                valoreSuQuotazione,     // ✅ Valore rosa aggiornato
                differenza: squad.valore - valoreSuQuotazione  // ✅ Differenza
            }
        })
    }, [])

    const openModal = (squad, type) => {
        // Trova la rosa per questa squadra
        const rosa = roseData.rose.find(r => r.id === squad.id)
        
        // Arricchisci la rosa con dati da calciatori
        const squadEnriched = {
            ...squad,
            rosa: rosa ? [{
                ...Object.entries(rosa.rosa[0]).reduce((acc, [key, value]) => {
                    acc[key] = [enrichGiocatore(value[0])]
                    return acc
                }, {})
            }] : []
        }
        
        setSelectedSquad(squadEnriched)
        setActiveModal(type)
    }

    const closeModal = () => {
        setActiveModal(null)
        setSelectedSquad(null)
    }
    
    return (
        <div className="space-y-8">
            <div className="text-4xl h-20 tracking-tight flex items-center justify-center gap-3 py-6 rounded-tl-4xl rounded-br-4xl font-extrabold text-sky-50 text-shadow-2xs text-shadow-sky-950 mb-0"
            style={{ 
                backgroundImage: `linear-gradient(rgba(7, 89, 133,  0.05), rgba(7, 89, 133, 0.05)), url(${headerS})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}>
                
            </div>
            <h1 className='text-4xl font-medium text-center py-0 mt-0 text-sky-800'>Squadre</h1>

            <div className="grid md:grid-cols-2 gap-6">
            {squadreConValori.sort((a, b) => a.nome.localeCompare(b.nome))
                .map((squad) => (
                <div
                key={squad.id}
                className="bg-sky-50 rounded-lg shadow shadow-sky-600 p-6 border-l-8 w-80 mx-auto"
                style={{borderLeftColor: squad.border}}
                >

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{squad.nome}</h2>
                    
                    <div className="flex flex-col gap-0.5 text-gray-700 text-xl">
                        <div className='grid gap-0.5'>
                            <span className="font-semibold col-span-2 text-sky-600">Allenatore:</span>
                            <span className="mt-0">{squad.allenatore}</span>
                            {squad.allenatore2 && <span className="mt-0">{squad.allenatore2}</span>}
                        </div>
                        <div className='flex gap-3'>
                            <span className="font-semibold w-35 text-sky-600">Valore:</span> 
                            <span className="pl-4 w-20 text-right">{squad.valoreSuQuotazione} <span className='font-serif'>fc</span></span>
                        </div>
                        <div className="flex gap-3">
                            <span className="font-semibold w-35 text-sky-600">Crediti residui:</span> 
                            <span className="pl-4 w-20 text-right">{squad.crediti} <span className='font-serif'>fc</span></span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 mt-6 font-semibold">
                            <button
                            onClick={() => openModal(squad, 'rosa')}
                            className="flex-1 bg-sky-700 text-white px-3 py-1.5 rounded-full hover:bg-sky-800 transition text-sm cursor-pointer text-center"
                            >
                            Info Rosa
                            </button>
                            <button
                            onClick={() => openModal(squad, 'top11')}
                            className="flex-1 bg-amber-600 text-white px-3 py-1.5 rounded-full hover:bg-amber-700 transition text-sm cursor-pointer text-center"
                            >
                            Top 11
                            </button>
                        </div>

                </div>
            ))}
            </div>

            {/* Componenti Modale Esterni */}
            <RosaModale
                isOpen={activeModal === 'rosa'}
                onClose={closeModal}
                squad={selectedSquad}
            />

            <Top11Modale
                isOpen={activeModal === 'top11'}
                onClose={closeModal}
                squad={selectedSquad}
            />
        </div>
    )
}