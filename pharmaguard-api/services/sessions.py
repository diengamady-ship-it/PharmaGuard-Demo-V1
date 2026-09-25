"""Historique éphémère isolé par navigateur pour la démonstration publique."""

from copy import deepcopy
from secrets import token_urlsafe
from threading import Lock

from data.demo_db import HISTORIQUE_ANALYSES, NOTIFICATIONS

_sessions = {}
_lock = Lock()
_MAX_SESSIONS = 500


def get_or_create_session(session_id):
    with _lock:
        if session_id in _sessions:
            return session_id, _sessions[session_id], False

        # Borne la mémoire d'une démo publique ; les anciennes sessions expirent.
        if len(_sessions) >= _MAX_SESSIONS:
            _sessions.pop(next(iter(_sessions)))

        session_id = token_urlsafe(32)
        session = {
            "historique": deepcopy(HISTORIQUE_ANALYSES),
            "notifications": deepcopy(NOTIFICATIONS),
        }
        _sessions[session_id] = session
        return session_id, session, True
