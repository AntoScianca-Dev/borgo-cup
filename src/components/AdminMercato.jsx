import { useState, useMemo } from 'react'

// Importazione dati JSON
import squadreData from '../assets/data/squadre.json'
import calciatoriData from '../assets/data/calciatori.json'
import roseData from '../assets/data/rose.json'

// Configurazione Ruoli con Colori Personalizzati
const RUOLI_CONFIG = [
    { titolo: 'Portieri', codice: 'P', color: 'bg-amber-200 text-amber-900 border-amber-400' },
    { titolo: 'Difensori', codice: 'D', color: 'bg-green-200 text-green-900 border-green-400' },
    { titolo: 'Centrocampisti', codice: 'C', color: 'bg-blue-200 text-blue-900 border-blue-400' },
    { titolo: 'Attaccanti', codice: 'A', color: 'bg-red-200 text-red-900 border-red-400' },
]

// Mappa per definire l'ordine dei ruoli (P -> D -> C -> A)
const RUOLO_ORDER = { P: 1, D: 2, C: 3, A: 4 }

// Helper per ottenere lo stile del badge ruolo
const getRoleBadge = (ruoloCodice) => {
    const codeUpper = (ruoloCodice || '').toUpperCase()
    const found = RUOLI_CONFIG.find((r) => r.codice === codeUpper)
    const colorClass = found ? found.color : 'bg-gray-200 text-gray-800 border-gray-400'
    
    return (
        <span className={`inline-flex items-center justify-center px-2 py-0.5 border rounded-md text-xs font-black uppercase tracking-wide ${colorClass}`}>
        {codeUpper}
        </span>
    )
}

// Calendario Ufficiale delle Sessioni di Mercato
const SESSIONS = [
    {
        id: 1,
        nome: '1ª Sessione di Mercato',
        start: new Date('2026-10-06T00:01:00'),
        end: new Date('2026-10-08T23:59:59'),
    },
    {
        id: 2,
        nome: '2ª Sessione di Mercato',
        start: new Date('2026-12-08T00:01:00'),
        end: new Date('2026-12-10T23:59:59'),
    },
    {
        id: 3,
        nome: '3ª Sessione di Mercato',
        start: new Date('2027-02-09T00:01:00'),
        end: new Date('2027-02-11T23:59:59'),
    },
]

