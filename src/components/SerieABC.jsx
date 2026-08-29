// import { useState } from 'react'
import squadreData from '../assets/data/classifiche.json'
import headerC from '../assets/image/header_campionato.png'
import { Link } from 'react-router-dom'

export default function SerieABC({ id }) {

    // 1. Estrai la classifica del "Serie" (id: 1)
    const serieObj = squadreData.classifiche.find(
        (item) => item.id === id 
    )

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    const partecipantiRaw = serieObj?.partecipanti || []

    // 3. Ordina i partecipanti per posizione crescente (1°, 2°, 3°, ...)
    const classificaOrdinata = [...partecipantiRaw].sort((a, b) => a.posizione - b.posizione)
    const imgsrc = serieObj.nome.replaceAll(' ', '').replace('S','s').concat('.png');
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Schermata */}
        <div className="text-center space-y-2 text-sky-50">
            <Link to='/competizioni'>
                <h1 className="text-4xl tracking-tight flex items-center justify-center gap-3 py-6 rounded-tl-4xl rounded-br-4xl font-medium mb-2"
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerC})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}>
                    <span className='flex gap-4 items-center justify-center'>
                        <div className='w-20 h-20 flex items-center justify-center object-center m-0 overflow-hidden'>
                            <img src={`../images/${imgsrc}`} className='object-contain w-15 h-15 rounded-full' alt="Logo campionato" />
                        </div>
                        <span className=''>
                            Classifica <br/>{`${serieObj.nome}`}
                        </span>
                    </span>
                </h1>
            </Link>
            <div className="flex items-center justify-evenly px-10">
                <p className="text-sky-900 font-medium uppercase text-2xl">
                    1' giornata
                </p>
            </div>
        </div>

        {/* Scheda Tabella */}
        <div className="rounded-2x overflow-hidden">
            
            {/* Banner testata tabella */}
            <div className="bg-linear-to-r from-sky-950 via-sky-800 mb-2 to-sky-950 px-6 py-4 text-amber-50 rounded-2xl grid gap-2">
                <div className='flex justify-between items-center'>
                    <div className="font-semibold text-sm tracking-wider uppercase">Squadra</div>
                    <div className="font-semibold text-sm tracking-wider uppercase">Punti</div>
                </div>
                <div className='flex justify-evenly'>
                    <div className="font-semibold text-sm px-4 text-center">G</div>
                    <div className="font-semibold text-sm px-4 text-center">V</div>
                    <div className="font-semibold text-sm px-4 text-center">N</div>
                    <div className="font-semibold text-sm px-4 text-center">P</div>
                    <div className="font-semibold text-sm px-4 text-center">Gf</div>
                    <div className="font-semibold text-sm px-4 text-center">Gs</div>
                </div>
            </div>

            {/* Lista Squadre */}
            <div className="grid gap-4 mb-4 p-1">
            {classificaOrdinata.map((squadra, index) => {
                const posizione = index + 1
                const isPrimo = posizione === 1
                const isSecondo = posizione === 2
                const isTerzo = posizione === 3

                return (
                <div
                    key={squadra.id || index}
                    className={`flex flex-col px-2 py-2 border-l-8 border-r-2 rounded-2xl shadow shadow-sky-950 transition-all duration-200 hover:bg-sky-50/50 group ${
                    isPrimo ? 'bg-amber-50/40' : ''
                    }`}
                    style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                >
                    <div className='flex items-center justify-between'>
                        {/* Posizione + Badge + Nome */}
                        <div className="flex items-center gap-1.5">
                            {/* Numero / Medaglia Posizione */}
                            <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                {isPrimo && (
                                <span className="w-9 h-9 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-md shadow-amber-300/50">
                                    1
                                </span>
                                )}
                                {isSecondo && (
                                <span className="w-9 h-9 rounded-full bg-linear-to-tr from-gray-300 to-gray-100 text-gray-800 flex items-center justify-center shadow-md border border-gray-300">
                                    2
                                </span>
                                )}
                                {isTerzo && (
                                <span className="w-9 h-9 rounded-full bg-linear-to-tr from-amber-700 to-amber-600 text-amber-50 flex items-center justify-center shadow-md">
                                    3
                                </span>
                                )}
                                {!isPrimo && !isSecondo && !isTerzo && (
                                <span className="text-sky-950 font-medium text-base shadow shadow-sky-950 w-9 h-9 flex items-center justify-center rounded-full">
                                    {posizione}
                                </span>
                                )}
                            </div>

                            {/* Dettagli Squadra */}
                            <div className="flex items-center gap-3">
                                <span   
                                className={`font-bold text-lg transition-colors group-hover:text-sky-700 ${
                                    isPrimo ? 'text-amber-900 text-xl' : 'text-gray-800'
                                }`}
                                >
                                    {squadra.nome}
                                </span>
                            </div>
                        </div>

                        {/* Punteggio */}
                        <div className="flex items-center">
                            <span
                                className={`text-xl font-black px-4 py-1.5 rounded-xl ${
                                isPrimo
                                    ? 'bg-amber-400/20 text-amber-900 border border-amber-300/50'
                                    : 'bg-gray-100 text-sky-950 group-hover:bg-sky-100 group-hover:text-sky-900'
                                }`}
                            >
                                {(squadra.punteggio || 0)}
                            </span>
                        </div>
                    </div>

                    {/* Punteggio */}
                    <div className='flex justify-evenly pt-0.5'>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.giocate}</div>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.vinte}</div>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.pari}</div>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.perso}</div>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.gf}</div>
                        <div className="font-medium bg-sky-100 px-4 text-center rounded-full">{squadra.gs}</div>
                    </div>
                    {/* <div className="flex items-center"> */}
                        {/* <span
                            className={`text-xl font-black px-4 py-1.5 rounded-xl ${
                            isPrimo
                                ? 'bg-amber-400/20 text-amber-900 border border-amber-300/50'
                                : 'bg-gray-100 text-sky-950 group-hover:bg-sky-100 group-hover:text-sky-900'
                            }`}
                        >
                            {(squadra.punteggio || 0)}
                        </span> */}
                    {/* </div> */}
                </div>
                )
            })}
            </div>
        </div>
        </div>
    )
}