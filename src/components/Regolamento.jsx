import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon, InformationCircleIcon, ScaleIcon } from '@heroicons/react/24/solid'
import TabsCompetizioni from './TabsCompetizioni'
import { Testo, Ev, Fasce } from './RegolamentoUI'

/* ---------- DATI ---------- */

const FACTS = [
    { valore: '13', label: 'Competizioni' },
    { valore: '24', label: 'Squadre' },
    { valore: '€100', label: 'Quota' },
    { valore: '25', label: 'Giocatori in rosa' },
    { valore: '300', label: 'Crediti iniziali' },
    { valore: '7', label: 'Cambi a sessione' },
]

const FASCE_DIFESA = [
    { label: 'Media < 6,00', valore: '0 punti' },
    { label: 'Media ≥ 6,00 e < 6,25', valore: '1 punto' },
    { label: 'Media ≥ 6,25 e < 6,50', valore: '2 punti' },
    { label: 'Media ≥ 6,50 e < 6,75', valore: '3 punti' },
    { label: 'Media ≥ 6,75 e < 7,00', valore: '4 punti' },
    { label: 'Media ≥ 7,00 e < 7,50', valore: '5 punti' },
    { label: 'Media ≥ 7,50', valore: '6 punti' },
]

const FASCE_GOL = [
    { label: 'Fino a 65.5 punti', valore: '0 gol' },
    { label: 'Da 66 a 71.5 punti', valore: '1 gol' },
    { label: 'Da 72 a 77.5 punti', valore: '2 gol' },
    { label: 'Da 78 a 83.5 punti', valore: '3 gol' },
    { label: 'Da 84 a 89.5 punti', valore: '4 gol' },
    { label: 'Da 90 a 95.5 punti', valore: '5 gol' },
    { label: 'Da 96 a 101.5 punti', valore: '6 gol' },
]

const SESSIONI = [
    { nome: 'Prima sessione', inizio: 'martedì 06 ottobre', fine: 'giovedì 08 ottobre' },
    { nome: 'Seconda sessione', inizio: 'martedì 08 dicembre', fine: 'giovedì 10 dicembre' },
    { nome: 'Terza sessione', inizio: 'martedì 09 febbraio', fine: 'giovedì 11 febbraio' },
]

const PREMI = [
    {
        gruppo: 'Campionato',
        voci: [
            { label: '1° classificato', valore: 300 },
            { label: '2° classificato', valore: 200 },
            { label: '3° classificato', valore: 150 },
            { label: '4° classificato', valore: 125 },
            { label: '5° classificato', valore: 100 },
        ],
    },
    { gruppo: 'Coppa Italia', voci: [{ label: 'Vincitore', valore: 100 }] },
    {
        gruppo: 'Coppe europee',
        voci: [
            { label: 'Vincitore Champions League', valore: 100 },
            { label: 'Vincitore Europa League', valore: 100 },
            { label: 'Vincitore Conference League', valore: 70 },
        ],
    },
    {
        gruppo: 'Serie A',
        voci: [
            { label: 'Vincitore', valore: 100 },
            { label: '2° classificato', valore: 60 },
            { label: '3° classificato', valore: 30 },
        ],
    },
    {
        gruppo: 'Serie B',
        voci: [
            { label: 'Vincitore', valore: 80 },
            { label: '2° classificato', valore: 40 },
            { label: '3° classificato', valore: 20 },
        ],
    },
    {
        gruppo: 'Serie C',
        voci: [
            { label: 'Vincitore', valore: 60 },
            { label: '2° classificato', valore: 30 },
            { label: '3° classificato', valore: 10 },
        ],
    },
    {
        gruppo: 'Altre competizioni',
        voci: [
            { label: 'Vincitore Survivor Cup', valore: 100 },
            { label: 'Vincitore Squid Game Cup', valore: 50 },
            { label: 'Vincitore Supercoppa Europea', valore: 10 },
            { label: 'Vincitore Supercoppa Italiana', valore: 10 },
            { label: 'Punteggio più alto di giornata', valore: 10 },
        ],
    },
]

const NUMERO_PREMI = PREMI.reduce((s, g) => s + g.voci.length, 0)

const euro = (n) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

/* ---------- COMPONENTI ---------- */

