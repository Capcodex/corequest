# Plan d’implémentation — Refonte du parcours pédagogique CoreQuest

## Objectif

Faire évoluer CoreQuest d’un MVP centré sur de petits exercices Rust vers un produit d’apprentissage structuré en :

- chapitres progressifs ;
- séries de problèmes ;
- paliers de validation ;
- projets de synthèse plus ambitieux ;
- deux modes de pratique distincts : `exercice` et `projet`.

Le principe clé est le suivant :

1. les exercices courts restent réalisés dans l’éditeur Rust simple ;
2. les projets de fin de thématique basculent dans un mode `IDE` plus riche ;
3. le déblocage des niveaux supérieurs dépend de la validation du niveau précédent.

---

## Vision produit

CoreQuest ne doit plus être pensé uniquement comme une suite de niveaux, mais comme un **parcours d’apprentissage complet** :

- un socle de syntaxe et de logique ;
- une montée progressive vers l’algorithmique ;
- des validations intermédiaires ;
- de gros projets de sortie de thème ;
- une interface capable de différencier clairement entraînement guidé et travail de construction.

Le produit cible ressemble donc à un mélange entre :

- plateforme de progression structurée ;
- laboratoire de pratique ;
- mini-environnement de développement pour les projets.

---

## Nouvelle structure pédagogique cible

## Hiérarchie canonique

Le contenu doit être réorganisé selon cette hiérarchie :

- `Parcours`
- `Niveau`
- `Thématique`
- `Chapitre`
- `Exercice` ou `Projet`

### Définition des unités

#### 1. Niveau

Le `niveau` correspond à un grand palier de progression.

Exemples :

- Niveau 1 : bases impératives ;
- Niveau 2 : structures, chaînes et fonctions ;
- Niveau 3 : algorithmique intermédiaire ;
- Niveau 4 : structures classiques et graphes ;
- Niveau 5 : algorithmes fondamentaux avancés ;
- Niveau 6 : sujets avancés et entraînement final.

#### 2. Thématique

La `thématique` est un bloc cohérent de savoir-faire.

Exemples :

- affichage et suite d’instructions ;
- répétitions ;
- tableaux ;
- fonctions ;
- graphes ;
- programmation dynamique.

#### 3. Chapitre

Le `chapitre` est une unité de lecture + pratique.

Un chapitre contient généralement :

- une introduction courte ;
- des notions à retenir ;
- une série d’exercices ;
- éventuellement un mini-bilan.

#### 4. Exercice

L’`exercice` reste le mode le plus rapide et le plus fréquent.

Il repose sur :

- un énoncé ;
- une sortie ou un comportement attendu ;
- un éditeur simple ;
- une exécution rapide ;
- une correction immédiate.

#### 5. Projet

Le `projet` est une validation forte de sortie de thématique ou de niveau.

Il peut inclure :

- plusieurs fichiers ;
- une arborescence ;
- des consignes plus ouvertes ;
- des tests ;
- un comportement global à produire.

---

## Interprétation des niveaux fournis

Les niveaux que vous avez listés doivent être pris comme **charpente pédagogique cible**.

Ils sont indicatifs sur la forme, mais très utiles pour définir la profondeur attendue.

### Niveau 1 — Fondamentaux

Couvre :

- affichage de texte ;
- suites d’instructions ;
- répétitions ;
- calculs ;
- variables ;
- lecture de l’entrée ;
- conditions ;
- structures avancées ;
- opérateurs booléens ;
- répétitions conditionnées.

### Niveau 2 — Outils de base

Couvre :

- nombres à virgule ;
- tableaux ;
- chaînes de caractères ;
- fonctions ;
- programmation sur son ordinateur.

### Niveau 3 — Algorithmique intermédiaire

Couvre :

- complexité ;
- caractères ;
- chaînes avancées ;
- tableaux avancés ;
- tris simples ;
- balayages ;
- récursivité ;
- efficacité temporelle ;
- exercices d’entraînement.

### Niveau 4 — Structures et méthodes

Couvre :

- méthodes de code propre ;
- arbres ;
- structures de données ;
- récursivité avancée ;
- géométrie (1) ;
- graphes ;
- algorithmes semi-numériques (1) ;
- graphes implicites (1).

### Niveau 5 — Algorithmes classiques avancés

Couvre :

- gloutons ;
- diviser pour régner ;
- arbres binaires ;
- tris efficaces ;
- plus courts chemins ;
- union-find ;
- algorithmes semi-numériques (2) ;
- programmation dynamique.

### Niveau 6 — Avancé

Couvre :

- graphes implicites (2) ;
- programmation dynamique avancée ;
- structures et balayages avancés ;
- composantes fortement connexes ;
- géométrie (2) ;
- flots et couplages ;
- entraînement final.

---

## Règle pédagogique structurante

### 1. Sortie de grosse thématique = projet

À la sortie de chaque grosse thématique, il faut prévoir un **projet de synthèse**, pas seulement un exercice supplémentaire.

Exemples :

