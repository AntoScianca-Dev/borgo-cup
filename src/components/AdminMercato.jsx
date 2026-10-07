import { useState, useMemo, useRef } from 'react'
import { toPng } from 'html-to-image'
import SelezionaGiocatoreModale from './SelezionaGiocatoreModale'

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
const MAX_CAMBI = 7

const getRoleBadge = (ruoloCodice) => {
    const codeUpper = (ruoloCodice || '').toUpperCase()
    const found = RUOLI_CONFIG.find((r) => r.codice === codeUpper)
    const colorClass = found ? found.color : 'bg-gray-200 text-gray-800 border-gray-400'

    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 border rounded w-6 h-6 font-black uppercase ${colorClass}`}>
        {codeUpper}
        </span>
    )
}

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

const getQuot = (p) => Number(p?.quotazione ?? p?.quotazioneAttuale ?? 0)

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

    // Modale di selezione: null | { mode: 'vendita' } | { mode: 'acquisto', cambioId }
    const [picker, setPicker] = useState(null)

    const squadre = useMemo(() => {
        const lista = Array.isArray(squadreData)
            ? squadreData
            : squadreData?.squadre || squadreData?.data || []
        return [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
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

    const sessioniAttive = useMemo(
        () => sessionsWithStatus.filter((s) => s.status === 'Attiva'),
        [sessionsWithStatus]
    )

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

    // --- Azioni sui cambi ---
    const handleAddVendita = (player) => {
        if (cambi.length >= MAX_CAMBI) return
        setCambi((prev) => [...prev, { id: Date.now(), venduto: player, acquistato: null }])
    }

    const handleRemoveCambio = (cambioId) => {
        setCambi((prev) => prev.filter((c) => c.id !== cambioId))
    }

    const handleSelectAcquisto = (cambioId, player) => {
        setCambi((prev) =>
            prev.map((c) => (c.id === cambioId ? { ...c, acquistato: player } : c))
        )
    }

    // --- Dati per la modale di selezione ---
    const closePicker = () => setPicker(null)

    const pickerData = useMemo(() => {
        if (!picker) return null

        if (picker.mode === 'vendita') {
            return {
                titolo: 'Scegli chi vendere',
                sottotitolo: 'Rosa attuale',
                showRuolo: true,
                giocatori: rosaSquadra.filter((p) => !idGiocatoriInVendita.includes(p.id)),
                onSelect: handleAddVendita,
            }
        }

        const cambio = cambi.find((c) => c.id === picker.cambioId)
        if (!cambio) return null

        const idRosa = rosaSquadra.map((p) => p.id)
        const idAcquistati = cambi
            .filter((c) => c.id !== cambio.id)
            .map((c) => c.acquistato?.id)
            .filter(Boolean)

        return {
            titolo: `Scegli l'acquisto`,
            sottotitolo: `Ruolo: ${cambio.venduto.ruolo} · al posto di ${cambio.venduto.nome}`,
            showRuolo: false,
            giocatori: tuttiCalciatori
                .filter(
                    (c) =>
                        (c.ruolo || '').toUpperCase() === cambio.venduto.ruolo &&
                        !idRosa.includes(c.id) &&
                        !idAcquistati.includes(c.id) &&
                        c.id !== cambio.venduto.id &&
                        c.stato !== 'svincolato'
                )
                .map((c) => ({ ...c, ruolo: (c.ruolo || '').toUpperCase() })),
            onSelect: (p) => handleSelectAcquisto(cambio.id, p),
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picker, cambi, rosaSquadra, tuttiCalciatori, idGiocatoriInVendita])

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

    // ============================ LOGIN ============================
    if (!isAuthenticated) {
        return (
        <div className="max-w-md mx-auto my-8 px-4">
            <div className="bg-amber-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md">
                <div className="h-20 bg-linear-to-br from-sky-800 to-sky-600" />
                <div className="px-6 pb-6 -mt-10">
                    <div className="w-20 h-20 rounded-full bg-amber-50 shadow-md border-l-4 border-t-4 border-amber-800 flex items-center justify-center text-3xl">
                        🔒
                    </div>
                    <h2 className="mt-3 text-xl font-extrabold text-gray-900 leading-tight">Area Admin</h2>
                    <p className="text-sm text-gray-500 mt-0.5 mb-5">Inserisci la password per gestire il mercato.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                                placeholder="••••••••"
                            />
                            {passwordError && (
                                <p className="text-red-500 text-xs mt-1">Password errata!</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-xl active:scale-95 transition text-sm cursor-pointer"
                        >
                            Accedi
                        </button>
                    </form>
                </div>
            </div>
        </div>
        )
    }

    // ============================ PANNELLO ============================
    return (
        <div className="space-y-8">
            {/* Banner (stesso stile della pagina Squadre) */}
            <div className="relative text-4xl h-20 tracking-tight flex items-center justify-center py-6 rounded-tl-4xl rounded-br-4xl font-extrabold text-sky-50 text-shadow-2xs text-shadow-sky-950 bg-linear-to-br from-sky-800 to-sky-950">
                <button
                    onClick={handleLogout}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition cursor-pointer text-shadow-none"
                >
                    Esci
                </button>
            </div>
            <h1 className="text-4xl font-medium text-center py-0 mt-0 text-sky-800">Gestione Mercato</h1>

            {/* Sessioni */}
            <div className="grid sm:grid-cols-3 gap-6">
                {sessionsWithStatus.map((s) => (
                    <div
                        key={s.id}
                        className="w-full max-w-80 mx-auto bg-amber-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md"
                    >
                        <div className={`px-5 py-3 border-b ${s.color} flex justify-between items-center`}>
                            <span className="font-bold text-sm">{s.nome}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-white/70">
                                {s.status}
                            </span>
                        </div>
                        <div className="px-5 py-3 text-xs text-gray-600 space-y-0.5">
                            <p>Inizio: {s.start.toLocaleString('it-IT')}</p>
                            <p>Fine: {s.end.toLocaleString('it-IT')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selezione Squadra */}
            <div className="max-w-xl mx-auto bg-amber-50 rounded-2xl border border-gray-100 shadow-md p-5 space-y-3">
                <label htmlFor="selectSquadra" className="block font-extrabold text-gray-900 text-lg">
                    Seleziona la squadra
                </label>
                <select
                    id="selectSquadra"
                    value={selectedSquadraId}
                    onChange={(e) => {
                        setSelectedSquadraId(e.target.value)
                        setCambi([])
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                    {/* Scheda squadra (come le card di Squadre) */}
                    <div className="bg-amber-50 rounded-2xl overflow-hidden border border-gray-100 shadow-md">
                        <div
                            className="h-20"
                            style={{ background: `linear-gradient(135deg, ${squadraSelezionata.border}, ${squadraSelezionata.border}99)` }}
                        />
                        <div className="px-5 pb-5 -mt-10">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div className="w-20 h-20 rounded-full bg-amber-50 shadow-md border-l-4 border-t-4 border-amber-800 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={`/images/logos/${squadraSelezionata.id}.png`}
                                        alt={`Logo ${squadraSelezionata.nome}`}
                                        className="w-14 h-14 object-contain"
                                    />
                                </div>
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isExporting || cambi.length === 0}
                                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                                        isExporting || cambi.length === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer'
                                    }`}
                                >
                                    {isExporting ? '⏳ Generazione...' : '📷 Scarica card'}
                                </button>
                            </div>

                            <h2 className="mt-3 text-xl font-extrabold text-gray-900 leading-tight">
                                {squadraSelezionata.nome}
                            </h2>
                            <p className={`text-sm mt-0.5 ${sessioniAttive.length > 0 ? 'text-gray-500' : 'text-amber-700 font-semibold'}`}>
                                {sessioniAttive.length > 0
                                    ? sessioniAttive.map((s) => s.nome).join(', ')
                                    : 'Sessione mercato di prova'}
                            </p>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="bg-sky-50 rounded-xl p-3 text-center">
                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-sky-600">Cambi</p>
                                    <p className="text-lg font-black text-gray-800">
                                        {cambi.length}<span className="text-xs font-semibold text-gray-500">/{MAX_CAMBI}</span>
                                    </p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                    <p className="text-[11px] uppercase tracking-wide font-semibold text-emerald-600">Crediti residui</p>
                                    <p className="text-lg font-black text-gray-800">
                                        {creditiResidui} <span className="text-xs font-semibold text-gray-500">fc</span>
                                    </p>
                                </div>
                                <div className={`${isBilancioInRosso ? 'bg-red-50' : 'bg-amber-100'} rounded-xl p-3 text-center`}>
                                    <p className={`text-[11px] uppercase tracking-wide font-semibold ${isBilancioInRosso ? 'text-red-600' : 'text-amber-700'}`}>Saldo finale</p>
                                    <p className={`text-lg font-black ${isBilancioInRosso ? 'text-red-600' : 'text-gray-800'}`}>
                                        {saldoFinale} <span className="text-xs font-semibold text-gray-500">fc</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INTERFACCIA OPERATIVA DI EDITING */}
                    <div className="grid lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 space-y-4">
                            {/* Aggiungi vendita */}
                            <button
                                onClick={() => setPicker({ mode: 'vendita' })}
                                disabled={cambi.length >= MAX_CAMBI}
                                className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
                                    cambi.length >= MAX_CAMBI
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-sky-700 text-white hover:bg-sky-800 active:scale-95 cursor-pointer'
                                }`}
                            >
                                {cambi.length >= MAX_CAMBI
                                    ? `Limite di ${MAX_CAMBI} cambi raggiunto`
                                    : '+ Aggiungi un cambio'}
                            </button>

                            {cambi.length === 0 && (
                                <div className="text-center py-10 bg-amber-50 rounded-2xl border border-dashed border-amber-300 text-gray-500 text-sm">
                                    Nessun cambio registrato. Parti scegliendo il calciatore da vendere.
                                </div>
                            )}

                            {cambi.map((cambio, index) => (
                                <div
                                    key={cambio.id}
                                    className="bg-amber-50 rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                                >
                                    <div className="flex justify-between items-center px-4 py-2.5 bg-sky-100 border-b border-sky-200">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-sky-900">Cambio {index + 1}</span>
                                            {getRoleBadge(cambio.venduto.ruolo)}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveCambio(cambio.id)}
                                            className="text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer"
                                        >
                                            ✕ Annulla
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                                        {/* VENDITA */}
                                        <div className="bg-red-50 rounded-xl border border-red-100 p-3 space-y-2">
                                            <p className="text-[11px] uppercase tracking-wide font-semibold text-red-600 text-center">Vendita</p>
                                            <div className="p-2.5 bg-white rounded-lg border border-red-200 space-y-0.5">
                                                <p className="font-extrabold text-gray-900 text-lg leading-tight">
                                                    {cambio.venduto.nome}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(cambio.venduto.squadraA || '').slice(0, 3).toUpperCase()}
                                                    {cambio.venduto.squadraA ? ' · ' : ''}
                                                    Incasso <span className="font-bold text-green-700">+{cambio.venduto.quotazioneAttuale} cr.</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACQUISTO */}
                                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3 space-y-2">
                                            <p className="text-[11px] uppercase tracking-wide font-semibold text-emerald-600 text-center">Acquisto</p>

                                            {cambio.acquistato ? (
                                                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 space-y-0.5">
                                                    <p className="font-extrabold text-gray-900 text-lg leading-tight">
                                                        {cambio.acquistato.nome}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(cambio.acquistato.squadraA || '').slice(0, 3).toUpperCase()}
                                                        {cambio.acquistato.squadraA ? ' · ' : ''}
                                                        Costo <span className="font-bold text-red-600">-{getQuot(cambio.acquistato)} cr.</span>
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic text-center py-3">
                                                    Nessun calciatore ancora selezionato
                                                </p>
                                            )}

                                            <button
                                                onClick={() => setPicker({ mode: 'acquisto', cambioId: cambio.id })}
                                                className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                                            >
                                                {cambio.acquistato ? 'Cambia acquisto' : `Scegli acquisto (${cambio.venduto.ruolo})`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Riepilogo Economico */}
                        <div className="bg-amber-50 rounded-2xl border border-gray-100 shadow-md overflow-hidden lg:sticky lg:top-4">
                            <div className="px-5 py-3 bg-sky-100 border-b border-sky-200">
                                <h3 className="font-extrabold text-sky-900">Bilancio in tempo reale</h3>
                            </div>
                            <div className="p-5 space-y-3 text-sm">
                                <div className="flex justify-between text-gray-700">
                                    <span>Residuo iniziale</span>
                                    <span className="font-bold">{creditiResidui} cr.</span>
                                </div>
                                <div className="flex justify-between text-green-700">
                                    <span>Incasso vendite</span>
                                    <span className="font-bold">+{totaleVendite} cr.</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>Costo acquisti</span>
                                    <span className="font-bold">-{totaleAcquisti} cr.</span>
                                </div>
                                <div className={`flex justify-between font-black border-t border-amber-200 pt-3 text-lg ${isBilancioInRosso ? 'text-red-600' : 'text-sky-900'}`}>
                                    <span>Saldo finale</span>
                                    <span>{saldoFinale} cr.</span>
                                </div>
                                {isBilancioInRosso && (
                                    <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        Gli acquisti superano i crediti disponibili.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modale di selezione giocatore (vendita e acquisto) */}
                    <SelezionaGiocatoreModale
                        isOpen={!!pickerData}
                        onClose={closePicker}
                        onSelect={pickerData?.onSelect || (() => {})}
                        giocatori={pickerData?.giocatori || []}
                        titolo={pickerData?.titolo || ''}
                        sottotitolo={pickerData?.sottotitolo}
                        showRuolo={pickerData?.showRuolo}
                        renderRuolo={getRoleBadge}
                        colore={squadraSelezionata.border}
                    />

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
                        className="p-6 bg-slate-950 text-white space-y-5 font-sans"
                        >
                            {/* Header Card */}
                            <div className="flex flex-col justify-between items-center border-b border-slate-700 pb-2">
                                <span className="text-xl uppercase font-bold tracking-widest text-sky-400">
                                    Borgo Cup • Report {sessionsWithStatus.filter(s => s.status=='Attiva').length>0?
                                    sessionsWithStatus.filter(s => s.status=='Attiva').map(p => p.nome) :
                                    "Sessione Mercato di prova"}
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