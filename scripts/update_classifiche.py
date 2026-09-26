import json
import os

FILE_PATH = "src/assets/data/classifiche.json"
FILE_SQUADRE_PATH = "src/assets/data/squadre.json"
FILE_COMPETIZIONI_PATH = "src/assets/data/competizioni.json"

# -------------------------------------------------------------
# CARICAMENTO E SALVATAGGIO JSON
# -------------------------------------------------------------

def carica_json(path):
    if not os.path.exists(path):
        print(f"⚠️ Attenzione: Il file {path} non esiste.")
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def salva_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"✅ File {path} salvato con successo!")

def input_float(prompt):
    while True:
        try:
            return float(input(prompt).replace(",", "."))
        except ValueError:
            print("❌ Valore non valido. Inserisci un numero.")

def input_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("❌ Valore non valido. Inserisci un numero intero.")

def input_posizione(prompt, max_squadre):
    """Garantisce che la posizione sia un numero compreso tra 1 e il totale delle squadre."""
    while True:
        valore = input_int(prompt)
        if 1 <= valore <= max_squadre:
            return valore
        print(f"❌ Posizione non valida! Deve essere compresa tra 1 e {max_squadre}.")

# -------------------------------------------------------------
# AGGIORNAMENTO FILE COMPETIZIONI.JSON
# -------------------------------------------------------------

def aggiorna_giornata_serie_a(data_comp):
    """Aggiorna giornataA nell'oggetto id: 0 di competizioni.json"""
    competizioni = data_comp.get("competizioni", [])
    item_0 = next((c for c in competizioni if c.get("id") == 0), None)
    
    if item_0 is not None:
        giornata_attuale = item_0.get("giornataA", 0)
        print(f"\n--- Giornata Generale Serie A (Attuale: {giornata_attuale}) ---")
        scelta = input("Vuoi aggiornare la giornataA di Serie A? (SI/NO): ").strip().upper()
        if scelta == "SI":
            nuova_giornata_a = input_int("Inserisci la nuova giornataA di Serie A: ")
            item_0["giornataA"] = nuova_giornata_a
            print(f"  ✅ giornataA aggiornata a: {nuova_giornata_a}")

def sincronizza_competizione(data_comp, nome_comp, nuova_giornata):
    """
    Sincronizza giornata, stato e avanzamento per la competizione selezionata.
    """
    if not data_comp:
        return

    competizioni = data_comp.get("competizioni", [])
    comp = next((c for c in competizioni if c.get("nome") == nome_comp), None)

    if not comp:
        return

    comp["giornata"] = nuova_giornata

    # Gestione dello STATO
    totale = comp.get("totale", 0)
    stato_attuale = comp.get("stato", "")

    if stato_attuale == "In attesa" and nuova_giornata > 0:
        comp["stato"] = "Attivo"
        print(f"  🔄 Stato competizione '{nome_comp}' cambiato in -> Attivo")

    if totale > 0 and nuova_giornata >= totale:
        comp["stato"] = "Terminata"
        print(f"  🏁 Stato competizione '{nome_comp}' cambiato in -> Terminata")

    # Calcolo percentuale AVANZAMENTO
    if totale > 0:
        comp["avanzamento"] = round((nuova_giornata / totale) * 100, 1)

    print(f"  📊 Competizioni.json -> {nome_comp}: Giornata {comp['giornata']}/{totale} | Stato: {comp['stato']} | Avanzamento: {comp.get('avanzamento', 0)}%")

# -------------------------------------------------------------
# HELPER PER SELEZIONE SQUADRA
# -------------------------------------------------------------

def seleziona_squadra(squadre):
    if not squadre:
        print(f"⚠️ Nessuna squadra trovata in {FILE_SQUADRE_PATH}. Inserimento manuale.")
        id_s = input_int("  ID Squadra: ")
        nome = input("  Nome Squadra: ")
        border = input("  Colore Border (es. #FF0000): ")
        return {"id": id_s, "nome": nome, "border": border}

    print(f"\n--- Seleziona Squadra da {FILE_SQUADRE_PATH} ---")
    for sq in squadre:
        print(f"  [{sq['id']}] {sq['nome']}")
    
    while True:
        scelta_id = input_int("Inserisci ID squadra selezionata: ")
        squadra_trovata = next((s for s in squadre if s["id"] == scelta_id), None)
        if squadra_trovata:
            return squadra_trovata
        print("❌ ID non valido. Riprova.")

