import { useState, useMemo, useRef } from 'react'
import { toPng } from 'html-to-image'

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

const RUOLO_ORDER = { P: 1, D: 2, C: 3, A: 4 }

const getRoleBadge = (ruoloCodice) => {
    const codeUpper = (ruoloCodice || '').toUpperCase()
    const found = RUOLI_CONFIG.find((r) => r.codice === codeUpper)
    const colorClass = found ? found.color : 'bg-gray-200 text-gray-800 border-gray-400'

    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 border rounded text-[10px] font-black uppercase ${colorClass}`}>
        {codeUpper}
        </span>
    )
}

const SESSIONS = [
    {
        id: 1,
        nome: '1ª Sessione di Mercato',
        start: new Date('2026-09-26T00:01:00'),
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

    // Ref specifica per l'esportazione dell'immagine
    const exportRef = useRef(null)
    const [isExporting, setIsExporting] = useState(false)

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('admin_authenticated') === 'true'
    })
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    const [selectedSquadraId, setSelectedSquadraId] = useState('')
    const [cambi, setCambi] = useState([])

    const squadre = useMemo(() => {
        if (Array.isArray(squadreData)) return squadreData
        return squadreData?.squadre || squadreData?.data || []
    }, [])

    const tuttiCalciatori = useMemo(() => {
        if (Array.isArray(calciatoriData)) return calciatoriData
        return calciatoriData?.calciatori || calciatoriData?.data || []
    }, [])

    const calciatoriMap = useMemo(() => {
        const map = new Map()
        tuttiCalciatori.forEach((c) => {
        if (c && c.id !== undefined) {
            map.set(String(c.id), c)
        }
        })
        return map
    }, [tuttiCalciatori])

    const sessionsWithStatus = useMemo(() => {
        const now = new Date()
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
    }, [])

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

    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem('admin_authenticated')
    }

    const squadraSelezionata = useMemo(() => {
        return squadre.find((s) => String(s.id) === String(selectedSquadraId))
    }, [selectedSquadraId, squadre])

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
            const ruolo = (infoAnagrafica.ruolo || slotKey.charAt(0)).toUpperCase()
            const quotazioneAttuale = infoAnagrafica.quotazione ?? g.costo ?? 0
            const squadraA = infoAnagrafica.squadraA 

            listaGiocatori.push({
                id: g.id,
                nome: g.nome || infoAnagrafica.nome || 'Sconosciuto',
                ruolo: ruolo,
                slot: slotKey,
                squadraA: squadraA,
                squadra: squadraSelezionata?.nome || '',
                costoOriginale: g.costo ?? 0,
                quotazioneAttuale: Number(quotazioneAttuale),
            })
            })
        }
        })

        return listaGiocatori.sort((a, b) => {
        const orderA = RUOLO_ORDER[a.ruolo] || 99
        const orderB = RUOLO_ORDER[b.ruolo] || 99
        if (orderA !== orderB) return orderA - orderB
        return b.quotazioneAttuale - a.quotazioneAttuale
        })
    }, [selectedSquadraId, calciatoriMap, squadraSelezionata])

    const idGiocatoriInVendita = useMemo(() => {
        return cambi.map((c) => c.venduto?.id).filter(Boolean)
    }, [cambi])

    const handleAddVendita = (player) => {
        if (cambi.length >= 7) {
        alert('Hai raggiunto il limite massimo di 7 cambi!')
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

    const handleRemoveCambio = (cambioId) => {
        setCambi(cambi.filter((c) => c.id !== cambioId))
    }

    const handleSelectAcquisto = (cambioId, player) => {
        setCambi(
        cambi.map((c) => (c.id === cambioId ? { ...c, acquistato: player } : c))
        )
    }

    // Totali Economici
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

    // Estrazione liste ordinate per l'immagine riepilogativa
    const listaGiocatoriCeduti = useMemo(() => {
        return cambi.map((c) => c.venduto).filter(Boolean)
    }, [cambi])

    const listaGiocatoriAcquistati = useMemo(() => {
        return cambi.map((c) => c.acquistato).filter(Boolean)
    }, [cambi])

    // Download dell'immagine generata dal container dedicato exportRef
    const handleDownloadImage = async () => {
        if (!exportRef.current) return

        try {
        setIsExporting(true)

        const dataUrl = await toPng(exportRef.current, {
            cacheBust: true,
            // backgroundColor: '#0f172a', // Sfondo scuro ed elegante (Slate-900)
            pixelRatio: 2,
        })

        const link = document.createElement('a')
        const nomeSquadraClean = (squadraSelezionata?.nome || 'squadra')
            .toLowerCase()
            .replace(/\s+/g, '_')

        link.download = `riepilogo_mercato_${nomeSquadraClean}.png`
        link.href = dataUrl
        link.click()
        } catch (err) {
        console.error('Errore durante la generazione dell\'immagine:', err)
        alert('Impossibile generare l\'immagine. Riprova!')
        } finally {
        setIsExporting(false)
        }
    }

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
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-sky-500 text-sm"
                    placeholder="••••••••"
                />
                {passwordError && (
                    <p className="text-red-500 text-xs mt-1">Password errata!</p>
                )}
                </div>

                <button
                type="submit"
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl transition text-sm"
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

            {/* Stato Sessioni */}
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
                        <p className="opacity-80">Inizio: {s.start.toLocaleString('it-IT')}</p>
                        <p className="opacity-80">Fine: {s.end.toLocaleString('it-IT')}</p>
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
                <div className="space-y-6">
                    {/* Pulsante di Esportazione */}
                    <div className="flex justify-end items-center">
                        <button
                        onClick={handleDownloadImage}
                        disabled={isExporting || cambi.length === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                            isExporting || cambi.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-95'
                        }`}
                        >
                            <span>{isExporting ? '⏳ Generazione...' : '📷 Scarica Card Grafica'}</span>
                        </button>
                    </div>

                    <div className='bg-sky-900 text-white p-4 rounded-xl flex justify-between items-center shadow-sm'>
                        <div>
                            <h2 className="text-xl pb-1.5 sm:text-2xl font-black">
                                Riepilogo Operazioni: <br /> {squadraSelezionata.nome}
                            </h2>
                            <p className="text-sky-200">
                                💠 {SESSIONS.at(0).nome} <br /> 
                                💠 Cambi registrati: {cambi.length}/7
                            </p>
                        </div>
                    </div>

                    {/* INTERFACCIA OPERATIVA DI EDITING (Interattiva per l'Utente) */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Selezione Calciatore da Vendere */}
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                                Vendi Calciatori dalla Rosa
                                </h3>
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
                                            [{p.ruolo}] {p.nome} | {p.squadraA.slice(0,3).toUpperCase()} | {p.quotazioneAttuale} cr.
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

                            {/* Lista dei Cambi in Corso */}
                            <div className="space-y-4">
                                {cambi.length === 0 && (
                                <div className="text-center py-8 bg-white rounded-2xl border border-dashed text-gray-400 text-xs sm:text-sm">
                                    Nessun giocatore selezionato per la vendita.
                                </div>
                                )}

                                {cambi.map((cambio, index) => {
                                const idGiocatoriInRosa = rosaSquadra.map((p) => p.id)
                                const idAcquistatiAttualmente = cambi
                                    .map((c) => c.acquistato?.id)
                                    .filter(Boolean)

                                const opzioniAcquisto = tuttiCalciatori
                                    .filter((c) => {
                                    const ruoloCalciatore = (c.ruolo || '').toUpperCase()
                                    return (
                                        ruoloCalciatore === cambio.venduto.ruolo &&
                                        !idGiocatoriInRosa.includes(c.id) &&
                                        !idAcquistatiAttualmente.includes(c.id) &&
                                        c.id !== cambio.venduto.id &&
                                        c.stato !== 'svincolato'
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
                                            <div className="bg-red-50/60 p-1.5 rounded-xl border border-red-100 space-y-1">
                                                <div className="text-xs font-bold text-red-600 uppercase tracking-wider text-center">
                                                    VENDITA
                                                </div>
                                                <div className="p-2 bg-white/80 rounded-lg border border-red-200 mt-1 space-y-0.5">
                                                    <div className="flex items-center">
                                                        <span className='w-8'>
                                                            {getRoleBadge(cambio.venduto.ruolo)}
                                                        </span>
                                                        <p className="font-bold text-gray-800 text-xl">
                                                        {cambio.venduto.nome}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                    💠 Incasso Vendita:{' '}
                                                    <span className="font-bold text-red-700">
                                                        +{cambio.venduto.quotazioneAttuale} cr.
                                                    </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ACQUISTO */}
                                            <div className="bg-green-50/60 p-3 rounded-xl border border-green-100 space-y-2">
                                                <div className="text-xs font-bold text-green-600 uppercase text-center">
                                                    ACQUISTO
                                                </div>
                                                <select
                                                    value={cambio.acquistato?.id || ''}
                                                    onChange={(e) => {
                                                    const player = tuttiCalciatori.find(
                                                        (p) => String(p.id) === e.target.value
                                                    )
                                                    handleSelectAcquisto(cambio.id, player || null)
                                                    }}
                                                    className="w-full p-2 border rounded-lg text-xs font-medium bg-white"
                                                >
                                                    <option value="">
                                                    -- Seleziona Acquisto ({cambio.venduto.ruolo}) --
                                                    </option>
                                                    {opzioniAcquisto.map((p) => {
                                                        const costoAcquisto =
                                                        p.quotazione || p.quotazioneAttuale || 0
                                                        const squadra = p.squadraA ? p.squadraA.slice(0, 3).toUpperCase() : ''
                                                        const padding = 30 - p.nome.length > 0 ? 30 - p.nome.length : 10
                                                        return (
                                                        <option key={p.id} value={p.id}>
                                                            {p.nome.padEnd(padding, '\u00A0')} | {squadra} | {costoAcquisto} cr.
                                                        </option>
                                                        )
                                                    })}
                                                </select>
                                            
                                                {/* VISUALIZZAZIONE GIOCATORE SCELTO */}
                                                {cambio.acquistato ? (
                                                <div className="p-2 bg-white/80 rounded-lg border border-green-200 mt-1 space-y-0.5">
                                                    <div className="flex items-center">
                                                        <span className='w-8'>
                                                            {getRoleBadge(cambio.venduto.ruolo)}
                                                        </span>
                                                        <p className="font-bold text-xl text-gray-900">
                                                        {cambio.acquistato.nome}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-gray-600">
                                                    💠 Costo Acquisto:{' '}
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

                        {/* Riepilogo Economico */}
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 h-fit space-y-3 text-xl sm:text-sm">
                            <h3 className="font-bold text-gray-800 border-b pb-2 text-base">
                                Bilancio In Tempo Reale
                            </h3>
                            <div className="flex justify-between">
                                <span>Residuo Iniziale:</span>
                                <span className="font-bold">{creditiResidui} cr.</span>
                            </div>
                            <div className="flex justify-between text-green-700">
                                <span>Incasso Vendite:</span>
                                <span className="font-bold">+{totaleVendite} cr.</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Costo Acquisti:</span>
                                <span className="font-bold">-{totaleAcquisti} cr.</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2 text-sky-900 text-xl">
                                <span>Saldo Finale:</span>
                                <span>{saldoFinale} cr.</span>
                            </div>
                        </div>
                    </div>

                    {/* 
                        ====================================================================
                        CARD COMPATTA E DEDICATA UNICAMENTE ALL'ESPORTAZIONE DELL'IMMAGINE 
                        (Posizionata Off-Screen con `position: absolute, left: -9999px`)
                        ====================================================================
                    */}
                    <div className="overflow-hidden h-0 w-0 relative text-2xl">
                        <div
                        ref={exportRef}
                        style={{ width: '650px' }}
                        className="p-6 bg-slate-950 text-white rounded-3xl space-y-5 font-sans"
                        >
                            {/* Header Card */}
                            <div className="flex flex-col justify-between items-center border-b border-slate-700 pb-2">
                                <span className="text-xl uppercase font-bold tracking-widest text-sky-400">
                                    Borgo Cup • Report {SESSIONS.at(0).nome}
                                </span>
                                <div className="flex justify-center items-center">
                                    <img src={`/images/logos/${squadraSelezionata.id}.png`} className='w-15 h-15 p-2' alt={`Logo ${squadraSelezionata.nome}`} />
                                    <h2 className="text-2xl font-black text-white">
                                        {squadraSelezionata.nome}
                                    </h2>
                                </div>
                            </div>

                            <div className="pt-2 border-b border-slate-700 flex justify-between items-center text-xl text-sky-300 w-80 ml-auto">
                                <p>Residuo Iniziale: </p>
                                <p className={`text-xl font-black ${
                                    creditiResidui>0 ? 'text-emerald-400' : ''
                                    }`}>{creditiResidui} cr.
                                </p>
                            </div>

                            {/* GRIGLIA: 1. PRIMA TUTTI I GIOCATORI CEDUTI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b border-red-900/50 pb-1">
                                <h3 className="text-xl font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>🔴</span> GIOCATORI CEDUTI ({listaGiocatoriCeduti.length})
                                </h3>
                                <span className="text-xl font-bold text-red-400">
                                    Totale: +{totaleVendite} cr.
                                </span>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5">
                                {listaGiocatoriCeduti.length === 0 ? (
                                    <p className="text-xl text-slate-500 italic py-1">Nessuna cessione</p>
                                ) : (
                                    listaGiocatoriCeduti.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-xl border border-red-900/30"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(p.ruolo)}
                                            <span className="font-bold text-2xl text-slate-100">{p.nome}</span>
                                            {p.squadraA && (
                                                <span className="text-xl text-sky-300 uppercase">
                                                ({p.squadraA.slice(0, 3)})
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xl font-bold text-red-400">
                                        +{p.quotazioneAttuale} cr.
                                        </span>
                                    </div>
                                    ))
                                )}
                                </div>
                            </div>

                            {/* GRIGLIA: 2. POI TUTTI I GIOCATORI ACQUISTATI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-1">
                                <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>🟢</span> GIOCATORI ACQUISTATI ({listaGiocatoriAcquistati.length})
                                </h3>
                                <span className="text-xl font-bold text-emerald-400">
                                    Totale: -{totaleAcquisti} cr.
                                </span>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5">
                                {listaGiocatoriAcquistati.length === 0 ? (
                                    <p className="text-xl text-slate-500 italic py-1">Nessun acquisto</p>
                                ) : (
                                    listaGiocatoriAcquistati.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-xl border border-emerald-900/30"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(p.ruolo)}
                                            <span className="font-bold text-2xl text-slate-100">{p.nome}</span>
                                            {p.squadraA && (
                                                <span className="text-xl text-sky-300 uppercase">
                                                ({p.squadraA.slice(0, 3)})
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xl font-bold text-emerald-400">
                                        -{p.quotazione || p.quotazioneAttuale || 0} cr.
                                        </span>
                                    </div>
                                    ))
                                )}
                                </div>
                            </div>

                            {/* Footer Card */}
                            <div className="pt-2 border-b border-slate-700 flex justify-between items-center text-xl text-sky-300 w-80 ml-auto">
                                <p>Saldo Finale: </p>
                                <p className={`text-xl font-black ${
                                    isBilancioInRosso ? 'text-red-400' : 'text-emerald-400'
                                    }`}
                                >
                                    {saldoFinale} cr.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}