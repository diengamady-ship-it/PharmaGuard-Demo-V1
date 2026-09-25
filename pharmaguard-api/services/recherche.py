import unicodedata
from typing import Optional

from data.demo_db import MEDICAMENTS_DB


def simplifier(texte: str) -> str:
    """Minuscules, sans accents ni espaces superflus : 'Kardégic ' -> 'kardegic'."""
    texte = unicodedata.normalize("NFKD", texte.lower().strip())
    return "".join(c for c in texte if not unicodedata.combining(c))


def _champs(key: str, med: dict) -> list[str]:
    return [key, simplifier(med["nom_commercial"]), simplifier(med["dci"])]


def resoudre(nom: str) -> Optional[str]:
    """Retrouve la clé d'un médicament à partir d'un nom commercial ou d'une DCI.

    Correspondance exacte d'abord, puis préfixe (« Kardégic 75mg » -> kardegic,
    « amox » -> amoxicilline). Renvoie None si rien ou si le préfixe est ambigu.
    """
    q = simplifier(nom)
    if not q:
        return None
    for key, med in MEDICAMENTS_DB.items():
        if q in _champs(key, med):
            return key
    candidats = {
        key
        for key, med in MEDICAMENTS_DB.items()
        for champ in _champs(key, med)
        if champ.startswith(q) or q.startswith(champ)
    }
    return candidats.pop() if len(candidats) == 1 else None


def rechercher(q: str) -> list[dict]:
    """Autocomplétion : médicaments dont le nom ou la DCI contient la saisie."""
    q = simplifier(q)
    return [
        {"nom_commercial": med["nom_commercial"], "dci": med["dci"], "classe": med["classe"]}
        for key, med in MEDICAMENTS_DB.items()
        if any(q in champ for champ in _champs(key, med))
    ]
