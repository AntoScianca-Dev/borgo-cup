import { ShieldExclamationIcon } from '@heroicons/react/24/solid'

export default function Footer({ giornata = 25 }) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full text-amber-50 shadow-inner mt-auto border-t border-sky-600/30 bg-linear-to-r from-sky-900 via-sky-800 to-sky-900">
            <div className="container mx-auto px-4 py-3 flex flex-col justify-between items-center text-sm gap-2">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dati aggiornati alla <strong>{giornata}ª Giornata</strong> di Serie A</span>
                </div>
                <div className="shadow shadow-amber-50 px-4 py-2 rounded-2xl" >
                    <ShieldExclamationIcon className='w-10 h-10 mx-auto'/> 
                    <span className='font-bold'>
                        I dati presenti su questo sito costituiscono un riepilogo a scopo informativo e potrebbero presentare lievi differenze rispetto ai dati ufficiali dell'app Leghe Fantacalcio, dovute a errori di battitura, arrotondamenti o tempistiche di sincronizzazione. <br/> L'app ufficiale Leghe Fantacalcio rimane l'unica fonte autorevole e ufficiale dei dati. <br/> In caso di discrepanze, fare sempre riferimento ai dati ufficiali.
                    </span>
                </div>
                
                <div className="text-amber-100/80 text-xs">
                    © {currentYear} Antonia Sciancalepore • Tutti i diritti riservati
                </div>
            </div>
        </footer>
    )
}