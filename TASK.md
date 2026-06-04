# TASK.md — Backlog priorisé

---

## P0 — Modèle de contenu et progression

- [ ] Définir les types `level`, `theme`, `chapter`, `exercise`, `project`, `gate`
- [ ] Refactorer les types TypeScript pour sortir du modèle plat actuel
- [ ] Définir les règles de déblocage entre niveaux et chapitres
- [ ] Définir les métadonnées minimales pour `exercise` et `project`
- [ ] Adapter les helpers de lecture de contenu au nouveau modèle
- [ ] Adapter le modèle de progression utilisateur au nouveau découpage

**Sortie attendue P0**

- le contenu n’est plus modélisé comme une simple liste de niveaux ;
- l’application sait représenter chapitres, exercices, projets et portes de déblocage.

---

## P1 — Moteur d’exercices v2

- [ ] Ajouter la gestion de l’entrée standard `stdin`
- [ ] Ajouter plusieurs modes de validation au-delà de la sortie simple
- [ ] Préparer les exercices orientés algorithmique
- [ ] Garder l’éditeur simple pour les exercices courts
- [ ] Adapter les feedbacks d’exécution aux nouveaux formats d’exercice

**Sortie attendue P1**

- les exercices peuvent couvrir des problèmes plus réalistes ;
- le mode `exercice` reste rapide, simple et fiable.

---

## P2 — Refonte du Niveau 1

- [ ] Découper le Niveau 1 en thématiques et chapitres
- [ ] Recréer les exercices du socle : affichage, répétitions, variables, entrée, conditions
- [ ] Ajouter plusieurs problèmes par chapitre au lieu d’un seul niveau par concept
- [ ] Définir les premiers paliers de validation pédagogique
- [ ] Recalibrer XP, rythme et difficulté sur ce nouveau Niveau 1

**Sortie attendue P2**

- le Niveau 1 devient un vrai parcours d’apprentissage structuré ;
- la progression repose sur plusieurs exercices courts et cohérents.

---

## P3 — Mode projet / mini-IDE

- [ ] Définir le contrat `projectConfig`
- [ ] Concevoir l’UI du mode projet séparée du mode exercice
- [ ] Ajouter une arborescence de fichiers simple
- [ ] Ajouter l’édition multi-fichiers
- [ ] Ajouter les fichiers en lecture seule / fichiers éditables
- [ ] Prévoir une vue claire pour consignes, fichiers et exécution

**Sortie attendue P3**

- CoreQuest distingue clairement un exercice d’un projet ;
- les projets donnent une impression de construction réelle sans devenir un IDE complet.

---

## P4 — Sandbox projet et validation avancée

- [ ] Supporter l’exécution multi-fichiers
- [ ] Supporter un usage Cargo encadré pour les projets
- [ ] Ajouter la validation par tests pour les projets
- [ ] Définir les critères d’acceptation projet
- [ ] Vérifier que la sandbox reste strictement bornée et sécurisée

**Sortie attendue P4**

- les projets sont réellement exécutables et validables ;
- la sandbox reste compatible avec les contraintes de sécurité du produit.

---

## P5 — Carte de progression et déblocages

- [ ] Faire évoluer la map pour afficher chapitres, projets et gates
- [ ] Représenter les états `non commencé`, `en cours`, `validé`, `projet`, `verrouillé`
- [ ] Mettre à jour le dashboard pour afficher chapitre courant et prochain projet
- [ ] Ajouter la logique de validation complète d’un niveau avant déblocage du suivant
- [ ] Harmoniser l’XP avec la nouvelle granularité du contenu

**Sortie attendue P5**

- la progression visible reflète le vrai parcours pédagogique ;
- les déblocages de niveaux supérieurs sont compréhensibles et fiables.

---

## P6 — Niveau 2 puis ouverture des niveaux supérieurs

- [ ] Structurer le Niveau 2 : flottants, tableaux, chaînes, fonctions
- [ ] Ajouter un premier projet de synthèse robuste au Niveau 2
- [ ] Préparer les gates d’ouverture du Niveau 3
- [ ] Intégrer les premières thématiques algorithmiques du Niveau 3
- [ ] Poser la structure extensible pour les Niveaux 4 à 6

**Sortie attendue P6**

- le parcours dépasse le socle MVP ;
- la montée vers l’algorithmique est installée proprement.

---

## P7 — QA, calibration et documentation

- [ ] Vérifier les flux `exercice` et `projet`
- [ ] Vérifier les déblocages réels entre niveaux
- [ ] Vérifier l’UX du mode projet sur desktop d’abord, puis formats plus petits
- [ ] Recalibrer difficulté, densité et répartition d’XP
- [ ] Maintenir `IMPLEMENTATION_PLAN.md` et `walkthrough.md` alignés avec les arbitrages réels

**Sortie attendue P7**

- le nouveau parcours est cohérent, testable et documenté ;
- le produit peut évoluer sans revenir à une structure MVP plate.

---

## Ordre recommandé

1. P0 — Modèle de contenu et progression
2. P1 — Moteur d’exercices v2
3. P2 — Refonte du Niveau 1
4. P3 — Mode projet / mini-IDE
5. P4 — Sandbox projet et validation avancée
6. P5 — Carte de progression et déblocages
7. P6 — Niveau 2 puis niveaux supérieurs
8. P7 — QA, calibration et documentation