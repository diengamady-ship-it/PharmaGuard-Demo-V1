"""Données FICTIVES pour la démonstration.

Les fiches d'interaction sont simplifiées et ne remplacent pas le Thésaurus ANSM,
le Vidal ou le Martindale. Ne pas utiliser pour une décision clinique.
"""


MEDICAMENTS_DB = {
    "kardegic": {
        "nom_commercial": "Kardégic",
        "dci": "Aspirine",
        "molecule": "acide_acetylsalicylique",
        "classe": "Antiagrégant plaquettaire / AINS"
    },
    "sintrom": {
        "nom_commercial": "Sintrom",
        "dci": "Acénocoumarol",
        "molecule": "acenocoumarol",
        "classe": "Anticoagulant AVK"
    },
    "brufen": {
        "nom_commercial": "Brufen",
        "dci": "Ibuprofène",
        "molecule": "ibuprofene",
        "classe": "AINS"
    },
    "metformine": {
        "nom_commercial": "Metformine EG",
        "dci": "Metformine",
        "molecule": "metformine",
        "classe": "Antidiabétique biguanide"
    },
    "lisinopril": {
        "nom_commercial": "Lisinopril Arrow",
        "dci": "Lisinopril",
        "molecule": "lisinopril",
        "classe": "IEC antihypertenseur"
    },
    "amoxicilline": {
        "nom_commercial": "Amoxicilline Sandoz",
        "dci": "Amoxicilline",
        "molecule": "amoxicilline",
        "classe": "Antibiotique pénicilline"
    },
    "doliprane": {
        "nom_commercial": "Doliprane",
        "dci": "Paracétamol",
        "molecule": "paracetamol",
        "classe": "Antalgique / Antipyrétique"
    },
    "amlodipine": {
        "nom_commercial": "Amlor",
        "dci": "Amlodipine",
        "molecule": "amlodipine",
        "classe": "Inhibiteur calcique antihypertenseur"
    },
    "omeprazole": {
        "nom_commercial": "Mopral",
        "dci": "Oméprazole",
        "molecule": "omeprazole",
        "classe": "IPP (Inhibiteur de la Pompe à Protons)"
    },
    "atorvastatine": {
        "nom_commercial": "Tahor",
        "dci": "Atorvastatine",
        "molecule": "atorvastatine",
        "classe": "Statine hypolipémiant"
    },
    "furosemide": {
        "nom_commercial": "Lasilix",
        "dci": "Furosémide",
        "molecule": "furosemide",
        "classe": "Diurétique de l'anse"
    },
    "ciprofloxacine": {
        "nom_commercial": "Ciflox",
        "dci": "Ciprofloxacine",
        "molecule": "ciprofloxacine",
        "classe": "Antibiotique fluoroquinolone"
    },
    "diazepam": {
        "nom_commercial": "Valium",
        "dci": "Diazépam",
        "molecule": "diazepam",
        "classe": "Benzodiazépine anxiolytique"
    },
    "prednisolone": {
        "nom_commercial": "Solupred",
        "dci": "Prednisolone",
        "molecule": "prednisolone",
        "classe": "Corticoïde anti-inflammatoire"
    },
    "salbutamol": {
        "nom_commercial": "Ventoline",
        "dci": "Salbutamol",
        "molecule": "salbutamol",
        "classe": "Bronchodilatateur bêta-2 agoniste"
    },
}

