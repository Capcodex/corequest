# TASK.md — Backlog priorisé

---

## P12 — Révisions Leitner

Objectif : proposer chaque jour une session courte de révision composée d’exercices déjà réussis, planifiée avec une logique de Leitner box inspirée de la courbe de l’oubli.

---

## P12.0 — Modèle de données

- [x] Créer la migration Supabase `review_items`
- [x] Créer la migration Supabase `review_attempts`
- [x] Ajouter les politiques RLS par utilisateur
- [x] Ajouter les index sur `user_id`, `content_id` et `next_review_at`
- [x] Prévoir l’idempotence : un exercice ne doit créer qu’un seul item de révision par utilisateur

**Sortie attendue**

- les exercices réussis peuvent être suivis dans un système de révision indépendant de la progression principale.

---

## P12.1 — Règles Leitner métier

- [x] Définir les intervalles de box : `1j`, `2j`, `4j`, `7j`, `14j`, `30j`
- [x] Ajouter un helper `getNextReviewDate(box, reviewedAt)`
- [x] Ajouter un helper `promoteReviewItem(item)`
- [x] Ajouter un helper `resetReviewItem(item)`
- [x] Tester les transitions : réussite, échec, box maximale, exercice jamais révisé

**Sortie attendue**

- la logique Leitner est centralisée, testable et indépendante de l’UI.

---

## P12.2 — Création automatique après réussite

- [x] Brancher la création de `review_item` après première complétion d’exercice
- [x] Ne pas créer d’item pour un projet dans cette première version
- [x] Ne pas dupliquer un item si l’exercice est déjà dans le système
- [x] Planifier la première révision au lendemain de la réussite
- [x] Tester la création depuis le flux de complétion existant

**Sortie attendue**

- chaque exercice validé entre automatiquement dans la mémoire long terme de l’utilisateur.

---

## P12.3 — Sélection quotidienne

- [x] Ajouter `getDailyReviewSession(userId)`
- [x] Inclure uniquement les exercices déjà complétés
- [x] Inclure uniquement les items dus : `next_review_at <= now`
- [x] Prioriser les exercices en retard et les box basses
- [x] Limiter la session quotidienne à un volume raisonnable, par exemple `5 à 10` exercices
- [x] Mélanger légèrement l’ordre à priorité égale
- [x] Tester les cas : rien à revoir, limite atteinte, plusieurs box dues, exercices en retard

**Sortie attendue**

- l’utilisateur reçoit une session courte, utile et stable, sans surcharge cognitive.

---

## P12.4 — API Révision

- [x] Ajouter `GET /api/review/today`
- [x] Ajouter `POST /api/review/submit`
- [x] Vérifier l’utilisateur via Supabase Auth côté serveur
- [x] Retourner les exercices avec leur contexte de curriculum
- [x] Enregistrer chaque tentative dans `review_attempts`
- [x] Mettre à jour box, compteurs et prochaine date après soumission
- [x] Tester les erreurs : non connecté, item inconnu, exercice non complété, payload invalide

**Sortie attendue**

- le frontend peut charger une session du jour et enregistrer le résultat de chaque révision.

---

## P12.5 — Page `/review`

- [x] Créer la page `/review`
- [x] Ajouter un résumé : exercices à revoir aujourd’hui, en retard, prochaine révision
- [x] Ajouter l’état vide : aucune révision aujourd’hui
- [x] Lister les exercices dus avec niveau, chapitre, difficulté et XP d’origine
- [x] Ajouter un CTA clair vers la révision de chaque exercice
- [x] Ajouter un accès depuis le dashboard
- [x] Ajouter un accès depuis la navigation principale si l’usage est suffisamment central

**Sortie attendue**

- l’utilisateur sait quoi revoir aujourd’hui sans avoir besoin de comprendre la mécanique interne des box.

---

## P12.6 — Mode exercice de révision

