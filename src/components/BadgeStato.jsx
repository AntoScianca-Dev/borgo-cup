import { formatoData, statoCompetizione, traQuanto } from '../hooks/calendario'

export default function BadgeStato({ comp, now }) {
    const stato = statoCompetizione(comp, now)
    if (!stato) return null

    if (stato.tipo === 'in_corso') {
        return (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Giornata in corso
            </span>
        )
    }

    const { tipo, turno } = stato
    return (
        <span className="inline-flex flex-col items-center rounded-2xl border border-amber-300 bg-amber-50 px-3 py-1 text-center">
            <span className="text-xs font-bold text-amber-900">
                {tipo === 'inizia' ? 'Inizia' : 'Prossima giornata'} {traQuanto(turno.inizio, now)}
            </span>
            <span className="text-[11px] font-medium text-amber-700">
                {formatoData(turno.inizio)}
                {!turno.definitivo && ' · da confermare'}
            </span>
        </span>
    )
}