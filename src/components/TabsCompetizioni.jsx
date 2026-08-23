import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react'
import { useState } from 'react'
import { competizioni } from '../assets/data/competizioni.json'

export default function TabsCompetizioni() {
    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 pl-3 pt-3 mb-1">Regolamenti competizioni:</h2>
            <p className='text-xl my-0 p-3 '>
                Di seguito sono i riportati i regolamenti di ciascuna delle competizioni sopra elencate.
            </p>
            <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                {/* Tab List */}
                <TabList className="flex flex-wrap gap-2 justify-center p-4 bg-sky-100 rounded-xl shadow shadow-sky-800 overflow-x-auto">
                    {competizioni.filter((comp) => comp.id <= 9)
                    .map((comp) => (
                        <Tab
                            key={comp.id}
                            className={({ selected }) =>
                                `min-w-80 px-4 py-2 rounded-xl font-semibold text-xl transition whitespace-nowrap ${
                                selected
                                ? 'bg-sky-700 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-sky-200'
                                }`
                            }
                        >
                            {comp.nome}
                        </Tab>
                    ))}
                </TabList>
            
                {/* Tab Panels */}
                <TabPanels className="mt-6">
                    {/* CAMPIONATO */}
                    <TabPanel key='1' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Campionato</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 1' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    e terminerà all'ultima giornata di serie A. Sarà strutturata a 
                                </span>
                                <span className="font-bold underline pr-1">
                                    somma punti totale
                                </span>
                                <span className='pr-1'>
                                    e senza scontri diretti. 
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premi garantiti per i primi 5 classificati.
                            </p>
                        </div>
                    </TabPanel>

                    {/* SERIE A - B - C */}
                    <TabPanel key='2' className="space-y-6">
                        {/* HEADER */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Serie A</h3>
                        </div>

                        <div className="grid gap-1.5 ">
                            <p className='col-1 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>Spera Ebbasta</p>
                            <p className='col-2 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>A.S. Marchigiana</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>SenzaNome</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>sam PDOR</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>Squarta Praga</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>Sgherza's FC</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>Zanzibar</p>
                            <p className='border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>TenenteRagno</p>
                        </div>

                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Serie B</h3>
                        </div>
                        <div className="grid gap-1.5 ">
                            <p className='col-1 border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>FC Carmine</p>
                            <p className='col-2 border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>FC TORETTO</p>
                            <p className='border border-sky-300 rounded-2xl py-2 px-1 text-xl text-center font-semibold'>all in - quae intus</p>
                            <p className='border border-sky-300 rounded-2xl py-2 px-1 text-xl text-center font-semibold'>Herta Vernello VII</p>
                            <p className='border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>VeroMat29</p>
                            <p className='border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>HAPPY MILF FC</p>
                            <p className='border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>AG13 FC</p>
                            <p className='border border-sky-300 rounded-2xl p-2 text-xl text-center font-semibold'>Banana83</p>
                        </div>

                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Serie C</h3>
                        </div>

                        <div className="grid gap-1.5 ">
                            <p className='col-1 border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>DG Team</p>
                            <p className='col-2 border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>FC Santo Stefano</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>REVOLUTION</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>G.s.11</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>San Marino</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>Longobarda united</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>Amala fc</p>
                            <p className='border border-sky-200 rounded-2xl p-2 text-xl text-center font-semibold'>MESSI MALE FC</p>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    Le competizioni
                                </span>
                                <span className='pr-1'>
                                    si disputeranno ogni giornata e 
                                </span>
                                <span className="font-bold underline pr-1">
                                    saranno strutturate a campionato, con scontri diretti di andata e ritorno.
                                </span>
                                <span className='pr-1'>
                                    Esse  
                                </span>
                                <span className="font-bold underline pr-1">
                                    avranno inizio a partire dalla 1' giornata di serie A,
                                </span>
                                <span className='pr-1'>
                                    e termineranno in concomitanza con la 35' giornata di serie A (weekend del 09.05.2027).
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Al termine delle competizioni, le ultime 3 classificate di Serie A e Serie B retrocederanno nella serie inferiore, mentre le prime 3 classificate di Serie B e Serie C saranno promosse nella serie superiore. Al termine delle competizioni, in caso di piazzamento a pari punti di una o più squadre varranno, nell'ordine, i seguenti criteri: scontri diretti, differenza reti negli scontri diretti, somma gol fatti negli scontri diretti, somma punti negli scontri diretti, differenza reti totale, somma gol fatti in totale, somma punti nel girone, spareggio (da ripetersi, eventualmente più volte fino massimo alla 37' giornata).
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premi garantiti alle prime tre squadre classificate di ciascuna serie.
                            </p>
                            
                        </div>
                    </TabPanel>

                    {/* COPPE EUROPEE */}
                    <TabPanel key='3' className="space-y-6">
                        {/* PRELIMINARI */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Preliminari Coppe Europee</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà a inizio a partire dalla 3' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    (weekend del 06.09.2026) e sarà strutturata in 
                                </span>
                                <span className="font-bold underline pr-1">
                                    4 gironi da 6 squadre ciascuno, con scontri diretti di sola andata;
                                </span>
                                <span className='pr-1'>
                                    le posizioni di ciascuna squadra in campionato fino a quel momento (cioè fino alla 2' giornata) determineranno la composizione dei gironi secondo il seguente ordine:  
                                </span>

                                <p className='border mt-3 border-sky-400 rounded-2xl p-1 text-xl text-center font-semibold'>Girone A</p>
                                <div className="grid gap-1.5 my-2">
                                    <p className='col-1 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>1'</p>
                                    <p className='col-2 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>5'</p>
                                    <p className='col-3 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>9'</p>
                                    <p className='col-4 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>13'</p>
                                    <p className='col-5 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>17'</p>
                                    <p className='col-6 min-w-10 border border-sky-400 rounded-2xl p-2 text-xl text-center font-semibold'>21'</p>
                                </div>

                                <p className='border mt-3 border-sky-600 rounded-2xl p-1 text-xl text-center font-semibold'>Girone B</p>
                                <div className="grid gap-1.5 my-2">
                                    <p className='col-1 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>2'</p>
                                    <p className='col-2 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>6'</p>
                                    <p className='col-3 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>10'</p>
                                    <p className='col-4 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>14'</p>
                                    <p className='col-5 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>18'</p>
                                    <p className='col-6 min-w-10 border border-sky-600 rounded-2xl p-2 text-xl text-center font-semibold'>22'</p>
                                </div>

                                <p className='border mt-3 border-sky-800 rounded-2xl p-1 text-xl text-center font-semibold'>Girone C</p>
                                <div className="grid gap-1.5 my-2">
                                    <p className='col-1 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>3'</p>
                                    <p className='col-2 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>7'</p>
                                    <p className='col-3 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>11'</p>
                                    <p className='col-4 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>15'</p>
                                    <p className='col-5 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>19'</p>
                                    <p className='col-6 min-w-10 border border-sky-800 rounded-2xl p-2 text-xl text-center font-semibold'>23'</p>
                                </div>

                                <p className='border mt-3 border-sky-950 rounded-2xl p-1 text-xl text-center font-semibold'>Girone D</p>
                                <div className="grid gap-1.5 my-2">
                                    <p className='col-1 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>4'</p>
                                    <p className='col-2 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>8'</p>
                                    <p className='col-3 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>12'</p>
                                    <p className='col-4 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>16'</p>
                                    <p className='col-5 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>20'</p>
                                    <p className='col-6 min-w-10 border border-sky-950 rounded-2xl p-2 text-xl text-center font-semibold'>24'</p>
                                </div>

                                <span className='pr-1'>
                                    Nel caso in cui, prima della composizione dei suddetti gironi, una o più squadre dovessero trovarsi a pari punti, l'ordine per l'assegnazione dei posti nei gironi sarà quello stabilito, al termine della 2' giornata, dalla classifica del Campionato visibile sulla app.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Al termine della fase a gironi, le prime due classificate si qualificheranno alla fase a gironi di Champions League, terze e quarte classificate si qualificheranno alla fase a gironi di Europa League, quinte e seste classificate si qualificheranno alla fase a gironi di Conference League.
                            </p>
                            
                        </div>

                        {/* CHAMPIONS LEAGUE */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Champions League</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 9' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    (weekend del 28.10.2026); alla stessa parteciperanno le prime 2 squadre classificate dei 4 gironi della fase preliminare delle Coppe Europee. La competizione sarà strutturata in
                                </span>
                                <span className="font-bold underline pr-1">
                                    due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    Le prime due squadre classificate dei gironi preliminari A e D comporranno il girone A, le prime due squadre classificate dei gironi preliminari B e C comporranno il girone B.  
                                </span>
                                <span className="font-bold underline pr-1">
                                    Al termine della fase a gironi, la terza classificata passerà a disputare le fasi finali di Europa League, mentre le prime due classificate di ciascun girone si affronteranno in semifinale in scontri diretti di andata e ritorno
                                </span> 
                                <span className='pr-1'>
                                    secondo il classico accoppiamento 1A - 2B e 1B - 2A. Le vincenti si affronteranno in finale in gara unica.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premio garantito unicamente alla squadra vincitrice della competizione.
                            </p>
                        </div>

                        {/* EUROPA LEAGUE */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Europa League</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 9' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    (weekend del 28.10.2026); alla stessa parteciperanno le terze e quarte squadre classificate dei 4 gironi della fase preliminare delle Coppe Europee. La competizione sarà strutturata in
                                </span>
                                <span className="font-bold underline pr-1">
                                    due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.
                                </span>
                                <span className='pr-1'>
                                    Le terze e quarte squadre classificate dei gironi preliminari A e D comporranno il girone A, le terze e quarte squadre classificate dei gironi preliminari B e C comporranno il girone B.  
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    Al termine della fase a gironi, si qualificheranno alla fase finale le prime tre classificate di ciascun girone che, insieme alle due “retrocesse” dalla Champions League, si affronteranno nei quarti di finale in scontri diretti di andata e ritorno
                                </span> 
                                <span className='pr-1'>
                                    secondo l'accoppiamento 1A - 3B , 3CHA - 2B , 1B - 3A , 3CHB - 2A. Successivamente anche le semifinali verranno disputate in scontri diretti di andata e ritorno con accoppiamenti stabiliti dall'ordine scritto in precedenza, quindi (1A - 3B) Vs (3CHA - 2B) , (1B - 3A) Vs (3CHB - 2A). Le vincenti si affronteranno in finale in gara unica.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premio garantito unicamente alla squadra vincitrice della competizione.
                            </p>
                        </div>

                        {/* CONFERENCE LEAGUE */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Conference League</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 9' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    (weekend del 28.10.2026); alla stessa parteciperanno le quinte e seste squadre classificate dei 4 gironi della fase preliminare delle Coppe Europee. La competizione sarà strutturata in
                                </span>
                                <span className="font-bold underline pr-1">
                                    due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.
                                </span>
                                <span className='pr-1'>
                                    Le quinte e seste squadre classificate dei gironi preliminari A e D comporranno il girone A, le quinte e seste squadre classificate dei gironi preliminari B e C comporranno il girone B.  
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    Al termine della fase a gironi, le prime due classificate di ciascun girone si affronteranno in semifinale in scontri diretti di andata e ritorno
                                </span> 
                                <span className='pr-1'>
                                    secondo il classico accoppiamento 1A - 2B e 1B - 2A. Le vincenti si affronteranno in finale in gara unica.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premio garantito unicamente alla squadra vincitrice della competizione.
                            </p>
                        </div>

                        {/* INFO GENERALI */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg flex gap-2 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                                <path fill="rgb(255, 251, 235)" d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/>
                            </svg>
                            <h3 className="text-3xl font-bold mb-2">Info</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                Per tutte le competizioni “europee”, preliminari compresi, al termine dei gironi, in caso di piazzamento a pari punti di una o più squadre varranno, nell'ordine, i seguenti criteri: scontri diretti, differenza reti negli scontri diretti, somma gol fatti negli scontri diretti, somma punti negli scontri diretti, differenza reti totale, somma gol fatti in totale, somma punti nel girone, 1 spareggio, somma punti in Campionato (fino a quel momento).
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Al termine dei quarti di finale e delle semifinali, in caso di parità negli scontri diretti varranno, nell'ordine, i seguenti criteri: differenza reti, somma gol fatti nel doppio confronto, somma punti fatti nel doppio confronto, 1 spareggio, somma punti in Campionato (fino a quel momento). Al termine della finale, in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da ripetersi, eventualmente più volte fino massimo alla 37' giornata).
                            </p>
                        </div>

                        {/* CALENDARIO PRELIMINARI */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg flex gap-2 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                            <path fill="rgb(255, 251, 235)" d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"/></svg>
                            <h3 className="text-3xl font-bold mb-2">Fase preliminare</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2 font-semibold underline">
                                Il calendario della fase preliminare delle Coppe Europee sarà il seguente:
                            </p>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>1' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>3' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>2' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>4' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>3' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>5' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>4' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>6' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>5' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>7' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>8' giornata di serie A</p>
                                </span>
                        </div>

                        {/* CALENDARIO COPPE ERUROPEE */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg flex gap-2 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                            <path fill="rgb(255, 251, 235)" d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"/></svg>
                            <h3 className="text-3xl font-bold mb-2">Fase a gironi</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2 font-semibold underline">
                                Il calendario dei gironi delle Coppe Europee sarà il seguente:
                            </p>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>ANDATA</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>1' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>8' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>2' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>12' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>3' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>15' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-800 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>RITORNO</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-800 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>1' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>18' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-800 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>2' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>21' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-800 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>3' giornata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>24' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>25' giornata di serie A</p>
                                </span>
                        </div>

                        {/* CALENDARIO FASI FINALI */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg flex gap-2 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                            <path fill="rgb(255, 251, 235)" d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"/></svg>
                            <h3 className="text-3xl font-bold mb-2">Fase finale</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2 font-semibold underline">
                                Il calendario delle fasi finali di Champions League e Conference League sarà il seguente:
                            </p>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>SEMIFINALE</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>27' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>30' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>31' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>FINALE</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>33' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>34' giornata di serie A</p>
                                </span>

                            <p className="text-xl mt-4 mb-0 pb-2 font-semibold underline">
                                Il calendario delle fasi finali di Europa League sarà il seguente:
                            </p>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>QUARTI DI FINALE</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>27' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>28' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>29' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>SEMIFINALE</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>30' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>31' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>32' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>FINALE</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>33' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>34' giornata di serie A</p>
                                </span>
                                
                        </div>
                    </TabPanel>

                    {/* SUPERCOPPA EUROPEA */}
                    <TabPanel key='4' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Supercoppa Europea</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    La competizione sarà disputata tra
                                </span>
                                <span className="font-bold underline pr-1">
                                    le due squadre vincitrici di Champions League e Europa League, in gara secca di sola andata
                                </span>
                                <span className='pr-1'>
                                    nel weekend del 
                                </span>
                                <span className="font-bold underline pr-1">
                                    09.05.2027
                                </span>
                                <span className='pr-1'>
                                    in concomitanza con la 
                                </span>
                                <span className="font-bold underline pr-1">
                                    35' giornata di serie A.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                In caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da disputarsi, eventualmente, nel weekend successivo, laddove possibile).
                            </p>
                        </div>
                    </TabPanel>

                    {/* COPPA ITALIA */}
                    <TabPanel key='5' className="space-y-6">
                        {/* PRELIMINARI */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Coppa Italia</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 8' giornata di serie A 
                                </span>
                                <span className='pr-1'>
                                    (weekend del 25.10.2026). La competizione sarà strutturata con 
                                </span>
                                <span className="font-bold underline pr-1">
                                    tabellone di scontri diretti di andata e ritorno, ad eliminazione diretta,
                                </span>
                                <span className='pr-1'>
                                    tra tutte le squadre partecipanti, a partire dagli ottavi di finale, dopo un primo turno preliminare ad eliminazione diretta, come di seguito riportato:  
                                </span>

                                <p className='border mt-3 border-sky-400 rounded-2xl p-1 text-xl text-center font-semibold'>COPPA ITALIA</p>
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

                                

                                <span className='pr-1'>
                                    Per completare il tabellone saranno considerate le posizioni di ciascuna squadra in campionato fino a quel momento (cioè fino alla 7' giornata). Nel caso in cui, prima della composizione del presente tabellone, una o più squadre dovessero trovarsi a pari punti, l'ordine per l'assegnazione dei posti sarà quello stabilito, al termine della 7' giornata, dalla classifica del Campionato visibile sulla app. Al termine del doppio confronto, in caso di parità negli scontri diretti varranno, nell'ordine, i seguenti criteri: differenza reti, somma gol fatti nel doppio confronto, somma punti fatti nel doppio confronto, 1 spareggio, somma punti in Campionato (fino a quel momento). Al termine della finale, in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da ripetersi più volte fino massimo alla 37' giornata).
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premio garantito unicamente alla squadra vincitrice della competizione.
                            </p>
                            
                        </div>

                        {/* CALENDARIO COPPA ITALIA */}
                        <div className="mb-4 bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg flex gap-2 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                            <path fill="rgb(255, 251, 235)" d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"/></svg>
                            <h3 className="text-3xl font-bold mb-2">Calendario</h3>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2 font-semibold underline">
                                Il calendario della Coppa Italia sarà il seguente:
                            </p>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>PRELIMINARI</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>8' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>11' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-2 mb-4 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>12' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>OTTAVI</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>14' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>17' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-2 mb-4 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>18' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>QUARTI</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>20' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>23' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-2 mb-4 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>24' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='p-2 text-xl text-center font-semibold'>SEMIFINALI</p>
                                </span>
                                <span className='grid gap-1.5 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Andata</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>26' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 my-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>Ritorno</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>29' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-2 mb-4 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>30' giornata di serie A</p>
                                </span>

                                <span className='grid gap-1.5 mt-4 mb-2 border border-sky-400 rounded-2xl'>
                                    <p className='col-1 p-2 text-xl text-center font-semibold'>FINALE</p>
                                    <p className='col-2 p-2 text-xl text-center font-semibold'>33' giornata di serie A</p>
                                </span>
                                <span className='grid gap-1.5 mt-2 mb-4 border border-sky-900 rounded-2xl'>
                                    <p className='p-1 text-xl text-center'>Eventuale Spareggio</p>
                                    <p className='p-1 text-xl text-center'>34' giornata di serie A</p>
                                </span>

                        </div>
                    </TabPanel>

                    {/* SUPERCOPPA ITALIANA */}
                    <TabPanel key='6' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Supercoppa Italiana</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    La competizione sarà disputata tra
                                </span>
                                <span className="font-bold underline pr-1">
                                    le due squadre vincitrici di Serie A e Coppa Italia,
                                </span>
                                <span className='pr-1'>
                                    in 
                                </span>
                                <span className="font-bold underline pr-1">
                                    gara secca di sola andata
                                </span>
                                <span className='pr-1'>
                                    nel weekend del 
                                </span>
                                <span className="font-bold underline pr-1">
                                    23.05.2026,
                                </span>
                                <span className='pr-1'>
                                    in concomitanza con la 
                                </span>
                                <span className="font-bold underline pr-1">
                                    37' giornata di serie A.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Nel caso in cui vincitrice di Serie A e di Coppa Italia dovessero coincidere, accederà alla competizione la finalista perdente di Coppa Italia.
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                In caso di parità varranno, nell’ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da disputarsi, eventualmente, nel weekend successivo, laddove possibile).
                            </p>
                        </div>
                    </TabPanel>

                    {/* SURVIVOR CUP */}
                    <TabPanel key='7' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Survivor Cup</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    La competizione avrà inizio a partire dalla 3' giornata di serie A
                                </span>
                                <span className='pr-1'>
                                    (weekend del 06.09.2026) e si disputerà a weekend alterni;
                                </span>
                                <span className="font-bold underline pr-1">
                                    alla stessa parteciperanno tutte le 24 squadre
                                </span>
                                <span className='pr-1'>
                                    iscritte alla Borgo Cup. Essa 
                                </span>
                                <span className="font-bold underline pr-1">
                                    sarà strutturata a somma punti totali
                                </span>
                                <span className='pr-1'>
                                    e sarà composta da un numero massimo di 14 giornate alle quali si accederà per step. 
                                </span>
                                <span className="font-bold underline pr-1">
                                    A ciascuno step successivo accederanno tutte le squadre, a prescindere dal punteggio di giornata totalizzato, eccezion fatta per la/e squadra/e che, tra i “sopravvissuti”, avrà/avranno totalizzato il punteggio peggiore di giornata e che quindi sarà/saranno automaticamente eliminata/e. Per i primi 9 step,
                                </span>
                                <span className='pr-1'>
                                    quindi fino al termine della 19' giornata di serie A (weekend del 10.01.2027) 
                                </span>
                                <span className="font-bold underline pr-1">
                                    saranno eliminati di volta in volta 2 squadre, mentre dallo step 10 in poi sarà eliminata
                                </span>
                                <span className='pr-1'>
                                    di volta in volta 
                                </span>
                                <span className="font-bold underline pr-1">
                                    una sola squadra. 
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Fino al penultimo step per il punteggio peggiore di giornata (tra i partecipanti “sopravvissuti”), in caso di parità varranno, nell'ordine, i seguenti criteri: spareggio (da disputarsi, eventualmente, nel weekend successivo), somma punti in Campionato (fino a quel momento).  
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Nello step finale in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da ripetersi più volte fino massimo alla 37' giornata).
                            </p>
                            <p className="text-xl mb-0 pb-2 font-bold underline">
                                Premio garantito unicamente alla squadra vincitrice della competizione.
                            </p>
                        </div>
                    </TabPanel>

                    {/* SQUID GAME CUP */}
                    <TabPanel key='8' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Squid Game Cup</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    La competizione sarà suddivisa in 4 parti:
                                </span>
                            </p>

                            <div className="grid gap-1.5 my-2 border border-sky-300 rounded-2xl p-2">
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>1' Squid Game Cup</p>
                                <p className='col-1 text-xl text-center font-semibold'>dalla 1' </p>
                                <p className='col-2 text-xl text-center font-semibold'>alla 5'</p>
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>giornata di Serie A</p>
                            </div>
                            <div className="grid gap-1.5 my-2 border border-sky-400 rounded-2xl p-2">
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>2' Squid Game Cup</p>
                                <p className='col-1 text-xl text-center font-semibold'>dalla 11' </p>
                                <p className='col-2 text-xl text-center font-semibold'>alla 15'</p>
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>giornata di Serie A</p>
                            </div>
                            <div className="grid gap-1.5 my-2 border border-sky-500 rounded-2xl p-2">
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>3' Squid Game Cup</p>
                                <p className='col-1 text-xl text-center font-semibold'>dalla 21' </p>
                                <p className='col-2 text-xl text-center font-semibold'>alla 25'</p>
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>giornata di Serie A</p>
                            </div>
                            <div className="grid gap-1.5 my-2 border border-sky-600 rounded-2xl p-2">
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>4' Squid Game Cup</p>
                                <p className='col-1 text-xl text-center font-semibold'>dalla 31' </p>
                                <p className='col-2 text-xl text-center font-semibold'>alla 35'</p>
                                <p className=' col-span-2 p-1 text-xl text-center font-semibold'>giornata di Serie A</p>
                            </div>

                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    A ciascuna di esse parteciperanno, in fase iniziale, tutte le 24 squadre iscritte alla Borgo Cup.
                                </span>
                                <span className="font-bold underline pr-1">
                                    Ciascuna Squid Game Cup sarà strutturata a somma punti totali 
                                </span>
                                <span className='pr-1'>
                                    e sarà composta da un numero massimo di 5 giornate alle quali si accederà per step secondo lo schema di seguito indicato: 
                                </span>
                            </p>

                            <div className="grid gap-1.5 mb-2 p-2">
                                <p className='p-1 text-xl text-center font-semibold border border-sky-300 rounded-2xl'>1' step superato per chi avrà totalizzato un punteggio non inferiore a 70 fantapunti</p>
                                <p className='p-1 text-xl text-center font-semibold border border-sky-400 rounded-2xl'> 2' step superato per chi avrà totalizzato un punteggio non inferiore a 73 fantapunti</p>
                                <p className='p-1 text-xl text-center font-semibold border border-sky-500 rounded-2xl'>3' step superato per chi avrà totalizzato un punteggio non inferiore a 75 fantapunti</p>
                                <p className='p-1 text-xl text-center font-semibold border border-sky-600 rounded-2xl'> 4' step superato per chi avrà totalizzato un punteggio non inferiore a 78 fantapunti</p>
                                <p className='p-1 text-xl text-center font-semibold border border-sky-700 rounded-2xl'> Vincerà chi avrà totalizzato un punteggio non inferiore a 80 fantapunti</p>
                            </div>

                            <p className="text-xl mb-0 pb-2">
                                Nel caso in cui nessuna squadra dovesse accedere allo step successivo, la competizione si riterrà terminata e il premio sarà assegnato alla squadra che nell'ultimo step disputato avrà totalizzato il punteggio migliore. 
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                Se questa ipotesi dovesse capitare già al primo step, e solo in questo caso specifico, la competizione sarà annullata e partirà nuovamente dalla giornata successiva. 
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    Premio garantito unicamente alla squadra vincitrice della competizione.
                                </span>
                                <span className='pr-1'>
                                    (nel caso in cui due o pù squadre dovessero totalizzare il medesimo punteggio nello step finale, il premio sarà suddiviso in parti uguali). 
                                </span>
                            </p>
                        </div>
                    </TabPanel>

                    {/* PUNTEGGIO PIU’ ALTO DI GIORNATA */}
                    <TabPanel key='9' className="space-y-6">
                        {/* HEADER */}
                        <div className="bg-linear-to-br from-sky-700 to-sky-300 text-amber-50 p-3 rounded-lg shadow-lg">
                            <h3 className="text-3xl font-bold mb-2">Punteggio Più Alto di Giornata</h3>
                        </div>

                        {/* BODY */}
                        <div className="bg-sky-50 p-2 rounded-2xl shadow shadow-sky-950">
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    La competizione sarà disputata da ciascuna delle 24 squadre partecipanti alla lega. Si aggiudicherà il premio
                                </span>
                                <span className="font-bold underline pr-1">
                                    la squadra che avrà totalizzato il maggior numero di punti nell’arco di ogni singola giornata.
                                </span>
                                <span className='pr-1'>
                                    In caso di parità tra una o più squadre, la quota premio sarà suddivisa in parti uguali tra le squadre prime classificate nella giornata. 
                                </span>
                            </p>
                        </div>
                    </TabPanel>

                </TabPanels>
            </TabGroup>
        </div>
    )
}