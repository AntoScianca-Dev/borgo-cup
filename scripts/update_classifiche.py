import json
import os

FILE_PATH = "src/assets/data/classifiche.json"
FILE_SQUADRE_PATH = "src/assets/data/squadre.json"

def carica_json():
    if not os.path.exists(FILE_PATH):
        print(f"Errore: Il file {FILE_PATH} non esiste.")
        return None
    with open(FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def carica_squadre():
    if not os.path.exists(FILE_SQUADRE_PATH):
        print(f"⚠️ Attenzione: Il file {FILE_SQUADRE_PATH} non esiste.")
        return []
    with open(FILE_SQUADRE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        # Gestisce sia il caso in cui squadre.json contenga un array diretto [ {...}, {...} ] 
        # sia il caso in cui abbia la chiave { "squadre": [ ... ] }
        if isinstance(data, dict):
            return data.get("squadre", [])
        return data

def salva_json(data):
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"\n✅ File {FILE_PATH} aggiornato con successo!\n")

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

# -------------------------------------------------------------
# HELPER PER SELEZIONE SQUADRA DA SQUADRE.JSON
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

def aggiorna_campionato(comp):
    """
    Campionato:
    - Variazione assume la posizione prima dell'aggiornamento.
    - Nuova posizione e nuovo punteggio presi in input.
    """
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    partecipanti = comp.get("partecipanti", [])

    for p in partecipanti:
        print(f"\n>> Partecipante: {p['nome']}")

        p["variazione"] = p["posizione"]

        nuova_pos = input_int(f"  Nuova POSIZIONE (attuale: {p['posizione']}): ")
        nuovo_punteggio = input_float(f"  Nuovo PUNTEGGIO (attuale: {p['punteggio']}): ")

        p["posizione"] = nuova_pos
        p["punteggio"] = nuovo_punteggio
        print(f"  --> Posizione: {nuova_pos} (Variazione registrata: {p['variazione']}) | Punti: {nuovo_punteggio}")

def aggiorna_survivor_cup(comp):
    """
    Survivor Cup:
    - Filtra e chiede solo sui partecipanti 'attivi'.
    - Se eliminato, aggiorna stato in 'eliminato'.
    - Chiede punteggio di giornata e lo somma direttamente al totale.
    """
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    partecipanti = comp.get("partecipanti", [])

    for p in partecipanti:
        if p.get("stato") != "attivo":
            continue

        print(f"\n>> Partecipante: {p['nome']} (Stato attuale: ATTIVO)")
        scelta_stato = input("  È stato ELIMINATO in questa giornata? (SI/NO): ").strip().upper()
        
        if scelta_stato == "SI":
            p["stato"] = "eliminato"
            print("  ❌ Stato aggiornato a 'eliminato'.")

        punteggio_giornata = input_float("  Inserisci punteggio di giornata: ")
        p["punteggio"] = punteggio_giornata
        p["totale"] = round(p.get("totale", 0) + punteggio_giornata, 2)
        print(f"  --> Punteggio registrato: {punteggio_giornata} | Nuovo Totale: {p['totale']}")

def aggiorna_punteggio_top(comp, squadre):
    """
    Punteggio Più Alto di Giornata:
    - Genera ID progressivo.
    - Seleziona la squadra da squadre.json.
    - Consente l'inserimento di più squadre in caso di parità mantenendo il titolo della giornata.
    """
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    partecipanti = comp.get("partecipanti", [])

    ultimo_id = max([p.get("id", 0) for p in partecipanti], default=0)
    
    num_giornata = input("Inserisci il numero della giornata (es. 5): ").strip()
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
        print(f"  ✅ Registrato: {squadra['nome']} ({punteggio} pt)")

        aggiungi_altra = input("\nVuoi aggiungere un'altra squadra vincitrice in parità per questa giornata? (SI/NO): ").strip().upper()

def aggiorna_girone_standard(comp):
    """
    Per Preliminari Coppe Europee, Serie A, Serie B, Serie C:
    - Giornata in input una sola volta all'inizio per impostare le giocate.
    - Mostra i valori attuali di V/N/P.
    - Vinto(V) / Pari(N) / Perso(P) con incrementi (+1) e ricalcolo automatico punteggio (V*3 + N).
    """
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    giornata = input_int("Inserisci il numero della giornataattuale (imposterà le partite giocate): ")
    partecipanti = comp.get("partecipanti", [])

    for p in partecipanti:
        print(f"\n>> Partecipante: {p['nome']}")
        
        p["posizione"] = input_int("  Posizione attuale: ")
        p["giocate"] = giornata

        v_att = p.get("vinte", 0)
        n_att = p.get("pari", 0)
        p_att = p.get("perso", 0)

        while True:
            esito = input(f"  Esito partita ultima giornata [Vinto(V): {v_att} | Pari(N): {n_att} | Perso(P): {p_att}] -> Inserisci V, N o P: ").strip().upper()
            if esito in ["V", "N", "P"]:
                break
            print("❌ Input non valido. Inserisci V per Vinto, N per Pari o P per Perso.")

        if esito == "V":
            p["vinte"] = v_att + 1
        elif esito == "N":
            p["pari"] = n_att + 1
        elif esito == "P":
            p["perso"] = p_att + 1

        p["punteggio"] = (p["vinte"] * 3) + p["pari"]

        p["gf"] = input_int("  Gol Fatti (GF): ")
        p["gs"] = input_int("  Gol Subiti (GS): ")

        print(f"  --> Statistiche aggiornate: V:{p['vinte']} N:{p['pari']} P:{p['perso']} | Punti Totali: {p['punteggio']}")

def aggiorna_squid_game_cup(comp):
    """
    Squid Game Cup 1:
    - Selezione step (1-5).
    - Inserimento punteggio per i soli partecipanti attivi.
    - Calcolo qualificazione/eliminazione in base alla soglia dello step.
    """
    soglie = {1: 70.0, 2: 73.0, 3: 75.0, 4: 78.0, 5: 80.0}

    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    
    while True:
        step = input_int("Seleziona Step da aggiornare (1, 2, 3, 4, 5): ")
        if step in soglie:
            break
        print("❌ Step non valido. Inserisci un valore compreso tra 1 e 5.")

    soglia = soglie[step]
    chiave_step = f"step{step}"
    print(f"--> Aggiornamento {chiave_step.upper()} (Soglia qualificazione: >= {soglia} punti)")

    partecipanti = comp.get("partecipanti", [])

    for p in partecipanti:
        stato_attuale = str(p.get("attivo", "")).upper()
        if stato_attuale not in ["SI", "ATTIVO", "TRUE"]:
            continue

        print(f"\n>> Partecipante: {p['nome']}")
        punteggio = input_float(f"  Inserisci punteggio per {chiave_step}: ")
        
        p[chiave_step] = punteggio
        p["punteggio"] = punteggio

        if punteggio >= soglia:
            p["attivo"] = "SI"
            print(f"  ✅ SUPERATO ({punteggio} >= {soglia}) -> Stato: SI")
        else:
            p["attivo"] = "NO"
            print(f"  ❌ ELIMINATO ({punteggio} < {soglia}) -> Stato: NO")

# -------------------------------------------------------------
# MAIN CLI
# -------------------------------------------------------------

def main():
    data = carica_json()
    if not data:
        return

    # Carica la lista delle squadre dal file dedicato squadre.json
    squadre = carica_squadre()

    classifiche = data.get("classifiche", [])

    while True:
        print("\n" + "=" * 45)
        print("     GESTIONE AGGIORNAMENTO CLASSIFICHE     ")
        print("=" * 45)

        for idx, c in enumerate(classifiche, start=1):
            num_part = len(c.get("partecipanti", []))
            info = f"({num_part} partecipanti)" if num_part > 0 else "(Vuota)"
            print(f"{idx}. {c['nome']} {info}")

        print("0. Esci e Salva")

        scelta = input("\nSeleziona la competizione da aggiornare (0 per uscire): ").strip()

        if scelta == "0":
            salva_json(data)
            break

        if not scelta.isdigit() or int(scelta) < 1 or int(scelta) > len(classifiche):
            print("❌ Selezione non valida.")
            continue

        comp_scelta = classifiche[int(scelta) - 1]
        nome_comp = comp_scelta["nome"]

        # Routing in base alla competizione selezionata
        if nome_comp == "Campionato":
            aggiorna_campionato(comp_scelta)
        elif nome_comp == "Survivor Cup":
            aggiorna_survivor_cup(comp_scelta)
        elif nome_comp == "Punteggio Più Alto di Giornata":
            aggiorna_punteggio_top(comp_scelta, squadre)
        elif nome_comp in ["Serie A", "Serie B", "Serie C", "Preliminari Coppe Europee"]:
            aggiorna_girone_standard(comp_scelta)
        elif nome_comp == "Squid Game Cup 1":
            aggiorna_squid_game_cup(comp_scelta)
        else:
            print(f"\n⚠️ Nessuna regola specifica trovata per '{nome_comp}'.")

        ancora = input("\nVuoi aggiornare un'altra competizione? (SI/NO): ").strip().upper()
        if ancora != "SI":
            salva_json(data)
            break

if __name__ == "__main__":
    main()