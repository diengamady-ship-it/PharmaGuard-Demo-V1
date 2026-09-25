# PharmaGuard SN — démo V1

**Démo en ligne :** <https://pharmaguard-demo-v1.onrender.com/landing.html>

Application de démonstration pour saisir une ordonnance et illustrer la détection d'interactions médicamenteuses. Le serveur est construit avec FastAPI et sert aussi l'interface web.

> **Démonstration uniquement.** Le catalogue et les interactions de cette V1 sont des données fictives et simplifiées. Ne pas utiliser pour une décision clinique, une prescription ou une vérification réelle d'ordonnance.

## Démarrage sous Windows

1. Installer Python et cocher l'option permettant de l'ajouter au `PATH`.
2. Lancer `INSTALL_DEMO.bat` pour installer les dépendances.
3. Lancer `START_DEMO.bat`, puis ouvrir <http://localhost:8000/landing.html> si le navigateur ne s'ouvre pas automatiquement.

La documentation de l'API est disponible sur <http://localhost:8000/docs>. Fermer la fenêtre du serveur pour arrêter la démo.

## Contenu

- `pharmaguard-api/` : API FastAPI et données fictives de la démo.
- `pharmaguard-ui/` : interface HTML, CSS et JavaScript.
- `SCENARIOS_DEMO.md` : scénarios de présentation.
- `TUTORIEL_INSTALLATION.txt` : guide d'installation complémentaire.

Cette publication concerne uniquement la **V1** ; elle n'inclut pas les travaux d'une autre version du projet.

## Déploiement en ligne

Le fichier `render.yaml` configure un service web Render gratuit qui héberge l'interface et l'API ensemble. Le premier chargement peut être lent après une période d'inactivité. Les analyses et notifications sont séparées par session de navigateur et restent uniquement en mémoire : elles disparaissent lorsque le service redémarre ou lorsque la session expire. Ne saisissez pas de données réelles de patients dans cette démo publique.
