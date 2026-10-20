from utils_cli import chiedi_partecipante, fmt, input_float, input_int, input_posizione, sincronizza_competizione

NOME_CAMPIONATO = "Campionato"
NOME_TOP = "Punteggio Più Alto di Giornata"

# --- 1. Punteggi di giornata ----------------------------------

def inserisci_punteggi(partecipanti, giornata):
    """Punteggio di giornata squadra per squadra. Ritorna False se non è stato inserito nulla."""
    chiave = str(giornata)

    print(f"\nPunteggi della {giornata}ª giornata:")
    for p in sorted(partecipanti, key=lambda x: x["id"]):
        valore = p.get("punteggiGiornata", {}).get(chiave)
        print(f"  [{p['id']:>2}] {p['nome']:<25} {'✓ ' + fmt(valore) if valore is not None else '–'}")

    while True:
        inseriti = sum(1 for p in partecipanti if chiave in p.get("punteggiGiornata", {}))
        p = chiedi_partecipante(
            partecipanti, f"\n[{inseriti}/{len(partecipanti)}] ID squadra (INVIO per terminare): "
        )

        if p is None:
            if inseriti == 0:
                return False
            mancanti = [m for m in partecipanti if chiave not in m.get("punteggiGiornata", {})]
            if mancanti:
                print("  Mancano: " + ", ".join(m["nome"] for m in mancanti))
                if input("  Terminare comunque? (SI/NO): ").strip().upper() != "SI":
                    continue
            return True

        storico = p.setdefault("punteggiGiornata", {})
        precedente = storico.get(chiave)
        attuale = f" [attuale {fmt(precedente)}]" if precedente is not None else ""
        nuovo = input_float(f"  Punteggio di {p['nome']}{attuale}: ")

        # Il totale cresce della differenza: reinserire una squadra corregge, non raddoppia
        p["punteggio"] = round(p.get("punteggio", 0) - (precedente or 0) + nuovo, 2)
        storico[chiave] = nuovo
        print(f"  ✅ Totale {p['nome']}: {fmt(p['punteggio'])}")


# --- 2. Classifica: verifica con l'app ------------------------

def conferma_classifica(partecipanti, precedenti, giornata):
    """Mostra la classifica per punteggio totale e permette di spostare le squadre. Ritorna l'ordine finale."""
    # A parità di punti, per ora vale la posizione precedente
    ordine = sorted(partecipanti, key=lambda p: (-p.get("punteggio", 0), precedenti[p["id"]]))

    while True:
        print(f"\n📊 Classifica dopo la {giornata}ª giornata (confrontala con l'app):")
        for i, p in enumerate(ordine, start=1):
            delta = precedenti[p["id"]] - i
            freccia = f"▲{delta}" if delta > 0 else f"▼{-delta}" if delta < 0 else "="
            print(f"  {i:>2}. [{p['id']:>2}] {p['nome']:<25} {fmt(p.get('punteggio', 0)):>8}   {freccia}")

        if input("\nCorrisponde alla classifica dell'app? (SI/NO): ").strip().upper() == "SI":
            return ordine

        p = chiedi_partecipante(partecipanti, "ID della squadra da spostare (INVIO per annullare): ")
        if p is None:
            continue

        attuale = ordine.index(p) + 1
        nuova = input_posizione(
            f"  Nuova posizione di {p['nome']} (1-{len(ordine)}, attuale {attuale}): ", len(ordine)
        )
        ordine.remove(p)
        ordine.insert(nuova - 1, p)  # le altre squadre scorrono di un posto


# --- 3. Punteggio più alto di giornata ------------------------

def assegna_punteggio_top(top, partecipanti, giornata):
    chiave = str(giornata)
    inseriti = [(p, p["punteggiGiornata"][chiave]) for p in partecipanti if chiave in p.get("punteggiGiornata", {})]
    if not inseriti:
        return

    massimo = max(round(v, 2) for _, v in inseriti)
    vincitori = [p for p, v in inseriti if round(v, 2) == massimo]

    print(f"\n🏆 Punteggio più alto della {giornata}ª giornata: {fmt(massimo)}")
    for p in vincitori:
        print(f"   - {p['nome']}")
    if len(vincitori) > 1:
        print(f"   (pari merito: {len(vincitori)} squadre, le registro tutte)")

    if input("Confermi? (SI/NO): ").strip().upper() != "SI":
        print("  Punteggio più alto non aggiornato.")
        return

    titolo = f"Giornata {giornata}"
    voci = top.setdefault("partecipanti", [])
    ultimo_id = max((v.get("id", 0) for v in voci), default=0)

    if any(v.get("titolo") == titolo for v in voci):
        print("  ♻️ Vincitori già presenti per questa giornata: li sostituisco.")
        voci[:] = [v for v in voci if v.get("titolo") != titolo]

    for p in vincitori:
        ultimo_id += 1
        voci.append({
            "id": ultimo_id,
            "titolo": titolo,
            "id_S": p["id"],
            "nome": p["nome"],
            "border": p.get("border", ""),
            "punteggio": massimo,
        })


# --- Handler principale ---------------------------------------

def aggiorna_giornata_lega(classifiche, data_comp):
    campionato = next((c for c in classifiche if c.get("nome") == NOME_CAMPIONATO), None)
    top = next((c for c in classifiche if c.get("nome") == NOME_TOP), None)
    if not campionato or not top:
        print(f"⚠️ Servono sia '{NOME_CAMPIONATO}' sia '{NOME_TOP}' in classifiche.json.")
        return

    partecipanti = campionato.get("partecipanti", [])
    if not partecipanti:
        print("⚠️ Il Campionato non ha partecipanti.")
        return

    print(f"\n--- Aggiornamento: {NOME_CAMPIONATO} + {NOME_TOP} ---")
    giornata = input_int("Inserisci il numero della giornata attuale: ")

    # Se la giornata è già stata elaborata, la posizione "precedente" è quella salvata in 'variazione'
    rielaborazione = campionato.get("ultimaGiornata") == giornata
    if rielaborazione:
        print("ℹ️ Giornata già elaborata: i punteggi reinseriti sostituiscono quelli precedenti.")
    precedenti = {
        p["id"]: p.get("variazione", p.get("posizione", 0)) if rielaborazione else p.get("posizione", 0)
        for p in partecipanti
    }

    if not inserisci_punteggi(partecipanti, giornata):
        print("Nessun punteggio inserito: nulla da aggiornare.")
        return

    ordine = conferma_classifica(partecipanti, precedenti, giornata)
    for i, p in enumerate(ordine, start=1):
        p["variazione"] = precedenti[p["id"]]
        p["posizione"] = i
    campionato["partecipanti"] = ordine
    campionato["ultimaGiornata"] = giornata

    assegna_punteggio_top(top, partecipanti, giornata)

    sincronizza_competizione(data_comp, NOME_CAMPIONATO, giornata)
    sincronizza_competizione(data_comp, NOME_TOP, giornata)