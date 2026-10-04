import { useMemo } from 'react'
import trofeiData from '../assets/data/trofei.json'

const ICONE = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function TrofeiModale({ isOpen, onClose, squad }) {
    const palmares = useMemo(() => {
        if (!squad) return []
        const voce = trofeiData.trofei.find((t) => String(t.id) === String(squad.id))
        return [...(voce?.palmares ?? [])].sort((a, b) => b.stagione.localeCompare(a.stagione))
    }, [squad])

    if (!isOpen || !squad) return null

    const vittorie = palmares.filter((p) => p.posizione === 1).length

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between p-4 text-white rounded-t-2xl"
                    style={{ background: squad.border }}
                >
                    <h2 className="text-lg font-extrabold">🏆 Sala Trofei · {squad.nome}</h2>
                    <button onClick={onClose} className="text-xl font-bold cursor-pointer">✕</button>
                </div>

                <div className="p-4 space-y-4">
                    {palmares.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-sm">
                            Nessun trofeo in bacheca per ora
                        </p>
                    ) : (
                        <>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                                <p className="text-3xl font-black text-amber-600">{vittorie}</p>
                                <p className="text-[11px] uppercase tracking-wide font-semibold text-amber-700">
                                    Titoli vinti
                                </p>
                            </div>
                            <ul className="space-y-2">
                                {palmares.map((p, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm"
                                    >
                                        <span className="text-2xl">{ICONE[p.posizione] ?? '🏅'}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-gray-800">{p.competizione}</p>
                                            <p className="text-xs text-gray-500">{p.titolo}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-sky-700">{p.stagione}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}