function Sezione({ titolo, icona, children }) {
    return (
        <Disclosure as="section" className="rounded-2xl bg-white shadow-md border border-sky-100 overflow-hidden">
            <DisclosureButton className="group flex w-full items-center gap-3 p-4 text-left hover:bg-sky-50 transition cursor-pointer">
                <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-sky-100 text-xl">
                    {icona}
                </span>
                <h2 className="flex-1 text-lg sm:text-xl font-extrabold text-sky-950">{titolo}</h2>
                <ChevronDownIcon className="w-5 h-5 text-sky-600 transition-transform duration-200 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel
                transition
                className="origin-top transition duration-200 ease-out data-closed:-translate-y-2 data-closed:opacity-0 px-4 pb-5 space-y-3 text-gray-700"
            >
                {children}
            </DisclosurePanel>
        </Disclosure>
    )
}


function Nota({ icona: Icona, children }) {
    return (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 border-l-8 border-l-amber-500 rounded-2xl p-4">
            <Icona className="w-8 h-8 shrink-0 text-amber-700" />
            <p className="text-amber-950 font-semibold leading-relaxed">{children}</p>
        </div>
    )
}

/* ---------- PAGINA ---------- */

export default function Regolamento() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3 pb-8">
            <header className="text-center space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-sky-900">Regolamento</h1>
                <p className="text-gray-500 font-medium">Borgo Cup · 9ª edizione</p>
            </header>

            {/* In breve */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {FACTS.map((f) => (
                    <div key={f.label} className="bg-sky-50 border border-sky-100 rounded-2xl py-3 text-center shadow-sm">
                        <p className="text-2xl font-black text-sky-800">{f.valore}</p>
                        <p className="text-[11px] uppercase tracking-wide font-semibold text-sky-600">{f.label}</p>
                    </div>
                ))}
            </div>

            <Sezione titolo="Descrizione lega" icona="📖">
                <Testo>
                    La lega è composta da 13 competizioni con 24 squadre partecipanti e diversi premi in palio, di
                    seguito elencati nel dettaglio.{' '}
                    <Ev>
                        La quota di partecipazione è di €100,00. Di questi, €50,00 andranno consegnati, come quota di iscrizione, prima che cominci la stagione e comunque non oltre il 31.08.2025. Le squadre che non dovessero rispettare la data di consegna della quota di iscrizione saranno penalizzate di 15 punti in classifica generale per ciascuna giornata di ritardo
                    </Ev>
                    (partendo già dal calcolo della 3'giornata).
                </Testo>
                <Testo>
                    <Ev>
                        Il saldo di €50,00 dovrà essere corrisposto obbligatoriamente a partire dal 01.04.2027 fino a non oltre il 02.05.2027, pena l'automatica esclusione dalla Borgo Cup 2027-2028,
                    </Ev>
                    ad eccezione delle squadre partecipanti che alla data del 10/05/2026 dovessero aver già vinto un premio superiore a €50,00. Le diverse competizioni verranno gestite tramite l'applicazione “Leghe FC”.
                </Testo>
                <Testo>
                    La rosa di calciatori a disposizione di ogni squadra partecipante dovrà essere composta da 3 portieri, 8 difensori, 8 centrocampisti, 6 attaccanti. Ciascun partecipante avrà a disposizione 300 crediti iniziali. Per la quotazione di ogni singolo calciatore sarà considerata la “quotazione iniziale” di ciascuno di esso.
                    <Ev>La rosa completa dei 25 giocatori,</Ev>
                    per ciascuno dei quali andrà indicata quotazione e squadra di appartenenza,
                    <Ev>dovrà essere consegnata entro e non oltre le ore 23:59 di giovedì 20 Agosto. Le squadre che non dovessero rispettare la data e l'ora di consegna della rosa completa saranno penalizzate di 20 punti in classifica generale ogni 6 ore di ritardo dall'orario massimo prestabilito</Ev>
                    (partendo già dal calcolo della 1'giornata). Nel caso in cui la somma totale delle quotazioni dei 25 giocatori in rosa dovesse superare i 300 crediti a disposizione, si procederà con una modifica d'ufficio alla rosa, escludendo dalla stessa il giocatore acquistato con la quotazione più alta, fino a reintegrare la somma totale delle quotazioni al di sotto del tetto massimo previsto; in tal caso, la rosa in questione rimarrà composta da 24 giocatori fino alla successiva sessione di mercato.
                </Testo>
                <Testo>
                    <Ev>L'inserimento della formazione</Ev>
                    sulla applicazione sarà possibile
                    <Ev>fino a 5 minuti prima</Ev>
                    dall'inizio del primo evento della giornata. Diversamente verrà automaticamente inserita la formazione schierata nella giornata precedente. Alla prima giornata di ciascuna competizione, non essendoci formazione precedente, si attribuirà punteggio 0 a chi non consegnerà la formazione entro il termine previsto. La formazione inserita in ogni giornata può essere schierata secondo i seguenti moduli: 5-4-1, 5-3-2, 4-5-1, 4-4-2, 4-3-3, 3-4-3, 3-5-2; essa è composta oltre che da 11 titolari, anche da 7 panchinari con possibilità di massimo 3 sostituzioni in base al mancato voto di uno o più titolari. La composizione della panchina sarà unicamente possibile secondo il seguente ordine: PDDCCAA.
                </Testo>
                <Testo>
                    Per tutte le partite rinviate, per qualsiasi motivo, si procederà con l'attribuzione di un 6 politico (a prescindere dalla decisione di Fantacalcio) a tutti i calciatori che prenderanno parte alla gara rinviata, inclusi non convocati, infortunati e squalificati. Nel caso in cui la stessa, però, sia giocata entro le 23:59 del giorno precedente alla prima partita della giornata successiva, i voti della gara in questione varranno ai fini del calcolo finale di giornata.
                </Testo>
                <Testo>
                    Nel caso in cui, a partita in corso, la stessa dovesse essere sospesa per un qualsivoglia motivo e dovesse riprendere dopo l'inizio della prima partita della giornata successiva, saranno presi in considerazione i voti attribuiti ai calciatori in campo fino a quel momento; diversamente se la stessa dovesse completarsi entro l'inizio della prima gara della giornata successiva, si attenderà il voto finale di ciascun giocatore prima del calcolo della giornata di riferimento; se invece la partita dovesse essere sospesa dopo pochi minuti, quindi quando a tutti i giocatori sia ancora attribuito il s.v., senza possibilità di ripresa entro la prima gara del turno successivo, sarà attribuito il 6 politico a tutti i calciatori che prenderanno parte alla gara rinviata, inclusi non convocati, infortunati e squalificati.
                </Testo>
                <Testo>
                    Nel dettaglio le 13 competizioni a cui i partecipanti alla lega avranno la possibilità di partecipare sono:
                    <Ev>Campionato, Serie A, Serie B, Serie C, Coppa Italia, Supercoppa Italiana, Champions League, Europa League, Conference League, Supercoppa Europea, Survivor Cup, Squid Game Cup e Punteggio più alto di giornata.</Ev>
                </Testo>
            </Sezione>

            <Sezione titolo="Calcolo punteggio" icona="🧮">
                <Testo>
                    Per il calcolo del punteggio, bonus e malus, quotazioni e definizione dei ruoli dei calciatori saranno considerati unicamente i dati “Fantacalcio”. Al giocatore senza voto e ammonito sarà assegnato d'ufficio il voto 5,5; al giocatore senza voto e espulso sarà assegnato d'ufficio il voto 4.
                </Testo>
                <Testo>
                    <Ev>Al portiere che resterà imbattuto</Ev>
                    fino al termine della gara, o prima di una sua eventuale sostituzione,
                    <Ev>sarà attribuito 1 punto bonus.</Ev>
                </Testo>
                <Testo>
                    Sarà possibile accumulare ulteriori punti bonus grazie al
                    <Ev>“modificatore difesa” nel caso in cui la formazione iniziale sia schierata con un minimo di 4 difensori; in tal caso si procederà con il calcolo della media matematica del singolo voto di giornata (esclusi bonus e/o malus) tra il portiere e i 3 migliori (in merito al voto) difensori schierati,</Ev>
                    e alla squadra di riferimento si attribuiranno ulteriori punti bonus in base alle fasce di seguito riportate:
                </Testo>
                <Fasce righe={FASCE_DIFESA} />
            </Sezione>

            <Sezione titolo="Mercato di riparazione" icona="🔁">
                <Testo>La competizione prevede tre differenti sessioni di mercato, secondo il seguente calendario:</Testo>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SESSIONI.map((s) => (
                        <div key={s.nome} className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-700">{s.nome}</p>
                            <p className="font-bold text-gray-800 mt-1">{s.inizio}</p>
                            <p className="text-xs text-gray-500">ore 00:01</p>
                            <p className="text-sky-400">↓</p>
                            <p className="font-bold text-gray-800">{s.fine}</p>
                            <p className="text-xs text-gray-500">ore 23:59</p>
                        </div>
                    ))}
                </div>
                <Testo>
                    Ciascun partecipante avrà a disposizione un
                    <Ev>numero massimo di 7 cambi per ciascuna sessione di mercato.</Ev>
                    Gli unici crediti a disposizione di ciascun partecipante saranno quelli derivanti dalla cessione dei propri calciatori, che si sommeranno ai crediti residui già in possesso di ciascuna squadra, laddove disponibili. Non sarà possibile, durante la stessa sessione di mercato, vendere un proprio giocatore per poi riacquistarlo. I cambi dovranno essere effettuati tenendo conto delle “quotazioni attuali” valide durante la sessione di mercato di riferimento. Nel caso in cui la somma delle quotazioni dei giocatori acquistati dovesse essere superiore alla somma delle quotazioni dei giocatori ceduti (più eventuali crediti residui a disposizione), si procederà con una modifica d'ufficio alla lista degli scambi, escludendo dalla stessa il giocatore acquistato con la quotazione più alta, fino a reintegrare la somma totale delle quotazioni al di sotto del tetto massimo previsto. Per questo motivo la lista dei cambi, al momento della presentazione e a prescindere dall'ordine indicato da ciascun partecipante, sarà risistemata ordinando dal più costoso sia acquisti che cessioni. Al termine del mercato, nel caso in cui un giocatore non più in rosa dovesse essere schierato nella formazione di giornata si procederà con l'attribuire allo stesso il voto 0, senza quindi possibilità di sostituire il giocatore in errore.
                </Testo>
            </Sezione>

            <Sezione titolo="Gol negli scontri diretti" icona="⚽">
                <Testo>Criterio di attribuzione dei gol negli scontri diretti:</Testo>
                <Fasce righe={FASCE_GOL} />
            </Sezione>

            <Sezione titolo="Premi" icona="💰">
                <Testo>La competizione avrà in totale {NUMERO_PREMI} premi garantiti, di seguito elencati nel dettaglio:</Testo>
                {PREMI.map((g) => (
                    <div key={g.gruppo} className="space-y-2 pt-2">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-sky-800">{g.gruppo}</h3>
                        <Fasce
                            invertita
                            righe={g.voci.map((v) => ({ label: v.label, valore: euro(v.valore) }))}
                        />
                    </div>
                ))}
            </Sezione>

            <TabsCompetizioni />

            <Nota icona={InformationCircleIcon}>
                N.B.: Al termine degli scontri diretti, in caso di parità, i criteri dell'applicazione potrebbero essere
                modificati manualmente in base a quelli scritti nel presente regolamento, nel caso in cui l'applicazione
                non dovesse permettere di rispettare i suddetti criteri.
            </Nota>

            <Nota icona={ScaleIcon}>
                Si fa fede, infine, al buon senso e allo spirito di correttezza di ciascun partecipante, che impone agli stessi di giocare sempre nel massimo rispetto di tutti e quindi di schierare la formazione tutte le giornate e in ogni competizione sempre per vincere e mai per favorire altre squadre in caso di propria matematica eliminazione. Il fantallenatore che dovesse venir meno, A GIUDIZIO INSINDACABILE DELL'ORGANIZZAZIONE, a questo principio tanto basilare quanto fondamentale per la correttezza del nostro gioco, sarà automaticamente escluso dalla prossima edizione della Borgo Cup, che rimane da anni una competizione unicamente volta al divertimento e alla inevitabile condivisione di regole per la disputa del gioco più bello di tutti.
            </Nota>
        </div>
    )
}