import { Link } from 'react-router-dom'

export default function Card({ title, description, icon, img, link }) {
    return (
        <Link
        to={link}
        className="bg-sky-100 rounded-lg shadow-md shadow-sky-800 w-70 mx-auto flex flex-col justify-center items-center text-center p-6 hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
        >
        
        {img ? (
            <div className="mb-4">
                <img src={img} alt={title || ''} className="w-15 h-15 object-contain" />
            </div>
        ) : icon ? (
            <div className="text-5xl mb-4">{icon}</div>
        ) : null}

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        </Link>
    )
}