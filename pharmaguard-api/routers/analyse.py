from datetime import datetime
from itertools import combinations

from fastapi import APIRouter, Request

from data.demo_db import (
    INTERACTIONS_DB,
    MEDICAMENTS_DB,
    next_analyse_id,
    next_notif_id,
)
from models.ordonnance import AnalyseResponse, InteractionResult, OrdonnanceRequest
from services.recherche import resoudre

router = APIRouter()

MESSAGES = {
    0: "Aucune interaction répertoriée entre ces médicaments.",
    1: "Interaction mineure : information à prendre en compte.",
    2: "Précaution d'emploi : surveillance recommandée.",
    3: "Association déconseillée : contacter le prescripteur.",
    4: "Contre-indication : ne pas délivrer sans avis du prescripteur.",
}

# Index {paire de molécules: interaction} pour éviter de reparcourir la liste
_INDEX = {frozenset((i["molecule_a"], i["molecule_b"])): i for i in INTERACTIONS_DB}


@router.post("/analyse", response_model=AnalyseResponse)
def analyser_ordonnance(ordonnance: OrdonnanceRequest, request: Request):
    # 1. Résoudre chaque saisie en médicament connu (sans doublon)
    cles, non_reconnus = [], []
    for med in ordonnance.medicaments:
        key = resoudre(med.nom)
        if key is None:
            non_reconnus.append(med.nom)
        elif key not in cles:
            cles.append(key)

    # 2. Comparer toutes les paires
    interactions = []
    for key_a, key_b in combinations(cles, 2):
        med_a, med_b = MEDICAMENTS_DB[key_a], MEDICAMENTS_DB[key_b]
        regle = _INDEX.get(frozenset((med_a["molecule"], med_b["molecule"])))
        if regle:
            interactions.append(
                InteractionResult(
                    molecule_a=med_a["molecule"],
                    molecule_b=med_b["molecule"],
                    dci_a=med_a["dci"],
                    dci_b=med_b["dci"],
                    **{k: regle[k] for k in ("niveau", "label", "couleur", "mecanisme", "conduite", "source")},
                )
            )

    interactions.sort(key=lambda i: i.niveau, reverse=True)
    niveau_max = interactions[0].niveau if interactions else 0

    # 3. Enregistrer dans l'historique
    resultat = AnalyseResponse(
        id=next_analyse_id(),
        patient_nom=ordonnance.patient_nom.strip(),
        patient_age=ordonnance.patient_age,
        date=datetime.now().isoformat(timespec="seconds"),
        nb_medicaments=len(cles),
        nb_interactions=len(interactions),
        niveau_max=niveau_max,
        medicaments=[MEDICAMENTS_DB[k]["nom_commercial"] for k in cles],
        non_reconnus=non_reconnus,
        interactions=interactions,
        message=MESSAGES[niveau_max],
    )
    request.state.demo_session["historique"].append(resultat.model_dump())

    # 4. Notification pour chaque interaction de niveau 3 ou 4
    for inter in interactions:
        if inter.niveau >= 3:
            request.state.demo_session["notifications"].append({
                "id": next_notif_id(),
                "type": "alerte",
                "titre": inter.label,
                "message": f"{resultat.patient_nom} — {inter.dci_a} × {inter.dci_b} (niveau {inter.niveau})",
                "date": resultat.date,
                "lue": False,
                "niveau": inter.niveau,
                "analyse_id": resultat.id,
            })

    return resultat
