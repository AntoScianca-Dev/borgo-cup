# import json
# import pandas as pd

# excel_path = 'scripts/Quotazioni.xlsx'
# json_file_path = 'src/assets/data/calciatori.json'
# rose_file_path = 'src/assets/data/rose.json'

# # 1. Carica l'Excel
# excel_file = pd.ExcelFile(excel_path)

# # 2. Carica il JSON esistente (se esiste) per preservare i campi utente (es. selezionato)
# try:
#     with open(json_file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     json_players = {p['id']: p for p in data.get('calciatori', [])}
# except FileNotFoundError:
#     json_players = {}

# def elabora_foglio(df, e_svincolato=False):
#     for _, row in df.iterrows():
#         if pd.isna(row.get('Id')):
#             continue
            
#         p_id = int(row['Id'])
#         ruolo = str(row['R']).strip() if pd.notna(row.get('R')) else ''
#         nome = str(row['Nome']).strip() if pd.notna(row.get('Nome')) else ''
#         squadraA = str(row['Squadra']).strip() if pd.notna(row.get('Squadra')) else ''
#         quotazione = int(row['Qt.A']) if pd.notna(row.get('Qt.A')) else 0

#         if p_id in json_players:
#             # Aggiorna i dati mantenendo i campi personalizzati (es. 'selezionato')
#             json_players[p_id]['nome'] = nome
#             json_players[p_id]['ruolo'] = ruolo
#             json_players[p_id]['squadraA'] = squadraA
#             json_players[p_id]['quotazione'] = quotazione
            
#             if e_svincolato:
#                 json_players[p_id]['stato'] = 'svincolato'
#             elif json_players[p_id].get('stato') == 'svincolato':
#                 # Se il giocatore è rientrato in lista, rimuove lo stato svincolato
#                 del json_players[p_id]['stato']
#         else:
#             # Nuovo inserimento
#             giocatore = {
#                 'id': p_id,
#                 'ruolo': ruolo,
#                 'nome': nome,
#                 'squadraA': squadraA,
#                 'quotazione': quotazione,
#                 'selezionato': 0
#             }
#             if e_svincolato:
#                 giocatore['stato'] = 'svincolato'
            
#             json_players[p_id] = giocatore

# # 3. Legge il foglio 'Tutti' (giocatori attivi) e il foglio 'Ceduti' (svincolati)
# df_tutti = pd.read_excel(excel_file, sheet_name='Tutti', header=1)
# elabora_foglio(df_tutti, e_svincolato=False)

# if 'Ceduti' in excel_file.sheet_names:
#     df_ceduti = pd.read_excel(excel_file, sheet_name='Ceduti', header=1)
#     elabora_foglio(df_ceduti, e_svincolato=True)

# # 4. Salva il file JSON
# updated_data = {'calciatori': list(json_players.values())}

# with open(json_file_path, 'w', encoding='utf-8') as f:
#     json.dump(updated_data, f, ensure_ascii=False, indent=4)
# # 4. Funzione per aggiornare il campo 'selezionato' basandosi sulle rose effettive
# def calcola_selezioni_da_rose():
#     try:
#         with open(rose_file_path, 'r', encoding='utf-8') as f:
#             rose_data = json.load(f)
        
#         # Reset contatori
#         for p in json_players.values():
#             p['selezionato'] = 0

#         # Conteggio di quante volte ciascun calciatore appare nelle rose
#         for squadra_obj in rose_data.get('rose', []):
#             for rosa_dict in squadra_obj.get('rosa', []):
#                 for slot_key, lista_giocatori in rosa_dict.items():
#                     if isinstance(lista_giocatori, list):
#                         for g in lista_giocatori:
#                             g_id = g.get('id')
#                             if g_id in json_players:
#                                 json_players[g_id]['selezionato'] += 1

#         print("📊 Campo 'selezionato' aggiornato con successo dalle rose!")
#     except FileNotFoundError:
#         print("⚠️ File rose.json non trovato: il valore 'selezionato' rimarrà quello corrente.")

# # Aggiorna il contatore delle selezioni
# calcola_selezioni_da_rose()

# # 5. Salva il file JSON dei calciatori
# updated_data = {'calciatori': list(json_players.values())}

# with open(json_file_path, 'w', encoding='utf-8') as f:
#     json.dump(updated_data, f, ensure_ascii=False, indent=4)

# print(f"✅ Convertiti e aggiornati {len(json_players)} calciatori con successo!")

