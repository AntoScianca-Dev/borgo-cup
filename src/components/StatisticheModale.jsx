import {
    Dialog, DialogPanel, DialogTitle,
    Disclosure, DisclosureButton, DisclosurePanel,
    Tab, TabGroup, TabList, TabPanel, TabPanels,
    Transition, TransitionChild,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useRef } from 'react'

const MEDAGLIE = ['🥇', '🥈', '🥉']
const squadreLabel = (n) => `${n} ${n === 1 ? 'squadra' : 'squadre'}`

function Sezione({ titolo, sottotitolo, children }) {
    return (
        <section className="space-y-2">
            <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-sky-800">{titolo}</h3>
                {sottotitolo && <p className="text-xs text-gray-500">{sottotitolo}</p>}
            </div>
            {children}
        </section>
    )
}

const RUOLI = {
    P: 'bg-amber-200 text-amber-900 border-amber-400',
    D: 'bg-green-200 text-green-900 border-green-400',
    C: 'bg-blue-200 text-blue-900 border-blue-400',
    A: 'bg-red-200 text-red-900 border-red-400',
}

function BadgeRuolo({ ruolo }) {
    const codice = (ruolo || '').toUpperCase()
    return (
        <span
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[11px] font-black ${
                RUOLI[codice] ?? 'bg-gray-200 text-gray-800 border-gray-400'
            }`}
        >
            {codice || '?'}
        </span>
    )
}

function RigaGiocatore({ giocatore: g, posizione, mostraSquadre = false }) {
    return (
        <li className="flex items-center gap-3 rounded-xl bg-white border border-sky-100 shadow-sm px-3 py-2">
            <span className="w-7 text-center text-xl">{MEDAGLIE[posizione]}</span>
            <BadgeRuolo ruolo={g.ruolo} />
            <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-800">
                    {g.nome}
                    {g.stato === 'svincolato' && (
                        <span className="ml-0.5 text-red-600" title="Calciatore svincolato / fuori lista">*</span>
                    )}
                </p>
                <p className="truncate text-xs text-gray-500">
                    {g.squadraA} · {g.quotazione} cr.
                </p>
                {mostraSquadre && g.squadre?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {g.squadre.map((s) => (
                            <span
                                key={s.nome}
                                className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-900"
                            >
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.border }} />
                                {s.nome}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                {squadreLabel(g.selezionato)}
            </span>
        </li>
    )
}

const definisciFasce = (soglia, n) => [
    { label: 'Unici', da: 1, a: 1, colore: 'bg-emerald-500' },
    { label: '2–3 squadre', da: 2, a: 3, colore: 'bg-sky-500' },
    { label: `4–${soglia - 1}`, da: 4, a: soglia - 1, colore: 'bg-amber-400' },
    { label: `${soglia}+`, da: soglia, a: n, colore: 'bg-rose-500' },
]

function Fasce({ distribuzione, soglia, compatta = false }) {
    const somma = (da, a) => distribuzione.slice(da - 1, a).reduce((s, n) => s + n, 0)
    const fasce = definisciFasce(soglia, distribuzione.length).map((f) => ({ ...f, n: somma(f.da, f.a) }))
    const totale = fasce.reduce((s, f) => s + f.n, 0) || 1

    return (
        <div className={compatta ? 'space-y-1' : 'space-y-1.5'}>
            <div className={`flex overflow-hidden rounded-full bg-sky-100 ${compatta ? 'h-2.5' : 'h-3'}`}>
                {fasce.map(
                    (f) =>
                        f.n > 0 && (
                            <span key={f.label} className={f.colore} style={{ width: `${(f.n / totale) * 100}%` }} />
                        )
                )}
            </div>

            {compatta ? (
                <div className="flex justify-between text-xs font-bold tabular-nums text-gray-700">
                    {fasce.map((f) => (
                        <span key={f.label} className="flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full ${f.colore}`} />
                            {f.n}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-1 text-center">
                    {fasce.map((f) => (
                        <div key={f.label}>
                            <p className="flex items-center justify-center gap-1 text-sm font-black text-gray-800">
                                <span className={`h-2 w-2 rounded-full ${f.colore}`} />
                                {f.n}
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{f.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function SquadraCard({ squadra, posizione, valore, etichetta, soglia }) {
    return (
        <li
            className="space-y-2 rounded-2xl border border-l-8 border-sky-100 bg-white p-3 shadow-sm"
            style={{ borderLeftColor: squadra.border }}
        >
            <div className="flex items-center gap-3">
                <span className="w-7 text-center text-xl">{MEDAGLIE[posizione]}</span>
                <p className="min-w-0 flex-1 truncate font-extrabold text-gray-900">{squadra.nome}</p>
                <div className="text-right">
                    <p className="text-xl font-black leading-none tabular-nums text-sky-900">{Math.round(valore)}%</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">{etichetta}</p>
                </div>
            </div>
            {/* <Istogramma distribuzione={squadra.distribuzione} /> */}
            <Fasce distribuzione={squadra.distribuzione} soglia={soglia} />
            <p className="text-xs text-gray-600">
                <strong>{squadra.unici}</strong> giocatori unici · <strong>{squadra.comuni}</strong> scelti da almeno{' '}
                {soglia} squadre
            </p>
        </li>
    )
}

export default function StatisticheModale({ isOpen, onClose, stats }) {
    const scrollRef = useRef(null)

    return (
        <Transition show={isOpen}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/70" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto p-4">
                    <div className="flex min-h-full items-center justify-center">
                        <TransitionChild
                            enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                                {/* Header */}
                                <div className="relative z-10 bg-linear-to-br from-sky-900 via-sky-700 to-sky-500 px-5 pb-5 pt-5 text-white">
                                    <button
                                        onClick={onClose}
                                        aria-label="Chiudi"
                                        className="absolute right-2 top-2 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/25 font-bold text-white transition touch-manipulation hover:bg-black/40"
                                    >
                                        ✕
                                    </button>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">Borgo Cup</p>
                                    <DialogTitle className="pr-10 text-2xl font-extrabold drop-shadow">Statistiche selezioni</DialogTitle>
                                </div>

                                <TabGroup onChange={() => scrollRef.current?.scrollTo({ top: 0 })}>
                                    <TabList className="mx-4 mt-4 grid grid-cols-2 gap-1 rounded-tl-2xl rounded-br-2xl bg-sky-100 p-1 shadow-inner">
                                        {['Giocatori', 'Squadre'].map((t) => (
                                            <Tab
                                                key={t}
                                                className={({ selected }) =>
                                                    `cursor-pointer rounded-tl-xl rounded-br-xl py-1.5 text-sm font-bold transition focus:outline-none ${
                                                        selected ? 'bg-sky-700 text-white shadow-md' : 'text-sky-800 hover:bg-sky-200'
                                                    }`
                                                }
                                            >
                                                {t}
                                            </Tab>
                                        ))}
                                    </TabList>
                                    <div ref={scrollRef} className="relative z-0 max-h-[60vh] overflow-y-auto p-4">
                                        <TabPanels>
                                            <TabPanel className="space-y-5 focus:outline-none">
                                                <Sezione titolo="Più selezionati" sottotitolo="A pari selezioni, prima la quotazione più alta.">
                                                    <ul className="space-y-2">
                                                        {stats.piuSelezionati.map((g, i) => (
                                                            <RigaGiocatore key={g.id} giocatore={g} posizione={i} />
                                                        ))}
                                                    </ul>
                                                </Sezione>
                                                <Sezione
                                                    titolo="Meno selezionati"
                                                    sottotitolo="Scelti da almeno una squadra, con la quotazione più alta."
                                                >
                                                    <ul className="space-y-2">
                                                        {stats.menoSelezionati.map((g, i) => (
                                                            <RigaGiocatore key={g.id} giocatore={g} posizione={i} mostraSquadre />
                                                        ))}
                                                    </ul>
                                                </Sezione>
                                            </TabPanel>

                                            <TabPanel className="space-y-5 focus:outline-none">
                                                <Sezione
                                                    titolo="Squadre più originali"
                                                    sottotitolo="Più giocatori scelti da poche squadre."
                                                >
                                                    <ul className="space-y-2">
                                                        {stats.piuOriginali.map((s, i) => (
                                                            <SquadraCard
                                                                key={s.id}
                                                                squadra={s}
                                                                posizione={i}
                                                                valore={s.originalita}
                                                                etichetta="Originalità"
                                                                soglia={stats.soglia}
                                                            />
                                                        ))}
                                                    </ul>
                                                </Sezione>
                                                <Sezione
                                                    titolo="Squadre più simili alle altre"
                                                    sottotitolo="Più giocatori scelti da molte squadre."
                                                >
                                                    <ul className="space-y-2">
                                                        {stats.piuSimili.map((s, i) => (
                                                            <SquadraCard
                                                                key={s.id}
                                                                squadra={s}
                                                                posizione={i}
                                                                valore={100 - s.originalita}
                                                                etichetta="Somiglianza"
                                                                soglia={stats.soglia}
                                                            />
                                                        ))}
                                                    </ul>
                                                </Sezione>

                                                <Disclosure as="div" className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                                                    <DisclosureButton className="group flex w-full cursor-pointer items-center justify-between p-3 text-left font-bold text-sky-900">
                                                        Classifica completa
                                                        <ChevronDownIcon className="h-5 w-5 transition-transform group-data-open:rotate-180" />
                                                    </DisclosureButton>
                                                    <DisclosurePanel className="space-y-3 px-3 pb-3">
                                                        {/* Legenda delle fasce, una volta sola */}
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-600">
                                                            {definisciFasce(stats.soglia, stats.nSquadre).map((f) => (
                                                                <span key={f.label} className="flex items-center gap-1">
                                                                    <span className={`h-2 w-2 rounded-full ${f.colore}`} />
                                                                    {f.label}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {stats.classificaSquadre.map((s, i) => (
                                                            <div key={s.id} className="space-y-1">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="w-6 text-right tabular-nums text-gray-400">{i + 1}</span>
                                                                    <span className="min-w-0 flex-1 truncate font-semibold text-gray-800">{s.nome}</span>
                                                                    <span className="text-xs font-bold tabular-nums text-sky-800">{Math.round(s.originalita)}%</span>
                                                                </div>
                                                                <div className="pl-8">
                                                                    <Fasce compatta distribuzione={s.distribuzione} soglia={stats.soglia} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </DisclosurePanel>
                                                </Disclosure>
                                            </TabPanel>
                                        </TabPanels>
                                    </div>
                                </TabGroup>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}