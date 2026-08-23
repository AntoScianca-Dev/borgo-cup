export default function Footer({ giornata = 25 }) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full text-amber-50 shadow-inner mt-auto border-t border-sky-600/30 bg-linear-to-r from-sky-900 via-sky-800 to-sky-900">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dati aggiornati alla <strong>{giornata}ª Giornata</strong> di Serie A</span>
                </div>
                
                <div className="text-amber-100/80 text-xs">
                    © {currentYear} Borgo Cup • Tutti i diritti riservati
                </div>
            </div>
        </footer>
    )
}