- fin des bases d’entrée/sortie → petit moteur de console ;
- fin des tableaux/chaînes → analyseur de texte ;
- fin des fonctions → mini-application modulaire ;
- fin des graphes → explorateur de cartes ;
- fin de la programmation dynamique → solveur de puzzle ;
- fin de niveau → projet de consolidation.

### 2. Déblocage par validation réelle

Le déblocage doit reposer sur des validations explicites :

- validation de chapitres ;
- validation de projets ;
- validation du niveau précédent.

La logique cible :

- le Niveau 3 ne s’ouvre qu’après validation du Niveau 2 ;
- idem pour les niveaux 4, 5 et 6 ;
- un projet peut être obligatoire pour clôturer un niveau.

---

## Deux modes de pratique à maintenir

## Mode 1 — Exercice

Le mode `exercice` conserve l’éditeur simple actuel.

Il reste adapté aux cas suivants :

- sorties attendues courtes ;
- exercices d’application immédiate ;
- répétition rapide ;
- progression fine par petits pas.

### Capacités attendues

- éditeur mono-fichier ;
- exécution rapide ;
- validation automatique ;
- feedback immédiat ;
- historique de réussite.

## Mode 2 — Projet

Le mode `projet` introduit un **mini-IDE**.

Il ne remplace pas l’éditeur simple : il vient le compléter pour les gros jalons.

### Capacités attendues

- arborescence de fichiers ;
- ouverture d’onglets ;
- édition multi-fichiers ;
- fichier principal + modules ;
- exécution du projet complet ;
- tests automatiques ;
- éventuelle vue consignes / fichiers / terminal.

### UX cible du mode projet

Le mode projet doit donner l’impression de construire un vrai petit programme, sans chercher à reproduire un IDE complet de bureau.

Il faut viser :

- une arborescence simple ;
- une navigation claire ;
- une exécution fiable ;
- une compréhension immédiate de ce qui est attendu.

À éviter :

- complexité excessive ;
- fonctionnalités gadget ;
- surcharger le MVP avec des outils de développeur avancés inutiles.

---

## Évolution de l’architecture contenu

Le modèle actuel centré sur une liste plate de niveaux doit évoluer.

## Nouveau modèle de contenu cible

Chaque entrée de contenu devrait pouvoir porter au minimum :

- `id`
- `levelNumber`
- `themeId`
- `chapterId`
- `title`
- `type` : `lesson`, `exercise`, `project`, `gate`
- `difficulty`
- `estimatedDuration`
- `xpReward`
- `unlockRules`
- `lessonContent`
- `exerciseConfig`
- `projectConfig`

### Pour un exercice

Prévoir des champs comme :

- `expectedOutput`
- `stdin`
- `validationMode`
- `hint`
- `starterMode` = vide
- `solutionKey`

### Pour un projet

Prévoir des champs comme :

- `files`
- `entryFile`
- `editableFiles`
- `readonlyFiles`
- `tests`
- `runCommand`
- `projectGoals`
- `acceptanceCriteria`

---

## Évolution de la sandbox Rust

La sandbox actuelle est adaptée aux exercices mono-fichier.

Les projets imposent une montée en capacité.

## Capacités à ajouter

### 1. Lecture de l’entrée standard

Indispensable pour une grande partie des problèmes algorithmiques.

### 2. Exécution multi-fichiers

Nécessaire pour les projets structurés.

### 3. Support Cargo encadré

Pour les projets, il faut pouvoir exécuter un petit workspace contrôlé.

### 4. Validation par tests

Les projets ne doivent pas dépendre uniquement d’une sortie console exacte.

Il faut ajouter des validations de type :

- tests unitaires ;
- exécutions de scénarios ;
- snapshots contrôlés ;
- critères de complétion.

### 5. Sécurité

La sandbox reste une contrainte absolue.

Le passage en multi-fichiers ne doit pas ouvrir :

- accès réseau ;
- dépendances arbitraires ;
- escape du conteneur ;
- exécution non bornée.

---

## Évolution produit / UX

## Écran de progression

La carte de progression doit évoluer pour représenter plusieurs types d’éléments :

- chapitres ;
- exercices ;
- portes de déblocage ;
- projets ;
- niveaux verrouillés.

### États à représenter

- non commencé ;
- en cours ;
- validé ;
- projet à faire ;
- verrouillé ;
- niveau débloqué.

## Écran de contenu

L’écran de contenu doit pouvoir rendre :

- un chapitre avec lecture + série d’exercices ;
- un exercice unitaire ;
- un projet avec IDE ;
- une porte de déblocage.

## Tableau de bord

Le dashboard doit évoluer pour afficher :

- niveau actuel ;
- chapitre en cours ;
- prochain projet ;
- taux de validation du niveau ;
- projets terminés ;
- progression globale.

---

## Stratégie d’implémentation recommandée

## Phase 1 — Refondre le modèle pédagogique

Objectif : préparer la suite sans encore tout reconstruire visuellement.

À faire :

