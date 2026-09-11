import json
import pandas as pd

excel_path = 'scripts/Quotazioni.xlsx'
json_file_path = 'src/assets/data/calciatori.json'

# 1. Carica l'Excel
excel_file = pd.ExcelFile(excel_path)

# 2. Carica il JSON esistente (se esiste) per preservare i campi utente (es. selezionato)
try:
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    json_players = {p['id']: p for p in data.get('calciatori', [])}
except FileNotFoundError:
    json_players = {}

def elabora_foglio(df, e_svincolato=False):
    for _, row in df.iterrows():
        if pd.isna(row.get('Id')):
            continue
            
        p_id = int(row['Id'])
        ruolo = str(row['R']).strip() if pd.notna(row.get('R')) else ''
        nome = str(row['Nome']).strip() if pd.notna(row.get('Nome')) else ''
        quotazione = int(row['Qt.A']) if pd.notna(row.get('Qt.A')) else 0

        if p_id in json_players:
            # Aggiorna i dati mantenendo i campi personalizzati (es. 'selezionato')
            json_players[p_id]['nome'] = nome
            json_players[p_id]['ruolo'] = ruolo
            json_players[p_id]['quotazione'] = quotazione
            
            if e_svincolato:
                json_players[p_id]['stato'] = 'svincolato'
            elif json_players[p_id].get('stato') == 'svincolato':
                # Se il giocatore è rientrato in lista, rimuove lo stato svincolato
                del json_players[p_id]['stato']
        else:
            # Nuovo inserimento
            giocatore = {
                'id': p_id,
                'ruolo': ruolo,
                'nome': nome,
                'quotazione': quotazione,
                'selezionato': 0
            }
            if e_svincolato:
                giocatore['stato'] = 'svincolato'
            
            json_players[p_id] = giocatore

# 3. Legge il foglio 'Tutti' (giocatori attivi) e il foglio 'Ceduti' (svincolati)
df_tutti = pd.read_excel(excel_file, sheet_name='Tutti', header=1)
elabora_foglio(df_tutti, e_svincolato=False)

if 'Ceduti' in excel_file.sheet_names:
    df_ceduti = pd.read_excel(excel_file, sheet_name='Ceduti', header=1)
    elabora_foglio(df_ceduti, e_svincolato=True)

# 4. Salva il file JSON
updated_data = {'calciatori': list(json_players.values())}

with open(json_file_path, 'w', encoding='utf-8') as f:
    json.dump(updated_data, f, ensure_ascii=False, indent=4)

print(f"✅ Convertiti {len(json_players)} calciatori con successo!")