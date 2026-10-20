from copy import deepcopy

from utils_cli import chiedi_partecipante, input_int, input_posizione, sincronizza_competizione

NOME_PRELIMINARI = "Preliminari Coppe Europee"
NOMI_GIRONI = ("Serie A", "Serie B", "Serie C", NOME_PRELIMINARI)


# --- Utilità --------------------------------------------------

def gruppi_della_competizione(comp):
    """Preliminari: un gruppo per girone. Serie A/B/C: un unico gruppo."""
    partecipanti = comp.get("partecipanti", [])
    if comp["nome"] == NOME_PRELIMINARI:
        nomi = sorted({str(p.get("girone", "")).upper() for p in partecipanti})
        return {g: [p for p in partecipanti if str(p.get("girone", "")).upper() == g] for g in nomi}
    return {None: partecipanti}


def gruppo_di(gruppi, p):
    return next(g for g in gruppi.values() if any(x["id"] == p["id"] for x in g))


def chiedi_gol(prompt):
    while True:
        n = input_int(prompt)
        if n >= 0:
            return n
        print("❌ I gol non possono essere negativi.")


def esito(casa, ospite, gc, go):
    if gc == go:
        return "pareggio"
    return f"vince {(casa if gc > go else ospite)['nome']}"


def chiedi_avversaria(gruppo, prima):
    candidati = [p for p in gruppo if p["id"] != prima["id"]]
    while True:
        p = chiedi_partecipante(candidati, f"  Avversaria di {prima['nome']} (ID): ")
        if p is not None:
            return p
        print("❌ Inserisci l'ID dell'avversaria.")


def applica(casa, ospite, gol_casa, gol_ospite, segno=1):
    """Aggiunge (segno=1) o toglie (segno=-1) un risultato dalle statistiche delle due squadre."""
    for p, fatti, subiti in ((casa, gol_casa, gol_ospite), (ospite, gol_ospite, gol_casa)):
        chiave = "vinte" if fatti > subiti else "perso" if fatti < subiti else "pari"
        p[chiave] = p.get(chiave, 0) + segno
        p["giocate"] = p.get("giocate", 0) + segno
        p["gf"] = p.get("gf", 0) + segno * fatti
        p["gs"] = p.get("gs", 0) + segno * subiti
        p["punteggio"] = p.get("vinte", 0) * 3 + p.get("pari", 0)


def stampa_squadre(gruppi, risultati, giornata):
    giocano = {i for r in risultati if r["giornata"] == giornata for i in (r["casa"], r["ospite"])}
    for etichetta, squadre in gruppi.items():
        if etichetta:
            print(f"\n--- Girone {etichetta} ---")
        for p in sorted(squadre, key=lambda x: x["id"]):
            print(f"  [{p['id']:>2}] {p['nome']:<25} {'✓' if p['id'] in giocano else ''}")
    print(f"\n(✓ = partita già inserita per la {giornata}ª giornata)")


# --- Inserimento risultati ------------------------------------

def inserisci_risultati(comp, gruppi, giornata):
    risultati = comp.setdefault("risultati", [])
    per_id = {p["id"]: p for p in comp["partecipanti"]}
    inseriti = 0

    stampa_squadre(gruppi, risultati, giornata)

    while True:
        prima = chiedi_partecipante(
            comp["partecipanti"], f"\n[{inseriti} inserite] Prima squadra (ID, INVIO per terminare): "
        )
        if prima is None:
            return inseriti

        seconda = chiedi_avversaria(gruppo_di(gruppi, prima), prima)
        gc = chiedi_gol(f"  Gol {prima['nome']}: ")
        go = chiedi_gol(f"  Gol {seconda['nome']}: ")

        coppia = {prima["id"], seconda["id"]}
        della_giornata = [r for r in risultati if r["giornata"] == giornata and ({r["casa"], r["ospite"]} & coppia)]
        stessa = [r for r in della_giornata if {r["casa"], r["ospite"]} == coppia]
        altre = [r for r in della_giornata if r not in stessa]

        if altre:
            for r in altre:
                print(f"  ⚠️ {per_id[r['casa']]['nome']} – {per_id[r['ospite']]['nome']} è già stata inserita in questa giornata.")
            if input("  Inserire comunque la nuova partita? (SI/NO): ").strip().upper() != "SI":
                continue

        # Se la stessa partita era già stata registrata, il vecchio risultato viene tolto prima
        for r in stessa:
            print(f"  ♻️ Risultato già presente ({r['golCasa']}:{r['golOspite']}): lo sostituisco.")
            applica(per_id[r["casa"]], per_id[r["ospite"]], r["golCasa"], r["golOspite"], segno=-1)
            risultati.remove(r)

        applica(prima, seconda, gc, go)
        risultati.append({"giornata": giornata, "casa": prima["id"], "ospite": seconda["id"], "golCasa": gc, "golOspite": go})
        inseriti += 1
        print(f"  ✅ {prima['nome']} {gc}:{go} {seconda['nome']} → {esito(prima, seconda, gc, go)}")


