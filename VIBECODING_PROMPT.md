# 🚀 Master Prompt : PharmaGuard Liquid Glass V4

Copiez et collez ce prompt dans votre outil de "Vibecoding" (Lovable, Replit Agent, Cursor, Bolt, etc.) pour recréer l'application.

---

## 1. Description du Produit
**Nom :** PharmaGuard SN v4
**Concept :** Analyseur intelligent d'interactions médicamenteuses. L'utilisateur saisit une liste de médicaments, l'app vérifie les conflits moléculaires et affiche des alertes de sécurité basées sur les bases Vidal et Martindale.

## 2. Identité Visuelle (Vibe)
- **Style :** "Liquid Glass" inspiré par Apple iOS (macOS Tahoe/iOS 26).
- **Couleurs :** Fond sombre ultra-profond (`#0a0e1a`), accents vibrants (Bleu Cyan, Violet, Rose, Vert Emeraude).
- **Effets :** 
  - Glassmorphism pur (cartes translucides, flou de 24px à 40px).
  - Fond dynamique avec 4 orbes colorés animés (Mesh Gradient).
  - Parallaxe au scroll sur les cartes et le mockup.
  - "Mouse-tracking light" : un effet de lumière qui suit le curseur sur les cartes en verre.
  - Grain de texture subtil sur toute l'interface.

## 3. Structure des Pages
### Landing Page (Modern Premium)
- **Hero Section :** Gros titre avec texte en dégradé, sous-titre élégant, et un mockup flottant de l'application.
- **Features :** Grille de 6 cartes en verre décrivant les fonctions (Temps réel, 4 niveaux d'alerte, Sources Vidal, etc.).
- **Stats :** Compteurs animés (0 à X) montrant l'efficacité.
- **Sources :** Logos et descriptions de Vidal et Martindale.
- **CTA :** Bouton "Entrer dans l'app" avec effet de lueur.

### Dashboard de l'Application (Clean UI)
- **Sidebar :** Navigation translucide.
- **Analyseur :** Saisie intuitive des médicaments avec autocomplétion.
- **Résultats :** Affichage d'alertes colorées (Rouge = Danger, Orange = Déconseillé, Jaune = Précaution, Bleu = Info).
- **Historique :** Tableau des analyses passées par patient.

## 4. Logique & Données
- **Algorithme :** Analyse croisée (chaque médicament comparé à tous les autres).
- **Base de Données (Demo) :** 
  - Inclure l'interaction critique : Aspirine (Kardégic) × Acénocoumarol (Sintrom) -> Niveau 4 (Contre-indication).
  - Inclure l'interaction : Ibuprofène (Brufen) × Acénocoumarol -> Niveau 3 (Déconseillé).
  - Inclure l'interaction : Ibuprofène × Lisinopril -> Niveau 2 (Précaution).

## 5. Exigences Techniques
- **Stack :** HTML5 sémantique, CSS moderne (Variables, Flexbox, Grid, Backdrop-filter), JavaScript Vanilla (ES11+).
- **Performance :** Accélération matérielle (GPU) pour les animations (will-change).
- **Export :** Fonctionnalité pour exporter les résultats en PDF.
- **Mobile :** Design responsive avec gestion des "Safe Areas" pour iOS.

---

> [!IMPORTANT]
> **Consigne pour l'IA :** "Prioritize visual excellence and premium feel. Every interaction must feel smooth and high-end. Do not use generic colors; use the HSL palette defined for Liquid Glass."
