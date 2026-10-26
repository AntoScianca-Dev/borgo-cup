import json
from datetime import datetime
from zoneinfo import ZoneInfo

PATH = "src/assets/data/calendarioA.json"
ROMA = ZoneInfo("Europe/Rome")


def leggi(valore, etichetta, errori):
    try:
        d = datetime.fromisoformat(valore)
    except (TypeError, ValueError):
        errori.append(f"{etichetta}: valore mancante o non valido (serve AAAA-MM-GGTHH:MM:SS+HH:MM).")
        return None
    if d.tzinfo is None:
        errori.append(f"{etichetta}: manca l'offset orario.")
        return None
    if d.utcoffset() != d.replace(tzinfo=ROMA).utcoffset():
        errori.append(f"{etichetta}: offset {d.strftime('%z')} sbagliato per quella data (ora legale?).")
    return d


def main():
    with open(PATH, encoding="utf-8") as f:
        giornate = json.load(f)["giornate"]

    errori, precedente = [], None
    if [g.get("giornata") for g in giornate] != list(range(1, 39)):
        errori.append("Le giornate devono essere 1..38, in ordine e senza buchi.")

    for g in giornate:
        n = g.get("giornata", "?")
        inizio = leggi(g.get("inizio"), f"{n}ª inizio", errori)
        fine = leggi(g.get("fine"), f"{n}ª fine", errori)
        if inizio and fine:
            if fine < inizio:
                errori.append(f"{n}ª: 'fine' precedente a 'inizio'.")
            if precedente and inizio <= precedente:
                errori.append(f"{n}ª: inizia prima della fine della giornata precedente.")
            precedente = fine   

    if errori:
        print("❌ Problemi trovati:")
        for e in errori:
            print("  -", e)
    else:
        provvisorie = [g["giornata"] for g in giornate if not g.get("definitivo", True)]
        print(f"✅ Calendario valido ({len(giornate)} giornate).")
        if provvisorie:
            print(f"ℹ️ Orari ancora da confermare per le giornate: {provvisorie}")


if __name__ == "__main__":
    main()