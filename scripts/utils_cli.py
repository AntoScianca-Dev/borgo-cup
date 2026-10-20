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

def input_gol_opzionale(prompt):
    while True:
        valore = input(prompt).strip()
        if not valore:
            return None
        if valore.isdigit():
            return int(valore)
        print("❌ Inserisci un numero intero oppure premi INVIO per saltare.")

def fmt(n):
    return f"{round(n, 2):.2f}".rstrip("0").rstrip(".")

def chiedi_partecipante(partecipanti, prompt):
    """Ritorna il partecipante scelto per ID, oppure None se si preme INVIO."""
    per_id = {p["id"]: p for p in partecipanti}
    while True:
        valore = input(prompt).strip()
        if not valore:
            return None
        if valore.isdigit() and int(valore) in per_id:
            return per_id[int(valore)]
        print("❌ ID non valido. Riprova.")

def chiedi_float_opzionale(prompt):
    while True:
        valore = input(prompt).strip().replace(",", ".")
        if not valore:
            return None
        try:
            return float(valore)
        except ValueError:
            print("❌ Inserisci un numero oppure premi INVIO per saltare.")

def punti_campionato(classifiche, squadra_id):
    campionato = next((c for c in classifiche if c.get("nome") == "Campionato"), {})
    p = next((p for p in campionato.get("partecipanti", []) if p["id"] == squadra_id), None)
    return p.get("punteggio", 0) if p else None