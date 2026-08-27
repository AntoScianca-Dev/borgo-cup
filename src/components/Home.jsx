import Card from './Card'
import competizioniData from '../assets/data/competizioni.json'

export default function Home() {
    // Gestione dell'import del JSON (default export)
    const competizioni = competizioniData.competizioni || competizioniData

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
                                key={comp.id} // Prop key obbligatoria
                                title={comp.nome}
                                img={comp.img}
                                icon={comp.icon}
                                link={`/competizioni${comp.link}`}
                            />
                        ))}
                </div>
            </section>

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