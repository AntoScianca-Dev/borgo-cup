import { useState } from 'react'
import squadreData from '../assets/data/squadre.json'
import RosaModale from './RosaModale'
import Top11Modale from './Top11Modale'
import headerS from '../assets/image/header_squadre.png'

export default function Squadre() {
    const squadre = squadreData.squadre || squadreData

    const [activeModal, setActiveModal] = useState(null) // 'rosa' | 'top11' | null
    const [selectedSquad, setSelectedSquad] = useState(null)

    const openModal = (squad, type) => {
        setSelectedSquad(squad)
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
            {squadre.sort((a, b) => a.nome.localeCompare(b.nome))
                .map((squad) => (
                <div
                key={squad.id}
                className="bg-sky-50 rounded-lg shadow shadow-sky-600 p-6 border-l-8 w-80 mx-auto"
                style={{borderLeftColor: squad.border}}
                >

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{squad.nome}</h2>
                    
                    <div className="flex flex-col gap-2 text-gray-700 text-xl">
                        <div className='grid gap-2'>
                            <span className="font-semibold col-span-2 text-sky-600">Allenatore:</span>
                            <span className="mt-0">{squad.allenatore}</span>
                            <span className="mt-0">{squad.allenatore2}</span>
                        </div>
                        <div className='flex gap-3'>
                            <span className="font-semibold text-sky-600">Valore:</span> 
                            <span className="pl-4">{squad.valore} <span className='font-serif'>fc</span></span>

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