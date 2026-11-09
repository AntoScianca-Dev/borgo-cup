from copy import deepcopy

from utils_cli import fmt, input_float, input_int, sincronizza_competizione

NOME_CAMPIONATO = "Campionato"
SOGLIE = {1: 70.0, 2: 73.0, 3: 75.0, 4: 78.0, 5: 80.0}


# --- Utilità --------------------------------------------------

def espandi_giornate(spec):
    """[8, {"da": 3, "a": 29, "passo": 2}] -> lista di giornate (stesso formato di giornateA nel sito)."""
    giornate = []
    for voce in spec or []:
        if isinstance(voce, int):
            giornate.append(voce)
        else:
            giornate.extend(range(voce["da"], voce["a"] + 1, voce.get("passo", 1)))
    return giornate


def trova_meta(data_comp, nome):
    """La voce della competizione in competizioni.json."""
    if not data_comp:
        return None
    return next((c for c in data_comp.get("competizioni", []) if c.get("nome") == nome), None)


def conferma(domanda):
    return input(f"{domanda} (SI/NO): ").strip().upper() == "SI"


def supera(valore, soglia):
    return round(valore, 2) >= soglia


def ultimo_step(partecipanti):
    """Ultimo step con almeno un punteggio inserito (0 = nessuno)."""
    return max((n for n in SOGLIE if any(p.get(f"step{n}") for p in partecipanti)), default=0)


def eleggibili(partecipanti, step):
    """Chi gioca lo step: tutti al primo, poi solo chi ha superato la soglia dello step precedente."""
    if step == 1:
        return list(partecipanti)
    prec = f"step{step - 1}"
    return [p for p in partecipanti if p.get(prec) and supera(p[prec], SOGLIE[step - 1])]


# --- Iscrizione delle squadre ---------------------------------

def iscrivi_squadre(comp, squadre, meta):
    """Alla partenza (competizione 'In attesa' o senza partecipanti) iscrive tutte le squadre."""
    stato = (meta or {}).get("stato", "")
    esistenti = comp.get("partecipanti", [])

    if esistenti and stato != "In attesa":
        return True
    if not squadre:
        print("⚠️ Nessuna squadra in squadre.json: non posso iscrivere i partecipanti.")
        return bool(esistenti)
    if esistenti and not conferma(
        f"Ci sono già {len(esistenti)} partecipanti ma la competizione è 'In attesa'. Ricrearli da squadre.json"
    ):
        return True

    comp["partecipanti"] = [
        {"id": s["id"], "nome": s["nome"], "border": s.get("border", ""), "attivo": "SI", "punteggio": 0}
        for s in sorted(squadre, key=lambda s: s["id"])
    ]
    print(f"✅ Iscritte {len(comp['partecipanti'])} squadre: tutte attive.")
    return True


# --- Scelte iniziali ------------------------------------------

def scegli_step(partecipanti):
    ultimo = ultimo_step(partecipanti)
    validi = [n for n in (ultimo, ultimo + 1) if n in SOGLIE]
    if ultimo:
        print(f"Ultimo step inserito: {ultimo}. Puoi inserire lo step {ultimo + 1} o correggere il {ultimo}.")
    while True:
        step = input_int(f"Step da aggiornare ({'/'.join(map(str, validi))}): ")
        if step in validi:
            return step
        print("❌ Step non valido.")


def giornata_serie_a(meta, step):
    """La giornata di Serie A dello step, da 'giornateA' in competizioni.json (altrimenti la chiede)."""
    giornate = espandi_giornate((meta or {}).get("giornateA"))
    if len(giornate) >= step:
        return giornate[step - 1]
    valore = input_int(f"Giornata di Serie A dello step {step} (0 = nessuna proposta dal Campionato): ")
    return valore or None


def punteggi_campionato(classifiche, giornata_a):
    """{id squadra: punteggio di giornata} dal Campionato, se già inseriti."""
    campionato = next((c for c in classifiche if c.get("nome") == NOME_CAMPIONATO), None)
    if not campionato or not giornata_a:
        return {}
    chiave = str(giornata_a)
    return {
        p["id"]: p["punteggiGiornata"][chiave]
        for p in campionato.get("partecipanti", [])
        if chiave in p.get("punteggiGiornata", {})
    }


def stampa_tabella(giocano, punteggi, origine, soglia, step):
    passano = sum(1 for p in giocano if supera(punteggi[p["id"]], soglia))
    print(f"\n📊 Step {step} · soglia {fmt(soglia)} · passano {passano}, eliminate {len(giocano) - passano}")

    separatore = False
    for i, p in enumerate(sorted(giocano, key=lambda p: -punteggi[p["id"]]), start=1):
        valore = punteggi[p["id"]]
        if not separatore and not supera(valore, soglia):
            print(f"      ──────── soglia {fmt(soglia)} ────────")
            separatore = True
        esito = "✅" if supera(valore, soglia) else "❌"
        print(f"  {i:>2}. [{p['id']:>2}] {p['nome']:<25} {fmt(valore):>7}  {origine[p['id']]:<10} {esito}")


