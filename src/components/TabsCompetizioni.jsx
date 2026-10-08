import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react'
import { Testo, Ev, Fasce, Titolo,  Blocco } from './RegolamentoUI'

/* ---------- DATI ---------- */

const g = (n) => `${n}ª giornata di Serie A`

const SERIE = [
    { nome: 'Serie A', squadre: ['Spera Ebbasta', 'A.S. Marchigiana', 'SenzaNome', 'sam PDOR', 'Squarta Praga', "Sgherza's FC", 'Zanzibar', 'TenenteRagno'] },
    { nome: 'Serie B', squadre: ['FC Carmine', 'FC TORETTO', 'all in - quae intus', 'Herta Vernello VII', 'VeroMat29', 'HAPPY MILF FC', 'AG13 FC', 'Banana83'] },
    { nome: 'Serie C', squadre: ['DG Team', 'FC Santo Stefano', 'REVOLUTION', 'G.s.11', 'San Marino', 'Longobarda united', 'Amala fc', 'MESSI MALE FC'] },
]

// Girone A: 1,5,9...; B: 2,6,10...; C: 3,7,11...; D: 4,8,12...
const GIRONI = ['A', 'B', 'C', 'D']
const posizioniGirone = (n) => Array.from({ length: 6 }, (_, i) => i * 4 + n)

const CAL_PRELIMINARI = [
    {
        righe: [1, 2, 3, 4, 5].map((i) => ({ label: `${i}ª giornata`, valore: g(i + 2) })),
        spareggio: g(8),
    },
]

const CAL_GIRONI = [
    {
        titolo: 'Andata',
        righe: [
            { label: '1ª giornata', valore: g(8) },
            { label: '2ª giornata', valore: g(12) },
            { label: '3ª giornata', valore: g(15) },
        ],
    },
    {
        titolo: 'Ritorno',
        righe: [
            { label: '1ª giornata', valore: g(18) },
            { label: '2ª giornata', valore: g(21) },
            { label: '3ª giornata', valore: g(24) },
        ],
        spareggio: g(25),
    },
]

const CAL_FINALI_CL_CONF = [
    {
        titolo: 'Semifinale',
        righe: [
            { label: 'Andata', valore: g(27) },
            { label: 'Ritorno', valore: g(30) },
        ],
        spareggio: g(31),
    },
    { titolo: 'Finale', righe: [{ label: 'Finale', valore: g(33) }], spareggio: g(34) },
]

const CAL_FINALI_EL = [
    {
        titolo: 'Quarti di finale',
        righe: [
            { label: 'Andata', valore: g(27) },
            { label: 'Ritorno', valore: g(28) },
        ],
        spareggio: g(29),
    },
    {
        titolo: 'Semifinale',
        righe: [
            { label: 'Andata', valore: g(30) },
            { label: 'Ritorno', valore: g(31) },
        ],
        spareggio: g(32),
    },
    { titolo: 'Finale', righe: [{ label: 'Finale', valore: g(33) }], spareggio: g(34) },
]

const CAL_COPPA_ITALIA = [
    { titolo: 'Preliminari', righe: [{ label: 'Andata', valore: g(8) }, { label: 'Ritorno', valore: g(11) }], spareggio: g(12) },
    { titolo: 'Ottavi', righe: [{ label: 'Andata', valore: g(14) }, { label: 'Ritorno', valore: g(17) }], spareggio: g(18) },
    { titolo: 'Quarti', righe: [{ label: 'Andata', valore: g(20) }, { label: 'Ritorno', valore: g(23) }], spareggio: g(24) },
    { titolo: 'Semifinali', righe: [{ label: 'Andata', valore: g(26) }, { label: 'Ritorno', valore: g(29) }], spareggio: g(30) },
    { titolo: 'Finale', righe: [{ label: 'Finale', valore: g(33) }], spareggio: g(34) },
]

// Tabellone Coppa Italia (posizioni in campionato dopo la 7ª giornata)
// Ogni gruppo: la testa di serie affronta la vincente del turno preliminare (numeri = posizione in campionato)
const BRACKET = {
    sinistra: [
        { seed: 1, prelim: [16, 17] },
        { seed: 8, prelim: [9, 24] },
        { seed: 4, prelim: [13, 20] },
        { seed: 5, prelim: [12, 21] },
    ],
    destra: [
        { seed: 6, prelim: [11, 22] },
        { seed: 3, prelim: [14, 19] },
        { seed: 7, prelim: [10, 23] },
        { seed: 2, prelim: [15, 18] },
    ],
}

