const chiave = (id) => String(id)
const limita = (n, min, max) => Math.min(Math.max(n, min), max)

// A parità di selezioni vince la quotazione più alta
const perSelezioniDesc = (a, b) => b.selezionato - a.selezionato || b.quotazione - a.quotazione
const perSelezioniAsc = (a, b) => a.selezionato - b.selezionato || b.quotazione - a.quotazione

export function calcolaStatistiche({ calciatori, rose, squadre }) {
    const nSquadre = squadre.length
    const soglia = Math.ceil(nSquadre / 2) // "diffuso" = scelto da almeno metà delle squadre

    const selezionati = calciatori.filter((c) => (c.selezionato || 0) > 0)
    const mappa = new Map(calciatori.map((c) => [chiave(c.id), c]))

    const proprietari = new Map()

    const classificaSquadre = squadre
        .map((squadra) => {
            const voce = rose.find((r) => chiave(r.id) === chiave(squadra.id))
            const giocatori = Object.values(voce?.rosa?.[0] ?? {})
                .flat()
                .filter((g) => g?.id !== undefined)
            if (giocatori.length === 0) return null

            // distribuzione[k - 1] = quanti giocatori della rosa sono scelti da k squadre
            const distribuzione = Array(nSquadre).fill(0)
            let somma = 0
            let comuni = 0

            giocatori.forEach((g) => {
                const k = chiave(g.id)
                proprietari.set(k, [...(proprietari.get(k) ?? []), { nome: squadra.nome, border: squadra.border }])

                const sel = limita(mappa.get(k)?.selezionato || 1, 1, nSquadre)

                // const sel = limita(mappa.get(chiave(g.id))?.selezionato || 1, 1, nSquadre)
                distribuzione[sel - 1]++
                if (nSquadre > 1) somma += (nSquadre - sel) / (nSquadre - 1)
                if (sel >= soglia) comuni++
            })

            return {
                id: squadra.id,
                nome: squadra.nome,
                border: squadra.border,
                distribuzione,
                unici: distribuzione[0],
                comuni,
                originalita: (somma / giocatori.length) * 100,
            }
        })
        .filter(Boolean)
        .sort((a, b) => b.originalita - a.originalita || b.unici - a.unici)

    return {
        nSquadre,
        soglia,
        piuSelezionati: [...selezionati].sort(perSelezioniDesc).slice(0, 3),
        menoSelezionati: [...selezionati]
            .sort(perSelezioniAsc)
            .slice(0, 3)
            .map((g) => ({ ...g, squadre: proprietari.get(chiave(g.id)) ?? [] })),
        classificaSquadre,
        piuOriginali: classificaSquadre.slice(0, 3),
        piuSimili: [...classificaSquadre].reverse().slice(0, 3),
    }
}