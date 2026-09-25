from typing import List, Optional

from pydantic import BaseModel, Field


class Medicament(BaseModel):
    nom: str = Field(..., min_length=1)  # nom commercial ou DCI : "Kardégic", "aspirine"
    dosage: Optional[str] = None


class OrdonnanceRequest(BaseModel):
    patient_nom: str = Field(..., min_length=1, max_length=120)
    patient_age: Optional[int] = Field(None, ge=0, le=130)
    medicaments: List[Medicament] = Field(..., min_length=1)


class InteractionResult(BaseModel):
    molecule_a: str
    molecule_b: str
    dci_a: str
    dci_b: str
    niveau: int  # 1 à 4
    label: str
    couleur: str
    mecanisme: str
    conduite: str
    source: str


class AnalyseResponse(BaseModel):
    id: str
    patient_nom: str
    patient_age: Optional[int]
    date: str
    nb_medicaments: int
    nb_interactions: int
    niveau_max: int
    medicaments: List[str]
    non_reconnus: List[str]
    interactions: List[InteractionResult]
    message: str
