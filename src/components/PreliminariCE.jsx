import squadreData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import headerC from '../assets/image/header_preliminariCE.png'
import { Link } from 'react-router-dom'

export default function PreliminariCE() {
    // 1. Estrai la partecipanti "Preliminari" (id: 10)
    const preliminariObj = squadreData.classifiche.find(
        (item) => item.id === 10 // oppure item.id === 1
    )

    // 2. Prendi l'array dei partecipanti (con fallback ad array vuoto)
    const partecipantiRaw = preliminariObj?.partecipanti || []

    // 3. Ordina i partecipanti girone A per posizione crescente (1°, 2°, 3°, ...)
    const classificaOrdinataA = [...partecipantiRaw].filter(p => p.girone==="A").sort((a, b) => a.posizione - b.posizione)
    
    const classificaOrdinataB = [...partecipantiRaw].filter(p => p.girone==='B').sort((a, b) => a.posizione - b.posizione)

    const classificaOrdinataC = [...partecipantiRaw].filter(p => p.girone==='C').sort((a, b) => a.posizione - b.posizione)

    const classificaOrdinataD = [...partecipantiRaw].filter(p => p.girone==='D').sort((a, b) => a.posizione - b.posizione)

    const competizioniObj = competizioniData.competizioni.find(
        (item) => item.id === 10
    )

    const giornata = competizioniObj.giornata
    // const giornata = 1
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Schermata */}
            <div className="text-center space-y-2 text-sky-50">
                <Link to='/competizioni'>
                    <h1 className="text-4xl tracking-tight flex flex-col px-2 items-center justify-center gap-3 py-6 rounded-tl-4xl rounded-br-4xl font-medium mb-2"
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerC})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'bottom' 
                    }}>
                        <span className='flex gap-4 items-center justify-center'>
                            <div className='grid grid-cols-2 items-center justify-center object-center m-0 overflow-hidden gap-1'>
                                <img src={`../images/champions.png`} className='object-contain col-1 w-10 h-8 rounded-full' alt="Logo squid game" />
                                <img src={`../images/europaLeague.png`} className='object-contain col-2  w-10 h-10 rounded-full' alt="Logo squid game" />
                                <div className="bg-amber-50 rounded-full col-span-2 w-8 mx-auto">
                                    <img src={`../images/conference.png`} className='object-contain  mx-auto w-8 h-8 rounded-full' alt="Logo squid game" />
                                </div>
                            </div>
                            <span className='text-3xl text-sky-50 font-bold'>
                                Preliminari Coppe Europee
                            </span>
                        </span>
                    </h1>
                </Link>
                <div className="flex items-center justify-evenly px-10">
                    <p className="text-sky-900 font-medium uppercase text-2xl">
                        {giornata}' giornata
                    </p>
                </div>
            </div>

            {/* Scheda Tabella GIRONE A*/}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className='font-extrabold text-center text-3xl text-sky-800 rounded-t-2xl border-sky-950 border-t border-x py-2'>
                    GIRONE A
                </div>
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

                {/* Lista Squadre GIRONE A*/}
                <div className="grid gap-4 mb-4 p-1">
                {classificaOrdinataA.map((squadra, index) => {
                    const posizione = index + 1
                    const isPrimo = posizione === 1 || posizione ===2
                    const isTerzo = posizione === 3 || posizione === 4
                    const isQuinto = posizione === 5 || posizione === 6

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 rounded-2xl shadow shadow-sky-950 transition-all duration-200 hover:bg-sky-50/50 group 
                            ${isPrimo ? 'bg-sky-200/40' : ''}
                            ${isTerzo ? 'bg-amber-200/40' : ''}
                            ${isQuinto ? 'bg-lime-200/40' : ''}
                        `}
                        style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    {isPrimo && (
                                        <img src={`../images/champions.png`} className='object-contain col-1 w-10 h-8 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isTerzo && (
                                        <img src={`../images/europaLeague.png`} className='object-contain col-2  w-10 h-10 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isQuinto && (
                                        <img src={`../images/conference.png`} className='object-contain  mx-auto w-8 h-8 rounded-full' alt="Logo squid game" />
                                    )}
                                </div>

                                {/* Dettagli Squadra */}
                                <div className="flex items-center gap-3">
                                    <span   
                                    className={`font-bold text-lg transition-colors group-hover:text-sky-700 text-gray-800`}
                                    >
                                        {squadra.nome}
                                    </span>
                                </div>
                            </div>

                            {/* Punteggio */}
                            <div className="flex items-center">
                                <span
                                    className="text-xl font-black px-4 py-1.5 rounded-xl
                                    bg-sky-100 text-sky-950 group-hover:bg-sky-200 group-hover:text-sky-900"
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
                    </div>
                    )
                })}
                </div>
            </div>


            {/* Scheda Tabella GIRONE B*/}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className='font-extrabold text-center text-3xl text-sky-800 rounded-t-2xl border-sky-950 border-t border-x py-2'>
                    GIRONE B
                </div>
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

                {/* Lista Squadre GIRONE B*/}
                <div className="grid gap-4 mb-4 p-1">
                {classificaOrdinataB.map((squadra, index) => {
                    const posizione = index + 1
                    const isPrimo = posizione === 1 || posizione ===2
                    const isTerzo = posizione === 3 || posizione === 4
                    const isQuinto = posizione === 5 || posizione === 6

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 rounded-2xl shadow shadow-sky-950 transition-all duration-200 hover:bg-sky-50/50 group 
                            ${isPrimo ? 'bg-sky-200/40' : ''}
                            ${isTerzo ? 'bg-amber-200/40' : ''}
                            ${isQuinto ? 'bg-lime-200/40' : ''}
                        `}
                        style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    {isPrimo && (
                                        <img src={`../images/champions.png`} className='object-contain col-1 w-10 h-8 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isTerzo && (
                                        <img src={`../images/europaLeague.png`} className='object-contain col-2  w-10 h-10 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isQuinto && (
                                        <img src={`../images/conference.png`} className='object-contain  mx-auto w-8 h-8 rounded-full' alt="Logo squid game" />
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
                                    className="text-xl font-black px-4 py-1.5 rounded-xl
                                    bg-sky-100 text-sky-950 group-hover:bg-sky-200 group-hover:text-sky-900"
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
                    </div>
                    )
                })}
                </div>
            </div>
            
            {/* Scheda Tabella GIRONE C*/}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className='font-extrabold text-center text-3xl text-sky-800 rounded-t-2xl border-sky-950 border-t border-x py-2'>
                    GIRONE C
                </div>
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

                {/* Lista Squadre GIRONE C*/}
                <div className="grid gap-4 mb-4 p-1">
                {classificaOrdinataC.map((squadra, index) => {
                    const posizione = index + 1
                    const isPrimo = posizione === 1 || posizione ===2
                    const isTerzo = posizione === 3 || posizione === 4
                    const isQuinto = posizione === 5 || posizione === 6

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 rounded-2xl shadow shadow-sky-950 transition-all duration-200 hover:bg-sky-50/50 group 
                            ${isPrimo ? 'bg-sky-200/40' : ''}
                            ${isTerzo ? 'bg-amber-200/40' : ''}
                            ${isQuinto ? 'bg-lime-200/40' : ''}
                        `}
                        style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    {isPrimo && (
                                        <img src={`../images/champions.png`} className='object-contain col-1 w-10 h-8 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isTerzo && (
                                        <img src={`../images/europaLeague.png`} className='object-contain col-2  w-10 h-10 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isQuinto && (
                                        <img src={`../images/conference.png`} className='object-contain  mx-auto w-8 h-8 rounded-full' alt="Logo squid game" />
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
                                    className="text-xl font-black px-4 py-1.5 rounded-xl
                                    bg-sky-100 text-sky-950 group-hover:bg-sky-200 group-hover:text-sky-900"
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
                    </div>
                    )
                })}
                </div>
            </div>

            
            {/* Scheda Tabella GIRONE D*/}
            <div className="rounded-2x overflow-hidden">
                
                {/* Banner testata tabella */}
                <div className='font-extrabold text-center text-3xl text-sky-800 rounded-t-2xl border-sky-950 border-t border-x py-2'>
                    GIRONE D
                </div>
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

                {/* Lista Squadre GIRONE D*/}
                <div className="grid gap-4 mb-4 p-1">
                {classificaOrdinataD.map((squadra, index) => {
                    const posizione = index + 1
                    const isPrimo = posizione === 1 || posizione ===2
                    const isTerzo = posizione === 3 || posizione === 4
                    const isQuinto = posizione === 5 || posizione === 6

                    return (
                    <div
                        key={squadra.id || index}
                        className={`flex flex-col px-2 py-2 border-l-8 border-r-2 rounded-2xl shadow shadow-sky-950 transition-all duration-200 hover:bg-sky-50/50 group 
                            ${isPrimo ? 'bg-sky-200/40' : ''}
                            ${isTerzo ? 'bg-amber-200/40' : ''}
                            ${isQuinto ? 'bg-lime-200/40' : ''}
                        `}
                        style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                    >
                        <div className='flex items-center justify-between'>
                            {/* Posizione + Badge + Nome */}
                            <div className="flex items-center gap-1.5">
                                {/* Numero / Medaglia Posizione */}
                                <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                                    {isPrimo && (
                                        <img src={`../images/champions.png`} className='object-contain col-1 w-10 h-8 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isTerzo && (
                                        <img src={`../images/europaLeague.png`} className='object-contain col-2  w-10 h-10 rounded-full' alt="Logo squid game" />
                                    )}
                                    {isQuinto && (
                                        <img src={`../images/conference.png`} className='object-contain  mx-auto w-8 h-8 rounded-full' alt="Logo squid game" />
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
                                    className="text-xl font-black px-4 py-1.5 rounded-xl
                                    bg-sky-100 text-sky-950 group-hover:bg-sky-200 group-hover:text-sky-900"
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
                    </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}