# Matrice d'interactions (simplifiée, inspirée des référentiels cités dans "source")
INTERACTIONS_DB = [
    {
        "molecule_a": "acide_acetylsalicylique",
        "molecule_b": "acenocoumarol",
        "niveau": 4,
        "label": "Contre-indication",
        "couleur": "red",
        "mecanisme": "L'aspirine inhibe l'agrégation plaquettaire et potentialise l'effet anticoagulant de l'acénocoumarol → risque hémorragique majeur.",
        "conduite": "Association contre-indiquée. Contacter le prescripteur immédiatement.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "ibuprofene",
        "molecule_b": "acenocoumarol",
        "niveau": 3,
        "label": "Association déconseillée",
        "couleur": "orange",
        "mecanisme": "Les AINS augmentent le risque hémorragique avec les AVK par inhibition des prostaglandines gastroprotectrices.",
        "conduite": "Éviter l'association. Substituer par Paracétamol.",
        "source": "Martindale 2024"
    },
    {
        "molecule_a": "ibuprofene",
        "molecule_b": "lisinopril",
        "niveau": 2,
        "label": "Précaution d'emploi",
        "couleur": "amber",
        "mecanisme": "Les AINS réduisent l'effet antihypertenseur des IEC. Risque d'insuffisance rénale aiguë.",
        "conduite": "Surveiller la PA et la fonction rénale. Limiter la durée du traitement AINS.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "metformine",
        "molecule_b": "lisinopril",
        "niveau": 1,
        "label": "Information",
        "couleur": "blue",
        "mecanisme": "Les IEC peuvent provoquer une légère hypoglycémie par augmentation de la sensibilité à l'insuline.",
        "conduite": "Surveiller la glycémie en début de traitement combiné.",
        "source": "Martindale 2024"
    },
    {
        "molecule_a": "ciprofloxacine",
        "molecule_b": "metformine",
        "niveau": 3,
        "label": "Association déconseillée",
        "couleur": "orange",
        "mecanisme": "Les fluoroquinolones perturbent la régulation glycémique. Risque d'hypoglycémie sévère ou d'hyperglycémie chez les patients sous metformine.",
        "conduite": "Éviter si possible. Si nécessaire, renforcer l'autosurveillance glycémique.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "prednisolone",
        "molecule_b": "metformine",
        "niveau": 2,
        "label": "Précaution d'emploi",
        "couleur": "amber",
        "mecanisme": "Les corticoïdes induisent une hyperglycémie dose-dépendante qui antagonise l'effet de la metformine.",
        "conduite": "Renforcer la surveillance glycémique, adapter la posologie de metformine si cure > 10 jours.",
        "source": "Martindale 2024"
    },
    {
        "molecule_a": "furosemide",
        "molecule_b": "lisinopril",
        "niveau": 2,
        "label": "Précaution d'emploi",
        "couleur": "amber",
        "mecanisme": "Risque d'hypotension artérielle brutale à l'initiation du traitement par IEC chez le patient sous diurétique.",
        "conduite": "Débuter l'IEC à faible dose. Arrêter le diurétique 2-3 jours avant si possible.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "ibuprofene",
        "molecule_b": "furosemide",
        "niveau": 2,
        "label": "Précaution d'emploi",
        "couleur": "amber",
        "mecanisme": "Les AINS réduisent l'effet diurétique et augmentent le risque d'insuffisance rénale fonctionnelle.",
        "conduite": "Hydrater le patient, surveiller la fonction rénale.",
        "source": "Martindale 2024"
    },
    {
        "molecule_a": "omeprazole",
        "molecule_b": "metformine",
        "niveau": 1,
        "label": "Information",
        "couleur": "blue",
        "mecanisme": "Interaction pharmacocinétique mineure (transporteurs rénaux) sans conséquence clinique habituelle.",
        "conduite": "Aucune action requise en pratique courante, simple surveillance.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "prednisolone",
        "molecule_b": "acide_acetylsalicylique",
        "niveau": 3,
        "label": "Association déconseillée",
        "couleur": "orange",
        "mecanisme": "Majoration du risque hémorragique digestif.",
        "conduite": "Contre-indiqué si antécédent d'ulcère. Associer un IPP si absolument nécessaire.",
        "source": "Vidal 2024"
    },
    {
        "molecule_a": "diazepam",
        "molecule_b": "omeprazole",
        "niveau": 2,
        "label": "Précaution d'emploi",
        "couleur": "amber",
        "mecanisme": "L'oméprazole inhibe le CYP2C19 et ralentit le métabolisme du diazépam, augmentant sa concentration plasmatique et ses effets sédatifs.",
        "conduite": "Réduire la posologie du diazépam. Surveiller la somnolence.",
        "source": "Martindale 2024"
    },
    {
        "molecule_a": "ibuprofene",
        "molecule_b": "prednisolone",
        "niveau": 3,
        "label": "Association déconseillée",
        "couleur": "orange",
        "mecanisme": "L'association AINS + corticoïdes majore considérablement le risque de toxicité gastro-intestinale (ulcères, perforations).",
        "conduite": "Éviter l'association. Si indispensable, protéger avec un IPP.",
        "source": "Vidal 2024"
    },
]

