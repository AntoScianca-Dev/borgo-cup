import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import classificheData from '../assets/data/classifiche.json'
import competizioniData from '../assets/data/competizioni.json'
import { Chip, Raccordo, Fila, Partita, Logo, SwitchVista, Calendario } from './PartiteUI'
import { vincitore } from '../hooks/partiteUtils'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import IconaTabellone from './IconaTabellone'
import headerC from '../assets/image/header_coppaIta.png'

const COMPETIZIONE_ID = 5

// Struttura ufficiale: l'ordine delle partite nel JSON è l'ordine nel tabellone
// (la partita i degli ottavi alimenta il quarto floor(i / 2), e così via)
const FORMATO = [
    { nome: 'Preliminari', n: 8 },
    { nome: 'Ottavi', n: 8 },
    { nome: 'Quarti', n: 4 },
    { nome: 'Semifinali', n: 2 },
    { nome: 'Finale', n: 1 },
]

const VISTE = [
    { id: 'tabellone', label: 'Tabellone', Icona: IconaTabellone },
    { id: 'calendario', label: 'Calendario', Icona: CalendarDaysIcon },
]

function Tabellone({ turni }) {
    const turniPrecedenti = turni.slice(0, -1) // tutto tranne la finale
    const finale = turni.at(-1).partite[0]

    // Metà alta: prima metà di ogni turno, dal primo turno in giù.
    // Metà bassa: seconda metà di ogni turno, dalla finale verso l'ultimo turno.
    const alto = turniPrecedenti.map((t) => ({
        nome: t.nome,
        partite: t.partite.slice(0, t.partite.length / 2),
    }))
    const basso = turniPrecedenti
        .map((t) => ({ nome: t.nome, partite: t.partite.slice(t.partite.length / 2) }))
        .reverse()

    return (
        <div className="rounded-3xl bg-white border border-sky-100 shadow-md p-3 sm:p-5">
            <div className="max-w-md mx-auto">
                {/* Metà alta */}
                <div className="flex justify-center pb-2">
                    <Chip>{alto[0].nome}</Chip>
                </div>
                {alto.map((r, i) => (
                    <Fragment key={r.nome}>
                        {i > 0 && (
                            <Raccordo
                                da={alto[i - 1].partite.length}
                                a={r.partite.length}
                                etichetta={r.nome}
                            />
                        )}
                        <Fila partite={r.partite} />
                    </Fragment>
                ))}

                <Raccordo da={alto.at(-1).partite.length} a={1} />

                {/* Finale */}
                <div className="relative flex justify-center">
                    <span
                        aria-hidden="true"
                        className="absolute left-[6%] top-1/2 -translate-y-1/2 text-5xl drop-shadow"
                    >
                        🏆
                    </span>
                    <div className="w-36 sm:w-52">
                        <Partita match={finale} grande titolo="Finale" />
                    </div>
                </div>

                <Raccordo da={basso[0].partite.length} a={1} invertito />

                {/* Metà bassa (speculare) */}
                {basso.map((r, i) => (
                    <Fragment key={r.nome}>
                        {i > 0 && (
                            <Raccordo
                                da={r.partite.length}
                                a={basso[i - 1].partite.length}
                                invertito
                                etichetta={basso[i - 1].nome}
                            />
                        )}
                        <Fila partite={r.partite} />
                    </Fragment>
                ))}
                <div className="flex justify-center pt-2">
                    <Chip>{basso.at(-1).nome}</Chip>
                </div>
            </div>
        </div>
    )
}

export default function CoppaItalia() {
    const [vista, setVista] = useState('tabellone')

    const coppa = classificheData.classifiche.find((c) => c.id === COMPETIZIONE_ID)
    const competizione = competizioniData.competizioni.find((c) => c.id === COMPETIZIONE_ID)

    // Normalizza i turni sul formato ufficiale e completa le partite mancanti con null
    const turni = useMemo(() => {
        const dati = coppa?.partecipanti ?? []
        return FORMATO.map((f, i) => ({
            id: dati[i]?.id ?? f.nome,
            nome: dati[i]?.nome ?? f.nome,
            partite: Array.from({ length: f.n }, (_, k) => dati[i]?.partite?.[k] ?? null),
        }))
    }, [coppa])

    if (!coppa) return null

    const finale = turni.at(-1).partite[0]
    const v = vincitore(finale)
    const campione = v === 'casa' ? finale.squadraCasa : v === 'ospite' ? finale.squadraOspite : null

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-3 pb-6">
            {/* Header */}
            <Link to="/competizioni" className="block">
                <h1 className=" py-2 md:py-6 rounded-tl-4xl rounded-br-4xl bg-linear-to-br from-sky-900 via-sky-700 to-sky-500 text-sky-50 shadow-lg"
                    style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(7, 89, 133, 0.2)), url(${headerC})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                }}>
                    <span className="flex justify-evenly items-center gap-1">
                        {competizione?.img && (
                            <img src={competizione.img} alt="" className="w-16 h-16 object-contain" />
                        )}
                        <span className="text-3xl sm:text-4xl font-medium tracking-tight drop-shadow">{coppa.nome}</span>
                        {coppa.stagione && (
                            <span className="text-sm font-semibold text-sky-100">Stagione {coppa.stagione}</span>
                        )}
                    </span>
                </h1>
            </Link>

            {competizione?.giornata != null && (
                <div className="flex justify-center">
                    <span className="bg-sky-900 text-sky-50 text-sm font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow">
                        {competizione.giornata}ª giornata
                    </span>
                </div>
            )}

            {/* Vincitrice */}
            {campione && (
                <div className="flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-amber-400 to-yellow-300 text-amber-950 p-4 shadow-lg">
                    <span className="text-3xl">🏆</span>
                    <Logo sq={campione} className="w-12 h-12" />
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest">Vincitrice</p>
                        <p className="text-2xl font-black leading-tight">{campione.nome}</p>
                    </div>
                </div>
            )}

            <SwitchVista opzioni={VISTE} valore={vista} onChange={setVista} />

            {vista === 'tabellone' ? <Tabellone turni={turni} /> : <Calendario turni={turni} />}
        </div>
    )
}