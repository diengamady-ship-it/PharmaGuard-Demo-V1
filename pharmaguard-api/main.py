from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from routers import analyse, historique, medicaments

UI_DIR = Path(__file__).resolve().parent.parent / "pharmaguard-ui"

app = FastAPI(
    title="PharmaGuard SN API",
    description="API de démonstration : détection d'interactions médicamenteuses sur une base fictive.",
    version="1.0.0",
)

# Utile seulement si l'interface est ouverte depuis une autre origine (file://, autre port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse.router, prefix="/api/v1", tags=["Analyse"])
app.include_router(medicaments.router, prefix="/api/v1", tags=["Médicaments"])
app.include_router(historique.router, prefix="/api/v1", tags=["Historique & Notifications"])


@app.get("/api/v1/status", tags=["Statut"])
def status():
    return {"app": "PharmaGuard SN", "version": app.version, "status": "running"}


@app.get("/", include_in_schema=False)
def accueil():
    return RedirectResponse("/landing.html")


# L'interface est servie par le même serveur : une seule fenêtre, pas de second port
app.mount("/", StaticFiles(directory=UI_DIR, html=True), name="ui")