1. définir la hiérarchie `niveau > thématique > chapitre > contenu` ;
2. définir les types `exercise` / `project` / `gate` ;
3. définir les règles de déblocage ;
4. définir les métadonnées minimales ;
5. préparer un premier jeu de données pilote.

## Phase 2 — Refondre le moteur de contenu

Objectif : rendre l’application capable de charger autre chose qu’une simple liste plate de niveaux.

À faire :

1. refactorer les types TypeScript ;
2. refactorer les helpers de lecture de contenu ;
3. adapter la progression utilisateur ;
4. adapter la logique d’XP ;
5. adapter la carte de progression.

## Phase 3 — Supporter les vrais exercices algorithmiques

Objectif : préparer les chapitres proches d’un entraînement plus académique.

À faire :

1. ajouter la gestion de `stdin` ;
2. ajouter plusieurs modes de validation ;
3. fiabiliser les retours d’exécution ;
4. préparer des problèmes plus proches des listes fournies.

## Phase 4 — Introduire le mode projet

Objectif : livrer le premier vrai projet de synthèse.

À faire :

1. définir le modèle `projectConfig` ;
2. créer l’UI mini-IDE ;
3. supporter multi-fichiers ;
4. exécuter un projet complet ;
5. valider par tests.

## Phase 5 — Refaire la progression pédagogique de Niveau 1

Objectif : passer du MVP actuel à une vraie première marche d’apprentissage.

À faire :

1. reconstruire le Niveau 1 en chapitres ;
2. créer plusieurs problèmes par chapitre ;
3. ajouter au moins un projet de fin de grande thématique ;
4. recalibrer XP, déblocages et rythme.

## Phase 6 — Étendre au Niveau 2

Objectif : stabiliser la mécanique avant les niveaux plus algorithmiques.

À faire :

1. tableaux ;
2. chaînes ;
3. fonctions ;
4. premier usage plus fréquent des entrées ;
5. projet de synthèse niveau 2.

## Phase 7 — Ouvrir les niveaux 3 à 6

Objectif : transformer CoreQuest en vrai parcours long.

À faire :

1. intégrer les portes de déblocage ;
2. structurer les thèmes algorithmiques ;
3. ajouter projets ou entraînements de sortie ;
4. calibrer la difficulté sur la durée.

---

## Première cible réaliste

La meilleure prochaine cible n’est pas de produire immédiatement les 6 niveaux complets.

La cible recommandée est :

### Lot A — Fondations du nouveau système

- nouveau modèle de contenu ;
- nouveaux types ;
- support des chapitres ;
- support des exercices avec entrée ;
- nouvelle progression ;
- refonte du Niveau 1.

### Lot B — Premier projet

- mode projet ;
- mini-IDE ;
- sandbox multi-fichiers ;
- premier projet de synthèse jouable.

### Lot C — Extension du catalogue

- Niveau 2 complet ;
- premiers jalons Niveau 3 ;
- rééquilibrage global.

---

## Décisions structurantes à prendre

### 1. Positionnement du Rust

Il faut décider explicitement si CoreQuest reste :

- un parcours d’apprentissage Rust ;
- ou un parcours d’algorithmique enseigné via Rust.

Avec votre nouvelle liste, on s’oriente clairement vers :

**algorithmique + programmation structurée via Rust**.

### 2. Place des projets

Il faut décider si les projets sont :

- obligatoires pour valider une thématique ;
- obligatoires seulement pour valider un niveau ;
- ou facultatifs avec bonus.

Recommandation :

- projet obligatoire pour clôturer les grosses thématiques structurantes ;
- projet final obligatoire pour clôturer un niveau.

### 3. Granularité des exercices

Il faut éviter de transformer chaque concept en une seule carte trop lourde.

Recommandation :

- plusieurs petits exercices ;
- puis un projet de synthèse.

---

## Risques principaux

- explosion du volume de contenu si le modèle n’est pas industrialisé ;
- sandbox trop limitée pour les projets si le multi-fichiers arrive trop tard ;
- UX confuse si exercice et projet ne sont pas clairement séparés ;
- surcharge produit si l’on tente de bâtir un IDE trop complet ;
- difficulté mal calibrée entre les niveaux 2 et 3.

---

## Critères de réussite

Le nouveau plan sera considéré comme correctement implémenté si :

- le produit distingue clairement `exercice` et `projet` ;
- la progression n’est plus une simple liste plate de niveaux ;
- le Niveau 1 devient un vrai parcours découpé en chapitres ;
- les projets de synthèse existent et sont réellement différenciants ;
- la sandbox supporte les besoins du parcours ;
- les niveaux supérieurs se débloquent par validation réelle du précédent.

---

## Priorité immédiate recommandée

La prochaine étape à exécuter n’est pas encore la production massive de contenu.

La priorité immédiate est :

1. figer le **modèle de contenu** ;
2. figer le **modèle de progression** ;
3. définir le **contrat technique du mode projet / IDE** ;
4. reconstruire ensuite le **Niveau 1** sur cette base.