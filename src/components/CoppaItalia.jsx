import { useState } from 'react'
import coppaData from '../assets/data/classifiche.json' // Percorso al tuo file JSON

export default function CoppaItalia() {
  const [activeTab, setActiveTab] = useState('tabellone') // 'tabellone' | 'calendario'
  const [selectedTurnoIndex, setSelectedTurnoIndex] = useState(0)

  const coppaObj = coppaData.classifiche.find(
        (item) => item.id === 5
    )

  const turni = coppaObj.partecipanti || []

    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Header Titolo */}
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">{coppaData.nome}</h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Stagione {coppaData.stagione}</p>
        </div>

        {/* Switch Modalità: Tabellone / Calendario */}
        <div className="flex justify-center">
            <div className="bg-gray-200 p-1 rounded-xl flex gap-1 shadow-inner">
            <button
                onClick={() => setActiveTab('tabellone')}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'tabellone'
                    ? 'bg-sky-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                🌳 Tabellone
            </button>
            <button
                onClick={() => setActiveTab('calendario')}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calendario'
                    ? 'bg-sky-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                📅 Partite / Calendario
            </button>
            </div>
        </div>

        {/* VISTA 1: TABELLONE COMPATTO SENZA SCROLL (Ispirato a Foto 1) */}
        {activeTab === 'tabellone' && (
            <div className="bg-slate-100 rounded-2xl p-2 sm:p-6 shadow-inner w-full">
            <div className="flex flex-col items-center space-y-4 sm:space-y-8 w-full py-1">
                {turni.map((turno) => (
                <div key={turno.id} className="w-full flex flex-col items-center">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">
                    {turno.nome}
                    </span>

                    {/* Grid dinamico: si adatta esattamente al numero di partite del turno senza uscire dallo schermo */}
                    <div
                    className="w-full grid gap-1.5 sm:gap-4"
                    style={{
                        gridTemplateColumns: `repeat(${turno.partite.length}, minmax(0, 1fr))`
                    }}
                    >
                    {turno.partite.map((match) => (
                        <div
                        key={match.id}
                        className="bg-white rounded-xl p-1.5 sm:p-3 shadow-sm border border-slate-200 flex flex-col items-center justify-between w-full hover:shadow-md transition-shadow"
                        >
                        {/* Loghi e Badges */}
                        <div className="flex items-center justify-center gap-0.5 sm:gap-3 w-full">
                            {/* Squadra Casa */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                            <img
                                src={match.squadraCasa.logo}
                                alt={match.squadraCasa.nome}
                                className="w-5 h-5 xs:w-6 xs:h-6 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                            />
                            <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-bold text-slate-600 mt-0.5 truncate max-w-full">
                                {match.squadraCasa.codice || match.squadraCasa.nome.substring(0, 3).toUpperCase()}
                            </span>
                            </div>

                            {/* Vs */}
                            <span className="text-[8px] sm:text-xs font-extrabold text-slate-300 px-0.5">
                            :
                            </span>

                            {/* Squadra Ospite */}
                            <div className="flex flex-col items-center flex-1 min-w-0">
                            <img
                                src={match.squadraOspite.logo}
                                alt={match.squadraOspite.nome}
                                className="w-5 h-5 xs:w-6 xs:h-6 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                            />
                            <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-bold text-slate-600 mt-0.5 truncate max-w-full">
                                {match.squadraOspite.codice || match.squadraOspite.nome.substring(0, 3).toUpperCase()}
                            </span>
                            </div>
                        </div>

                        {/* Risultato o Orario */}
                        <div className="mt-1 text-center border-t border-slate-100 pt-0.5 w-full">
                            {match.conclusa ? (
                            <div className="text-[10px] xs:text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-tight">
                                {match.golCasa} : {match.golOspite}
                                {match.rigoriCasa !== undefined && (
                                <span className="block text-[7px] xs:text-[8px] sm:text-[10px] text-slate-500 font-medium">
                                    ({match.rigoriCasa}):({match.rigoriOspite})
                                </span>
                                )}
                            </div>
                            ) : (
                            <span className="text-[8px] xs:text-[9px] sm:text-xs font-bold text-slate-400">
                                {match.orario || 'Da Giocare'}
                            </span>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* VISTA 2: CALENDARIO SCURO (Ispirato a Foto 2) */}
        {activeTab === 'calendario' && (
            <div className="bg-[#0b1736] text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
            {/* Selettore Turno */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide text-sky-400">
                {turni[selectedTurnoIndex]?.nome}
                </h2>

                <div className="flex flex-wrap gap-1.5">
                {turni.map((t, idx) => (
                    <button
                    key={t.id}
                    onClick={() => setSelectedTurnoIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                        selectedTurnoIndex === idx
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                    >
                    {t.nome}
                    </button>
                ))}
                </div>
            </div>

            {/* Elenco Partite del Turno Selezionato */}
            <div className="divide-y divide-slate-800/80">
                {turni[selectedTurnoIndex]?.partite.map((match) => (
                <div
                    key={match.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                    {/* Nomi Squadre + Loghi */}
                    <div className="space-y-1.5 flex-1">
                    {/* Squadra Casa */}
                    <div className="flex items-center gap-2.5">
                        <img
                        src={match.squadraCasa.logo}
                        alt={match.squadraCasa.nome}
                        className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-xs sm:text-base text-slate-100">
                        {match.squadraCasa.nome}
                        </span>
                    </div>

                    {/* Squadra Ospite */}
                    <div className="flex items-center gap-2.5">
                        <img
                        src={match.squadraOspite.logo}
                        alt={match.squadraOspite.nome}
                        className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-xs sm:text-base text-slate-100">
                        {match.squadraOspite.nome}
                        </span>
                    </div>
                    </div>

                    {/* Risultati affiancati */}
                    <div className="text-right flex flex-col justify-center space-y-1 font-bold text-base sm:text-lg min-w-[40px]">
                    {match.conclusa ? (
                        <>
                        <span className="text-white">{match.golCasa}</span>
                        <span className="text-white">{match.golOspite}</span>
                        </>
                    ) : (
                        <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">
                        {match.orario || '-'}
                        </span>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    )
}