export const vincitore = (m) => {
    if (!m?.conclusa) return null
    if (m.golCasa !== m.golOspite) return m.golCasa > m.golOspite ? 'casa' : 'ospite'
    if (m.rigoriCasa != null && m.rigoriCasa !== m.rigoriOspite) {
        return m.rigoriCasa > m.rigoriOspite ? 'casa' : 'ospite'
    }
    return null
}

export const codice = (sq) => (sq ? sq.codice || sq.nome?.slice(0, 3).toUpperCase() || '?' : null)