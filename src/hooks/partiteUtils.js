export const vincitore = (m) => {
    if (!m?.conclusa) return null
    if (m.golCasa !== m.golOspite) return m.golCasa > m.golOspite ? 'casa' : 'ospite'
    if (m.rigoriCasa != null && m.rigoriCasa !== m.rigoriOspite) {
        return m.rigoriCasa > m.rigoriOspite ? 'casa' : 'ospite'
    }
    return null
}

export const codice = (sq) => (sq ? sq.codice || sq.nome?.slice(0, 3).toUpperCase() || '?' : null)

// Tabellone: totale se il confronto è concluso, altrimenti l'andata (o lo stato dopo andata e ritorno)
export const risultatoConfronto = (m) => {
    if (!m) return null
    if (m.conclusa) return { casa: m.golCasa, ospite: m.golOspite, etichetta: m.decisaDa ?? null }
    if ((m.andata && m.ritorno) || m.gara) return { casa: m.golCasa, ospite: m.golOspite, etichetta: 'Spareggio' }
    if (m.andata) return { casa: m.andata.golCasa, ospite: m.andata.golOspite, etichetta: 'Andata' }
    return null
}

// Calendario: una colonna per gara giocata, con il totale (tot = true) in evidenza
export const colonneConfronto = (m) => {
    const gare = [['And.', m.andata], ['Rit.', m.ritorno], ['Gara', m.gara], ['Spar.', m.spareggio]].filter(([, g]) => g)

    // Dati senza dettaglio (gironi, vecchi risultati): una sola colonna con il risultato
    if (gare.length === 0) {
        return m.conclusa ? [{ label: 'Ris.', casa: m.golCasa, ospite: m.golOspite, tot: true }] : []
    }

    const colonne = gare.map(([label, g]) => ({ label, casa: g.golCasa, ospite: g.golOspite }))

    if (m.andata && m.ritorno) {
        colonne.splice(2, 0, {
            label: 'Tot.',
            casa: m.andata.golCasa + m.ritorno.golCasa,
            ospite: m.andata.golOspite + m.ritorno.golOspite,
            tot: true,
        })
    } else {
        // Solo andata o gara unica: quel risultato è già il risultato del confronto
        const principale = colonne.find((c) => c.label === 'And.' || c.label === 'Gara')
        if (principale) principale.tot = true
    }
    return colonne
}