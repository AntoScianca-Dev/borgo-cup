import { useState, useMemo } from 'react'
import squadreData from '../assets/data/squadre.json'
import roseData from '../assets/data/rose.json'
import calciatoriData from '../assets/data/calciatori.json'
import RosaModale from './RosaModale'
import Top11Modale from './Top11Modale'
import TrofeiModale from './TrofeiModale'
import headerS from '../assets/image/header_squadre.png'

export default function Squadre() {
    const squadre = squadreData.squadre || squadreData

    const [activeModal, setActiveModal] = useState(null) // 'rosa' | 'top11' | 'trofei' | null
    const [selectedSquad, setSelectedSquad] = useState(null)

    // Helper per arricchire i giocatori con dati da calciatori
    const enrichGiocatore = (giocatore) => {
        const calciatore = calciatoriData.calciatori.find(
            c => c.nome === giocatore.nome
        )
        return {
            ...giocatore,
            quotazione: calciatore?.quotazione || 0,
            variazione: (calciatore?.quotazione || 0) - (parseInt(giocatore.costo) || 0),
            stato: calciatore?.stato || ""
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
    })

    const openModal = (squad, type) => {
        if (type === 'trofei') {
            setSelectedSquad(squad)
            setActiveModal(type)
            return
        }
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
        // setSelectedSquad(null)
    }
    
    const squadreOrdinate = useMemo(
        () => [...squadreConValori].sort((a, b) => a.nome.localeCompare(b.nome)),
        [squadreConValori]
    )

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

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {squadreOrdinate.map((squad) => (
                <div
                key={squad.id}
                className="group w-80 mx-auto bg-amber-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                {/* Fascia colore squadra */}
                <div
                    className="h-20"
                    style={{ background: `linear-gradient(135deg, ${squad.border}, ${squad.border}99)` }}
                />

                <div className="px-5 pb-5 -mt-10">
                    {/* Logo sovrapposto alla fascia */}
                    <div className="w-20 h-20 rounded-full bg-amber-50 shadow-md border-l-4 border-t-4 border-amber-800 flex items-center justify-center overflow-hidden">
                    <img
                        src={`../images/logos/${squad.id}.png`}
                        alt={`Logo ${squad.nome}`}
                        className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    </div>

                    {/* Nome e allenatori */}
                    <h2 className="mt-3 text-xl font-extrabold text-gray-900 leading-tight">{squad.nome}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                    {squad.allenatore}
                    {squad.allenatore2 && <span> · {squad.allenatore2}</span>}
                    </p>

                    {/* Statistiche */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-sky-50 rounded-xl p-3 text-center">
                        <p className="text-[11px] uppercase tracking-wide font-semibold text-sky-600">Valore Rosa</p>
                        <p className="text-lg font-black text-gray-800">
                        {squad.valoreSuQuotazione} <span className="text-xs font-semibold text-gray-500">fc</span>
                        </p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                        <p className="text-[11px] uppercase tracking-wide font-semibold text-emerald-600">Crediti Residui</p>
                        <p className="text-lg font-black text-gray-800">
                        {squad.crediti} <span className="text-xs font-semibold text-gray-500">fc</span>
                        </p>
                    </div>
                    </div>

                    {/* Azioni */}
                    <div className="flex gap-2 mt-5">
                    <button
                        onClick={() => openModal(squad, 'rosa')}
                        className="flex-1 bg-sky-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-sky-800 active:scale-95 transition cursor-pointer"
                    >
                        Info Rosa
                    </button>
                    <button
                        onClick={() => openModal(squad, 'top11')}
                        className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 active:scale-95 transition cursor-pointer"
                    >
                        Top 11
                    </button>
                    <button
                        onClick={() => openModal(squad, 'trofei')}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                    >
                        Sala Trofei
                    </button>
                    </div>
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

            <TrofeiModale
                isOpen={activeModal === 'trofei'}
                onClose={closeModal}
                squad={selectedSquad}
            />
        </div>
    )
}