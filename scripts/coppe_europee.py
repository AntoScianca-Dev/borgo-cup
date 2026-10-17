from utils_cli import input_int, input_posizione, sincronizza_competizione
from collections import Counter
# -------------------------------------------------------------
# COPPE EUROPEE: Champions, Europa e Conference League
# -------------------------------------------------------------

GIRONI_COPPE = ["A", "B"]
SQUADRE_PER_GIRONE = 4
NOMI_GIORNATE = ["Andata · 1ª", "Andata · 2ª", "Andata · 3ª", "Ritorno · 1ª", "Ritorno · 2ª", "Ritorno · 3ª"]


def _vincenti(n):
    return [(f"V{2 * k + 1}", f"V{2 * k + 2}") for k in range(n)]


# Stessa struttura (e stesso ordine) di CONFIG in CoppaEuropea.jsx: l'indice della partita è l'indice dello slot
FORMATO_COPPE = {
    "Champions League": [("Semifinali", [("1A", "2B"), ("1B", "2A")]), ("Finale", _vincenti(1))],
    "Europa League": [
        ("Quarti di finale", [("1A", "3B"), ("3CHA", "2B"), ("1B", "3A"), ("3CHB", "2A")]),
        ("Semifinali", _vincenti(2)),
        ("Finale", _vincenti(1)),
    ],
    "Conference League": [("Semifinali", [("1A", "2B"), ("1B", "2A")]), ("Finale", _vincenti(1))],
}


def assicura_struttura(comp):
    """Crea, se mancano, i turni dei gironi e del tabellone nell'ordine letto dall'app."""
    comp.setdefault("partecipanti", [])
    per_id = {t["id"]: t for t in comp.setdefault("turni", [])}

    for i, nome in enumerate(NOMI_GIORNATE, start=1):
        per_id.setdefault(f"g{i}", {"id": f"g{i}", "fase": "gironi", "nome": nome, "partite": []})

    for i, (nome, slot) in enumerate(FORMATO_COPPE[comp["nome"]], start=1):
        turno = per_id.setdefault(f"t{i}", {"id": f"t{i}", "fase": "tabellone", "nome": nome, "partite": []})
        turno["partite"] += [None] * (len(slot) - len(turno["partite"]))  # slot vuoti = null

    # L'app legge i turni per posizione: prima i gironi, poi il tabellone
    comp["turni"] = sorted(per_id.values(), key=lambda t: (t.get("fase") != "gironi", t["id"]))


def trova_turno(comp, turno_id):
    return next(t for t in comp["turni"] if t["id"] == turno_id)


def prossimo_id_partita(comp):
    ids = [m["id"] for t in comp["turni"] for m in t["partite"] if m and "id" in m]
    return max(ids, default=0) + 1


def stampa_elenco_squadre(squadre):
    print("\nSquadre disponibili:")
    for sq in squadre:
        print(f"  [{sq['id']}] {sq['nome']}")


def chiedi_squadra(prompt, squadre, ammessi=None, vuoto_ok=False, predefinita=None):
    """Chiede l'ID di una squadra. INVIO = predefinita (se c'è) oppure None (se vuoto_ok)."""
    while True:
        valore = input(prompt).strip()
        if not valore:
            if predefinita is not None:
                return predefinita
            if vuoto_ok:
                return None
        elif valore.isdigit():
            sq = next((s for s in squadre if s["id"] == int(valore)), None)
            if sq and (ammessi is None or sq["id"] in ammessi):
                return sq
        print("❌ ID non valido. Riprova.")


def vincente_partita(m):
    if not m or not m.get("conclusa"):
        return None
    if m["golCasa"] != m["golOspite"]:
        return m["squadraCasa"] if m["golCasa"] > m["golOspite"] else m["squadraOspite"]
    if m.get("passa"):
        return m["squadraCasa"] if m["passa"] == "casa" else m["squadraOspite"]
    return None