# --- Handler principale ---------------------------------------

def aggiorna_squid_game_cup(comp, squadre, data_comp, classifiche):
    print(f"\n--- Aggiornamento: {comp['nome']} ---")
    meta = trova_meta(data_comp, comp["nome"])
    backup = deepcopy(comp.get("partecipanti", []))

    if not iscrivi_squadre(comp, squadre, meta):
        return
    partecipanti = comp["partecipanti"]

    step = scegli_step(partecipanti)
    giocano = eleggibili(partecipanti, step)
    if not giocano:
        print(f"⚠️ Nessuna squadra ha superato lo step {step - 1}: la competizione è terminata.")
        comp["partecipanti"] = backup
        return

    soglia, chiave = SOGLIE[step], f"step{step}"
    print(f"\n{len(giocano)} squadre in gara allo step {step} (soglia {fmt(soglia)}).")

    # 1. Proposta: punteggi di giornata del Campionato
    giornata_a = giornata_serie_a(meta, step)
    dal_campionato = punteggi_campionato(classifiche, giornata_a)
    if dal_campionato:
        print(f"Proposta: punteggi del Campionato della {giornata_a}ª giornata di Serie A.")
    elif giornata_a:
        print(f"⚠️ Nessun punteggio del Campionato salvato per la {giornata_a}ª giornata: li inserisco a mano.")

    punteggi, origine = {}, {}
    for p in giocano:
        if p.get(chiave):  # step già inserito (correzione)
            punteggi[p["id"]], origine[p["id"]] = p[chiave], "salvato"
        elif p["id"] in dal_campionato:
            punteggi[p["id"]], origine[p["id"]] = dal_campionato[p["id"]], "Campionato"

    mancanti = [p for p in sorted(giocano, key=lambda p: p["id"]) if p["id"] not in punteggi]
    if mancanti:
        print(f"\nMancano {len(mancanti)} punteggi:")
        for p in mancanti:
            punteggi[p["id"]] = input_float(f"  Punteggio di {p['nome']}: ")
            origine[p["id"]] = "manuale"

    # 2. Conferma o modifica
    ids = {p["id"] for p in giocano}
    while True:
        stampa_tabella(giocano, punteggi, origine, soglia, step)
        scelta = input("\nINVIO = conferma tutto · ID squadra = modifica · A = annulla: ").strip().upper()
        if scelta == "":
            break
        if scelta == "A":
            comp["partecipanti"] = backup
            print("Nessuna modifica.")
            return
        if scelta.isdigit() and int(scelta) in ids:
            p = next(p for p in giocano if p["id"] == int(scelta))
            punteggi[p["id"]] = input_float(
                f"  Nuovo punteggio di {p['nome']} (attuale {fmt(punteggi[p['id']])}): "
            )
            origine[p["id"]] = "manuale"
        else:
            print("❌ ID non valido.")

    passano = {p["id"] for p in giocano if supera(punteggi[p["id"]], soglia)}

    # 3. Regole del regolamento se nessuno passa lo step
    terminata = False
    if not passano:
        if step == 1:
            if not conferma(
                "Nessuna squadra supera la soglia al primo step: la competizione è annullata e riparte "
                "dalla giornata successiva. Annullarla"
            ):
                comp["partecipanti"] = backup
                print("Nessuna modifica.")
                return
            for p in partecipanti:
                for n in SOGLIE:
                    p.pop(f"step{n}", None)
                p["punteggio"], p["attivo"] = 0, "SI"
            sincronizza_competizione(data_comp, comp["nome"], 0)
            print("🔄 Competizione annullata. Aggiorna 'giornateA' in competizioni.json con le nuove giornate.")
            return

        migliore = max(round(punteggi[p["id"]], 2) for p in giocano)
        passano = {p["id"] for p in giocano if round(punteggi[p["id"]], 2) == migliore}
        terminata = True
        print("\n🏁 Nessuna squadra accede allo step successivo: la competizione termina.")
    elif step == 5:
        terminata = True

    # 4. Salvataggio dei dati
    for p in giocano:
        p[chiave] = punteggi[p["id"]]
        p["punteggio"] = punteggi[p["id"]]
        p["attivo"] = "SI" if p["id"] in passano else "NO"

    sincronizza_competizione(data_comp, comp["nome"], step)
    if terminata:
        if meta:
            meta["stato"], meta["avanzamento"] = "Terminata", 100.0
        vincitori = [p for p in giocano if p["id"] in passano]
        print("🏆 Vince: " + ", ".join(f"{p['nome']} ({fmt(punteggi[p['id']])})" for p in vincitori))
        if len(vincitori) > 1:
            print("⚠️ Più squadre: controlla nel regolamento come si assegna il premio.")
    else:
        print(f"✅ Step {step}: {len(passano)} squadre avanzano, {len(giocano) - len(passano)} eliminate.")