import json
import os
from utils_cli import input_float, input_int, input_posizione, sincronizza_competizione
from coppe_europee import FORMATO_COPPE, aggiorna_coppa_europea
from coppa_italia import aggiorna_coppa_italia
from giornata_lega import NOME_CAMPIONATO, NOME_TOP, aggiorna_giornata_lega
from survivor_cup import NOME_SURVIVOR, aggiorna_survivor_cup
from gironi import NOMI_GIRONI, aggiorna_gironi

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

# -------------------------------------------------------------
# HANDLERS SPECIFICI PER COMPETIZIONE
# -------------------------------------------------------------

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

        if nome_comp in (NOME_CAMPIONATO, NOME_TOP):
            aggiorna_giornata_lega(classifiche, data_competizioni)
        elif nome_comp == NOME_SURVIVOR:
            aggiorna_survivor_cup(comp_scelta, data_competizioni, classifiche)
        elif nome_comp in NOMI_GIRONI:
            aggiorna_gironi(comp_scelta, data_competizioni)
        elif nome_comp[:14] == "Squid Game Cup":
            aggiorna_squid_game_cup(comp_scelta, data_competizioni)
        elif nome_comp in FORMATO_COPPE:
            aggiorna_coppa_europea(comp_scelta, squadre, data_competizioni, classifiche)
        elif nome_comp == "Coppa Italia":
            aggiorna_coppa_italia(comp_scelta, data_competizioni, classifiche)
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