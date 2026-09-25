# 🚀 Workflow du Projet : PharmaGuard SN (Demo Fictive)

Ce document détaille les étapes que nous allons suivre pour construire la solution décrite dans le cahier des charges.

## 📌 Phase 1 : Initialisation & Backend (FastAPI)
1. **Création de la structure du projet backend**
   - Mise en place de l'environnement Python et du `requirements.txt`.
   - Création de la hiérarchie : `routers/`, `models/`, et `data/`.
2. **Implémentation des Données Fictives**
   - Création de `data/demo_db.py` avec `MEDICAMENTS_DB` et `INTERACTIONS_DB`.
3. **Schémas de Données (Pydantic)**
   - Création de `models/ordonnance.py` pour valider les requêtes.
4. **Développement des Routes de l'API**
   - Implémentation du moteur d'analyse : `routers/analyse.py`.
   - Autocomplétion : `routers/medicaments.py`.
5. **Intégration & Lancement du Serveur**
   - Implémentation du point d'entrée `main.py` avec configuration CORS.

## 📌 Phase 2 : Frontend (Interface Utilisateur UI)
1. **Initialisation de l'Interface Web (Stitch / Vanilla JS)**
   - Intégration de la palette de couleurs d'alerte spécifique (Rouge, Orange, Ambre, Bleu, Vert).
2. **Page de Saisie de l'Ordonnance**
   - Interface : Formulaire Patient & Ajout dynamique de médicaments.
3. **Affichage des Résultats d'Analyse**
   - Cartes et Modals Pop-Up pour détailler les interactions détectées.
4. **Connexion Backend ↔ Frontend**
   - Implémentation des appels `fetch()` vers `http://localhost:8000/api/v1/analyse`.

## 📌 Phase 3 : Finalisation & Démonstration
1. **Tests des Cas d'Usage**
   - Ex : Ordonnance de "Moussa Diallo", et "Fatou Seck".
2. **Bouton & Export**
   - Simulation d'un export ou affichage d'impression.
3. **Scripts de Lancement**
   - Fourniture d'un petit script (ex: `START_DEMO.bat`) pour lancer la démo en un clic.
