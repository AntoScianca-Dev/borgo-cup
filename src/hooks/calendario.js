import calendarioData from '../assets/data/calendarioA.json'

const FUSO = 'Europe/Rome'
const GIORNO_MS = 24 * 60 * 60 * 1000

const GIORNATE = calendarioData.giornate
    .map((g) => ({
        giornata: g.giornata,
        inizio: new Date(g.inizio),
        fine: new Date(g.fine),
        definitivo: g.definitivo !== false,
    }))
    .sort((a, b) => a.giornata - b.giornata)

const PER_NUMERO = new Map(GIORNATE.map((g) => [g.giornata, g]))

const fineGiornata = (n) => {
    const g = PER_NUMERO.get(n)
    return g ? new Date(g.fine.getTime()) : null
}

export const espandiGiornate = (spec = []) =>
    spec.flatMap((s) => {
        if (typeof s === 'number') return [s]
        const out = []
        for (let n = s.da; n <= s.a; n += s.passo ?? 1) out.push(n)
        return out
    })

// Ultima giornata di Serie A il cui primo calcio d'inizio è già passato
export const giornataSerieA = (adesso = new Date()) =>
    GIORNATE.filter((g) => g.inizio <= adesso).at(-1)?.giornata ?? null

// null = niente da mostrare; altrimenti { tipo: 'inizia' | 'in_corso' | 'prossima', turno }
export function statoCompetizione(comp, adesso = new Date()) {
    if (!comp || comp.stato === 'Terminata' || comp.stato === 'None') return null

    const turni = espandiGiornate(comp.giornateA).flatMap((n, i) => {
        const g = PER_NUMERO.get(n)
        return g
            ? [{ numero: i + 1, giornataA: n, inizio: g.inizio, fine: fineGiornata(n), definitivo: g.definitivo }]
            : []
    })
    if (turni.length === 0) return null

    const inCorso = turni.find((t) => adesso >= t.inizio && adesso < t.fine)
    if (inCorso) return { tipo: 'in_corso', turno: inCorso }

    const prossimo = turni.find((t) => t.inizio > adesso)
    if (!prossimo) return null
    return { tipo: prossimo.numero === 1 ? 'inizia' : 'prossima', turno: prossimo }
}

/* ---------- Formattazione (sempre in ora italiana) ---------- */

const giornoRoma = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(d) // AAAA-MM-GG

const giorniDiCalendario = (da, a) => {
    const [y1, m1, d1] = giornoRoma(da).split('-').map(Number)
    const [y2, m2, d2] = giornoRoma(a).split('-').map(Number)
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / GIORNO_MS)
}

export function traQuanto(data, adesso = new Date()) {
    const minuti = Math.round((data - adesso) / 60000)
    if (minuti <= 0) return 'a breve'
    if (minuti < 60) return `tra ${minuti} min`
    const giorni = giorniDiCalendario(adesso, data)
    if (giorni === 0) {
        const ore = Math.floor(minuti / 60)
        return ore === 1 ? 'tra 1 ora' : `tra ${ore} ore`
    }
    return giorni === 1 ? 'domani' : `tra ${giorni} giorni`
}

const formato = new Intl.DateTimeFormat('it-IT', {
    timeZone: FUSO, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
})
export const formatoData = (d) => formato.format(d)