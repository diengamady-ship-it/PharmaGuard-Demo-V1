# 🍎 Guide de Conversion : PharmaGuard iOS (Liquid Glass)

Ce guide détaille les étapes nécessaires pour transformer la démo **PharmaGuard V4 Liquid Glass** en une application native pour iOS.

---

## 1. Architecture Cible

Pour conserver l'esthétique premium "Liquid Glass" tout en ayant une application performante sur iPhone, nous utilisons l'architecture **Capacitor**.

```mermaid
graph TD
    A[iPhone App] --> B[Capacitor WebView]
    B --> C[PharmaGuard UI (HTML/CSS/JS)]
    C -- "HTTPS Requests" --> D[Cloud API (FastAPI)]
    D --> E[Base de Données]
```

---

## 2. Prérequis Techniques

### Environnement de Développement
- **Mac avec macOS** (requis pour compiler vers iOS).
- **Xcode** 15+ installé.
- **Node.js** (LTS) & npm.
- **CocoaPods** installé (`sudo gem install cocoapods`).

---

## 3. Étape 1 : Hébergement du Backend

Puisque iOS ne peut pas exécuter le script Python directement dans l'application :
1. **Déployez votre dossier `pharmaguard-api`** sur un service comme Heroku, Render ou AWS.
2. **Configurez CORS** dans `main.py` pour accepter les requêtes de l'application mobile :
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["capacitor://localhost", "http://localhost"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. **Mettez à jour `app.js`** avec l'URL de production :
   ```javascript
   const API_BASE = "https://votre-api-pharmaguard.herokuapp.com/api/v1";
   ```

---

## 4. Étape 2 : Intégration de Capacitor

Dans le dossier `pharmaguard-ui` :

1. **Initialisez le projet** :
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli
   npx cap init PharmaGuard com.votre.app --web-dir .
   ```

2. **Ajoutez la plateforme iOS** :
   ```bash
   npm install @capacitor/ios
   npx cap add ios
   ```

---

## 5. Étape 3 : Ajustements UI "Liquid Glass" pour iOS

### Support de l'Encoche (Safe Area)
Ajoutez ceci dans votre `landing.css` et `styles.css` pour éviter que le contenu ne soit caché par l'encoche (notch) :
```css
body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}
```

### Optimisation Performance
iOS gère très bien le `backdrop-filter`, mais pour garantir une fluidité totale des orbes animés :
- Utilisez `will-change: transform, opacity;` sur les éléments `.bg-orb`.
- Assurez-vous que tous les éléments fixes utilisent `transform: translateZ(0);` pour forcer le rendu GPU.

### Adaptation des Interactions Tactiles
Le design Liquid Glass utilise le suivi de la souris (mouse-tracking) pour les effets de lumière. Sur iOS :
- **Adaptation tactile** : Remplacez les événements `mousemove` par un effet de lumière statique ou lié au défilement, pour éviter de surcharger le processeur.
- **Réactivité** : Ajoutez des styles CSS `:active` sur les cartes en verre pour un feedback visuel immédiat lors du toucher.

---

## 6. Étape 4 : Compilation et Lancement

1. **Synchronisez le code** :
   ```bash
   npx cap copy ios
   ```

2. **Ouvrez dans Xcode** :
   ```bash
   npx cap open ios
   ```

3. **Dans Xcode** :
   - Sélectionnez votre iPhone ou un simulateur (ex: iPhone 15 Pro).
   - Cliquez sur le bouton "Play" (Run).

---

## 7. Checklist de Publication

- [ ] **Icônes** : Utilisez `cordova-res` ou un générateur d'icônes iOS (1024x1024px).
- [ ] **Splash Screen** : Prévoyez une image centrée avec un fond sombre pour s'adapter au design Liquid Glass.
- [ ] **Permissions** : Si vous ajoutez le scan d'ordonnance par caméra plus tard, n'oubliez pas d'ajouter `NSCameraUsageDescription` dans le fichier `Info.plist`.

---

> [!TIP]
> **Performance Tip :** Sur mobile, privilégiez le clic tactile immédiat en désactivant le délai de 300ms (Capacitor le fait automatiquement via le moteur WebKit moderne).
