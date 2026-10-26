import { useEffect, useState } from 'react'

export default function useNow(intervalloMs = 60_000) {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), intervalloMs)
        return () => clearInterval(id)
    }, [intervalloMs])

    return now
}