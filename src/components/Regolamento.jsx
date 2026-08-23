import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import TabsCompetizioni from './TabsCompetizioni'

export default function Regolamento() {
    
    return (
        <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Regolamento</h1>
        
        {/* INFO E DESCRIZIONE LEGA */}
        <Disclosure>
            {({ open }) => (
                <>
                <DisclosureButton className="flex w-full justify-between items-center bg-blue-50 my-1.5 p-4 rounded-lg shadow-md hover:bg-sky-100 transition">
                <h2 className='text-gray-700 font-bold text-2xl mb-0 pb-2 text-left'>Descrizione lega </h2>
                <ChevronUpIcon
                className={`w-5 h-5 text-lega-600 transition ${open ? 'transform rotate-180' : ''}`}
                />
                </DisclosureButton>
                <DisclosurePanel className="bg-amber-50 p-2 rounded-2xl shadow shadow-gray-300 text-gray-700">
                    <div className="m-0">
                        <span>
                            <p className='text-xl mb-0 pb-2'> 
                                <span className=' pr-1'>
                                    La lega è composta da 13 competizioni con 24 squadre partecipanti e diversi premi in palio, di seguito elencati nel dettaglio.
                                </span>
                                <span className='font-bold underline pr-1'>
                                    La quota di partecipazione è di €100,00. Di questi, €50,00 andranno consegnati, come quota di iscrizione, prima che cominci la stagione e comunque non oltre il 31.08.2025. Le squadre che non dovessero rispettare la data di consegna della quota di iscrizione saranno penalizzate di 15 punti in classifica generale per ciascuna giornata di ritardo
                                </span>
                                <span className=' pr-1'>
                                    (partendo già dal calcolo della 3'giornata).
                                </span>
                            </p>
                            <p className='text-xl mb-0 pb-2'>
                                <span className="font-bold underline pr-1">
                                    Il saldo di €50,00 dovrà essere corrisposto obbligatoriamente a partire dal 01.04.2027 fino a non oltre il 02.05.2027, pena l'automatica esclusione dalla Borgo Cup 2027-2028,
                                </span>
                                <span>
                                    ad eccezione delle squadre partecipanti che alla data del 10/05/2026 dovessero aver già vinto un premio superiore a €50,00. Le diverse competizioni verranno gestite tramite l'applicazione “Leghe FC”. 
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    La rosa di calciatori a disposizione di ogni squadra partecipante dovrà essere composta da 3 portieri, 8 difensori, 8 centrocampisti, 6 attaccanti. Ciascun partecipante avrà a disposizione 300 crediti iniziali. Per la quotazione di ogni singolo calciatore sarà considerata la “quotazione iniziale” di ciascuno di esso.
                                </span>
                                <span className="font-bold underline pr-1">
                                    La rosa completa dei 25 giocatori,
                                </span>
                                <span className="pr-1">
                                    per ciascuno dei quali andrà indicata quotazione e squadra di appartenenza,
                                </span>
                                <span className="font-bold underline pr-1">
                                    dovrà essere consegnata entro e non oltre le ore 23:59 di giovedì 20 Agosto. Le squadre che non dovessero rispettare la data e l'ora di consegna della rosa completa saranno penalizzate di 20 punti in classifica generale ogni 6 ore di ritardo dall'orario massimo prestabilito
                                </span>
                                <span className="pr-1">
                                    (partendo già dal calcolo della 1'giornata). Nel caso in cui la somma totale delle quotazioni dei 25 giocatori in rosa dovesse superare i 300 crediti a disposizione, si procederà con una modifica d'ufficio alla rosa, escludendo dalla stessa il giocatore acquistato con la quotazione più alta, fino a reintegrare la somma totale delle quotazioni al di sotto del tetto massimo previsto; in tal caso, la rosa in questione rimarrà composta da 24 giocatori fino alla successiva sessione di mercato. 
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    L'inserimento della formazione
                                </span>
                                <span className="pr-1">
                                    sulla applicazione sarà possibile
                                </span>
                                <span className="font-bold underline pr-1">
                                    fino a 5 minuti prima
                                </span>
                                <span className="pr-1">
                                    dall'inizio del primo evento della giornata. Diversamente verrà automaticamente inserita la formazione schierata nella giornata precedente. Alla prima giornata di ciascuna competizione, non essendoci formazione precedente, si attribuirà punteggio 0 a chi non consegnerà la formazione entro il termine previsto. La formazione inserita in ogni giornata può essere schierata secondo i seguenti moduli: 5-4-1, 5-3-2, 4-5-1, 4-4-2, 4-3-3, 3-4-3, 3-5-2; essa è composta oltre che da 11 titolari, anche da 7 panchinari con possibilità di massimo 3 sostituzioni in base al mancato voto di uno o più titolari. La composizione della panchina sarà unicamente possibile secondo il seguente ordine: PDDCCAA.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span>
                                    Per tutte le partite rinviate, per qualsiasi motivo, si procederà con l’attribuzione di un 6 politico (a prescindere dalla decisione di Fantacalcio) a tutti i calciatori che prenderanno parte alla gara rinviata, inclusi non convocati, infortunati e squalificati. Nel caso in cui la stessa, però, sia giocata entro le 23:59 del giorno precedente alla prima partita della giornata successiva, i voti della gara in questione varranno ai fini del calcolo finale di giornata.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span>
                                    Nel caso in cui, a partita in corso, la stessa dovesse essere sospesa per un qualsivoglia motivo e dovesse riprendere dopo l'inizio della prima partita della giornata successiva, saranno presi in considerazione i voti attribuiti ai calciatori in campo fino a quel momento; diversamente se la stessa dovesse completarsi entro l'inizio della prima gara della giornata successiva, si attenderà il voto finale di ciascun giocatore prima del calcolo della giornata di riferimento; se invece la partita dovesse essere sospesa dopo pochi minuti, quindi quando a tutti i giocatori sia ancora attribuito il s.v., senza possibilità di ripresa entro la prima gara del turno successivo, sarà attribuito il 6 politico a tutti i calciatori che prenderanno parte alla gara rinviata, inclusi non convocati, infortunati e squalificati.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    Nel dettaglio le 13 competizioni a cui i partecipanti alla lega avranno la possibilità di partecipare sono: 
                                </span>
                                <span className="font-bold underline pr-1">
                                    Campionato, Serie A, Serie B, Serie C, Coppa Italia, Supercoppa Italiana, Champions League, Europa League, Conference League, Supercoppa Europea, Survivor Cup, Squid Game Cup e Punteggio più alto di giornata.
                                </span>
                            </p>
                        </span>
                    </div>
                </DisclosurePanel>
                </>
            )}
        </Disclosure>

        {/* CALCOLO PUNTEGGIO */}
        <Disclosure>
            {({ open }) => (
                <>
                <DisclosureButton className="flex w-full justify-between items-center bg-blue-50 my-1.5 p-4 rounded-lg shadow-md hover:bg-sky-100 transition">
                <h2 className='text-gray-700 font-bold text-2xl mb-0 pb-2'>Calcolo punteggio</h2>
                <ChevronUpIcon
                className={`w-5 h-5 text-lega-600 transition ${open ? 'transform rotate-180' : ''}`}
                />
                </DisclosureButton>
                <DisclosurePanel className="bg-amber-50 p-2 rounded-2xl shadow shadow-gray-300 text-gray-700">
                    <div className="m-0">
                        <span>
                            <p className="text-xl mb-0 pb-2">
                                <span className="pr-1">
                                    Per il calcolo del punteggio, bonus e malus, quotazioni e definizione dei ruoli dei calciatori saranno considerati unicamente i dati “Fantacalcio”. Al giocatore senza voto e ammonito sarà assegnato d'ufficio il voto 5,5; al giocatore senza voto e espulso sarà assegnato d'ufficio il voto 4.
                                </span>
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                <span className="font-bold underline pr-1">
                                    Al portiere che resterà imbattuto
                                </span>
                                <span className="pr-1">
                                    fino al termine della gara, o prima di una sua eventuale sostituzione, 
                                </span>
                                <span className="font-bold underline pr-1">
                                    sarà attribuito 1 punto bonus.
                                </span>
                            </p>

                            {/* MODIFICATORE DIFESA */}
                            <p className="text-xl mb-0 pb-2">
                                <span className="pr-1">
                                    Sarà possibile accumulare ulteriori punti bonus grazie al
                                </span>
                                <span className="font-bold underline pr-1">
                                    “modificatore difesa”
                                </span>
                                <span className="font-bold pr-1">
                                    nel caso in cui la formazione iniziale sia schierata con un minimo di 4 difensori; in tal caso si procederà con il calcolo della media matematica del singolo voto di giornata (esclusi bonus e/o malus) tra il portiere e i 3 migliori (in merito al voto) difensori schierati,
                                </span>
                                <span className='pr-1'>
                                    e alla squadra di riferimento si attribuiranno ulteriori punti bonus in base alle fasce di seguito riportate:
                                </span>
                                <span className='grid gap-1.5 pt-3'>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-300 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Fino ad una media minore di 6,00: 
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            0 punti;
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-400 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore o uguale a 6,00 e minore di 6,25: 
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            1 punto
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore o uguale 6,25 e minore di 6,50:  
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            2 punti
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-600 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore o uguale a 6,50 e minore di 6,75: 
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            3 punti
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore o uguale a 6,75 e minore di 7,00: 
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            4 punti
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-800 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore o uguale a 7,00 e minore di 7,50:  
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            5 punti
                                        </p>
                                    </span>
                                    <span className='flex flex-row justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-22'>
                                        <p className=' flex-2'>
                                            Da una media maggiore di o uguale a 7,50:    
                                        </p>
                                        <p className=' flex-1 text-center'>
                                            6 punti
                                        </p>
                                    </span>
                                </span>
                            </p>
                        </span>
                    </div>
                </DisclosurePanel>
                </>
            )}
        </Disclosure>

        {/* MERCATO DI RIPARAZIONE */}
        <Disclosure>
            {({ open }) => (
                <>
                <DisclosureButton className="flex w-full justify-between items-center bg-blue-50 my-1.5 p-4 rounded-lg shadow-md hover:bg-sky-100 transition">
                <h2 className='text-gray-700 font-bold text-2xl mb-0 pb-2'>Mercato di riparazione</h2>
                <ChevronUpIcon
                className={`w-5 h-5 text-lega-600 transition ${open ? 'transform rotate-180' : ''}`}
                />
                </DisclosureButton>
                <DisclosurePanel className="bg-amber-50 p-2 rounded-2xl shadow shadow-gray-300 text-gray-700">
                    <div className="m-0">
                        <span>
                            <p className="text-xl mb-0 pb-2">
                                La competizione prevede tre differenti sessioni di mercato, secondo il seguente calendario:
                            </p>
                            <p className="text-xl underline mb-0 pb-2 font-bold">
                                PRIMA SESSIONE:
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                dalle 00:01 di martedì 06 ottobre alle 23:59 di giovedì 08 ottobre.
                            </p>
                            <p className="text-xl underline mb-0 pb-2 font-bold">
                                SECONDA SESSIONE: 
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                dalle 00:01 di martedì 08 dicembre alle 23:59 di giovedì 10 dicembre.
                            </p>
                            <p className="text-xl underline mb-0 pb-2 font-bold">
                                TERZA SESSIONE: 
                            </p>
                            <p className="text-xl mb-0 pb-2">
                                dalle 00:01 di martedì 09 febbraio alle 23:59 di giovedì 11 febbraio.
                            </p>                            
                            <p className="text-xl mb-0 pb-2">
                                <span className='pr-1'>
                                    Ciascun partecipante avrà a disposizione un 
                                </span>
                                <span className="font-bold underline pr-1">
                                    numero massimo di 7 cambi per ciascuna sessione di mercato.
                                </span>
                                <span className='pr-1'>
                                    Gli unici crediti a disposizione di ciascun partecipante saranno quelli derivanti dalla cessione dei propri calciatori, che si sommeranno ai crediti residui già in possesso di ciascuna squadra, laddove disponibili. Non sarà possibile, durante la stessa sessione di mercato, vendere un proprio giocatore per poi riacquistarlo. I cambi dovranno essere effettuati tenendo conto delle “quotazioni attuali” valide durante la sessione di mercato di riferimento. Nel caso in cui la somma delle quotazioni dei giocatori acquistati dovesse essere superiore alla somma delle quotazioni dei giocatori ceduti (più eventuali crediti residui a disposizione), si procederà con una modifica d'ufficio alla lista degli scambi, escludendo dalla stessa il giocatore acquistato con la quotazione più alta, fino a reintegrare la somma totale delle quotazioni al di sotto del tetto massimo previsto. Per questo motivo la lista dei cambi, al momento della presentazione e a prescindere dall'ordine indicato da ciascun partecipante, sarà risistemata ordinando dal più costoso sia acquisti che cessioni. Al termine del mercato, nel caso in cui un giocatore non più in rosa dovesse essere schierato nella formazione di giornata si procederà con l'attribuire allo stesso il voto 0, senza quindi possibilità di sostituire il giocatore in errore.
                                </span>
                            </p>
                        </span>
                    </div>
                </DisclosurePanel>
                </>
            )}
        </Disclosure>

        {/* CRITERIO DI ATTRIBUZIONE DEI GOL NEGLI SCONTRI DIRETTI */}
        <Disclosure>
            {({ open }) => (
                <>
                <DisclosureButton className="flex w-full justify-between items-center bg-blue-50 my-1.5 p-4 rounded-lg shadow-md hover:bg-sky-100 transition">
                <h2 className='text-gray-700 font-bold text-2xl mb-0 pb-2'>Gol negli scontri diretti</h2>
                <ChevronUpIcon
                className={`w-5 h-5 text-lega-600 transition ${open ? 'transform rotate-180' : ''}`}
                />
                </DisclosureButton>
                <DisclosurePanel className="bg-amber-50 p-2 rounded-2xl shadow shadow-gray-300 text-gray-700">
                    <div className="m-0">
                        <p className="text-xl mb-0 pb-2">
                            <span>
                                Criterio di attribuzione dei gol negli scontri diretti:
                            </span>
                            <span className='grid gap-1.5 pt-3'>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-300 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Fino a 65.5 punti: 
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        0 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-400 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 66 punti fino a 71.5 punti: 
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        1 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 72 punti fino a 77.5 punti:  
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        2 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-600 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 78 punti fino a 83.5 punti: 
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        3 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 84 punti fino a 89.5 punti: 
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        4 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-800 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 90 punti fino a 95.5 punti:  
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        5 gol
                                    </p>
                                </span>
                                <span className='flex flex-row justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                    <p className=' flex-2'>
                                        Da 96 punti fino a 101.5 punti:    
                                    </p>
                                    <p className=' flex-1 text-center'>
                                        6 gol
                                    </p>
                                </span>
                            </span>
                        </p>
                    </div>
                </DisclosurePanel>
                </>
            )}
        </Disclosure>

        {/* PREMI */}
        <Disclosure>
            {({ open }) => (
                <>
                <DisclosureButton className="flex w-full justify-between items-center bg-blue-50 my-1.5 p-4 rounded-lg shadow-md hover:bg-sky-100 transition">
                <h2 className='text-gray-700 font-bold text-2xl mb-0 pb-2'>Premi</h2>
                <ChevronUpIcon
                className={`w-5 h-5 text-lega-600 transition ${open ? 'transform rotate-180' : ''}`}
                />
                </DisclosureButton>
                <DisclosurePanel className="bg-amber-50 p-2 rounded-2xl shadow shadow-gray-300 text-gray-700">
                <div className="m-0">
                    <p className="text-xl mb-0 pb-2">
                        <span>
                            La competizione avrà in totale 23 premi garantiti di seguito elencati nel dettaglio:
                        </span>
                        <span className='grid gap-1.5 pt-3'>
                            {/* CAMPIONATO */}
                            <span className='flex flex-row justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    1° Classificato Campionato: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 300.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-800 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    2° Classificato Campionato: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 200.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    3° Classificato Campionato:  
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 150.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-600 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    4° Classificato Campionato: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 125.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    5° Classificato Campionato: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00
                                </p>
                            </span>

                            {/* COPPA ITALIA */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Coppa Italia:  
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00
                                </p>
                            </span>

                            {/* COPPE EUROPEE */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Champions League: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Europa League: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00 
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Conference League:  
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 70.00
                                </p>
                            </span>
                            
                            {/* SERIE A/B/C */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Serie A: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    2° Classificato Serie A: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 60.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    3° Classificato Serie A:  
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 30.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-800 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Serie B: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 80.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-600 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    2° Classificato Serie B: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 40.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-400 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    3° Classificato Serie B: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 20.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-700 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Serie C: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 60.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-500 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    2° Classificato Serie C: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 30.00
                                </p>
                            </span>
                            <span className='flex flex-row justify-center items-center border-2 border-amber-300 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    3° Classificato Serie C: 
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 10.00
                                </p>
                            </span>

                            {/* SURVICOR CUP */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Survivor Cup:    
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 100.00
                                </p>
                            </span>
                            
                            {/* SQUID GAME CUP */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Squid Game Cup:    
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 50.00
                                </p>
                            </span>
                            
                            {/* SUPERCOPPA EUROPEA */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Supercoppa Europea:    
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 10.00
                                </p>
                            </span>
                            
                            {/* SUPERCOPPA ITALIANA */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Vincitore Supercoppa Italiana:    
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 10.00
                                </p>
                            </span>
                            
                            {/* PUNTEGGIO PIù ALTO GIORNATA */}
                            <span className='flex flex-row mt-4 justify-center items-center border-2 border-amber-900 rounded-2xl px-5 py-1 min-h-16'>
                                <p className=' flex-2'>
                                    Punteggio più alto di giornata:    
                                </p>
                                <p className=' flex-1 text-center'>
                                    € 10.00
                                </p>
                            </span>
                        </span>
                    </p>
                </div>
                </DisclosurePanel>
                </>
            )}
        </Disclosure>

        {/* TABS COMPETIZIONI */}
        <TabsCompetizioni />

        {/* INFO GENERALI */}
        <div className="bg-yellow-50 border-t-4 border-yellow-600 p-4 rounded-xl mt-4">
            <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                    <path fill="rgb(138, 77, 2)" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 384C302.3 384 288 398.3 288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416C352 398.3 337.7 384 320 384zM320 192C301.8 192 287.3 207.5 288.6 225.7L296 329.7C296.9 342.3 307.4 352 319.9 352C332.5 352 342.9 342.3 343.8 329.7L351.2 225.7C352.5 207.5 338.1 192 319.8 192z"/>
                </svg>  
            </div>

            <p className="text-yellow-800 font-bold text-xl underline">
            N.B.: Al termine degli scontri diretti, in caso di parità, i criteri dell'applicazione potrebbero essere modificati manualmente in base a quelli scritti nel presente regolamento, nel caso in cui l'applicazione non dovesse permettere di rispettare i suddetti criteri.
            </p>
        </div>

        <div className="bg-yellow-50 border-t-4 border-yellow-600 p-4 rounded-xl mt-4">
            <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height='40' width='40'>
                    <path fill="rgb(138, 77, 2)" d="M160 96C160 78.3 174.3 64 192 64L448 64C465.7 64 480 78.3 480 96C480 113.7 465.7 128 448 128L418.5 128L428.8 262.1C465.9 283.3 494.6 318.5 507 361.8L510.8 375.2C513.6 384.9 511.6 395.2 505.6 403.3C499.6 411.4 490 416 480 416L160 416C150 416 140.5 411.3 134.5 403.3C128.5 395.3 126.5 384.9 129.3 375.2L133 361.8C145.4 318.5 174 283.3 211.2 262.1L221.5 128L192 128C174.3 128 160 113.7 160 96zM288 464L352 464L352 576C352 593.7 337.7 608 320 608C302.3 608 288 593.7 288 576L288 464z"/>
                </svg>
            </div>

            <p className="text-yellow-800 font-bold text-xl underline">
                Si fa fede, infine, al buon senso e allo spirito di correttezza di ciascun partecipante, che impone agli stessi di giocare sempre nel massimo rispetto di tutti e quindi di schierare la formazione tutte le giornate e in ogni competizione sempre per vincere e mai per favorire altre squadre in caso di propria matematica eliminazione. Il fantallenatore che dovesse venir meno, A GIUDIZIO INSINDACABILE DELL'ORGANIZZAZIONE, a questo principio tanto basilare quanto fondamentale per la correttezza del nostro gioco, sarà automaticamente escluso dalla prossima edizione della Borgo Cup, che rimane da anni una competizione unicamente volta al divertimento e alla inevitabile condivisione di regole per la disputa del gioco più bello di tutti.
            </p>
        </div>
        

        </div>
    )
}