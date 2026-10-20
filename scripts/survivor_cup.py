from copy import deepcopy

from utils_cli import (
    chiedi_float_opzionale, chiedi_partecipante, fmt, input_float, input_int,
    punti_campionato, sincronizza_competizione,
)

NOME_SURVIVOR = "Survivor Cup"
ULTIMO_STEP_DOPPIA_ELIMINAZIONE = 9  # fino allo step 9 escono 2 squadre, dal 10 una sola


def eliminati_per_step(step):
    return 2 if step <= ULTIMO_STEP_DOPPIA_ELIMINAZIONE else 1


def separa(squadre, punti, servono):
    """Dalle peggiori. Ritorna (eliminate_certe, a_pari_merito, posti_rimasti).
    Se a_pari_merito è vuoto non c'è ambiguità."""
    ordinate = sorted(squadre, key=punti)
    soglia = punti(ordinate[servono - 1])
    certe = [p for p in ordinate if punti(p) < soglia]
    pari = [p for p in ordinate if punti(p) == soglia]
    posti = servono - len(certe)
    if len(pari) == posti:
        return certe + pari, [], 0
    return certe, pari, posti


def elimina(squadre, step):
    for p in squadre:
        p["stato"] = "eliminato"
        p["eliminataAlloStep"] = step
        print(f"  ❌ Eliminata: {p['nome']}")


def scegli_a_mano(squadre, posti):
    print("  Ancora parità: scegli tu chi viene eliminata.")
    rimaste, scelte = list(squadre), []
    while len(scelte) < posti:
        for p in rimaste:
            print(f"    [{p['id']}] {p['nome']}")
        p = chiedi_partecipante(rimaste, f"  ID squadra eliminata ({len(scelte) + 1}/{posti}): ")
        if p is not None:
            scelte.append(p)
            rimaste.remove(p)
    return scelte


# --- Spareggio in sospeso -------------------------------------

def risolvi_spareggio(comp, classifiche):
    """Ritorna True se lo spareggio è risolto; False se rimandato o da ripetere (finale)."""
    sp = comp["spareggio"]
    squadre = [p for p in comp["partecipanti"] if p["id"] in sp["squadre"] and p.get("stato") == "attivo"]

    print(f"\n⚖️ Spareggio dello step {sp['step']}: {sp['daEliminare']} squadra/e da eliminare tra:")
    for p in squadre:
        print(f"  [{p['id']:>2}] {p['nome']}")

    punteggi = {}
    for p in squadre:
        valore = chiedi_float_opzionale(f"  Punteggio di {p['nome']} nello spareggio (INVIO = non ancora giocato): ")
        if valore is None:
            print("  Spareggio rimandato: lo step successivo si può inserire solo dopo averlo risolto.")
            return False
        punteggi[p["id"]] = round(valore, 2)

    certe, pari, posti = separa(squadre, lambda p: punteggi[p["id"]], sp["daEliminare"])
    elimina(certe, sp["step"])

    if pari:
        if sp["finale"]:
            print("  ⚖️ Parità anche nello spareggio: nello step finale va ripetuto.")
            comp["spareggio"] = {**sp, "squadre": [p["id"] for p in pari], "daEliminare": posti}
            return False

        print("  ⚖️ Parità anche nello spareggio: conta la somma dei punti in Campionato (meno punti = eliminata).")
        pc = lambda p: round(punti_campionato(classifiche, p["id"]) or 0, 2)
        certe2, pari2, posti2 = separa(pari, pc, posti)
        elimina(certe2, sp["step"])
        if pari2:
            elimina(scegli_a_mano(pari2, posti2), sp["step"])

    comp.pop("spareggio", None)
    return True


# --- Punteggi dello step --------------------------------------