import argparse
import json
from collections import Counter
from pathlib import Path

import pandas as pd

EXCEL_PATH = Path('scripts/Quotazioni.xlsx')
JSON_PATH = Path('src/assets/data/calciatori.json')
ROSE_PATH = Path('src/assets/data/rose.json')


def testo(valore):
    return str(valore).strip() if pd.notna(valore) else ''


def carica_giocatori():
    """Carica il JSON esistente per preservare i campi utente (es. 'selezionato')."""
    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            return {p['id']: p for p in json.load(f).get('calciatori', [])}
    except FileNotFoundError:
        return {}


def elabora_foglio(giocatori, df, svincolati=False):
    """Aggiorna o inserisce i giocatori del foglio. Ritorna (aggiunti, aggiornati)."""
    aggiunti = aggiornati = 0

    for row in df.to_dict('records'):
        if pd.isna(row.get('Id')):
            continue

        p_id = int(row['Id'])
        dati = {
            'ruolo': testo(row.get('R')),
            'nome': testo(row.get('Nome')),
            'squadraA': testo(row.get('Squadra')),
            'quotazione': int(row['Qt.A']) if pd.notna(row.get('Qt.A')) else 0,
        }

        if p_id in giocatori:
            giocatori[p_id].update(dati)
            aggiornati += 1
        else:
            giocatori[p_id] = {'id': p_id, **dati, 'selezionato': 0}
            aggiunti += 1

        if svincolati:
            giocatori[p_id]['stato'] = 'svincolato'
        elif giocatori[p_id].get('stato') == 'svincolato':
            # Rientrato in lista: rimuove lo stato svincolato
            del giocatori[p_id]['stato']

    return aggiunti, aggiornati


def aggiorna_selezioni(giocatori):
    """Conta quante volte ogni calciatore compare nelle rose. Ritorna True se aggiornato."""
    try:
        with open(ROSE_PATH, 'r', encoding='utf-8') as f:
            rose_data = json.load(f)
    except FileNotFoundError:
        print("⚠️  rose.json non trovato: 'selezionato' resta quello attuale.")
        return False

    conteggio = Counter(
        g.get('id')
        for squadra in rose_data.get('rose', [])
        for rosa in squadra.get('rosa', [])
        for lista in rosa.values()
        if isinstance(lista, list)
        for g in lista
    )

    for p_id, p in giocatori.items():
        p['selezionato'] = conteggio.get(p_id, 0)

    print("📊 Campo 'selezionato' aggiornato dalle rose.")
    return True


def chiedi_si_no(domanda, default=False):
    suffisso = 'S/n' if default else 's/N'
    risposta = input(f'{domanda} [{suffisso}]: ').strip().lower()
    return default if not risposta else risposta in ('s', 'si', 'sì', 'y', 'yes')


def main():
    parser = argparse.ArgumentParser(description='Aggiorna calciatori.json dalle quotazioni Excel.')
    parser.add_argument(
        '--selezioni',
        action=argparse.BooleanOptionalAction,
        default=None,
        help="aggiorna (o no) il conteggio 'selezionato' dalle rose, senza chiedere conferma",
    )
    args = parser.parse_args()

    # Se non indicato da riga di comando, lo chiede
    vuoi_selezioni = (
        args.selezioni
        if args.selezioni is not None
        else chiedi_si_no('Aggiornare il conteggio delle selezioni dalle rose?')
    )

    giocatori = carica_giocatori()
    excel = pd.ExcelFile(EXCEL_PATH)

    # Foglio 'Tutti' (attivi) e foglio 'Ceduti' (svincolati)
    agg_t, upd_t = elabora_foglio(giocatori, pd.read_excel(excel, sheet_name='Tutti', header=1))
    agg_c = upd_c = 0
    if 'Ceduti' in excel.sheet_names:
        agg_c, upd_c = elabora_foglio(
            giocatori, pd.read_excel(excel, sheet_name='Ceduti', header=1), svincolati=True
        )

    if vuoi_selezioni:
        aggiorna_selezioni(giocatori)

    # Un solo salvataggio, ordinato per id (diff più puliti su git)
    JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump({'calciatori': sorted(giocatori.values(), key=lambda p: p['id'])},
                    f, ensure_ascii=False, indent=4)

    print(
        f"✅ {len(giocatori)} calciatori totali "
        f"({agg_t + agg_c} nuovi, {upd_t + upd_c} aggiornati, {agg_c + upd_c} svincolati)."
    )


if __name__ == '__main__':
    main()