# Historique des analyses (en mémoire, réinitialisé à chaque redémarrage)
_MESSAGES = {
    1: "Interaction mineure : information à prendre en compte.",
    3: "Association déconseillée : contacter le prescripteur.",
    4: "Contre-indication : ne pas délivrer sans avis du prescripteur.",
}


def _analyse_demo(id_, patient, age, date, cles):
    """Construit une entrée d'historique cohérente avec les tables ci-dessus."""
    meds = [MEDICAMENTS_DB[k] for k in cles]
    interactions = []
    for i, a in enumerate(meds):
        for b in meds[i + 1:]:
            for regle in INTERACTIONS_DB:
                if {regle["molecule_a"], regle["molecule_b"]} == {a["molecule"], b["molecule"]}:
                    interactions.append({
                        "molecule_a": a["molecule"], "molecule_b": b["molecule"],
                        "dci_a": a["dci"], "dci_b": b["dci"],
                        **{k: regle[k] for k in ("niveau", "label", "couleur", "mecanisme", "conduite", "source")},
                    })
    interactions.sort(key=lambda x: x["niveau"], reverse=True)
    niveau_max = interactions[0]["niveau"] if interactions else 0
    return {
        "id": id_,
        "patient_nom": patient,
        "patient_age": age,
        "date": date,
        "nb_medicaments": len(meds),
        "nb_interactions": len(interactions),
        "niveau_max": niveau_max,
        "medicaments": [m["nom_commercial"] for m in meds],
        "non_reconnus": [],
        "interactions": interactions,
        "message": _MESSAGES.get(niveau_max, ""),
    }


HISTORIQUE_ANALYSES = [
    _analyse_demo("demo-001", "Moussa Diallo", 58, "2026-02-28T14:30:00",
                  ["kardegic", "sintrom", "brufen", "metformine", "lisinopril"]),
    _analyse_demo("demo-002", "Fatou Seck", 35, "2026-02-27T09:15:00",
                  ["metformine", "lisinopril"]),
    _analyse_demo("demo-003", "Omar Sy", 42, "2026-02-21T16:45:00",
                  ["brufen", "sintrom", "doliprane"]),
]

NOTIFICATIONS = [
    {
        "id": "notif-001",
        "type": "alerte",
        "titre": "Contre-indication",
        "message": "Moussa Diallo — Aspirine × Acénocoumarol (niveau 4)",
        "date": "2026-02-28T14:30:00",
        "lue": False,
        "niveau": 4,
        "analyse_id": "demo-001",
    },
    {
        "id": "notif-002",
        "type": "alerte",
        "titre": "Association déconseillée",
        "message": "Omar Sy — Ibuprofène × Acénocoumarol (niveau 3)",
        "date": "2026-02-21T16:45:00",
        "lue": False,
        "niveau": 3,
        "analyse_id": "demo-003",
    },
]

_analyse_counter = 0
_notif_counter = len(NOTIFICATIONS)


def next_analyse_id():
    global _analyse_counter
    _analyse_counter += 1
    return f"analyse-{_analyse_counter:04d}"


def next_notif_id():
    global _notif_counter
    _notif_counter += 1
    return f"notif-{_notif_counter:04d}"
