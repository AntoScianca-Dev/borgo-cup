import { useMemo } from 'react'
import Card from './Card'
import BadgeStato from './BadgeStato'
import useNow from '../hooks/useNow'
import competizioniData from '../assets/data/competizioni.json'
import { formatoData, giornataSerieA, statoCompetizione, traQuanto } from '../hooks/calendario'
import { Link } from 'react-router-dom'

const EDIZIONE = '9ª Edizione'
const STAGIONE = 'Stagione 2026/2027'

const MENU = [
    {
        title: 'Tutte le Competizioni',
        description: 'Consulta archivio, gironi, calendari e classifiche complete.',
        icon: '🏆',
        link: '/competizioni',
    },
    {
        title: 'Squadre e Rose',
        description: 'Scopri i club partecipanti, gli elenchi dei giocatori e i dettagli dei team.',
        icon: '👥',
        link: '/squadre',
    },
    {
        title: 'Regolamento',
        description: 'Leggi le norme ufficiali, il sistema di punteggio e le linee guida della lega.',
        icon: '📋',
        link: '/regolamento',
    },
]

function SectionTitle({ children, badge }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-sky-200" />
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-widest text-sky-800">
                {children}
                {badge !== undefined && (
                    <span className="bg-sky-800 text-white text-xs font-bold rounded-full px-2 py-0.5">{badge}</span>
                )}
            </h2>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-sky-200" />
        </div>
    )
}

export default function Home() {
    const competizioni = competizioniData.competizioni || competizioniData
    const now = useNow()
    const giornataCorrente = giornataSerieA(now)

    const attive = useMemo(() => competizioni.filter((c) => c.stato === 'Attivo'), [competizioni])

    // Le competizioni che iniziano per prime (stessa giornata di Serie A)
    const inPartenza = useMemo(() => {
        const inizi = competizioni
            .map((comp) => ({ comp, stato: statoCompetizione(comp, now) }))
            .filter(({ stato }) => stato?.tipo === 'inizia')
        if (inizi.length === 0) return null

        const prima = Math.min(...inizi.map(({ stato }) => stato.turno.giornataA))
        const gruppo = inizi.filter(({ stato }) => stato.turno.giornataA === prima)
        const { inizio, definitivo } = gruppo[0].stato.turno
        return { giornataA: prima, inizio, definitivo, competizioni: gruppo.map(({ comp }) => comp) }
    }, [competizioni, now])

    return (
        <div className="space-y-12 max-w-6xl mx-auto px-4 pb-8">
            {/* Hero */}
            <header className="text-center pt-4 space-y-3">
                <h1 className="text-5xl pb-5 sm:text-6xl font-black tracking-tight bg-linear-to-r from-sky-900 via-sky-700 to-sky-900 bg-clip-text text-transparent">
                    Borgo Cup
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
                    <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full">{EDIZIONE}</span>
                    <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full">{STAGIONE}</span>
                    {giornataCorrente != null && (
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                            Giornata {giornataCorrente}
                        </span>
                    )}
                </div>
            </header>

            {/* In corso */}
            {attive.length > 0 && (
                <section>
                    <SectionTitle badge={attive.length}>Competizioni in corso</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {attive.map((comp) => (
                            <Card
                                key={comp.id}
                                title={comp.nome}
                                img={comp.img}
                                icon={comp.icon}
                                link={`/competizioni${comp.link}`}
                                badge={<BadgeStato comp={comp} now={now} />}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* In partenza */}
            {inPartenza && (
                <section className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm max-w-2xl mx-auto">
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Prossimamente</p>
                    <h2 className="text-center text-xl font-extrabold text-amber-950">
                        Al via con la {inPartenza.giornataA}ª giornata di Serie A
                    </h2>
                    <p className="mt-1 mb-4 text-center text-sm font-semibold text-amber-800">
                        {traQuanto(inPartenza.inizio, now)} · {formatoData(inPartenza.inizio)}
                        {!inPartenza.definitivo && ' · da confermare'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {inPartenza.competizioni.map((comp) => {
                            const isLinkable = comp.info === 'SI' || comp.stato === 'Attivo';
                            const link = isLinkable ? `/competizioni${comp.link}` : '/competizioni';
                            return(
                                <Link 
                                    key={comp.id}
                                    to={link}
                                    state={!isLinkable ? { statoIniziale: 'In attesa' } : undefined}
                                >
                                <span
                                    className="inline-flex items-center gap-2 bg-white text-amber-950 font-semibold px-4 py-2 rounded-full border border-amber-300 shadow-sm"
                                    >
                                    {comp.icon && <span>{comp.icon}</span>}
                                    {comp.nome}
                                </span>
                            </Link>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Menu */}
            <section>
                <SectionTitle>Menu Principale</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {MENU.map((voce) => (
                        <Card key={voce.link} {...voce} />
                    ))}
                </div>
            </section>
        </div>
    )
}