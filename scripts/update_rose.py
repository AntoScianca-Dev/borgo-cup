import csv
import json
import os

# Nomi dei file di input e output
CSV_FILE = "scripts/borgo-cup_rosters.csv"
SQUADRE_FILE = "src/assets/data/squadre.json"
CALCIATORI_FILE = "src/assets/data/calciatori.json"
ROSE_OUTPUT_FILE = "src/assets/data/rose.json"


def carica_json(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File non trovato: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def salva_json(filepath, data):
    # Assicura che la cartella di destinazione esista
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    print("Caricamento squadre e calciatori...")

    # 1. Caricamento dati di riferimento
    raw_squadre = carica_json(SQUADRE_FILE)
    raw_calciatori = carica_json(CALCIATORI_FILE)

    # Estrazione lista squadre (gestisce sia array diretto che {"squadre": [...]})
    if isinstance(raw_squadre, dict) and "squadre" in raw_squadre:
        squadre_list = raw_squadre["squadre"]
    elif isinstance(raw_squadre, list):
        squadre_list = raw_squadre
    else:
        squadre_list = raw_squadre.get("data", [])

    # Estrazione lista calciatori (da {"calciatori": [...]})
    if isinstance(raw_calciatori, dict) and "calciatori" in raw_calciatori:
        calciatori_list = raw_calciatori["calciatori"]
    elif isinstance(raw_calciatori, list):
        calciatori_list = raw_calciatori
    else:
        calciatori_list = raw_calciatori.get("data", [])

    # Mappa Nome Squadra -> ID Squadra
    squadre_map = {
        str(s["nome"]).strip().lower(): s["id"]
        for s in squadre_list
        if isinstance(s, dict) and "id" in s and "nome" in s
    }

    # Mappa ID Calciatore -> Dettagli Calciatore
    calciatori_map = {
        str(c["id"]): c
        for c in calciatori_list
        if isinstance(c, dict) and "id" in c
    }

    print(
        f"Caricate {len(squadre_map)} squadre e {len(calciatori_map)} calciatori."
    )

    # 2. Lettura ed elaborazione CSV
    print(f"Elaborazione file CSV: {CSV_FILE}...")

    # Struttura temporanea: { id_squadra: { 'p': [giocatori], 'd': [...], 'c': [...], 'a': [...] } }
    rose_builder = {}

    with open(CSV_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)

        for row in reader:
            if not row or len(row) < 3:
                continue

            nome_squadra = row[0].strip()
            id_giocatore_str = row[1].strip()
            costo_str = row[2].strip()

            # Salta la riga se non contiene un ID numerico
            if not id_giocatore_str.isdigit():
                continue

            # Lookup squadra
            squadra_key = nome_squadra.lower()
            if squadra_key not in squadre_map:
                print(
                    f"⚠️ Squadra '{nome_squadra}' non trovata in {SQUADRE_FILE}. Salto la riga."
                )
                continue
            id_squadra = squadre_map[squadra_key]

            # Lookup calciatore
            if id_giocatore_str not in calciatori_map:
                print(
                    f"⚠️ Calciatore ID {id_giocatore_str} non trovato in {CALCIATORI_FILE}. Salto."
                )
                continue

            giocatore_info = calciatori_map[id_giocatore_str]

            # Ruolo in minuscolo (p, d, c, a) e nome letto da calciatori.json
            ruolo_raw = str(giocatore_info.get("ruolo", "")).strip().lower()
            nome_giocatore = giocatore_info.get("nome", "")

            try:
                costo = int(costo_str)
            except ValueError:
                costo = costo_str

            if id_squadra not in rose_builder:
                rose_builder[id_squadra] = {}

            if ruolo_raw not in rose_builder[id_squadra]:
                rose_builder[id_squadra][ruolo_raw] = []

            rose_builder[id_squadra][ruolo_raw].append(
                {
                    "id": int(id_giocatore_str),
                    "nome": nome_giocatore,
                    "costo": costo,
                }
            )

    # 3. Costruzione della struttura finale rose.json (p1, p2, d1, d2...)
    rose_final_list = []

    for id_squadra, ruoli_dict in rose_builder.items():
        rosa_obj = {}

        for ruolo in ["p", "d", "c", "a"]:
            if ruolo in ruoli_dict:
                for idx, giocatore in enumerate(ruoli_dict[ruolo], start=1):
                    slot_key = f"{ruolo}{idx}"
                    rosa_obj[slot_key] = [giocatore]

        rose_final_list.append({"id": id_squadra, "rosa": [rosa_obj]})

    # Ordina le squadre per ID
    rose_final_list.sort(key=lambda x: x["id"])

    output_data = {"rose": rose_final_list}

    # 4. Salvataggio del file
    salva_json(ROSE_OUTPUT_FILE, output_data)
    print(f"✅ File {ROSE_OUTPUT_FILE} aggiornato con successo!")


if __name__ == "__main__":
    main()