def risolvi_etichetta(comp, etichetta, i):
    """Squadra suggerita per uno slot: '1A' = prima del girone A (a girone concluso),
    'V1' = vincente della partita 1 del turno precedente. i = indice (da 1) del turno."""
    if etichetta.startswith("V") and etichetta[1:].isdigit() and i > 1:
        return vincente_partita(trova_turno(comp, f"t{i - 1}")["partite"][int(etichetta[1:]) - 1])

    if len(etichetta) == 2 and etichetta[0].isdigit() and etichetta[1] in GIRONI_COPPE:
        squadre = [p for p in comp["partecipanti"] if p["girone"] == etichetta[1]]
        if squadre and all(p["giocate"] >= (len(squadre) - 1) * 2 for p in squadre):
            return next((p for p in squadre if p["posizione"] == int(etichetta[0])), None)
    return None  # es. 3CHA / 3CHB: vanno indicate a mano


def descrivi_partita(m):
    if not m:
        return "(da inserire)"
    testo = f"{m['squadraCasa']['nome']} – {m['squadraOspite']['nome']}"
    if m.get("conclusa"):
        testo += f"  {m['golCasa']}:{m['golOspite']}"
    return testo


# --- Gironi ---------------------------------------------------

def componi_gironi(comp, squadre):
    if comp["partecipanti"]:
        risposta = input("⚠️ I gironi esistono già: ricomporli azzera classifica e risultati. Continuare? (SI/NO): ")
        if risposta.strip().upper() != "SI":
            return False
        for t in comp["turni"]:
            if t.get("fase") == "gironi":
                t["partite"] = []

    stampa_elenco_squadre(squadre)
    scelte, partecipanti = set(), []

    for girone in GIRONI_COPPE:
        print(f"\n--- Girone {girone} ({SQUADRE_PER_GIRONE} squadre) ---")
        for i in range(1, SQUADRE_PER_GIRONE + 1):
            ammessi = {s["id"] for s in squadre} - scelte
            sq = chiedi_squadra(f"  Squadra {i} (ID): ", squadre, ammessi)
            scelte.add(sq["id"])
            partecipanti.append({
                "id": sq["id"], "nome": sq["nome"], "border": sq.get("border", ""),
                "girone": girone, "posizione": i, "punteggio": 0, "giocate": 0,
                "vinte": 0, "pari": 0, "perso": 0, "gf": 0, "gs": 0,
            })

    comp["partecipanti"] = partecipanti
    print("✅ Gironi composti.")
    return True


# --- Calendario dei gironi ------------------------------------

