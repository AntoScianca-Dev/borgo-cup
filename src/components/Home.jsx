import Card from './Card'
import competizioniData from '../assets/data/competizioni.json'

export default function Home() {
    // Gestione dell'import del JSON
    const competizioni = competizioniData.competizioni || competizioniData

    // Imposta la giornata attualmente in corso nella lega
    const GIORNATA_CORRENTE = competizioniData.competizioni.find(
        (item) => item.id === 0
    ).giornataA

    const PROSSIMA_GIORNATA = GIORNATA_CORRENTE + 1

    // Competizioni che partono la giornata seguente
    const inPartenza = competizioni.filter(
        (comp) => comp.gInizio === PROSSIMA_GIORNATA
    )

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-sky-800 mb-2">
                    Borgo Cup
                </h1>
                <p className="text-lg text-gray-600">
                    9ª Edizione - Stagione 2026/2027
                </p>
            </div>

            {/* Sezione 1: Competizioni Attive */}
            <section>
                <div className="text-xl text-center font-semibold rounded-full bg-emerald-100 text-emerald-800 p-3 mb-6 w-80 mx-auto shadow-sm">
                    <h2>Competizioni in corso</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {competizioni
                        .filter((comp) => comp.stato === "Attivo")
                        .map((comp) => (
                            <Card
                                key={comp.id}
                                title={comp.nome}
                                img={comp.img}
                                icon={comp.icon}
                                link={`/competizioni${comp.link}`}
                            />
                        ))}
                </div>
            </section>

            {/* Sezione: In partenza la prossima giornata */}
            {inPartenza.length > 0 && (
                <section className="bg-amber-50 w-70 mx-auto border border-amber-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <span className="mx-auto font-semibold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full w-fit">
                            <h2 className="font-bold text-amber-900">
                                Inizio alla Giornata {PROSSIMA_GIORNATA}
                            </h2>
                        </span>
                    </div>

                    {/* Bottoni su singola riga */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {inPartenza.map((comp) => (
                            <div
                                key={comp.id}
                                className="inline-flex items-center gap-2 bg-white hover:bg-amber-100/60 text-amber-950 font-semibold px-4 py-2.5 rounded-xl border border-amber-300 shadow-sm transition-all duration-200 shrink-0 hover:scale-[1.02] active:scale-95"
                            >
                                {comp.icon && <span>{comp.icon}</span>}
                                <span>{comp.nome}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Sezione 2: Link Rapidi / Sezioni Principali */}
            <section>
                <div className="text-xl text-center font-semibold rounded-full bg-emerald-100 text-emerald-800 p-3 mb-6 w-80 mx-auto shadow-sm">
                    <h2>Menu Principale</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card
                        title="Tutte le Competizioni"
                        description="Consulta archivio, gironi, calendari e classifiche complete."
                        icon="🏆"
                        link="/competizioni"
                    />
                    <Card
                        title="Squadre e Rose"
                        description="Scopri i club partecipanti, gli elenchi dei giocatori e i dettagli dei team."
                        icon="👥"
                        link="/squadre"
                    />
                    <Card
                        title="Regolamento"
                        description="Leggi le norme ufficiali, il sistema di punteggio e le linee guida della lega."
                        icon="📋"
                        link="/regolamento"
                    />
                </div>
            </section>
        </div>
    )
}