// Geometria del tabellone (unità del viewBox)
const W = 360
const PW = 44 // larghezza pillola
const PH = 24 // altezza pillola
const Y0 = 79
const PITCH = 70
const yc = (i) => Y0 + i * PITCH // centro del gruppo i
const ym = (k) => (yc(2 * k) + yc(2 * k + 1)) / 2 // centro della coppia k (quarti)
const yM = (ym(0) + ym(1)) / 2 // centro del tabellone (finale)

const LINEA = 'fill-none stroke-sky-400'

function Pill({ cx, cy, testo, seed = false }) {
    return (
        <g transform={`translate(${cx - PW / 2} ${cy - PH / 2})`}>
            <rect
                width={PW}
                height={PH}
                rx={12}
                strokeWidth="1.5"
                className={seed ? 'fill-amber-100 stroke-amber-400' : 'fill-sky-100 stroke-sky-300'}
            />
            <text
                x={PW / 2}
                y={PH / 2}
                dy=".35em"
                textAnchor="middle"
                className={`text-[11px] font-bold ${seed ? 'fill-amber-900' : 'fill-sky-900'}`}
            >
                {testo}°
            </text>
        </g>
    )
}

function Lato({ gruppi, specchia = false }) {
    const X = (x) => (specchia ? W - x : x)

    return (
        <g>
            <text x={X(30)} y="24" textAnchor="middle" className="fill-sky-700 text-[8px] font-bold tracking-wider">
                PRELIM.
            </text>
            <text x={X(96)} y="24" textAnchor="middle" className="fill-amber-700 text-[8px] font-bold tracking-wider">
                OTTAVI
            </text>

            {gruppi.map(({ seed, prelim }, i) => {
                const cy = yc(i)
                return (
                    <g key={seed}>
                        {/* preliminare → ottavo */}
                        <path
                            className={LINEA}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={`M${X(52)} ${cy - 16}H${X(62)}V${cy + 16}H${X(52)}M${X(62)} ${cy}H${X(74)}`}
                        />
                        <Pill cx={X(30)} cy={cy - 16} testo={prelim[0]} />
                        <Pill cx={X(30)} cy={cy + 16} testo={prelim[1]} />
                        <Pill cx={X(96)} cy={cy} testo={seed} seed />
                    </g>
                )
            })}

            {/* ottavi → quarti */}
            {[0, 1].map((k) => (
                <path
                    key={k}
                    className={LINEA}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={`M${X(118)} ${yc(2 * k)}H${X(126)}V${yc(2 * k + 1)}H${X(118)}M${X(126)} ${ym(k)}H${X(138)}`}
                />
            ))}

            {/* quarti → semifinale → finale */}
            <path
                className={LINEA}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={`M${X(138)} ${ym(0)}V${ym(1)}M${X(138)} ${yM}H${X(148)}`}
            />
        </g>
    )
}

function Tabellone() {
    return (
        <div className="rounded-2xl border border-sky-100 bg-white p-2">
            <svg
                viewBox="0 0 360 330"
                role="img"
                aria-label="Tabellone della Coppa Italia: turno preliminare, ottavi, quarti, semifinali e finale"
                className="w-full max-w-md mx-auto"
            >
                <Lato gruppi={BRACKET.sinistra} />
                <Lato gruppi={BRACKET.destra} specchia />

                {/* Finale */}
                <text x={W / 2} y={yM - 26} textAnchor="middle" className="text-[22px]">
                    🏆
                </text>
                <g transform={`translate(${W / 2 - 32} ${yM - 18})`}>
                    <rect width="64" height="36" rx="18" strokeWidth="1.5" className="fill-amber-400 stroke-amber-600" />
                    <text x="32" y="18" dy=".35em" textAnchor="middle" className="fill-amber-950 text-[11px] font-black">
                        FINALE
                    </text>
                </g>
            </svg>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pb-1 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-200 border border-sky-400" />
                    Turno preliminare (9°–24°)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400" />
                    Teste di serie (1°–8°)
                </span>
            </div>
        </div>
    )
}

