// import { useState } from 'react'
import squadreData from '../assets/data/classifiche.json'
import headerS from '../assets/image/header_squid.png'
import { Link } from 'react-router-dom'

export default function Squid({ id }) {

    // 1. Estrai la classifica del "Serie" (id: 1)
    const serieObj = squadreData.classifiche.find(
        (item) => item.id === id 
    )

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    const partecipantiRaw = serieObj?.partecipanti || []

    // 3. Ordina i partecipanti per posizione crescente (1°, 2°, 3°, ...)
    // const classificaOrdinata = [...partecipantiRaw].sort((a, b) => b.punteggio - a.punteggio)
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Schermata */}
            <div className="text-center space-y-2 text-sky-50">
                <Link to='/competizioni'>
                    <h1 className="text-4xl tracking-tight flex items-center justify-center gap-3 py-6 rounded-tl-4xl rounded-br-4xl font-medium mb-2"
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerS})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' 
                    }}>
                        <span className='flex gap-0.5 items-center justify-center flex-col'>
                            <div className='w-20 h-20 flex items-center justify-center object-center m-0 overflow-hidden'>
                                <img src={`../images/squid.png`} className='object-contain w-15 h-15 rounded-full' alt="Logo squid game" />
                            </div>
                            <span >
                                {`${serieObj.nome}`}
                            </span>
                        </span>
                    </h1>
                </Link>
            </div>

            {/* Scheda Tabella */}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className="bg-linear-to-r from-pink-800 via-pink-700 mb-2 to-pink-800 px-6 py-4 text-amber-50 rounded-2xl grid">
                    <div className='flex justify-between items-center'>
                        <div className="font-semibold text-sm tracking-wider uppercase">Squadra</div>
                        <div className="font-semibold text-sm tracking-wider uppercase">Punti</div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className="font-bold text-center">STEP 1</div>
                        <div className="font-light text-center">STEP 2</div>
                        <div className="font-light text-center">STEP 3</div>
                        <div className="font-light text-center">STEP 4</div>
                        <div className="font-light text-center">STEP 5</div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className="font-bold text-sm px-4 text-center">70</div>
                        <div className="font-light text-sm px-4 text-center">70</div>
                        <div className="font-light text-sm px-4 text-center">70</div>
                        <div className="font-light text-sm px-4 text-center">70</div>
                        <div className="font-light text-sm px-4 text-center">70</div>
                    </div>
                </div>

                {/* Lista Squadre attive */}
                <div className="grid gap-4 mb-4 p-1">
                {partecipantiRaw.filter((pfiltri) => pfiltri.attivo == "SI")
                    .sort((a, b) => b.punteggio - a.punteggio)
                    .map((squadra, index) => {
                    const posizione = index + 1

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 border-lime-600 border-y rounded-2xl shadow shadow-lime-800 transition-all duration-200 hover:bg-sky-50/50 group `}
                        // style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    <span className="text-lime-800 font-medium text-base shadow shadow-lime-800 w-9 h-9 flex items-center justify-center rounded-full"
                                    >
                                        {posizione}
                                    </span>
                                </div>

                                {/* Dettagli Squadra */}
                                <div className="flex items-center gap-3">
                                    <span   
                                    className={`font-bold text-lg transition-colors group-hover:text-sky-700 text-gray-800 border-l-8 rounded-2xl pl-2`}
                                    style={{borderColor: squadra.border}}
                                    >
                                        {squadra.nome}
                                    </span>
                                </div>
                            </div>

                            {/* Punteggio */}
                            <div className="flex items-center">
                                <span
                                    className={`text-xl font-black px-4 py-1.5 rounded-xlbg-gray-100 text-sky-950 group-hover:bg-sky-100 group-hover:text-sky-900`}
                                >
                                    {(squadra.step1 || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Punteggio */}
                        <div className='flex justify-evenly pt-0.5'>
                            <div className="font-medium bg-lime-100 px-4 text-center rounded-full">{(squadra.step1 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{(squadra.step2 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{(squadra.step3 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{(squadra.step4 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{(squadra.step5 || 0).toFixed(1)}</div>
                        </div>
                    </div>
                    )
                })}
                </div>

                <div className='flex text-2xl items-center justify-evenly pt-4 pb-2'>
                    <span>➖❌➖</span>
                    <span>ELIMINATI</span>
                    <span>➖❌➖</span>
                </div>
                
                {/* Lista Squadre eliminate */}
                <div className="grid gap-4 mb-4 p-1">
                {partecipantiRaw.filter((pfiltri) => pfiltri.attivo == "NO")
                    .sort((a, b) => b.punteggio - a.punteggio)
                    .map((squadra, index) => {

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 border-pink-600 border-y rounded-2xl shadow shadow-pink-800 transition-all duration-200 hover:bg-sky-50/50 group `}
                        // style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    <span className="text-pink-800 font-medium text-base shadow shadow-pink-800 w-9 h-9 flex items-center justify-center rounded-full"
                                    >
                                        ❌
                                    </span>
                                </div>

                                {/* Dettagli Squadra */}
                                <div className="flex items-center gap-3">
                                    <span   
                                    className={`font-bold text-lg transition-colors group-hover:text-sky-700 text-gray-800 border-l-8 rounded-2xl pl-2`}
                                    style={{borderColor: squadra.border}}
                                    >
                                        {squadra.nome}
                                    </span>
                                </div>
                            </div>

                            {/* Punteggio */}
                            <div className="flex items-center">
                                <span
                                    className={`text-xl font-black px-4 py-1.5 rounded-xlbg-gray-100 text-sky-950 group-hover:bg-sky-100 group-hover:text-sky-900`}
                                >
                                    {(squadra.step1 || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Punteggio */}
                        <div className='flex justify-evenly pt-0.5'>
                            <div className="font-medium bg-pink-100 px-4 text-center rounded-full">{(squadra.step1 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-pink-100 px-4 text-center rounded-full">{(squadra.step2 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-pink-100 px-4 text-center rounded-full">{(squadra.step3 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-pink-100 px-4 text-center rounded-full">{(squadra.step4 || 0).toFixed(1)}</div>
                            <div className="font-medium bg-pink-100 px-4 text-center rounded-full">{(squadra.step5 || 0).toFixed(1)}</div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}