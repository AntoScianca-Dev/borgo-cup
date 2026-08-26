// import { useState } from 'react'
import squadreData from '../assets/data/squadre.json'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid'

export default function Classifica() {
    const squadre = squadreData.squadre || squadreData
    // Ordiniamo le squadre per punteggio decrescente
    const classificaOrdinata = [...squadre].sort((a, b) => (a.posizione || 0) - (b.posizione || 0))

    return (
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Schermata */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-sky-900 tracking-tight flex items-center justify-center gap-3">
                Classifica Campionato
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
                1' giornata
            </p>
        </div>

        {/* Scheda Tabella */}
        <div className="rounded-2x overflow-hidden">
            
            {/* Banner testata tabella */}
            <div className="bg-linear-to-r from-sky-900 via-sky-800 mb-2 to-sky-900 px-6 py-4 text-amber-50 flex justify-between items-center rounded-2xl">
                <span className="font-semibold text-sm tracking-wider uppercase">Squadra</span>
                <span className="font-semibold text-sm tracking-wider uppercase">Punti</span>
            </div>

            {/* Lista Squadre */}
            <div className="grid gap-2">
            {classificaOrdinata.map((squadra, index) => {
                const posizione = index + 1
                const isPrimo = posizione === 1
                const isSecondo = posizione === 2
                const isTerzo = posizione === 3
                const isQuarto = posizione === 4
                const isQuinto = posizione === 5

                return (
                <div
                    key={squadra.id || index}
                    className={`flex items-center justify-between px-2 py-2 border-x-4 rounded-2xl transition-all duration-200 hover:bg-sky-50/50 group ${
                    isPrimo ? 'bg-amber-50/40' : ''
                    }`}
                    style={{borderLeftColor: squadra.border, borderRightColor: squadra.border}}
                >
                    {/* Posizione + Badge + Nome */}
                    <div className="flex items-center gap-1.5">
                        {/* Numero / Medaglia Posizione */}
                        <div className="w-9 h-9 flex items-center justify-center font-bold text-lg rounded-full shrink-0">
                            {isPrimo && (
                            <span className="w-9 h-9 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-md shadow-amber-300/50">
                                1
                            </span>
                            )}
                            {isSecondo && (
                            <span className="w-9 h-9 rounded-full bg-linear-to-tr from-gray-300 to-gray-100 text-gray-800 flex items-center justify-center shadow-md border border-gray-300">
                                2
                            </span>
                            )}
                            {isTerzo && (
                            <span className="w-9 h-9 rounded-full bg-linear-to-tr from-amber-700 to-amber-600 text-amber-50 flex items-center justify-center shadow-md">
                                3
                            </span>
                            )}
                            {isQuarto && (
                            <span className="w-9 h-9 rounded-full bg-linear-to-tr from-yellow-300 to-yellow-100 text-yellow-800 flex items-center justify-center shadow-md">
                                4
                            </span>
                            )}
                            {isQuinto && (
                            <span className="w-9 h-9 rounded-full bg-linear-to-tr from-sky-700 to-sky-600 text-sky-50 flex items-center justify-center shadow-md">
                                5
                            </span>
                            )}
                            {!isPrimo && !isSecondo && !isTerzo && !isQuarto && !isQuinto && (
                            <span className="text-gray-400 font-medium text-base">
                                {posizione}
                            </span>
                            )}
                        </div>

                        {/* Indicatore Trend (Variazione) */}
                        <div className="w-5 flex justify-center">
                            {squadra.variazione > 0 && (
                            <span className="text-emerald-500 flex items-center text-xs font-bold">
                                <ArrowUpIcon className="w-3.5 h-3.5" />
                            </span>
                            )}
                            {squadra.variazione < 0 && (
                            <span className="text-red-500 flex items-center text-xs font-bold">
                                <ArrowDownIcon className="w-3.5 h-3.5" />
                            </span>
                            )}
                            {(!squadra.variazione || squadra.variazione === 0) && (
                            <MinusIcon className="w-3.5 h-3.5 text-gray-300" />
                            )}
                        </div>

                        {/* Dettagli Squadra */}
                        <div className="flex items-center gap-3">
                            {/* {squadra.logo && (
                            <img
                                src={squadra.logo}
                                alt={squadra.nome}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                            )} */}
                            <span
                            className={`font-bold text-lg transition-colors group-hover:text-sky-700 ${
                                isPrimo ? 'text-amber-900 text-xl' : 'text-gray-800'
                            }`}
                            >
                            {squadra.nome}
                            </span>
                        </div>
                    </div>

                    {/* Punteggio */}
                    <div className="flex items-center">
                        <span
                            className={`text-xl font-black px-4 py-1.5 rounded-xl ${
                            isPrimo
                                ? 'bg-amber-400/20 text-amber-900 border border-amber-300/50'
                                : 'bg-gray-100 text-sky-950 group-hover:bg-sky-100 group-hover:text-sky-900'
                            }`}
                        >
                            {(squadra.punteggio || 0).toFixed(1)}
                        </span>
                    </div>
                </div>
                )
            })}
            </div>
        </div>
        </div>
    )
}