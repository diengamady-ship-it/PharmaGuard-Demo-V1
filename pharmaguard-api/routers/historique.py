from fastapi import APIRouter, HTTPException, Request

router = APIRouter()


@router.get("/historique")
def get_historique(request: Request):
    """Analyses, de la plus récente à la plus ancienne."""
    return sorted(request.state.demo_session["historique"], key=lambda a: a["date"], reverse=True)


@router.get("/historique/{analyse_id}")
def get_analyse_detail(analyse_id: str, request: Request):
    for analyse in request.state.demo_session["historique"]:
        if analyse["id"] == analyse_id:
            return analyse
    raise HTTPException(status_code=404, detail="Analyse introuvable")


@router.get("/notifications")
def get_notifications(request: Request):
    notifications = request.state.demo_session["notifications"]
    return {
        "notifications": sorted(notifications, key=lambda n: n["date"], reverse=True),
        "nb_non_lues": sum(1 for n in notifications if not n["lue"]),
    }


@router.post("/notifications/read")
def mark_notifications_read(request: Request):
    for notif in request.state.demo_session["notifications"]:
        notif["lue"] = True
    return {"status": "ok", "nb_non_lues": 0}


@router.post("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: str, request: Request):
    for notif in request.state.demo_session["notifications"]:
        if notif["id"] == notif_id:
            notif["lue"] = True
            return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Notification introuvable")