const SQUID_PARTI = [[1, 5], [11, 15], [21, 25], [31, 35]]
const SQUID_STEP = [
    { label: '1º step superato con almeno', valore: '70 fantapunti' },
    { label: '2º step superato con almeno', valore: '73 fantapunti' },
    { label: '3º step superato con almeno', valore: '75 fantapunti' },
    { label: '4º step superato con almeno', valore: '78 fantapunti' },
    { label: 'Vince chi totalizza almeno', valore: '80 fantapunti' },
]

/* ---------- COMPONENTI DI SUPPORTO ---------- */

function Calendario({ intro, blocchi }) {
    return (
        <div className="space-y-4">
            {intro && (
                <p className="font-semibold text-sky-900 underline decoration-sky-300">{intro}</p>
            )}
            {blocchi.map((b, i) => (
                <div key={b.titolo ?? i} className="space-y-2">
                    {b.titolo && (
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-700">{b.titolo}</h4>
                    )}
                    <Fasce neutra righe={b.righe} />
                    {b.spareggio && (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-sky-400 px-4 py-2 text-[0.8rem] text-sky-900">
                            <span>Eventuale spareggio</span>
                            <span className="font-bold">{b.spareggio}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function SquadreSerie({ nome, squadre }) {
    return (
        <section className="space-y-3">
            <Titolo icona="⚽">{nome}</Titolo>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {squadre.map((s) => (
                    <p key={s} className="border border-sky-300 bg-white rounded-xl px-3 py-2 text-center font-semibold text-gray-800">
                        {s}
                    </p>
                ))}
            </div>
        </section>
    )
}

/* ---------- PANNELLI ---------- */

function Campionato() {
    return (
        <Blocco titolo="Campionato" id={1} >
            <Testo>
                <Ev>La competizione avrà inizio a partire dalla 1ª giornata di Serie A</Ev> e terminerà all'ultima
                giornata di Serie A. Sarà strutturata a <Ev>somma punti totale</Ev> e senza scontri diretti.
            </Testo>
            <Testo>
                <Ev>Premi garantiti per i primi 5 classificati.</Ev>
            </Testo>
        </Blocco>
    )
}

function SerieABC() {
    return (
        <>
            {SERIE.map((s) => (
                <SquadreSerie key={s.nome} {...s} />
            ))}
            <Blocco titolo="Regolamento Serie A, B e C" icona="📋">
                <Testo>
                    <Ev>Le competizioni</Ev> si disputeranno ogni giornata e{' '}
                    <Ev>saranno strutturate a campionato, con scontri diretti di andata e ritorno.</Ev> Esse{' '}
                    <Ev>avranno inizio a partire dalla 1ª giornata di Serie A,</Ev> e termineranno in concomitanza con la
                    35ª giornata di Serie A (weekend del 09.05.2027).
                </Testo>
                <Testo>
                    Al termine delle competizioni, le ultime 3 classificate di Serie A e Serie B retrocederanno nella
                    serie inferiore, mentre le prime 3 classificate di Serie B e Serie C saranno promosse nella serie
                    superiore. Al termine delle competizioni, in caso di piazzamento a pari punti di una o più squadre
                    varranno, nell'ordine, i seguenti criteri: scontri diretti, differenza reti negli scontri diretti,
                    somma gol fatti negli scontri diretti, somma punti negli scontri diretti, differenza reti totale,
                    somma gol fatti in totale, somma punti nel girone, spareggio (da ripetersi, eventualmente più volte
                    fino massimo alla 37ª giornata).
                </Testo>
                <Testo>
                    <Ev>Premi garantiti alle prime tre squadre classificate di ciascuna serie.</Ev>
                </Testo>
            </Blocco>
        </>
    )
}

function CoppeEuropee() {
    return (
        <>
            <Blocco titolo="Preliminari Coppe Europee" icona="🌍">
                <Testo>
                    <Ev>La competizione avrà inizio a partire dalla 3ª giornata di Serie A</Ev> (weekend del 06.09.2026)
                    e sarà strutturata in{' '}
                    <Ev>4 gironi da 6 squadre ciascuno, con scontri diretti di sola andata;</Ev> le posizioni di ciascuna
                    squadra in campionato fino a quel momento (cioè fino alla 2ª giornata) determineranno la
                    composizione dei gironi secondo il seguente ordine:
                </Testo>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GIRONI.map((nome, i) => (
                        <div key={nome} className="rounded-2xl border border-sky-200 bg-white p-3">
                            <p className="text-center font-extrabold text-sky-800 mb-2">Girone {nome}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {posizioniGirone(i + 1).map((p) => (
                                    <span
                                        key={p}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-100 text-sky-900 font-bold"
                                    >
                                        {p}°
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Testo>
                    Nel caso in cui, prima della composizione dei suddetti gironi, una o più squadre dovessero trovarsi a
                    pari punti, l'ordine per l'assegnazione dei posti nei gironi sarà quello stabilito, al termine della
                    2ª giornata, dalla classifica del Campionato visibile sulla app.
                </Testo>
                <Testo>
                    <Ev>
                        Al termine della fase a gironi, le prime due classificate si qualificheranno alla fase a gironi
                        di Champions League, terze e quarte classificate si qualificheranno alla fase a gironi di Europa
                        League, quinte e seste classificate si qualificheranno alla fase a gironi di Conference League.
                    </Ev>
                </Testo>
            </Blocco>

            <Blocco titolo="Champions League" id={11}>
                <Testo>
                    <Ev>La competizione avrà inizio a partire dalla 9ª giornata di Serie A</Ev> (weekend del 28.10.2026);
                    alla stessa parteciperanno le prime 2 squadre classificate dei 4 gironi della fase preliminare delle
                    Coppe Europee. La competizione sarà strutturata in{' '}
                    <Ev>due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.</Ev>
                </Testo>
                <Testo>
                    Le prime due squadre classificate dei gironi preliminari A e D comporranno il girone A, le prime due
                    squadre classificate dei gironi preliminari B e C comporranno il girone B.{' '}
                    <Ev>
                        Al termine della fase a gironi, la terza classificata passerà a disputare le fasi finali di Europa
                        League, mentre le prime due classificate di ciascun girone si affronteranno in semifinale in
                        scontri diretti di andata e ritorno
                    </Ev>{' '}
                    secondo il classico accoppiamento 1A - 2B e 1B - 2A. Le vincenti si affronteranno in finale in gara
                    unica.
                </Testo>
                <Testo>
                    <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev>
                </Testo>
            </Blocco>

            <Blocco titolo="Europa League" id={12}>
                <Testo>
                    <Ev>La competizione avrà inizio a partire dalla 9ª giornata di Serie A</Ev> (weekend del 28.10.2026);
                    alla stessa parteciperanno le terze e quarte squadre classificate dei 4 gironi della fase
                    preliminare delle Coppe Europee. La competizione sarà strutturata in{' '}
                    <Ev>due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.</Ev> Le terze e quarte
                    squadre classificate dei gironi preliminari A e D comporranno il girone A, le terze e quarte squadre
                    classificate dei gironi preliminari B e C comporranno il girone B.
                </Testo>
                <Testo>
                    <Ev>
                        Al termine della fase a gironi, si qualificheranno alla fase finale le prime tre classificate di
                        ciascun girone che, insieme alle due “retrocesse” dalla Champions League, si affronteranno nei
                        quarti di finale in scontri diretti di andata e ritorno
                    </Ev>{' '}
                    secondo l'accoppiamento 1A - 3B , 3CHA - 2B , 1B - 3A , 3CHB - 2A. Successivamente anche le
                    semifinali verranno disputate in scontri diretti di andata e ritorno con accoppiamenti stabiliti
                    dall'ordine scritto in precedenza, quindi (1A - 3B) Vs (3CHA - 2B) , (1B - 3A) Vs (3CHB - 2A). Le
                    vincenti si affronteranno in finale in gara unica.
                </Testo>
                <Testo>
                    <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev>
                </Testo>
            </Blocco>

            <Blocco titolo="Conference League" id={13}>
                <Testo>
                    <Ev>La competizione avrà inizio a partire dalla 9ª giornata di Serie A</Ev> (weekend del 28.10.2026);
                    alla stessa parteciperanno le quinte e seste squadre classificate dei 4 gironi della fase
                    preliminare delle Coppe Europee. La competizione sarà strutturata in{' '}
                    <Ev>due gironi da 4 squadre ciascuno, con scontri diretti di andata e ritorno.</Ev> Le quinte e seste
                    squadre classificate dei gironi preliminari A e D comporranno il girone A, le quinte e seste squadre
                    classificate dei gironi preliminari B e C comporranno il girone B.
                </Testo>
                <Testo>
                    <Ev>
                        Al termine della fase a gironi, le prime due classificate di ciascun girone si affronteranno in
                        semifinale in scontri diretti di andata e ritorno
                    </Ev>{' '}
                    secondo il classico accoppiamento 1A - 2B e 1B - 2A. Le vincenti si affronteranno in finale in gara
                    unica.
                </Testo>
                <Testo>
                    <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev>
                </Testo>
            </Blocco>

            <Blocco titolo="Info" icona="ℹ️">
                <Testo>
                    Per tutte le competizioni “europee”, preliminari compresi, al termine dei gironi, in caso di
                    piazzamento a pari punti di una o più squadre varranno, nell'ordine, i seguenti criteri: scontri
                    diretti, differenza reti negli scontri diretti, somma gol fatti negli scontri diretti, somma punti
                    negli scontri diretti, differenza reti totale, somma gol fatti in totale, somma punti nel girone, 1
                    spareggio, somma punti in Campionato (fino a quel momento).
                </Testo>
                <Testo>
                    Al termine dei quarti di finale e delle semifinali, in caso di parità negli scontri diretti varranno,
                    nell'ordine, i seguenti criteri: differenza reti, somma gol fatti nel doppio confronto, somma punti
                    fatti nel doppio confronto, 1 spareggio, somma punti in Campionato (fino a quel momento). Al termine
                    della finale, in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti
                    fatti, spareggio (da ripetersi, eventualmente più volte fino massimo alla 37ª giornata).
                </Testo>
            </Blocco>

            <Blocco titolo="Calendario fase preliminare" icona="📅">
                <Calendario
                    intro="Il calendario della fase preliminare delle Coppe Europee sarà il seguente:"
                    blocchi={CAL_PRELIMINARI}
                />
            </Blocco>

            <Blocco titolo="Calendario fase a gironi" icona="📅">
                <Calendario
                    intro="Il calendario dei gironi delle Coppe Europee sarà il seguente:"
                    blocchi={CAL_GIRONI}
                />
            </Blocco>

            <Blocco titolo="Calendario fasi finali" icona="📅">
                <Calendario
                    intro="Il calendario delle fasi finali di Champions League e Conference League sarà il seguente:"
                    blocchi={CAL_FINALI_CL_CONF}
                />
                <Calendario
                    intro="Il calendario delle fasi finali di Europa League sarà il seguente:"
                    blocchi={CAL_FINALI_EL}
                />
            </Blocco>
        </>
    )
}

function SupercoppaEuropea() {
    return (
        <Blocco titolo="Supercoppa Europea" id={4}>
            <Testo>
                La competizione sarà disputata tra{' '}
                <Ev>le due squadre vincitrici di Champions League e Europa League, in gara secca di sola andata</Ev> nel
                weekend del <Ev>09.05.2027</Ev> in concomitanza con la <Ev>35ª giornata di Serie A.</Ev>
            </Testo>
            <Testo>
                In caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da
                disputarsi, eventualmente, nel weekend successivo, laddove possibile).
            </Testo>
        </Blocco>
    )
}

function CoppaItalia() {
    return (
        <>
            <Blocco titolo="Coppa Italia" id={5}>
                <Testo>
                    <Ev>La competizione avrà inizio a partire dalla 8ª giornata di Serie A</Ev> (weekend del 25.10.2026).
                    La competizione sarà strutturata con{' '}
                    <Ev>tabellone di scontri diretti di andata e ritorno, ad eliminazione diretta,</Ev> tra tutte le
                    squadre partecipanti, a partire dagli ottavi di finale, dopo un primo turno preliminare ad
                    eliminazione diretta, come di seguito riportato (numeri = posizioni in campionato):
                </Testo>

                <Tabellone />

                <Testo>
                    Per completare il tabellone saranno considerate le posizioni di ciascuna squadra in campionato fino a
                    quel momento (cioè fino alla 7ª giornata). Nel caso in cui, prima della composizione del presente
                    tabellone, una o più squadre dovessero trovarsi a pari punti, l'ordine per l'assegnazione dei posti
                    sarà quello stabilito, al termine della 7ª giornata, dalla classifica del Campionato visibile sulla
                    app. Al termine del doppio confronto, in caso di parità negli scontri diretti varranno, nell'ordine,
                    i seguenti criteri: differenza reti, somma gol fatti nel doppio confronto, somma punti fatti nel
                    doppio confronto, 1 spareggio, somma punti in Campionato (fino a quel momento). Al termine della
                    finale, in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti fatti,
                    spareggio (da ripetersi più volte fino massimo alla 37ª giornata).
                </Testo>
                <Testo>
                    <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev>
                </Testo>
            </Blocco>

            <Blocco titolo="Calendario Coppa Italia" icona="📅">
                <Calendario intro="Il calendario della Coppa Italia sarà il seguente:" blocchi={CAL_COPPA_ITALIA} />
            </Blocco>
        </>
    )
}

function SupercoppaItaliana() {
    return (
        <Blocco titolo="Supercoppa Italiana" id={6}>
            <Testo>
                La competizione sarà disputata tra <Ev>le due squadre vincitrici di Serie A e Coppa Italia,</Ev> in{' '}
                <Ev>gara secca di sola andata</Ev> nel weekend del <Ev>23.05.2026,</Ev> in concomitanza con la{' '}
                <Ev>37ª giornata di Serie A.</Ev>
            </Testo>
            <Testo>
                Nel caso in cui vincitrice di Serie A e di Coppa Italia dovessero coincidere, accederà alla competizione
                la finalista perdente di Coppa Italia.
            </Testo>
            <Testo>
                In caso di parità varranno, nell’ordine, i seguenti criteri: maggior numero di punti fatti, spareggio (da
                disputarsi, eventualmente, nel weekend successivo, laddove possibile).
            </Testo>
        </Blocco>
    )
}

function SurvivorCup() {
    return (
        <Blocco titolo="Survivor Cup" id={7}>
            <Testo>
                <Ev>La competizione avrà inizio a partire dalla 3ª giornata di Serie A</Ev> (weekend del 06.09.2026) e
                si disputerà a weekend alterni; <Ev>alla stessa parteciperanno tutte le 24 squadre</Ev> iscritte alla
                Borgo Cup. Essa <Ev>sarà strutturata a somma punti totali</Ev> e sarà composta da un numero massimo di 14
                giornate alle quali si accederà per step.{' '}
                <Ev>
                    A ciascuno step successivo accederanno tutte le squadre, a prescindere dal punteggio di giornata
                    totalizzato, eccezion fatta per la/e squadra/e che, tra i “sopravvissuti”, avrà/avranno totalizzato
                    il punteggio peggiore di giornata e che quindi sarà/saranno automaticamente eliminata/e. Per i primi
                    9 step,
                </Ev>{' '}
                quindi fino al termine della 19ª giornata di Serie A (weekend del 10.01.2027){' '}
                <Ev>saranno eliminati di volta in volta 2 squadre, mentre dallo step 10 in poi sarà eliminata</Ev> di
                volta in volta <Ev>una sola squadra.</Ev>
            </Testo>
            <Testo>
                Fino al penultimo step per il punteggio peggiore di giornata (tra i partecipanti “sopravvissuti”), in
                caso di parità varranno, nell'ordine, i seguenti criteri: spareggio (da disputarsi, eventualmente, nel
                weekend successivo), somma punti in Campionato (fino a quel momento).
            </Testo>
            <Testo>
                Nello step finale in caso di parità varranno, nell'ordine, i seguenti criteri: maggior numero di punti
                fatti, spareggio (da ripetersi più volte fino massimo alla 37ª giornata).
            </Testo>
            <Testo>
                <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev>
            </Testo>
        </Blocco>
    )
}

function SquidGameCup() {
    return (
        <Blocco titolo="Squid Game Cup" id={14}>
            <Testo>La competizione sarà suddivisa in 4 parti:</Testo>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SQUID_PARTI.map(([da, a], i) => (
                    <div key={da} className="rounded-2xl border border-sky-200 bg-white p-3 text-center">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                            {i + 1}ª Squid Game Cup
                        </p>
                        <p className="font-bold text-gray-800 mt-1">
                            dalla {da}ª alla {a}ª giornata di Serie A
                        </p>
                    </div>
                ))}
            </div>

            <Testo>
                A ciascuna di esse parteciperanno, in fase iniziale, tutte le 24 squadre iscritte alla Borgo Cup.{' '}
                <Ev>Ciascuna Squid Game Cup sarà strutturata a somma punti totali</Ev> e sarà composta da un numero
                massimo di 5 giornate alle quali si accederà per step secondo lo schema di seguito indicato:
            </Testo>

            <Fasce righe={SQUID_STEP} />

            <Testo>
                Nel caso in cui nessuna squadra dovesse accedere allo step successivo, la competizione si riterrà
                terminata e il premio sarà assegnato alla squadra che nell'ultimo step disputato avrà totalizzato il
                punteggio migliore.
            </Testo>
            <Testo>
                Se questa ipotesi dovesse capitare già al primo step, e solo in questo caso specifico, la competizione
                sarà annullata e partirà nuovamente dalla giornata successiva.
            </Testo>
            <Testo>
                <Ev>Premio garantito unicamente alla squadra vincitrice della competizione.</Ev> (nel caso in cui due o
                più squadre dovessero totalizzare il medesimo punteggio nello step finale, il premio sarà suddiviso in
                parti uguali).
            </Testo>
        </Blocco>
    )
}

function PunteggioPiuAlto() {
    return (
        <Blocco titolo="Punteggio Più Alto di Giornata" icona="🔝">
            <Testo>
                La competizione sarà disputata da ciascuna delle 24 squadre partecipanti alla lega. Si aggiudicherà il
                premio{' '}
                <Ev>la squadra che avrà totalizzato il maggior numero di punti nell’arco di ogni singola giornata.</Ev> In
                caso di parità tra una o più squadre, la quota premio sarà suddivisa in parti uguali tra le squadre prime
                classificate nella giornata.
            </Testo>
        </Blocco>
    )
}

/* ---------- TAB ---------- */

const TABS = [
    { id: 'campionato', titolo: 'Campionato', Pannello: Campionato },
    { id: 'serie', titolo: 'Serie A - B - C', Pannello: SerieABC },
    { id: 'europee', titolo: 'Coppe Europee', Pannello: CoppeEuropee },
    { id: 'supercoppa-europea', titolo: 'Supercoppa Europea', Pannello: SupercoppaEuropea },
    { id: 'coppa-italia', titolo: 'Coppa Italia', Pannello: CoppaItalia },
    { id: 'supercoppa-italiana', titolo: 'Supercoppa Italiana', Pannello: SupercoppaItaliana },
    { id: 'survivor', titolo: 'Survivor Cup', Pannello: SurvivorCup },
    { id: 'squid', titolo: 'Squid Game Cup', Pannello: SquidGameCup },
    { id: 'punteggio', titolo: 'Punteggio più alto', Pannello: PunteggioPiuAlto },
]

export default function TabsCompetizioni() {
    return (
        <section className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-sky-950">Regolamenti competizioni</h2>
                <p className="text-gray-600">
                    Di seguito sono riportati i regolamenti di ciascuna delle competizioni sopra elencate.
                </p>
            </div>

            <TabGroup>
                <TabList className="flex gap-2 flex-wrap justify-center items-center snap-x p-2 bg-sky-100 rounded-2xl shadow-inner">
                    {TABS.map((t) => (
                        <Tab
                            key={t.id}
                            className={({ selected }) =>
                                `snap-start shrink-0 px-4 py-2 rounded-xl text-sm w-50 sm:text-base font-semibold whitespace-nowrap transition cursor-pointer focus:outline-none ${
                                    selected
                                        ? 'bg-sky-700 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-sky-200'
                                }`
                            }
                        >
                            {t.titolo}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels className="mt-5">
                    {TABS.map(({ id, Pannello }) => (
                        <TabPanel key={id} className="space-y-5 focus:outline-none">
                            <Pannello />
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </section>
    )
}