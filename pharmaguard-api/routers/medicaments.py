from fastapi import APIRouter, Query

from services.recherche import rechercher

router = APIRouter()


@router.get("/medicaments/search")
def rechercher_medicament(q: str = Query(..., min_length=2)):
    """Autocomplétion par nom commercial ou DCI (insensible aux accents)."""
    return rechercher(q)
