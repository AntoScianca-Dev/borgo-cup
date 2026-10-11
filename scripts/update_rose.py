import csv
import json
import os
import argparse
from collections import Counter

# Nomi dei file di input e output
CSV_FILE = "scripts/borgo-cup_rostersM1.csv"
SQUADRE_FILE = "src/assets/data/squadre.json"
CALCIATORI_FILE = "src/assets/data/calciatori.json"
ROSE_OUTPUT_FILE = "src/assets/data/rose.json"

LIMITE_CAMBI = 7

def mappa_giocatori(rose_data):
    """{id squadra: {id giocatore: giocatore + 'ruolo'}} da un rose.json."""
    risultato = {}
    for s in rose_data.get("rose", []):
        giocatori = {}
        for rosa in s.get("rosa", []):
            for slot, lista in rosa.items():
                if isinstance(lista, list):
                    for g in lista:
                        giocatori[g["id"]] = {**g, "ruolo": slot[0]}
        risultato[s["id"]] = giocatori
    return risultato
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
    parser = argparse.ArgumentParser(description="Rigenera rose.json dal CSV, tracciando gli acquisti di mercato.")
    parser.add_argument("--sessione", type=int, choices=[1, 2, 3],
                        help="marca come acquistati in questa sessione i giocatori nuovi rispetto alla rosa precedente")
    parser.add_argument("--precedente",
                        help="rose.json di confronto (default: quello attuale), utile se è già stato rigenerato")
    parser.add_argument("--dry-run", action="store_true", help="mostra il riepilogo senza salvare")
    args = parser.parse_args()

    # Prima di sovrascrivere: gli statoM già assegnati vanno conservati
    corrente_data = carica_json(ROSE_OUTPUT_FILE) if os.path.exists(ROSE_OUTPUT_FILE) else {}
    corrente = mappa_giocatori(corrente_data)
    base = mappa_giocatori(carica_json(args.precedente)) if args.precedente else corrente
    # Cessioni già registrate: vanno conservate a ogni rigenerazione
    svincolati_storici = {s["id"]: s.get("svincolati", []) for s in corrente_data.get("rose", [])}
    acquisti = Counter()
    senza_storico = set()

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

            giocatore = {
                "id": int(id_giocatore_str),
                "nome": nome_giocatore,
                "costo": costo,
            }

            stato_m = corrente.get(id_squadra, {}).get(giocatore["id"], {}).get("statoM", 0)
            if stato_m:
                giocatore["statoM"] = stato_m  # già acquistato in una sessione precedente
            elif args.sessione:
                if id_squadra not in base:
                    senza_storico.add(id_squadra)
                elif giocatore["id"] not in base[id_squadra]:
                    giocatore["statoM"] = args.sessione
                    acquisti[id_squadra] += 1

            rose_builder[id_squadra][ruolo_raw].append(giocatore)
    
    # Cessioni: chi era nella rosa di confronto e ora non c'è più
    cessioni = Counter()
    nuovi_svincolati = {}
    if args.sessione:
        for id_squadra, ruoli_dict in rose_builder.items():
            presenti = {g["id"] for lista in ruoli_dict.values() for g in lista}
            gia_registrati = {(s["id"], s["svincolatoM"]) for s in svincolati_storici.get(id_squadra, [])}
            usciti = [
                {"id": pid, "nome": g["nome"], "ruolo": g["ruolo"], "costo": g["costo"], "svincolatoM": args.sessione}
                for pid, g in base.get(id_squadra, {}).items()
                if pid not in presenti and (pid, args.sessione) not in gia_registrati
            ]
            if usciti:
                nuovi_svincolati[id_squadra] = usciti
                cessioni[id_squadra] = len(usciti)

    # 3. Costruzione della struttura finale rose.json (p1, p2, d1, d2...)
    rose_final_list = []

    for id_squadra, ruoli_dict in rose_builder.items():
        rosa_obj = {}

        for ruolo in ["p", "d", "c", "a"]:
            if ruolo in ruoli_dict:
                for idx, giocatore in enumerate(ruoli_dict[ruolo], start=1):
                    slot_key = f"{ruolo}{idx}"
                    rosa_obj[slot_key] = [giocatore]

        voce = {"id": id_squadra, "rosa": [rosa_obj]}
        svincolati = svincolati_storici.get(id_squadra, []) + nuovi_svincolati.get(id_squadra, [])
        if svincolati:
            voce["svincolati"] = svincolati
        rose_final_list.append(voce)

    # Ordina le squadre per ID
    rose_final_list.sort(key=lambda x: x["id"])

    output_data = {"rose": rose_final_list}

    if args.sessione:
        for id_squadra in sorted(set(acquisti) | set(cessioni)):
            a, c = acquisti[id_squadra], cessioni[id_squadra]
            note = []
            if a > LIMITE_CAMBI:
                note.append(f"oltre il limite di {LIMITE_CAMBI} cambi")
            if a != c:
                note.append("acquisti e cessioni non coincidono")
            avviso = f"  ⚠️ {', '.join(note)}" if note else ""
            print(f"Squadra {id_squadra}: {a} acquisti, {c} cessioni{avviso}")

    if args.dry_run:
        print("🔍 Simulazione: nulla salvato.")
        return

    # 4. Salvataggio del file
    salva_json(ROSE_OUTPUT_FILE, output_data)
    print(f"✅ File {ROSE_OUTPUT_FILE} aggiornato con successo!")


if __name__ == "__main__":
    main()