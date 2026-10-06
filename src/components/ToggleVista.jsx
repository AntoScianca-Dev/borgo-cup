// import { useState } from 'react'

const OPZIONI = [
    { valore: false, label: 'Estesa' },
    { valore: true, label: 'Compatta' },
]

// La scelta viene ricordata e vale per tutte le classifiche
// export function useVistaCompatta() {
//     const [compatta, setCompatta] = useState(() => {
//         try {
//             return localStorage.getItem('vistaCompatta') === 'true'
//         } catch {
//             return false
//         }
//     })

//     const imposta = (valore) => {
//         setCompatta(valore)
//         try {
//             localStorage.setItem('vistaCompatta', String(valore))
//         } catch {
//             /* storage non disponibile: la scelta vale solo per questa pagina */
//         }
//     }

//     return [compatta, imposta]
// }

export default function ToggleVista({ compatta, onChange }) {
    return (
        <div
            role="group"
            aria-label="Modalità di visualizzazione"
            className="relative mx-auto grid grid-cols-2 w-64 p-1 bg-sky-100 rounded-tl-2xl rounded-br-2xl shadow-inner"
        >
            {/* Cursore che scorre */}
            <span
                aria-hidden="true"
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-tl-xl rounded-br-xl bg-sky-700 shadow-md transition-transform duration-300 ${
                    compatta ? 'translate-x-full' : ''
                }`}
            />
            {OPZIONI.map((o) => (
                <button
                    key={o.label}
                    type="button"
                    aria-pressed={compatta === o.valore}
                    onClick={() => onChange(o.valore)}
                    className={`relative z-10 py-1.5 text-sm font-bold transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 rounded-tl-xl rounded-br-xl ${
                        compatta === o.valore ? 'text-white' : 'text-sky-800'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    )
}