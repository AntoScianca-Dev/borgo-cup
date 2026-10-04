import { Link } from 'react-router-dom'

export default function Card({ title, description, icon, img, link }) {
    return (
        <Link
            to={link}
            className="group relative min-w-0 w-full max-w-xs mx-auto h-full flex flex-col items-center text-center gap-3 bg-white rounded-3xl border border-sky-100 shadow-md p-6 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-sky-300 transition-all duration-300"
        >
            {/* Alone decorativo */}
            <span
                aria-hidden="true"
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sky-100 opacity-60 group-hover:scale-150 transition-transform duration-500"
            />

            {/* Icona / immagine */}
            {(img || icon) && (
                <span className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-sky-50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {img ? (
                        <img src={img} alt="" className="w-14 h-14 object-contain" />
                    ) : (
                        <span className="text-4xl">{icon}</span>
                    )}
                </span>
            )}

            <h3 className="relative text-xl font-extrabold text-sky-950 leading-tight">{title}</h3>

            {description && (
                <p className="relative text-sm text-gray-600 leading-relaxed">{description}</p>
            )}

            {/* Freccia in fondo, allineata anche con card di altezza diversa */}
            <span className="relative mt-auto pt-2 inline-flex items-center gap-1 text-sm font-bold text-sky-700">
                Vai
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
        </Link>
    )
}