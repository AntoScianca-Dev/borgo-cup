from itertools import count
from utils_cli import chiedi_float_opzionale, input_gol_opzionale, input_int, punti_campionato, sincronizza_competizione

# Struttura ufficiale (stesso ordine letto dal tabellone in CoppaItalia.jsx).
# "giornate" = giornate di Serie A in cui si gioca ogni gara.
TURNI = [
    {"id": "prelim", "nome": "Preliminari", "n": 8, "giornate": {"andata": 8, "ritorno": 11, "spareggio": 12}},
    {"id": "ottavi", "nome": "Ottavi", "n": 8, "giornate": {"andata": 14, "ritorno": 17, "spareggio": 18}},
    {"id": "quarti", "nome": "Quarti", "n": 4, "giornate": {"andata": 20, "ritorno": 23, "spareggio": 24}},
    {"id": "semifinali", "nome": "Semifinali", "n": 2, "giornate": {"andata": 26, "ritorno": 29, "spareggio": 30}},
    {"id": "finale", "nome": "Finale", "n": 1, "giornate": {"gara": 33, "spareggio": 34}},
]
ETICHETTE = {"andata": "Andata", "ritorno": "Ritorno", "gara": "Gara unica"}

# Posizioni in Campionato (dopo la 7ª giornata): preliminari e teste di serie degli ottavi.
# Il preliminare k alimenta l'ottavo k (nello slot "ospite").
PRELIMINARI = [(16, 17), (9, 24), (13, 20), (12, 21), (11, 22), (14, 19), (10, 23), (15, 18)]
TESTE_DI_SERIE = [1, 8, 4, 5, 6, 3, 7, 2]


# --- Utilità --------------------------------------------------

def struttura_vuota():
    return [{"id": t["id"], "nome": t["nome"], "partite": [None] * t["n"]} for t in TURNI]


def assicura_struttura(comp):
    """Porta comp['partecipanti'] sui 5 turni ufficiali con slot fissi (null = vuoto)."""
    esistenti = comp.get("partecipanti") or []
    turni = []
    for i, t in enumerate(TURNI):
        vecchio = esistenti[i] if i < len(esistenti) and isinstance(esistenti[i], dict) else {}
        partite = list(vecchio.get("partite", []))[: t["n"]]
        partite += [None] * (t["n"] - len(partite))
        turni.append({"id": t["id"], "nome": t["nome"], "partite": partite})
    comp["partecipanti"] = turni


def prossimo_id(comp):
    ids = [m["id"] for t in comp["partecipanti"] for m in t["partite"] if m and "id" in m]
    return max(ids, default=0) + 1


def chiedi_scelta(prompt, validi):
    validi = list(validi)
    while True:
        valore = input_int(prompt)
        if valore in validi:
            return valore
        print("❌ Scelta non valida.")


def chiedi_chi_passa(casa, ospite):
    while True:
        scelta = input(f"  Chi passa il turno? (1 = {casa}, 2 = {ospite}, INVIO = ancora da decidere): ").strip()
        if not scelta:
            return None
        if scelta in ("1", "2"):
            return "casa" if scelta == "1" else "ospite"
        print("❌ Inserisci 1, 2 oppure INVIO.")


def descrivi(m):
    if not m:
        return "(da definire)"
    casa = (m.get("squadraCasa") or {}).get("nome", "?")
    ospite = (m.get("squadraOspite") or {}).get("nome", "?")
    testo = f"{casa} – {ospite}"
    if m.get("conclusa"):
        testo += f"   {m['golCasa']}:{m['golOspite']}"
        if m.get("passa"):
            testo += f"  → passa {casa if m['passa'] == 'casa' else ospite} ({m.get('decisaDa', '')})"
    elif "andata" in m or "ritorno" in m or "gara" in m:
        testo += f"   (in corso: {m['golCasa']}:{m['golOspite']})"
    return testo


def stampa_tabellone(comp):
    for t in comp["partecipanti"]:
        print(f"\n{t['nome'].upper()}")
        for k, m in enumerate(t["partite"], start=1):
            print(f"  {k}. {descrivi(m)}")


def vincente_dalla_partita(m):
    if not m or not m.get("conclusa"):
        return None
    if m["golCasa"] != m["golOspite"]:
        return m["squadraCasa"] if m["golCasa"] > m["golOspite"] else m["squadraOspite"]
    if m.get("passa") == "casa":
        return m["squadraCasa"]
    if m.get("passa") == "ospite":
        return m["squadraOspite"]
    return None