# -------------------------------------------------------------
# HANDLERS SPECIFICI PER COMPETIZIONE
# -------------------------------------------------------------
def aggiorna_campionato(comp, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    giornata = input_int("Inserisci il numero della giornata attuale per Campionato: ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    partecipanti = comp.get("partecipanti", [])
    totale_squadre = len(partecipanti)

    # Ordinamento per Posizione Attuale
    partecipanti_ordinati = sorted(partecipanti, key=lambda x: x.get("posizione", 999))

    for p in partecipanti_ordinati:
        pos_attuale = p.get("posizione", "-")
        print(f"\n>> Partecipante: {p['nome']} (Posizione Attuale: {pos_attuale})")
        p["variazione"] = p.get("posizione", 0)
        p["posizione"] = input_posizione(f"  Nuova POSIZIONE (1-{totale_squadre}, attuale: {pos_attuale}): ", totale_squadre)
        p["punteggio"] = input_float(f"  Nuovo PUNTEGGIO (attuale: {p.get('punteggio', 0)}): ")

    # Salva ordinando per la nuova posizione
    comp["partecipanti"] = sorted(partecipanti, key=lambda x: x.get("posizione", 999))

def aggiorna_survivor_cup(comp, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    giornata = input_int("Inserisci il numero della giornata attuale per Survivor Cup: ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    partecipanti = comp.get("partecipanti", [])
    partecipanti_ordinati = sorted(partecipanti, key=lambda x: x.get("totale", 0), reverse=True)

    for p in partecipanti_ordinati:
        if p.get("stato") != "attivo":
            continue

        print(f"\n>> Partecipante: {p['nome']} (Totale attuale: {p.get('totale', 0)})")
        scelta_stato = input("  È stato ELIMINATO in questa giornata? (SI/NO): ").strip().upper()
        
        if scelta_stato == "SI":
            p["stato"] = "eliminato"

        punteggio_giornata = input_float("  Inserisci punteggio di giornata: ")
        p["punteggio"] = punteggio_giornata
        p["totale"] = round(p.get("totale", 0) + punteggio_giornata, 2)

def aggiorna_punteggio_top(comp, squadre, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    partecipanti = comp.get("partecipanti", [])

    ultimo_id = max([p.get("id", 0) for p in partecipanti], default=0)
    num_giornata = input_int("Inserisci il numero della giornata attuale: ")
    
    sincronizza_competizione(data_comp, comp["nome"], num_giornata)
    titolo = f"Giornata {num_giornata}"

    aggiungi_altra = "SI"
    while aggiungi_altra == "SI":
        ultimo_id += 1
        print(f"\n>> Inserimento vincitore (ID Voce: {ultimo_id}) per: {titolo}")

        squadra = seleziona_squadra(squadre)
        punteggio = input_float("  Inserisci punteggio ottenuto: ")

        nuovo_entry = {
            "id": ultimo_id,
            "titolo": titolo,
            "id_S": squadra["id"],
            "nome": squadra["nome"],
            "border": squadra.get("border", ""),
            "punteggio": punteggio
        }

        partecipanti.append(nuovo_entry)
        aggiungi_altra = input("\nVuoi aggiungere un'altra squadra vincitrice in parità per questa giornata? (SI/NO): ").strip().upper()

def aggiorna_girone_standard(comp, data_comp):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    giornata = input_int("Inserisci il numero della giornata attuale (imposterà le partite giocate): ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    partecipanti = comp.get("partecipanti", [])
    totale_squadre = len(partecipanti)

    # Ordinamento per Posizione
    partecipanti_ordinati = sorted(partecipanti, key=lambda x: x.get("posizione", 999))

    for p in partecipanti_ordinati:
        pos_attuale = p.get("posizione", "-")
        print(f"\n>> Partecipante: {p['nome']} (Posizione Attuale: {pos_attuale})")
        
        p["posizione"] = input_posizione(f"  Nuova POSIZIONE (1-{totale_squadre}, attuale: {pos_attuale}): ", totale_squadre)
        p["giocate"] = giornata

        v_att = p.get("vinte", 0)
        n_att = p.get("pari", 0)
        p_att = p.get("perso", 0)

        while True:
            esito = input(f"  Esito partita ultima giornata [Vinto(V): {v_att} | Pari(N): {n_att} | Perso(P): {p_att}] -> Inserisci V, N o P: ").strip().upper()
            if esito in ["V", "N", "P"]:
                break
            print("❌ Input non valido. Inserisci V, N o P.")

        if esito == "V":
            p["vinte"] = v_att + 1
        elif esito == "N":
            p["pari"] = n_att + 1
        elif esito == "P":
            p["perso"] = p_att + 1

        p["punteggio"] = (p["vinte"] * 3) + p["pari"]
        p["gf"] = input_int("  Gol Fatti (GF): ")
        p["gs"] = input_int("  Gol Subiti (GS): ")

    # Salva ordinando per la nuova posizione
    comp["partecipanti"] = sorted(partecipanti, key=lambda x: x.get("posizione", 999))
    
def aggiorna_preliminari_coppe_europee(comp, data_comp):
    """
    Specifica per Preliminari Coppe Europee:
    - Ordinamento primario per Girone (A, B, C, D...)
    - Ordinamento secondario per Posizione all'interno del girone.
    """
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    giornata = input_int("Inserisci il numero della giornata attuale (imposterà le partite giocate): ")
    sincronizza_competizione(data_comp, comp["nome"], giornata)

    partecipanti = comp.get("partecipanti", [])

    # Ordina prima per Girone (es. 'A', 'B'), poi per Posizione (1, 2, ...)
    partecipanti_ordinati = sorted(
        partecipanti, 
        key=lambda x: (str(x.get("girone", "")).upper(), x.get("posizione", 999))
    )

    # Conta quante squadre ci sono in ciascun girone per validare la posizione
    conteggio_gironi = {}
    for p in partecipanti:
        g = str(p.get("girone", "A")).upper()
        conteggio_gironi[g] = conteggio_gironi.get(g, 0) + 1

    for p in partecipanti_ordinati:
        girone = str(p.get("girone", "-")).upper()
        pos_attuale = p.get("posizione", "-")
        max_pos = conteggio_gironi.get(girone, len(partecipanti))

        print(f"\n>> Partecipante: {p['nome']} [Girone {girone}] (Posizione Attuale: {pos_attuale})")
        
        p["posizione"] = input_posizione(f"  Nuova POSIZIONE nel Girone {girone} (1-{max_pos}, attuale: {pos_attuale}): ", max_pos)
        p["giocate"] = giornata

        v_att = p.get("vinte", 0)
        n_att = p.get("pari", 0)
        p_att = p.get("perso", 0)

        while True:
            esito = input(f"  Esito partita ultima giornata [Vinto(V): {v_att} | Pari(N): {n_att} | Perso(P): {p_att}] -> Inserisci V, N o P: ").strip().upper()
            if esito in ["V", "N", "P"]:
                break
            print("❌ Input non valido. Inserisci V, N o P.")

        if esito == "V":
            p["vinte"] = v_att + 1
        elif esito == "N":
            p["pari"] = n_att + 1
        elif esito == "P":
            p["perso"] = p_att + 1

        p["punteggio"] = (p["vinte"] * 3) + p["pari"]
        p["gf"] = input_int("  Gol Fatti (GF): ")
        p["gs"] = input_int("  Gol Subiti (GS): ")

    # Salva ordinando per Girone e Posizione nel JSON
    comp["partecipanti"] = sorted(
        partecipanti, 
        key=lambda x: (str(x.get("girone", "")).upper(), x.get("posizione", 999))
    )

def aggiorna_squid_game_cup(comp, data_comp):
    soglie = {1: 70.0, 2: 73.0, 3: 75.0, 4: 78.0, 5: 80.0}

    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    while True:
        step = input_int("Seleziona Step da aggiornare (1, 2, 3, 4, 5): ")
        if step in soglie:
            break
        print("❌ Step non valido. Inserisci un valore compreso tra 1 e 5.")

    sincronizza_competizione(data_comp, comp["nome"], step)

    soglia = soglie[step]
    chiave_step = f"step{step}"
    partecipanti = comp.get("partecipanti", [])

    partecipanti_ordinati = sorted(partecipanti, key=lambda x: x.get("punteggio", 0), reverse=True)

    for p in partecipanti_ordinati:
        stato_attuale = str(p.get("attivo", "")).upper()
        if stato_attuale not in ["SI", "ATTIVO", "TRUE"]:
            continue

        print(f"\n>> Partecipante: {p['nome']}")
        punteggio = input_float(f"  Inserisci punteggio per {chiave_step}: ")
        
        p[chiave_step] = punteggio
        p["punteggio"] = punteggio

        if punteggio >= soglia:
            p["attivo"] = "SI"
        else:
            p["attivo"] = "NO"

# -------------------------------------------------------------
# MAIN CLI
# -------------------------------------------------------------

def main():
    data_classifiche = carica_json(FILE_PATH)
    if not data_classifiche:
        return

    data_squadre = carica_json(FILE_SQUADRE_PATH)
    squadre = data_squadre.get("squadre", []) if isinstance(data_squadre, dict) else (data_squadre or [])

    data_competizioni = carica_json(FILE_COMPETIZIONI_PATH)

    if data_competizioni:
        aggiorna_giornata_serie_a(data_competizioni)

    classifiche = data_classifiche.get("classifiche", [])

    while True:
        print("\n" + "=" * 45)
        print("     GESTIONE AGGIORNAMENTO CLASSIFICHE     ")
        print("=" * 45)

        for idx, c in enumerate(classifiche, start=1):
            num_part = len(c.get("partecipanti", []))
            info = f"({num_part} partecipanti)" if num_part > 0 else "(Vuota)"
            print(f"{idx}. {c['nome']} {info}")

        print("0. Esci e Salva Tutti i File")

        scelta = input("\nSeleziona la competizione da aggiornare (0 per uscire): ").strip()

        if scelta == "0":
            salva_json(FILE_PATH, data_classifiche)
            if data_competizioni:
                salva_json(FILE_COMPETIZIONI_PATH, data_competizioni)
            break

        if not scelta.isdigit() or int(scelta) < 1 or int(scelta) > len(classifiche):
            print("❌ Selezione non valida.")
            continue

        comp_scelta = classifiche[int(scelta) - 1]
        nome_comp = comp_scelta["nome"]

        if nome_comp == "Campionato":
            aggiorna_campionato(comp_scelta, data_competizioni)
        elif nome_comp == "Survivor Cup":
            aggiorna_survivor_cup(comp_scelta, data_competizioni)
        elif nome_comp == "Punteggio Più Alto di Giornata":
            aggiorna_punteggio_top(comp_scelta, squadre, data_competizioni)
        elif nome_comp == "Preliminari Coppe Europee":
            aggiorna_preliminari_coppe_europee(comp_scelta, data_competizioni)
        elif nome_comp in ["Serie A", "Serie B", "Serie C"]:
            aggiorna_girone_standard(comp_scelta, data_competizioni)
        elif nome_comp[:14] == "Squid Game Cup":
            aggiorna_squid_game_cup(comp_scelta, data_competizioni)
        else:
            print(f"\n⚠️ Nessuna regola specifica trovata per '{nome_comp}'.")

        ancora = input("\nVuoi aggiornare un'altra competizione? (SI/NO): ").strip().upper()
        if ancora != "SI":
            salva_json(FILE_PATH, data_classifiche)
            if data_competizioni:
                salva_json(FILE_COMPETIZIONI_PATH, data_competizioni)
            break

if __name__ == "__main__":
    main()