# --- Classifica: verifica con l'app ---------------------------

def ordina(gruppo, precedenti):
    # Punti, differenza reti, gol fatti, posizione precedente
    return sorted(
        gruppo,
        key=lambda p: (-p.get("punteggio", 0), -(p.get("gf", 0) - p.get("gs", 0)), -p.get("gf", 0), precedenti[p["id"]]),
    )


def stampa_classifica(ordini, precedenti, giornata):
    print(f"\n📊 Classifica dopo la {giornata}ª giornata (confrontala con l'app):")
    for etichetta, ordine in ordini.items():
        if etichetta:
            print(f"\n--- Girone {etichetta} ---")
        print("  Pos   ID  Squadra                   G  V  N  P  GF  GS   DR   Pt")
        for i, p in enumerate(ordine, start=1):
            dr = p.get("gf", 0) - p.get("gs", 0)
            prima = precedenti[p["id"]]
            delta = prima - i if prima else 0
            freccia = f"▲{delta}" if delta > 0 else f"▼{-delta}" if delta < 0 else "="
            print(
                f"  {i:>3}  [{p['id']:>2}] {p['nome']:<22} {p.get('giocate', 0):>2} {p.get('vinte', 0):>2} "
                f"{p.get('pari', 0):>2} {p.get('perso', 0):>2} {p.get('gf', 0):>3} {p.get('gs', 0):>3} {dr:>+4} "
                f"{p.get('punteggio', 0):>4}  {freccia}"
            )
        if any(a.get("punteggio", 0) == b.get("punteggio", 0) for a, b in zip(ordine, ordine[1:])):
            print("  ⚠️ Squadre a pari punti: l'ordine usa differenza reti e gol fatti, ma vale prima lo scontro diretto del regolamento.")


def conferma_classifica(comp, gruppi, precedenti, giornata):
    """Ritorna {gruppo: squadre in ordine} se confermata, None se annullata."""
    ordini = {g: ordina(squadre, precedenti) for g, squadre in gruppi.items()}

    while True:
        stampa_classifica(ordini, precedenti, giornata)
        scelta = input("\nConfermi? (S = conferma, M = modifica una posizione, A = annulla tutto): ").strip().upper()

        if scelta == "S":
            return ordini
        if scelta == "A":
            return None
        if scelta != "M":
            continue

        p = chiedi_partecipante(comp["partecipanti"], "ID della squadra da spostare (INVIO per annullare): ")
        if p is None:
            continue
        ordine = next(o for o in ordini.values() if any(x["id"] == p["id"] for x in o))
        attuale = [x["id"] for x in ordine].index(p["id"]) + 1
        nuova = input_posizione(f"  Nuova posizione di {p['nome']} (1-{len(ordine)}, attuale {attuale}): ", len(ordine))
        ordine.remove(p)
        ordine.insert(nuova - 1, p)  # le altre squadre scorrono di un posto


# --- Handler principale ---------------------------------------

def aggiorna_gironi(comp, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    if not comp.get("partecipanti"):
        print("⚠️ La competizione non ha partecipanti.")
        return

    giornata = input_int("Inserisci il numero della giornata attuale: ")
    gruppi = gruppi_della_competizione(comp)

    backup = (deepcopy(comp["partecipanti"]), deepcopy(comp.get("risultati")))
    precedenti = {p["id"]: p.get("posizione", 0) for p in comp["partecipanti"]}

    if inserisci_risultati(comp, gruppi, giornata) == 0:
        print("Nessun risultato inserito: nulla da aggiornare.")
        return

    # Segnala le squadre senza partita in questa giornata
    giocano = {i for r in comp["risultati"] if r["giornata"] == giornata for i in (r["casa"], r["ospite"])}
    for etichetta, squadre in gruppi.items():
        mancano = [p["nome"] for p in squadre if p["id"] not in giocano]
        if mancano:
            dove = f" (girone {etichetta})" if etichetta else ""
            print(f"\n⚠️ Nessuna partita inserita per{dove}: " + ", ".join(mancano))

    ordini = conferma_classifica(comp, gruppi, precedenti, giornata)

    if ordini is None:
        comp["partecipanti"] = backup[0]
        if backup[1] is None:
            comp.pop("risultati", None)
        else:
            comp["risultati"] = backup[1]
        print("Aggiornamento annullato: nessuna modifica salvata.")
        return

    for ordine in ordini.values():
        for i, p in enumerate(ordine, start=1):
            p["posizione"] = i
    comp["partecipanti"] = sorted(
        comp["partecipanti"], key=lambda p: (str(p.get("girone", "")).upper(), p["posizione"])
    )

    sincronizza_competizione(data_comp, comp["nome"], giornata)