# --- Generazione del tabellone --------------------------------

def genera_tabellone(comp, classifiche):
    campionato = next((c for c in classifiche if c.get("nome") == "Campionato"), None)
    partecipanti = (campionato or {}).get("partecipanti", [])
    per_pos = {p["posizione"]: p for p in partecipanti}

    if sorted(per_pos) != list(range(1, 25)):
        print("⚠️ Servono le 24 squadre del Campionato con posizioni da 1 a 24 senza doppioni.")
        return

    print("\nClassifica del Campionato usata per il tabellone:")
    for pos in range(1, 25):
        print(f"  {pos:>2}. {per_pos[pos]['nome']:<25} {per_pos[pos].get('punteggio', 0)}")
    if input("\nÈ la classifica dopo la 7ª giornata? (SI/NO): ").strip().upper() != "SI":
        return

    if any(m for t in comp["partecipanti"] for m in t["partite"]):
        if input("⚠️ Il tabellone esiste già: rigenerarlo cancella tutti i risultati. Continuare? (SI/NO): ").strip().upper() != "SI":
            return

    ids = count(1)

    def squadra(pos):
        return {"id": per_pos[pos]["id"], "nome": per_pos[pos]["nome"]}

    def partita(casa, ospite):
        return {"id": next(ids), "squadraCasa": casa, "squadraOspite": ospite, "conclusa": False}

    turni = struttura_vuota()
    turni[0]["partite"] = [partita(squadra(a), squadra(b)) for a, b in PRELIMINARI]
    turni[1]["partite"] = [partita(squadra(s), None) for s in TESTE_DI_SERIE]  # l'ospite arriva dal preliminare
    comp["partecipanti"] = turni

    print("✅ Tabellone generato.")
    stampa_tabellone(comp)


# --- Avanzamento dei vincenti ---------------------------------

