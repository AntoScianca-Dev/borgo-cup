export const Testo = ({ children }) => (
    <p className="text-base sm:text-lg leading-relaxed">{children}</p>
)

export const Ev = ({ children }) => (
    <strong className="font-bold text-amber-900 bg-amber-100 px-1 rounded box-decoration-clone">
        {children}
    </strong>
)

const RAMPA = [
    'bg-amber-50 border-amber-200',
    'bg-amber-100/70 border-amber-300',
    'bg-amber-100 border-amber-300',
    'bg-amber-200/70 border-amber-400',
    'bg-amber-200 border-amber-400',
    'bg-amber-300/70 border-amber-500',
    'bg-amber-300 border-amber-500',
]

// righe = [{ label, valore }]. "neutra": tutte uguali (calendari); "invertita": la prima è la più marcata (premi)
export function Fasce({ righe, invertita = false, neutra = false }) {
    return (
        <div className="grid grid-cols-1 gap-2">
            {righe.map((r, i) => {
                const idx = Math.min(Math.max(invertita ? RAMPA.length - 1 - i : i, 0), RAMPA.length - 1)
                const stile = neutra ? 'bg-sky-50 border-sky-200' : RAMPA[idx]
                return (
                    <div
                        key={`${r.label}-${i}`}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 ${stile}`}
                    >
                        <span className="min-w-0 text-sm sm:text-base text-gray-700">{r.label}</span>
                        <span className={`font-black whitespace-nowrap ${neutra ? 'text-sky-900' : 'text-amber-900'}`}>
                            {r.valore}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export function Titolo({ children, icona = '📌' }) {
    return (
        <div className="flex items-center gap-3 bg-linear-to-br from-sky-800 to-sky-500 text-white rounded-2xl px-4 py-3 shadow-md">
            <span className="text-2xl">{icona}</span>
            <h3 className="text-xl sm:text-2xl font-extrabold">{children}</h3>
        </div>
    )
}

export function Box({ children }) {
    return (
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 space-y-3 text-gray-700 shadow-sm">
            {children}
        </div>
    )
}

// Titolo + contenuto
export function Blocco({ titolo, icona, children }) {
    return (
        <section className="space-y-3">
            <Titolo icona={icona}>{titolo}</Titolo>
            <Box>{children}</Box>
        </section>
    )
}