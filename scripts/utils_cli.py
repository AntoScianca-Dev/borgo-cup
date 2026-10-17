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
