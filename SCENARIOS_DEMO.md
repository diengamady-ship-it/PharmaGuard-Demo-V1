# Scénarios de démonstration — PharmaGuard SN

Toutes les données sont fictives et simplifiées (voir `pharmaguard-api/data/demo_db.py`). Elles servent à montrer le fonctionnement de l'outil, pas à vérifier de vraies ordonnances.

## Médicaments disponibles

La base contient 15 médicaments. Dans le champ « Ordonnance », tapez au moins 2 lettres du nom commercial ou de la DCI (les accents sont facultatifs), puis cliquez sur une suggestion ou appuyez sur Entrée.

| Nom commercial | DCI | Classe |
|---|---|---|
| Kardégic | Aspirine | Antiagrégant plaquettaire / AINS |
| Sintrom | Acénocoumarol | Anticoagulant AVK |
| Brufen | Ibuprofène | AINS |
| Metformine EG | Metformine | Antidiabétique biguanide |
| Lisinopril Arrow | Lisinopril | IEC antihypertenseur |
| Amoxicilline Sandoz | Amoxicilline | Antibiotique pénicilline |
| Doliprane | Paracétamol | Antalgique / antipyrétique |
| Amlor | Amlodipine | Inhibiteur calcique |
| Mopral | Oméprazole | IPP |
| Tahor | Atorvastatine | Statine |
| Lasilix | Furosémide | Diurétique de l'anse |
| Ciflox | Ciprofloxacine | Fluoroquinolone |
| Valium | Diazépam | Benzodiazépine |
| Solupred | Prednisolone | Corticoïde |
| Ventoline | Salbutamol | Bêta-2 agoniste |

## Scénario 1 — interaction mineure

Patient : Fatou Seck, 35 ans
Médicaments : Metformine EG, Lisinopril Arrow

Résultat attendu : 1 interaction de niveau 1 (Information, bleu) — Metformine × Lisinopril.

## Scénario 2 — ordonnance à risque

Patient : Moussa Diallo, 58 ans
Médicaments : Kardégic, Sintrom, Brufen, Metformine EG, Lisinopril Arrow

Résultat attendu : 4 interactions, triées de la plus grave à la moins grave.

| Niveau | Couleur | Paire |
|---|---|---|
| 4 — Contre-indication | rouge | Aspirine × Acénocoumarol |
| 3 — Association déconseillée | orange | Acénocoumarol × Ibuprofène |
| 2 — Précaution d'emploi | ambre | Ibuprofène × Lisinopril |
| 1 — Information | bleu | Metformine × Lisinopril |

Les interactions de niveau 3 et 4 créent une notification (cloche en haut à droite).

## Scénario 3 — aucune interaction

Médicaments : Doliprane, Amoxicilline Sandoz

Résultat attendu : aucune interaction répertoriée.

## À montrer ensuite

- Cliquer sur une alerte pour afficher le mécanisme et la conduite à tenir, puis « Imprimer la fiche ».
- « Imprimer / PDF » pour le rapport complet (choisir « Enregistrer au format PDF » dans la fenêtre d'impression).
- L'onglet Historique : filtre par patient ou médicament, détail de chaque analyse.

L'historique est gardé en mémoire : il revient aux 3 analyses d'exemple à chaque redémarrage du serveur.
