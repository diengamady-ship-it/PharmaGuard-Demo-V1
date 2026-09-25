from fastapi import APIRouter, HTTPException

from data.demo_db import HISTORIQUE_ANALYSES, NOTIFICATIONS

router = APIRouter()


@router.get("/historique")
def get_historique():
    """Analyses, de la plus récente à la plus ancienne."""
    return sorted(HISTORIQUE_ANALYSES, key=lambda a: a["date"], reverse=True)


@router.get("/historique/{analyse_id}")
def get_analyse_detail(analyse_id: str):
    for analyse in HISTORIQUE_ANALYSES:
        if analyse["id"] == analyse_id:
            return analyse
    raise HTTPException(status_code=404, detail="Analyse introuvable")


@router.get("/notifications")
def get_notifications():
    return {
        "notifications": sorted(NOTIFICATIONS, key=lambda n: n["date"], reverse=True),
        "nb_non_lues": sum(1 for n in NOTIFICATIONS if not n["lue"]),
    }


@router.post("/notifications/read")
def mark_notifications_read():
    for notif in NOTIFICATIONS:
        notif["lue"] = True
    return {"status": "ok", "nb_non_lues": 0}


@router.post("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: str):
    for notif in NOTIFICATIONS:
        if notif["id"] == notif_id:
            notif["lue"] = True
            return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Notification introuvable")