- [x] Créer une route dédiée, recommandée : `/review/[contentId]`
- [x] Réutiliser le moteur d’exercice existant
- [x] Démarrer avec l’éditeur vide
- [x] Masquer le cours par défaut, mais garder un lien `Revoir le cours` si besoin
- [x] Enregistrer une réussite comme `success: true`
- [x] Définir une action explicite pour marquer un échec ou abandonner
- [x] Éviter de pénaliser automatiquement chaque erreur de compilation pendant l’essai

**Sortie attendue**

- la révision ressemble à un rappel actif, pas à une relecture guidée.

---

## P12.7 — Dashboard et signaux produit

- [x] Ajouter un bloc dashboard `Révisions du jour`
- [x] Afficher le nombre d’exercices dus
- [x] Afficher un CTA `Faire ma session`
- [x] Ajouter un indicateur discret si des révisions sont en retard
- [x] Garder la roadmap centrée sur l’apprentissage principal
- [x] Ne pas surcharger la map avec la mécanique Leitner dans cette première version

**Sortie attendue**

- la révision devient visible au bon endroit sans brouiller le parcours principal.

---

## P12.8 — QA, calibration et migration distante

- [x] Exécuter `typecheck`
- [x] Exécuter les tests unitaires métier Leitner
- [x] Exécuter les tests API review
- [x] Vérifier le parcours : réussir un exercice → item créé → révision due → réussite → box suivante
- [x] Vérifier le parcours : échec de révision → retour box 1
- [x] Appliquer la migration sur Supabase distant
- [x] Vérifier RLS sur un utilisateur connecté réel
- [x] Ajuster le volume quotidien si la session paraît trop longue

**Sortie attendue**

- la fonctionnalité est fiable, persistée, testée et utilisable dans le produit réel.

---

## P12.9 — Vue des box Leitner

Objectif : rendre le système de révision plus lisible en affichant les `6` box Leitner avant l’accès aux exercices, sans transformer la mécanique en tableau de bord complexe.

- [x] Ajouter un helper `getReviewBoxesOverview(userId)` ou équivalent
- [x] Regrouper les `review_items` par `leitner_box`
- [x] Retourner pour chaque box : total, exercices dus, exercices verrouillés, prochaine échéance
- [x] Calculer le nombre de jours restants avant révision pour les exercices non dus
- [x] Conserver la session du jour comme raccourci principal pour éviter la surcharge cognitive
- [x] Ajouter une grille de `6` box sur `/review`
- [x] Rendre chaque box cliquable avec un état sélectionné visible
- [x] Afficher les exercices de la box sélectionnée sous la grille
- [x] Distinguer clairement les exercices disponibles des exercices verrouillés
- [x] Pour un exercice verrouillé, afficher `Disponible dans X jour(s)` et désactiver le CTA de révision
- [x] Pour un exercice disponible, garder un CTA vers `/review/[contentId]`
- [x] Prévoir un état vide par box : `Aucun exercice dans cette box`
- [x] Prévoir un état global vide si aucun `review_item` n’existe encore
- [x] Garder des libellés sobres et non infantilisants pour les box
- [x] Vérifier clavier/focus : navigation tabulable, box sélectionnée annoncée, boutons désactivés explicites
- [x] Tester : box vide, box avec dus, box avec verrouillés, mélange dus/verrouillés, calcul jours restants

**Sortie attendue**

- l’utilisateur comprend où se trouvent ses exercices dans le cycle de mémorisation, peut filtrer par box et voit clairement ce qui est disponible maintenant ou planifié plus tard.

---

## Hors périmètre P12

- [ ] Pas de révision des projets multi-fichiers dans cette première version
- [ ] Pas de notifications email ou push
- [ ] Pas d’algorithme adaptatif complexe au-delà des box fixes
- [ ] Pas de streak social ou classement
- [ ] Pas de réglage manuel des intervalles ou déplacement manuel d’un exercice entre les box

---

## Ordre de démarrage recommandé

1. `P12.0` + `P12.1` : données et règles métier
2. `P12.2` : création automatique après réussite
3. `P12.3` + `P12.4` : session quotidienne et API
4. `P12.5` + `P12.6` : expérience utilisateur
5. `P12.7` + `P12.8` : intégration dashboard, QA et migration distante
6. `P12.9` : visualisation et navigation par box Leitner