export default function AdminMercato() {
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

    // Gestione autenticazione con persistenza in sessionStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('admin_authenticated') === 'true'
    })
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    // Selezione della Squadra
    const [selectedSquadraId, setSelectedSquadraId] = useState('')

    // Lista dei cambi correnti: [{ id: timestamp, venduto: calciatoreObj, acquistato: calciatoreObj | null }]
    const [cambi, setCambi] = useState([])

    // Normalizzazione dati
    const squadre = useMemo(() => {
        if (Array.isArray(squadreData)) return squadreData
        return squadreData?.squadre || squadreData?.data || []
    }, [])

    const tuttiCalciatori = useMemo(() => {
        if (Array.isArray(calciatoriData)) return calciatoriData
        return calciatoriData?.calciatori || calciatoriData?.data || []
    }, [])

    // Mappa di lookup rapido per i calciatori (ID -> Calciatore)
    const calciatoriMap = useMemo(() => {
        const map = new Map()
        tuttiCalciatori.forEach((c) => {
        if (c && c.id !== undefined) {
            map.set(String(c.id), c)
        }
        })
        return map
    }, [tuttiCalciatori])

    // Stato delle sessioni di mercato
    const now = new Date()
    const sessionsWithStatus = useMemo(() => {
        return SESSIONS.map((session) => {
        let status = 'In attesa'
        let color = 'bg-yellow-50 text-yellow-800 border-yellow-300'

        if (now >= session.start && now <= session.end) {
            status = 'Attiva'
            color = 'bg-green-50 text-green-800 border-green-300 font-bold'
        } else if (now > session.end) {
            status = 'Terminata'
            color = 'bg-red-50 text-red-800 border-red-300'
        }

        return { ...session, status, color }
        })
    }, [now])

    // Login Handler
    const handleLogin = (e) => {
        e.preventDefault()
        if (passwordInput === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        sessionStorage.setItem('admin_authenticated', 'true')
        setPasswordError(false)
        } else {
        setPasswordError(true)
        }
    }

    // Logout Handler
    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem('admin_authenticated')
    }

    // Dettagli squadra selezionata
    const squadraSelezionata = useMemo(() => {
        return squadre.find((s) => String(s.id) === String(selectedSquadraId))
    }, [selectedSquadraId, squadre])

    // Lettura e parsing della rosa reale da rose.json con ORDINAMENTO (Ruolo P,D,C,A e Quotazione Decrescente)
    const rosaSquadra = useMemo(() => {
        if (!selectedSquadraId || !roseData?.rose) return []

        const squadraInRose = roseData.rose.find(
        (item) => String(item.id) === String(selectedSquadraId)
        )

        if (!squadraInRose || !squadraInRose.rosa || squadraInRose.rosa.length === 0) {
        return []
        }

        const rosaSlots = squadraInRose.rosa[0]
        const listaGiocatori = []

        Object.keys(rosaSlots).forEach((slotKey) => {
        const arr = rosaSlots[slotKey]
        if (Array.isArray(arr)) {
            arr.forEach((g) => {
            const infoAnagrafica = calciatoriMap.get(String(g.id)) || {}

            const ruolo = (
                infoAnagrafica.ruolo || slotKey.charAt(0)
            ).toUpperCase()

            const quotazioneAttuale =
                infoAnagrafica.quotazione ?? g.costo ?? 0

            listaGiocatori.push({
                id: g.id,
                nome: g.nome || infoAnagrafica.nome || 'Sconosciuto',
                ruolo: ruolo,
                slot: slotKey,
                squadra: squadraSelezionata?.nome || '',
                costoOriginale: g.costo ?? 0,
                quotazioneAttuale: Number(quotazioneAttuale),
            })
            })
        }
        })

        // Ordinamento: Prima per Ruolo (P, D, C, A) e poi per Quotazione più alta
        return listaGiocatori.sort((a, b) => {
        const orderA = RUOLO_ORDER[a.ruolo] || 99
        const orderB = RUOLO_ORDER[b.ruolo] || 99

        if (orderA !== orderB) {
            return orderA - orderB
        }
        return b.quotazioneAttuale - a.quotazioneAttuale
        })
    }, [selectedSquadraId, calciatoriMap, squadraSelezionata])

    // Giocatori già selezionati per la vendita
    const idGiocatoriInVendita = useMemo(() => {
        return cambi.map((c) => c.venduto?.id).filter(Boolean)
    }, [cambi])

    // Aggiungi un nuovo cambio (fino a max 7)
    const handleAddVendita = (player) => {
        if (cambi.length >= 7) {
        alert('Hai raggiunto il limite massimo di 7 cambi per questa sessione!')
        return
        }

        setCambi([
        ...cambi,
        {
            id: Date.now(),
            venduto: player,
            acquistato: null,
        },
        ])
    }

    // Rimuovi una vendita
    const handleRemoveCambio = (cambioId) => {
        setCambi(cambi.filter((c) => c.id !== cambioId))
    }

    // Assegna/Modifica il calciatore da acquistare
    const handleSelectAcquisto = (cambioId, player) => {
        setCambi(
        cambi.map((c) => (c.id === cambioId ? { ...c, acquistato: player } : c))
        )
    }

    // Calcolo Totali Economici
    const creditiResidui = squadraSelezionata?.creditiResidui || 0

    const totaleVendite = useMemo(() => {
        return cambi.reduce(
        (acc, curr) => acc + (curr.venduto?.quotazioneAttuale || 0),
        0
        )
    }, [cambi])

    const totaleAcquisti = useMemo(() => {
        return cambi.reduce(
        (acc, curr) =>
            acc +
            (curr.acquistato?.quotazione ||
            curr.acquistato?.quotazioneAttuale ||
            0),
        0
        )
    }, [cambi])

    const creditiTotaliDisponibili = creditiResidui + totaleVendite
    const saldoFinale = creditiTotaliDisponibili - totaleAcquisti
    const isBilancioInRosso = totaleAcquisti > creditiTotaliDisponibili

    // Schermata di Login
    if (!isAuthenticated) {
        return (
        <div className="max-w-md mx-auto my-8 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-sky-900 text-center mb-6">
                🔒 Accesso Area Admin
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Password Admin
                </label>
                <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                    placeholder="••••••••"
                />
                {passwordError && (
                    <p className="text-red-500 text-xs mt-1">Password errata!</p>
                )}
                </div>

                <button
                type="submit"
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
                >
                Accedi
                </button>
            </form>
            </div>
        </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Header Admin */}
        <div className="flex justify-between items-center bg-sky-900 text-white p-4 sm:p-6 rounded-2xl shadow-md">
            <div>
            <h1 className="text-lg sm:text-2xl font-bold">Gestione Mercato</h1>
            <p className="text-[11px] sm:text-xs text-sky-200">Pannello di Controllo Lega</p>
            </div>
            <button
            onClick={handleLogout}
            className="bg-sky-800 hover:bg-sky-700 text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition"
            >
            Esci
            </button>
        </div>

        {/* Sezione Stato Sessioni di Mercato */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📅</span> Sessioni di Mercato
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sessionsWithStatus.map((s) => (
                <div
                key={s.id}
                className={`p-3 rounded-xl border ${s.color} space-y-1 text-xs`}
                >
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{s.nome}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-white/70">
                    {s.status}
                    </span>
                </div>
                <p className="opacity-80">
                    Inizio: {s.start.toLocaleString('it-IT')}
                </p>
                <p className="opacity-80">
                    Fine: {s.end.toLocaleString('it-IT')}
                </p>
                </div>
            ))}
            </div>
        </div>

        {/* Selezione Squadra */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <label className="block font-bold text-gray-800 text-base sm:text-lg">
            1. Seleziona la Squadra
            </label>
            <select
            value={selectedSquadraId}
            onChange={(e) => {
                setSelectedSquadraId(e.target.value)
                setCambi([])
            }}
            className="w-full sm:w-80 px-3 py-2.5 border rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-sky-500"
            >
            <option value="">-- Scegli la squadra --</option>
            {squadre.map((sq) => (
                <option key={sq.id} value={sq.id}>
                {sq.nome}
                </option>
            ))}
            </select>
        </div>

        {squadraSelezionata && (
            <div className="grid lg:grid-cols-3 gap-6">
            {/* Colonna Sinistra e Centrale: Gestione Cambi */}
            <div className="lg:col-span-2 space-y-6">
                {/* Seleziona Calciatore da Vendere */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    Vendi Calciatori dalla Rosa ({cambi.length}/7)
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                    id="selectVendita"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs sm:text-sm"
                    defaultValue=""
                    >
                    <option value="" disabled>
                        -- Seleziona un giocatore da vendere --
                    </option>
                    {rosaSquadra
                        .filter((p) => !idGiocatoriInVendita.includes(p.id))
                        .map((p) => (
                        <option key={`${p.slot}-${p.id}`} value={p.id}>
                            [{p.ruolo}] {p.nome} - Quotazione: {p.quotazioneAttuale} cr.
                        </option>
                        ))}
                    </select>
                    <button
                    onClick={() => {
                        const el = document.getElementById('selectVendita')
                        const selectedPlayer = rosaSquadra.find(
                        (p) => String(p.id) === el.value
                        )
                        if (selectedPlayer) {
                        handleAddVendita(selectedPlayer)
                        el.value = ''
                        }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition w-full sm:w-auto"
                    >
                    + Vendi
                    </button>
                </div>
                </div>

                {/* Lista degli Slot di Cambio Operativi */}
                <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                    Cambi Attivi nella Sessione
                </h3>

                {cambi.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed text-gray-400 text-xs sm:text-sm">
                    Nessun giocatore selezionato per la vendita.
                    </div>
                )}

                {cambi.map((cambio, index) => {
                    const idGiocatoriInRosa = rosaSquadra.map((p) => p.id)

                    const idAcquistatiAttualmente = cambi
                    .map((c) => c.acquistato?.id)
                    .filter(Boolean)

                    // Calciatori filtrati per ruolo e ORDINATI DIRETTAMENTE PER QUOTAZIONE PIÙ ALTA
                    const opzioniAcquisto = tuttiCalciatori
                    .filter((c) => {
                        const ruoloCalciatore = (c.ruolo || '').toUpperCase()
                        return (
                        ruoloCalciatore === cambio.venduto.ruolo &&
                        !idGiocatoriInRosa.includes(c.id) &&
                        !idAcquistatiAttualmente.includes(c.id) &&
                        c.id !== cambio.venduto.id
                        )
                    })
                    .sort((a, b) => {
                        const quotA = a.quotazione ?? a.quotazioneAttuale ?? 0
                        const quotB = b.quotazione ?? b.quotazioneAttuale ?? 0
                        return quotB - quotA
                    })

                    return (
                    <div
                        key={cambio.id}
                        className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3"
                    >
                        <div className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                            Cambio #{index + 1}
                            </span>
                            {getRoleBadge(cambio.venduto.ruolo)}
                        </div>
                        <button
                            onClick={() => handleRemoveCambio(cambio.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                            ✕ Annulla
                        </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* VENDITA */}
                        <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 space-y-1">
                            <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                                CEDUTO
                            </span>
                            {getRoleBadge(cambio.venduto.ruolo)}
                            </div>
                            <p className="font-bold text-gray-800 text-sm">
                            {cambio.venduto.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                            Slot: {cambio.venduto.slot} • Incasso:{' '}
                            <span className="font-bold text-red-700">
                                +{cambio.venduto.quotazioneAttuale} cr.
                            </span>
                            </p>
                        </div>

                        {/* ACQUISTO */}
                        <div className="bg-green-50/60 p-3 rounded-xl border border-green-100 space-y-2">
                            <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                                ACQUISTATO
                            </span>
                            {getRoleBadge(cambio.venduto.ruolo)}
                            </div>

                            <select
                            value={cambio.acquistato?.id || ''}
                            onChange={(e) => {
                                const player = tuttiCalciatori.find(
                                (p) => String(p.id) === e.target.value
                                )
                                handleSelectAcquisto(cambio.id, player || null)
                            }}
                            className="w-full p-2 border rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-green-500"
                            >
                            <option value="">
                                -- Seleziona Acquisto ({cambio.venduto.ruolo}) --
                            </option>
                            {opzioniAcquisto.map((p) => {
                                const costoAcquisto =
                                p.quotazione || p.quotazioneAttuale || 0
                                return (
                                <option key={p.id} value={p.id}>
                                    {p.nome} ({costoAcquisto} cr.)
                                </option>
                                )
                            })}
                            </select>

                            {/* VISUALIZZAZIONE GIOCATORE SCELTO */}
                            {cambio.acquistato ? (
                            <div className="p-2 bg-white/80 rounded-lg border border-green-200 mt-1 space-y-0.5">
                                <p className="font-bold text-xs text-gray-900">
                                ⚽ {cambio.acquistato.nome}
                                </p>
                                <p className="text-[11px] text-gray-600">
                                Costo Acquisto:{' '}
                                <span className="font-bold text-green-700">
                                    -
                                    {cambio.acquistato.quotazione ||
                                    cambio.acquistato.quotazioneAttuale ||
                                    0}{' '}
                                    cr.
                                </span>
                                </p>
                            </div>
                            ) : (
                            <p className="text-[11px] text-gray-400 italic">
                                Nessun calciatore ancora selezionato
                            </p>
                            )}
                        </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>

            {/* Colonna Destra: Riepilogo Finanziario */}
            <div className="space-y-6">
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 lg:sticky lg:top-6 space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-3 text-base sm:text-lg">
                    Riepilogo Bilancio Sessione
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between text-gray-600">
                    <span>Crediti Residui Iniziali:</span>
                    <span className="font-bold">{creditiResidui} cr.</span>
                    </div>

                    <div className="flex justify-between text-green-700">
                    <span>Totale Incasso Vendite:</span>
                    <span className="font-bold">+{totaleVendite} cr.</span>
                    </div>

                    <div className="flex justify-between text-sky-900 font-bold border-t pt-2">
                    <span>Disponibilità Totale:</span>
                    <span>{creditiTotaliDisponibili} cr.</span>
                    </div>

                    <div className="flex justify-between text-red-600 border-b pb-3">
                    <span>Totale Spesa Acquisti:</span>
                    <span className="font-bold">-{totaleAcquisti} cr.</span>
                    </div>

                    {/* Saldo Finale */}
                    <div
                    className={`p-4 rounded-xl text-center space-y-1 ${
                        isBilancioInRosso
                        ? 'bg-red-100 text-red-900 border border-red-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                    >
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                        Saldo Crediti Finale
                    </span>
                    <span className="text-xl sm:text-2xl font-black">
                        {saldoFinale} cr.
                    </span>
                    {isBilancioInRosso && (
                        <p className="text-[11px] font-bold text-red-700 mt-1">
                        ⚠️ Bilancio in rosso! Spesa superiore alla disponibilità.
                        </p>
                    )}
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    )
}