def inserisci_punteggi_step(attivi, step):
    """Ritorna True se tutti i punteggi sono inseriti, False se l'utente annulla."""
    chiave = str(step)

    print(f"\nPunteggi dello step {step} ({len(attivi)} squadre attive):")
    for p in sorted(attivi, key=lambda x: x["id"]):
        valore = p.get("punteggiGiornata", {}).get(chiave)
        print(f"  [{p['id']:>2}] {p['nome']:<25} {'✓ ' + fmt(valore) if valore is not None else '–'}")

    while True:
        inseriti = sum(1 for p in attivi if chiave in p.get("punteggiGiornata", {}))
        p = chiedi_partecipante(attivi, f"\n[{inseriti}/{len(attivi)}] ID squadra (INVIO per terminare): ")

        if p is None:
            if inseriti == len(attivi):
                return True
            if inseriti == 0:
                return False
            mancanti = [m["nome"] for m in attivi if chiave not in m.get("punteggiGiornata", {})]
            print("  Servono tutti i punteggi. Mancano: " + ", ".join(mancanti))
            if input("  Annullare e scartare quelli inseriti? (SI/NO): ").strip().upper() == "SI":
                return False
            continue

        storico = p.setdefault("punteggiGiornata", {})
        precedente = storico.get(chiave)
        attuale = f" [attuale {fmt(precedente)}]" if precedente is not None else ""
        nuovo = input_float(f"  Punteggio di {p['nome']}{attuale}: ")

        # Come nell'handler originale: totale = somma dei punteggi, totale2 = somma pesata sullo step.
        # Si aggiorna con la differenza, così reinserire una squadra corregge senza raddoppiare.
        vecchio = precedente or 0
        p["punteggio"] = nuovo
        p["totale"] = round(p.get("totale", 0) - vecchio + nuovo, 2)
        p["totale2"] = round(p.get("totale2", 0) - vecchio * step + nuovo * step, 2)
        storico[chiave] = nuovo
        print(f"  ✅ {p['nome']}: {fmt(nuovo)}")


def mostra_esito(attivi, step, certe, pari, posti):
    chiave = str(step)
    ids_certe = {p["id"] for p in certe}
    ids_pari = {p["id"] for p in pari}

    print(f"\n📊 Step {step}: punteggi dal migliore al peggiore")
    for i, p in enumerate(sorted(attivi, key=lambda p: -p["punteggiGiornata"][chiave]), start=1):
        marca = "❌ eliminata" if p["id"] in ids_certe else "⚖️ spareggio" if p["id"] in ids_pari else ""
        print(f"  {i:>2}. [{p['id']:>2}] {p['nome']:<25} {fmt(p['punteggiGiornata'][chiave]):>7}   {marca}")

    if pari:
        print(f"\n  ⚖️ {len(pari)} squadre a pari punteggio per {posti} posto/i: faranno lo spareggio e uscirà chi fa peggio.")


# --- Handler principale ---------------------------------------

def aggiorna_survivor_cup(comp, data_comp, classifiche):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    partecipanti = comp.get("partecipanti", [])

    # Se c'è uno spareggio dello step precedente, va chiuso prima
    if comp.get("spareggio") and not risolvi_spareggio(comp, classifiche):
        return

    step = input_int("Inserisci il numero dello step: ")
    ultimo = comp.get("ultimoStep")
    if ultimo == step:
        print(f"⚠️ Lo step {step} è già stato elaborato. Per correggerlo ripristina classifiche.json dalla versione precedente.")
        return
    if ultimo is not None and step != ultimo + 1:
        if input(f"⚠️ L'ultimo step elaborato è il {ultimo}: stai saltando degli step. Continuare? (SI/NO): ").strip().upper() != "SI":
            return

    attivi = [p for p in partecipanti if p.get("stato") == "attivo"]
    if len(attivi) <= 1:
        print("⚠️ Rimane una sola squadra attiva: la competizione è conclusa.")
        return

    da_eliminare = min(eliminati_per_step(step), len(attivi) - 1)
    finale = len(attivi) - da_eliminare == 1
    chiave = str(step)
    print(f"\nSquadre attive: {len(attivi)} · da eliminare in questo step: {da_eliminare}" + (" (step finale)" if finale else ""))

    backup = deepcopy(partecipanti)

    while True:
        if not inserisci_punteggi_step(attivi, step):
            comp["partecipanti"] = backup
            print("Nessuna modifica.")
            return

        certe, pari, posti = separa(attivi, lambda p: round(p["punteggiGiornata"][chiave], 2), da_eliminare)
        mostra_esito(attivi, step, certe, pari, posti)

        scelta = input("\nConfermi? (S = conferma, C = correggi un punteggio, A = annulla): ").strip().upper()
        if scelta == "S":
            break
        if scelta == "A":
            comp["partecipanti"] = backup
            print("Nessuna modifica.")
            return

    elimina(certe, step)
    if pari:
        comp["spareggio"] = {"step": step, "daEliminare": posti, "squadre": [p["id"] for p in pari], "finale": finale}
        print("\n⚖️ Spareggio registrato: alla prossima esecuzione ti chiederò il risultato prima dello step successivo.")

    comp["ultimoStep"] = step
    sincronizza_competizione(data_comp, comp["nome"], step)

    rimaste = [p for p in partecipanti if p.get("stato") == "attivo"]
    if len(rimaste) == 1 and not pari:
        print(f"\n🏆 Vincitrice: {rimaste[0]['nome']}")