def giornate_girone(ids):
    """Doppio girone all'italiana (metodo del cerchio): andata e ritorno a campi invertiti."""
    n = len(ids)
    ordine = list(ids)
    andata = []
    for _ in range(n - 1):
        andata.append([(ordine[i], ordine[n - 1 - i]) for i in range(n // 2)])
        ordine = [ordine[0], ordine[-1]] + ordine[1:-1]
    ritorno = [[(o, c) for c, o in giornata] for giornata in andata]
    return andata + ritorno


def calendario_automatico(comp):
    calendario = {}
    for girone in GIRONI_COPPE:
        squadre = sorted((p for p in comp["partecipanti"] if p["girone"] == girone), key=lambda p: p["posizione"])
        ids = [p["id"] for p in squadre]
        if len(ids) >= 2 and len(ids) % 2 == 0:
            calendario[girone] = giornate_girone(ids)
    return calendario


def calendario_manuale(comp):
    specchio = input("Il ritorno ripete l'andata a campi invertiti, nello stesso ordine? (SI/NO): ").strip().upper() == "SI"
    n_giornate = len(NOMI_GIORNATE) // 2 if specchio else len(NOMI_GIORNATE)
    squadre_girone = {g: [p for p in comp["partecipanti"] if p["girone"] == g] for g in GIRONI_COPPE}
    calendario = {g: [] for g in GIRONI_COPPE}

    for n in range(n_giornate):
        print(f"\n=== {NOMI_GIORNATE[n]} ===")
        for girone, squadre in squadre_girone.items():
            ids = {p["id"] for p in squadre}
            print(f"\n--- Girone {girone} ---")
            for p in squadre:
                print(f"  [{p['id']}] {p['nome']}")

            coppie, usate = [], set()
            for k in range(1, len(squadre) // 2 + 1):
                casa = chiedi_squadra(f"  Partita {k} - casa (ID): ", squadre, ids - usate)
                usate.add(casa["id"])
                ospite = chiedi_squadra(f"  Partita {k} - ospite (ID): ", squadre, ids - usate)
                usate.add(ospite["id"])
                coppie.append((casa["id"], ospite["id"]))
            calendario[girone].append(coppie)

    if specchio:
        for giornate in calendario.values():
            giornate.extend([[(o, c) for c, o in giornata] for giornata in giornate])
    return calendario


def verifica_calendario(comp, calendario):
    """Ogni coppia di un girone deve incontrarsi esattamente 2 volte (andata e ritorno)."""
    ok = True
    for girone, giornate in calendario.items():
        n = sum(1 for p in comp["partecipanti"] if p["girone"] == girone)
        incontri = Counter(frozenset(c) for g in giornate for c in g)
        if len(incontri) != n * (n - 1) // 2 or any(v != 2 for v in incontri.values()):
            print(f"⚠️ Girone {girone}: ogni coppia di squadre deve incontrarsi esattamente 2 volte.")
            ok = False
    return ok


def applica_calendario(comp, calendario):
    """Aggiunge le partite programmate (conclusa = False) senza toccare quelle già presenti."""
    nomi = {p["id"]: p["nome"] for p in comp["partecipanti"]}
    aggiunte = 0

    for girone, giornate in calendario.items():
        for n, coppie in enumerate(giornate, start=1):
            turno = trova_turno(comp, f"g{n}")
            for casa, ospite in coppie:
                esiste = any(
                    m.get("girone") == girone and {m["squadraCasa"]["id"], m["squadraOspite"]["id"]} == {casa, ospite}
                    for m in turno["partite"]
                )
                if esiste:
                    continue
                turno["partite"].append({
                    "id": prossimo_id_partita(comp),
                    "girone": girone,
                    "squadraCasa": {"id": casa, "nome": nomi[casa]},
                    "squadraOspite": {"id": ospite, "nome": nomi[ospite]},
                    "conclusa": False,
                })
                aggiunte += 1
    return aggiunte


def definisci_calendario(comp):
    if not comp["partecipanti"]:
        print("⚠️ Prima componi i gironi.")
        return

    print("\nCalendario dei gironi:")
    print("  1. Automatico")
    print("  2. Manuale (copialo dall'app)")
    print("  0. Salta (lo definisci dopo dal menu)")
    scelta = input("Scelta: ").strip()

    if scelta == "1":
        calendario = calendario_automatico(comp)
    elif scelta == "2":
        calendario = calendario_manuale(comp)
    else:
        return

    if not verifica_calendario(comp, calendario) and input("Salvare comunque? (SI/NO): ").strip().upper() != "SI":
        return
    print(f"✅ Calendario definito: {applica_calendario(comp, calendario)} partite programmate.")

def ricalcola_classifica(comp):
    """Rifà le statistiche di tutti i partecipanti da zero a partire dalle partite registrate."""
    stats = {p["id"]: dict(giocate=0, vinte=0, pari=0, perso=0, gf=0, gs=0) for p in comp["partecipanti"]}

    for t in comp["turni"]:
        if t.get("fase") != "gironi":
            continue
        for m in t["partite"]:
            if not m.get("conclusa"):
                continue
            casa, ospite = m["squadraCasa"]["id"], m["squadraOspite"]["id"]
            if casa not in stats or ospite not in stats:
                continue
            for sid, fatti, subiti in ((casa, m["golCasa"], m["golOspite"]), (ospite, m["golOspite"], m["golCasa"])):
                s = stats[sid]
                s["giocate"] += 1
                s["gf"] += fatti
                s["gs"] += subiti
                s["vinte" if fatti > subiti else "perso" if fatti < subiti else "pari"] += 1

    for p in comp["partecipanti"]:
        p.update(stats[p["id"]])
        p["punteggio"] = p["vinte"] * 3 + p["pari"]


def assegna_manuale(squadre):
    while True:
        scelte = {
            p["id"]: input_posizione(f"    Posizione per {p['nome']} (1-{len(squadre)}): ", len(squadre))
            for p in squadre
        }
        if len(set(scelte.values())) == len(squadre):
            for p in squadre:
                p["posizione"] = scelte[p["id"]]
            return
        print("❌ Posizioni duplicate, riprova.")


def assegna_posizioni(comp):
    for girone in GIRONI_COPPE:
        squadre = [p for p in comp["partecipanti"] if p["girone"] == girone]
        if not squadre:
            continue

        ordinate = sorted(squadre, key=lambda p: (p["punteggio"], p["gf"] - p["gs"], p["gf"]), reverse=True)
        print(f"\n--- Girone {girone}: ordine suggerito (punti, differenza reti, gol fatti) ---")
        for i, p in enumerate(ordinate, start=1):
            print(f"  {i}. {p['nome']:<25} {p['punteggio']:>2} pt   GF {p['gf']:>2}  GS {p['gs']:>2}")
        print("  ⚠️ A parità di punti controlla i criteri del regolamento (scontri diretti, ecc.).")

        if input("  Confermi questo ordine? (SI/NO): ").strip().upper() == "SI":
            for i, p in enumerate(ordinate, start=1):
                p["posizione"] = i
        else:
            assegna_manuale(squadre)

    comp["partecipanti"].sort(key=lambda p: (p["girone"], p["posizione"]))


def input_gol_opzionale(prompt):
    while True:
        valore = input(prompt).strip()
        if not valore:
            return None
        if valore.isdigit():
            return int(valore)
        print("❌ Inserisci un numero intero oppure premi INVIO per saltare.")


def inserisci_giornata_gironi(comp):
    if not comp["partecipanti"]:
        print("⚠️ Prima componi i gironi.")
        return

    while True:
        n = input_int("Numero della giornata dei gironi (1-6): ")
        if 1 <= n <= 6:
            break
        print("❌ Inserisci un valore tra 1 e 6.")

    turno = trova_turno(comp, f"g{n}")
    if not turno["partite"]:
        print("⚠️ Calendario mancante per questa giornata: usa l'opzione 4.")
        return

    print(f"\n{turno['nome']}  (INVIO = nessuna modifica)")
    modificate = 0

    for m in sorted(turno["partite"], key=lambda m: m["girone"]):
        casa, ospite = m["squadraCasa"]["nome"], m["squadraOspite"]["nome"]
        attuale = f"   [attuale {m['golCasa']}:{m['golOspite']}]" if m.get("conclusa") else ""
        print(f"\n  Girone {m['girone']}: {casa} – {ospite}{attuale}")

        gol_casa = input_gol_opzionale(f"    Gol {casa}: ")
        if gol_casa is None:
            continue
        gol_ospite = input_int(f"    Gol {ospite}: ")

        m["golCasa"], m["golOspite"], m["conclusa"] = gol_casa, gol_ospite, True
        modificate += 1

    if not modificate:
        print("Nessuna modifica.")
        return

    ricalcola_classifica(comp)
    print("\n📊 Classifica ricalcolata dai risultati.")
    assegna_posizioni(comp)

# --- Tabellone ------------------------------------------------

def inserisci_partita_tabellone(comp, squadre):
    formato = FORMATO_COPPE[comp["nome"]]

    print("\nTurni del tabellone:")
    for i, (nome, _) in enumerate(formato, start=1):
        print(f"  {i}. {nome}")
    while True:
        i = input_int("Seleziona il turno: ")
        if 1 <= i <= len(formato):
            break
        print("❌ Turno non valido.")

    nome_turno, slot = formato[i - 1]
    turno = trova_turno(comp, f"t{i}")

    print(f"\n{nome_turno}:")
    for k, (a, b) in enumerate(slot, start=1):
        print(f"  {k}. {a} – {b}   {descrivi_partita(turno['partite'][k - 1])}")
    while True:
        k = input_int("Seleziona la partita: ")
        if 1 <= k <= len(slot):
            break
        print("❌ Partita non valida.")

    etichetta_casa, etichetta_ospite = slot[k - 1]
    esistente = turno["partite"][k - 1]
    stampa_elenco_squadre(squadre)

    def prompt(lato, etichetta, suggerita):
        extra = f" → {suggerita['nome']} (INVIO per confermare)" if suggerita else ""
        return f"  Squadra {lato} [{etichetta}]{extra}, ID: "

    sugg_casa = risolvi_etichetta(comp, etichetta_casa, i)
    casa = chiedi_squadra(prompt("1", etichetta_casa, sugg_casa), squadre, predefinita=sugg_casa)

    sugg_ospite = risolvi_etichetta(comp, etichetta_ospite, i)
    ammessi = {s["id"] for s in squadre} - {casa["id"]}
    ospite = chiedi_squadra(prompt("2", etichetta_ospite, sugg_ospite), squadre, ammessi, predefinita=sugg_ospite)

    partita = {
        "id": esistente["id"] if esistente else prossimo_id_partita(comp),
        "squadraCasa": {"id": casa["id"], "nome": casa["nome"]},
        "squadraOspite": {"id": ospite["id"], "nome": ospite["nome"]},
        "conclusa": False,
    }

    if input("  Confronto concluso? (SI/NO): ").strip().upper() == "SI":
        partita["golCasa"] = input_int(f"  Gol {casa['nome']} (totale del confronto): ")
        partita["golOspite"] = input_int(f"  Gol {ospite['nome']} (totale del confronto): ")
        partita["conclusa"] = True
        if partita["golCasa"] == partita["golOspite"]:
            while True:
                scelta = input("  Parità: chi passa il turno? (1 = prima squadra, 2 = seconda): ").strip()
                if scelta in ("1", "2"):
                    break
            partita["passa"] = "casa" if scelta == "1" else "ospite"
    else:
        orario = input("  Data/orario (INVIO per saltare): ").strip()
        if orario:
            partita["orario"] = orario

    turno["partite"][k - 1] = partita
    print(f"  ✅ {nome_turno} · partita {k}: {descrivi_partita(partita)}")


# --- Handler principale ---------------------------------------

def aggiorna_coppa_europea(comp, squadre, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    assicura_struttura(comp)

    giornata = input_int("Inserisci il numero della giornata attuale: ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    while True:
        print("\n  1. Componi i gironi (e il calendario)")
        print("  2. Inserisci i risultati di una giornata dei gironi")
        print("  3. Inserisci / aggiorna una partita del tabellone")
        print("  4. Definisci o completa il calendario dei gironi")
        print("  0. Fine")
        scelta = input("Scelta: ").strip()

        if scelta == "0":
            break
        elif scelta == "1":
            if componi_gironi(comp, squadre):
                definisci_calendario(comp)
        elif scelta == "2":
            inserisci_giornata_gironi(comp)
        elif scelta == "3":
            inserisci_partita_tabellone(comp, squadre)
        elif scelta == "4":
            definisci_calendario(comp)
        else:
            print("❌ Scelta non valida.")