def propaga(comp, i, k, vincente):
    """Mette (o toglie, se None) il vincente della partita k del turno i nello slot del turno successivo."""
    if i + 1 >= len(TURNI):
        return
    successivo = comp["partecipanti"][i + 1]

    # Preliminari -> ospite dell'ottavo k. Dagli ottavi in poi: le partite 2j e 2j+1 alimentano la j.
    idx, lato = (k, "squadraOspite") if i == 0 else (k // 2, "squadraCasa" if k % 2 == 0 else "squadraOspite")
    m = successivo["partite"][idx]

    if m is None:
        if vincente is None:
            return
        m = {"id": prossimo_id(comp), "squadraCasa": None, "squadraOspite": None, "conclusa": False}
        successivo["partite"][idx] = m

    cambia = (m.get(lato) or {}).get("id") != (vincente or {}).get("id")
    if cambia and m.get("conclusa"):
        print("  ⚠️ Il confronto successivo era già concluso: ricontrolla il suo risultato.")

    m[lato] = vincente
    if not m["squadraCasa"] and not m["squadraOspite"] and not m.get("conclusa"):
        successivo["partite"][idx] = None  # slot di nuovo vuoto


# --- Risultati ------------------------------------------------

def decidi_passaggio(m, turno, classifiche):
    """Criteri del regolamento in caso di parità. Ritorna (lato | None, motivo); None = ancora da decidere."""
    casa, ospite = m["squadraCasa"]["nome"], m["squadraOspite"]["nome"]

    if m["golCasa"] != m["golOspite"]:
        return ("casa" if m["golCasa"] > m["golOspite"] else "ospite"), "gol"

    print(f"\n  ⚖️ Parità {m['golCasa']}:{m['golOspite']}: si applicano i criteri del regolamento.")

    # 1. Punti fatti nel confronto
    pc = chiedi_float_opzionale(f"  Punti fatti da {casa} nel confronto (INVIO se non disponibili): ")
    if pc is not None:
        po = chiedi_float_opzionale(f"  Punti fatti da {ospite} nel confronto: ")
        if po is not None and pc != po:
            return ("casa" if pc > po else "ospite"), "punti fatti"

    # 2. Spareggio
    sp = m.get("spareggio") or {}
    attuale = f" [attuale {sp['golCasa']}:{sp['golOspite']}]" if sp else ""
    gc = input_gol_opzionale(
        f"  Spareggio ({turno['giornate']['spareggio']}ª giornata) · gol {casa}{attuale} (INVIO = da giocare/invariato): "
    )
    if gc is None and not sp:
        return None, "spareggio da giocare"
    if gc is None:
        gc, go = sp["golCasa"], sp["golOspite"]
    else:
        go = input_int(f"  Spareggio · gol {ospite}: ")
    m["spareggio"] = {"golCasa": gc, "golOspite": go}
    if gc != go:
        return ("casa" if gc > go else "ospite"), "spareggio"

    # 3. Punti in Campionato (solo per i doppi confronti)
    if turno["id"] != "finale":
        a = punti_campionato(classifiche, m["squadraCasa"]["id"])
        b = punti_campionato(classifiche, m["squadraOspite"]["id"])
        if a is not None and b is not None and a != b:
            return ("casa" if a > b else "ospite"), "punti in campionato"

    print("  Ancora parità: indica chi passa (per la finale lo spareggio va ripetuto).")
    return chiedi_chi_passa(casa, ospite), "decisione manuale"


def registra_confronto(comp, i, k, classifiche):
    turno = TURNI[i]
    m = comp["partecipanti"][i]["partite"][k]
    casa, ospite = m["squadraCasa"]["nome"], m["squadraOspite"]["nome"]
    gare = [g for g in turno["giornate"] if g != "spareggio"]

    print(f"\n{turno['nome']} · {casa} – {ospite}  (INVIO = nessuna modifica)")
    for g in gare:
        att = m.get(g)
        attuale = f" [attuale {att['golCasa']}:{att['golOspite']}]" if att else ""
        gc = input_gol_opzionale(f"  {ETICHETTE[g]} ({turno['giornate'][g]}ª giornata) · gol {casa}{attuale}: ")
        if gc is None:
            continue
        m[g] = {"golCasa": gc, "golOspite": input_int(f"  {ETICHETTE[g]} · gol {ospite}: ")}

    giocate = [m[g] for g in gare if g in m]
    m["golCasa"] = sum(x["golCasa"] for x in giocate)
    m["golOspite"] = sum(x["golOspite"] for x in giocate)
    for chiave in ("passa", "decisaDa"):
        m.pop(chiave, None)

    if len(giocate) < len(gare):
        m["conclusa"] = False
    else:
        if m["golCasa"] != m["golOspite"]:
            m.pop("spareggio", None)
        lato, motivo = decidi_passaggio(m, turno, classifiche)
        m["conclusa"] = lato is not None
        if lato and m["golCasa"] == m["golOspite"]:
            m["passa"], m["decisaDa"] = lato, motivo

    propaga(comp, i, k, vincente_dalla_partita(m))
    print(f"  {'✅' if m['conclusa'] else '⏳'} {descrivi(m)}")


def inserisci_risultato(comp, classifiche):
    print("\nTurni:")
    for n, t in enumerate(TURNI, start=1):
        print(f"  {n}. {t['nome']}")
    i = chiedi_scelta("Seleziona il turno: ", range(1, len(TURNI) + 1)) - 1

    partite = comp["partecipanti"][i]["partite"]
    giocabili = [k for k, m in enumerate(partite) if m and m.get("squadraCasa") and m.get("squadraOspite")]
    if not giocabili:
        print("⚠️ Nessun confronto disponibile: mancano le squadre (genera il tabellone o completa il turno precedente).")
        return

    print(f"\n{TURNI[i]['nome']}:")
    for k in giocabili:
        print(f"  {k + 1}. {descrivi(partite[k])}")
    k = chiedi_scelta("Seleziona la partita: ", [k + 1 for k in giocabili]) - 1
    registra_confronto(comp, i, k, classifiche)


# --- Handler principale ---------------------------------------

def aggiorna_coppa_italia(comp, data_comp, classifiche):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    assicura_struttura(comp)

    giornata = input_int("Inserisci il numero della giornata attuale: ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    while True:
        print("\n  1. Genera il tabellone dalla classifica del Campionato")
        print("  2. Inserisci / aggiorna un confronto")
        print("  3. Mostra il tabellone")
        print("  0. Fine")
        scelta = input("Scelta: ").strip()

        if scelta == "0":
            break
        elif scelta == "1":
            genera_tabellone(comp, classifiche)
        elif scelta == "2":
            inserisci_risultato(comp, classifiche)
        elif scelta == "3":
            stampa_tabellone(comp)
        else:
            print("❌ Scelta non valida.")