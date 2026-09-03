// import { useState } from 'react'
// import squadreData from '../assets/data/classifiche.json'
// import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid'
import headerC from '../assets/image/header_campionato.png'
import { Link } from 'react-router-dom'

export default function CoppaItalia() {
    // 1. Estrai la classifica del "Campionato" (id: 1)
    // const campionatoObj = squadreData.classifiche.find(
    //     (item) => item.nome === 'Campionato' // oppure item.id === 1
    // )

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    // const partecipantiRaw = campionatoObj?.partecipanti || []

    // 3. Ordina i partecipanti per posizione crescente (1°, 2°, 3°, ...)
    // const classificaOrdinata = [...partecipantiRaw].sort((a, b) => a.posizione - b.posizione)

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
                        <span className='flex justify-center items-center px-4'>
                            <div className='w-20 h-20 flex items-center justify-center object-center m-0 overflow-hidden'>
                                <img src="../images/coppa_Italia.png" className='object-contain w-15 h-15 m-0 p-1.5' alt="Logo coppa italia" />
                            </div>
                            <span>
                                Coppa Italia
                            </span>
                        </span>
                    </h1>
                </Link>
                <div className="flex items-center justify-evenly px-10">
                    <p className="text-sky-900 font-medium uppercase text-2xl">
                            Tabellone: Preliminari
                    </p>
                </div>
            </div>

            {/* Scheda Tabella */}
            <div className="rounded-2x overflow-hidden">
                <div className="grid gap-1.5 my-2">
                    <p className='col-1 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>16°</p>
                    <p className='col-2 row-span-3 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>1°</p>
                        <p className='col-4 row-span-3 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>6°</p>
                        <p className='col-5 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>11°</p>
                            <p className='col-3 row-span-7 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>FINALE</p>
                    <p className='col-1 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>17°</p>
                        <p className='col-5 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>22°</p>


                    <p className='col-1 min-w-10 mt-4 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>9°</p>
                    <p className='col-2 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>8°</p>
                        <p className='col-4 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>3°</p>
                        <p className='col-5 min-w-10 mt-4 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>14°</p>
                    <p className='col-1 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>24°</p>
                        <p className='col-5 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>19°</p>

                    <p className='col-1 min-w-10 mt-8 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>13°</p>
                    <p className='col-2 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>4°</p>
                        <p className='col-4 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>7°</p>
                        <p className='col-5 min-w-10 mt-8 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>10°</p>
                    <p className='col-1 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>20°</p>
                        <p className='col-5 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>23°</p>

                    <p className='col-1 min-w-10 mt-4 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>12°</p>
                    <p className='col-2 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>5°</p>
                        <p className='col-4 row-span-2 min-w-10 h-12 my-auto border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>2°</p>
                        <p className='col-5 min-w-10 mt-4 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>15°</p>
                    <p className='col-1 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>21°</p>
                        <p className='col-5 min-w-10 border border-sky-400 rounded-full p-2 text-xl text-center font-semibold'>18°</p>
                </div>

            </div>
        </div>
    )
}