from utils_cli import chiedi_float_opzionale, input_gol_opzionale, input_int, punti_campionato

def chiedi_chi_passa(casa, ospite):
    while True:
        scelta = input(f"  Chi passa il turno? (1 = {casa}, 2 = {ospite}, INVIO = ancora da decidere): ").strip()
        if not scelta:
            return None
        if scelta in ("1", "2"):
            return "casa" if scelta == "1" else "ospite"
        print("❌ Inserisci 1, 2 oppure INVIO.")

def decidi_passaggio(m, turno, classifiche):
    """Criteri del regolamento in caso di parità. Ritorna (lato | None, motivo); None = ancora da decidere."""
    casa, ospite = m["squadraCasa"]["nome"], m["squadraOspite"]["nome"]

    if m["golCasa"] != m["golOspite"]:
        return ("casa" if m["golCasa"] > m["golOspite"] else "ospite"), "gol"

    print(f"\n  ⚖️ Parità {m['golCasa']}:{m['golOspite']}: si applicano i criteri del regolamento.")

    # 1. Punti fatti nel confronto
    pc = chiedi_float_opzionale(f"  Punti fatti da {casa} nel confronto (INVIO se non disponibili): ")
    if pc is not None:
        po = chiedi_float_opzionale(f"  Punti fatti da {ospite} nel confronto: ")
        if po is not None and pc != po:
            return ("casa" if pc > po else "ospite"), "punti fatti"

    # 2. Spareggio
    sp = m.get("spareggio") or {}
    attuale = f" [attuale {sp['golCasa']}:{sp['golOspite']}]" if sp else ""
    gc = input_gol_opzionale(
        f"  Spareggio ({turno['giornate']['spareggio']}ª giornata) · gol {casa}{attuale} (INVIO = da giocare/invariato): "
    )
    if gc is None and not sp:
        return None, "spareggio da giocare"
    if gc is None:
        gc, go = sp["golCasa"], sp["golOspite"]
    else:
        go = input_int(f"  Spareggio · gol {ospite}: ")
    m["spareggio"] = {"golCasa": gc, "golOspite": go}
    if gc != go:
        return ("casa" if gc > go else "ospite"), "spareggio"

    # 3. Punti in Campionato (solo per i doppi confronti)
    if turno["id"] != "finale":
        a = punti_campionato(classifiche, m["squadraCasa"]["id"])
        b = punti_campionato(classifiche, m["squadraOspite"]["id"])
        if a is not None and b is not None and a != b:
            return ("casa" if a > b else "ospite"), "punti in campionato"

    print("  Ancora parità: indica chi passa (per la finale lo spareggio va ripetuto).")
    return chiedi_chi_passa(casa, ospite), "decisione manuale"

