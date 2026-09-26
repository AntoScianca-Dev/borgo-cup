// import { useState } from 'react'
import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerS from '../assets/image/header_squid.png'
import { Link } from 'react-router-dom'

export default function Squid({ id }) {

    // 1. Estrai la classifica del "Serie" (id: 1)
    const serieObj = squadreData.classifiche.find(
        (item) => item.id === id 
    )

    const giornataInCorso = competizioniData.competizioni.find(
        (item) => item.id === id
    ).giornata

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    const partecipantiRaw = serieObj?.partecipanti || []

    // 3. Estrai la squadra vincitrice (quella attiva con punteggio massimo)
    const isCompetizioneTerminata = competizioniData.competizioni.find(
        (item) => item.id === id
    ).stato === 'Terminata'

    const vincitore = isCompetizioneTerminata 
        ? partecipantiRaw
            .filter((p) => p.attivo === "SI")
            .sort((a, b) => b.punteggio - a.punteggio)[0]
        : null
    
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

            {/* CARD VINCITORE */}
            {vincitore && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-900 via-purple-950 to-slate-900 p-6 text-white shadow-2xl shadow-pink-600/30 border-2 border-pink-500/80 my-4">
                    {/* Effetto bagliore di sfondo */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        
                        {/* Sinistra: Badge + Nome */}
                        <div className="flex items-center gap-4">
                            <div className="text-4xl sm:text-5xl shrink-0 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]">
                                👑
                            </div>
                            <div>
                                <span className="text-xs font-black uppercase tracking-widest text-pink-400 bg-pink-950/90 border border-pink-500/50 px-3 py-1 rounded-full shadow-sm">
                                    VINCITORE SQUID GAME
                                </span>
                                <h2 
                                    className="text-3xl sm:text-4xl font-black tracking-tight mt-1 border-l-4 pl-3"
                                    style={{ borderColor: vincitore.border || '#ec4899' }}
                                >
                                    {vincitore.nome}
                                </h2>
                            </div>
                        </div>

                        {/* Destra: Punteggio Immediato */}
                        <div className="bg-black/40 backdrop-blur-md border border-pink-500/40 px-6 py-2.5 rounded-2xl shrink-0 shadow-inner">
                            <span className="block text-[10px] font-bold tracking-widest text-pink-300 uppercase">
                                Punti
                            </span>
                            <span className="text-3xl sm:text-4xl font-black text-lime-400">
                                {(vincitore.punteggio || 0).toFixed(1)}
                            </span>
                        </div>

                    </div>
                </div>
            )}

            {/* Scheda Tabella */}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className="bg-linear-to-r from-pink-800 via-pink-700 mb-2 to-pink-800 px-6 py-4 text-amber-50 rounded-2xl grid">
                    <div className='flex justify-between items-center'>
                        <div className="font-semibold text-sm tracking-wider uppercase">Squadra</div>
                        <div className="font-semibold text-sm tracking-wider uppercase">Punti</div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className={`${giornataInCorso>=1 ? 'font-bold' : 'font-light'} text-center`}>STEP 1</div>
                        <div className={`${giornataInCorso>=2 ? 'font-bold' : 'font-light'} text-center`}>STEP 2</div>
                        <div className={`${giornataInCorso>=3 ? 'font-bold' : 'font-light'} text-center`}>STEP 3</div>
                        <div className={`${giornataInCorso>=4 ? 'font-bold' : 'font-light'} text-center`}>STEP 4</div>
                        <div className={`${giornataInCorso>=5 ? 'font-bold' : 'font-light'} text-center`}>STEP 5</div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className={`${giornataInCorso>=1 ? 'font-bold' : 'font-light'} text-center`}>≥70</div>
                        <div className={`${giornataInCorso>=2 ? 'font-bold' : 'font-light'} text-center`}>≥73</div>
                        <div className={`${giornataInCorso>=3 ? 'font-bold' : 'font-light'} text-center`}>≥75</div>
                        <div className={`${giornataInCorso>=4 ? 'font-bold' : 'font-light'} text-center`}>≥78</div>
                        <div className={`${giornataInCorso>=5 ? 'font-bold' : 'font-light'} text-center`}>≥80</div>
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
                                    {(squadra.punteggio || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Punteggio */}
                        <div className='flex justify-evenly pt-0.5'>
                            <div className={`font-medium ${squadra.step1>=70 ? "bg-lime-100" : "bg-amber-100" }  px-4 text-center rounded-full`}>{(squadra.step1 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step2>=73 ? "bg-lime-100" : "bg-amber-100" }  px-4 text-center rounded-full`}>{(squadra.step2 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step3>=75 ? "bg-lime-100" : "bg-amber-100" }  px-4 text-center rounded-full`}>{(squadra.step3 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step4>=78 ? "bg-lime-100" : "bg-amber-100" }  px-4 text-center rounded-full`}>{(squadra.step4 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step5>=80 ? "bg-lime-100" : "bg-amber-100" }  px-4 text-center rounded-full`}>{(squadra.step5 || 0).toFixed(1)}</div>
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
                    .sort((a, b) => {
                        const puntiA =  (a.step1 || 0) +
                                        (a.step2 || 0) * 10 +
                                        (a.step3 || 0) * 100 +
                                        (a.step4 || 0) * 1000 +
                                        (a.step5 || 0) * 10000;

                        const puntiB =  (b.step1 || 0) +
                                        (b.step2 || 0) * 10 +
                                        (b.step3 || 0) * 100 +
                                        (b.step4 || 0) * 1000 +
                                        (b.step5 || 0) * 10000;

                        return puntiB-puntiA
                    }
                    )
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
                                    {(squadra.punteggio || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Punteggio */}
                        <div className='flex justify-evenly pt-0.5'>
                            <div className={`font-medium ${squadra.step1>=70 ? "bg-lime-100" : "bg-pink-100" }  px-4 text-center rounded-full`}>{(squadra.step1 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step2>=73 ? "bg-lime-100" : "bg-pink-100" }  px-4 text-center rounded-full`}>{(squadra.step2 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step3>=75 ? "bg-lime-100" : "bg-pink-100" }  px-4 text-center rounded-full`}>{(squadra.step3 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step4>=78 ? "bg-lime-100" : "bg-pink-100" }  px-4 text-center rounded-full`}>{(squadra.step4 || 0).toFixed(1)}</div>
                            <div className={`font-medium ${squadra.step5>=80 ? "bg-lime-100" : "bg-pink-100" }  px-4 text-center rounded-full`}>{(squadra.step5 || 0).toFixed(1)}</div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}