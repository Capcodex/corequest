# Plan d?impl?mentation ? Niveaux 4, 5 et 6 de CoreQuest

## Objectif

?tendre CoreQuest au-del? du Niveau 3 avec un parcours long, coh?rent et progressif, sans casser les fondations d?j? pos?es :

- chapitres courts et lisibles ;
- exercices algorithmiques de plus en plus structurants ;
- gates explicites entre niveaux ;
- un projet de synth?se par niveau ;
- une progression XP et produit qui reste lisible jusqu?? la fin du parcours.

Le but n?est pas seulement d?ajouter du volume, mais d?installer une mont?e en difficult? ma?tris?e jusqu?au bloc avanc? final.

---

## Principes de cadrage

### 1. Niveau = grande marche de comp?tence

- `Niveau 4` : choisir une m?thode et manipuler des structures classiques ;
- `Niveau 5` : reconna?tre et appliquer les grandes familles d?algorithmes ;
- `Niveau 6` : consolider les sujets avanc?s et finir sur un entra?nement dense.

### 2. Chapitre = lecture courte + pratique directe

Chaque chapitre doit rester compact :

- une introduction ;
- quelques points ? retenir ;
- une s?rie d?exercices ;
- ?ventuellement un gate de validation.

### 3. Projet = validation forte du niveau

Chaque niveau 4, 5 et 6 doit se terminer par un projet :

- plus long qu?un exercice ;
- multi-fichiers ;
- ex?cut? dans la sandbox projet ;
- valid? par sc?narios/tests ;
- assez significatif pour servir de synth?se r?elle.

### 4. D?blocage = validation r?elle du niveau pr?c?dent

Le niveau sup?rieur ne s?ouvre que si :

- les chapitres requis du niveau pr?c?dent sont valid?s ;
- le gate final du niveau pr?c?dent est franchi ;
- la logique de progression reste compr?hensible c?t? map et dashboard.

---

## Niveau 4 ? Structures et m?thodes

## Intention p?dagogique

Faire passer l?utilisateur de la r?solution locale d?un exercice ? une logique de m?thode.

Il ne s?agit plus seulement de coder une r?ponse correcte, mais de :

- choisir une structure adapt?e ;
- d?couper le probl?me ;
- reconna?tre un sch?ma de r?solution ;
- commencer ? raisonner en termes de parcours, arbre, graphe, r?cursivit?.

## Th?matiques cibles

- m?thodes : coder proprement et efficacement ;
- arbres ;
- structures de donn?es et balayages ;
- r?cursivit? avanc?e ;
- calculs g?om?triques (1) ;
- graphes ;
- algorithmes semi-num?riques (1) ;
- graphes implicites (1) ;
- entra?nement de fin de niveau.

## Forme recommand?e

- `6 ? 8` chapitres r?els ;
- `3 ? 5` exercices par chapitre ;
- `1` gate interm?diaire apr?s les th?mes les plus structurants ;
- `1` projet final obligatoire.

## Projet de synth?se recommand?

### Projet Niveau 4 ? Explorateur de carte

Projet multi-fichiers autour de :

- lecture d?une carte ;
- parcours de structure ;
- r?gles de d?placement ;
- restitution d?un r?sultat de navigation ou d?exploration.

Ce projet doit mobiliser :

- structures simples ;
- parcours ;
- d?coupage du code ;
- validation par sc?narios.

## Risque principal

Le saut entre Niveau 3 et Niveau 4 peut ?tre brutal si l?on introduit trop vite graphes, r?cursivit? avanc?e et g?om?trie sans sas p?dagogique.

## Crit?re de r?ussite

? la fin du Niveau 4, l?utilisateur doit savoir choisir une approche raisonnable parmi plusieurs outils classiques.

---

## Niveau 5 ? Algorithmes fondamentaux avanc?s

## Intention p?dagogique

Faire entrer l?utilisateur dans les grandes familles d?algorithmes attendues sur des probl?mes plus s?rieux.

Le niveau doit lui apprendre ? reconna?tre :

- quand un glouton est pertinent ;
- quand il faut diviser le probl?me ;
- quand utiliser une structure d?arbre ;
- quand un graphe ou une programmation dynamique devient le bon cadre.

## Th?matiques cibles

- algorithmes gloutons ;
- diviser pour r?gner ;
- arbres binaires ;
- tris efficaces ;
- plus courts chemins ;
- union-find ;
- algorithmes semi-num?riques (2) ;
- algorithmes dynamiques ;
- entra?nement de fin de niveau.

## Forme recommand?e

- `6 ? 8` chapitres ;
- `3 ? 4` exercices par chapitre ;
- un peu plus de densit? conceptuelle que le Niveau 4 ;
- `1` projet final plus ouvert que celui du Niveau 4.

## Projet de synth?se recommand?

### Projet Niveau 5 ? Moteur d?optimisation

Projet multi-fichiers autour de :

- choix d?une strat?gie de r?solution ;
- agr?gation de donn?es ;
- optimisation d?un r?sultat ;
- sc?narios de validation multiples.

Ce projet doit pousser l?utilisateur ? choisir une famille algorithmique adapt?e, pas seulement ? traduire une consigne brute.

## Risque principal

Le niveau peut devenir trop th?orique si les exercices n?explicitent pas assez le ?quand utiliser quoi?.

## Crit?re de r?ussite

? la fin du Niveau 5, l?utilisateur doit mieux reconna?tre la famille algorithmique adapt?e ? un probl?me donn?.

---

## Niveau 6 ? Avanc? et entra?nement final

## Intention p?dagogique

Consolider les th?mes les plus exigeants et fermer le parcours avec un vrai bloc d?entra?nement autonome.

Le Niveau 6 n?est pas un simple appendice : c?est la phase o? l?utilisateur doit commencer ? encha?ner des probl?mes denses avec moins de guidage.

## Th?matiques cibles

- graphes implicites (2) ;
- algorithmes dynamiques avanc?s ;
- structures de donn?es et balayages avanc?s ;
- composantes fortement connexes ;
- calculs g?om?triques (2) ;
- flots et couplages ;
- entra?nement final.

## Forme recommand?e

- `5 ? 7` chapitres ? forte densit? ;
- `3 ? 4` exercices par chapitre ;
- un bloc final d?entra?nement plus libre ;
- `1` projet final le plus ambitieux du parcours.

## Projet de synth?se recommand?

### Projet Niveau 6 ? Solveur avanc?

Projet multi-fichiers autour de :

- un probl?me plus riche ;
- plusieurs modules ;
- plusieurs sc?narios de validation ;
- une ex?cution suffisamment longue pour justifier le mode projet ;
- une vraie sensation d?aboutissement de parcours.

## Risque principal

Le niveau peut devenir intimidant si la lisibilit? produit n??volue pas en parall?le : map, dashboard et mode projet doivent rester tr?s clairs.

## Crit?re de r?ussite

? la fin du Niveau 6, l?utilisateur doit pouvoir traiter des probl?mes complexes avec une autonomie nettement plus forte qu?au d?but du produit.

---

## Chantiers transverses n?cessaires

Ces trois niveaux ne doivent pas ?tre produits comme de simples ajouts de contenu. Ils impliquent aussi un travail transversal.

## 1. Contenu

? faire :

- d?finir les chapitres canoniques de chaque niveau ;
- ?crire les s?ries d?exercices ;
- d?finir les gates ;
- d?finir les projets finaux ;
- calibrer difficult? et dur?e.

## 2. Progression

? faire :

- ajouter les r?gles d?ouverture Niveau 4 ? 5 ? 6 ;
- v?rifier les ?tats visibles sur la map ;
- v?rifier les recommandations du dashboard ;
- s?assurer que les projets restent visibles sans brouiller la reprise principale.

## 3. Sandbox projet

? faire :

- confirmer que les projets N4/N5/N6 restent dans le p?rim?tre s?r ;
- contr?ler la dur?e d?ex?cution ;
- limiter le poids des workspaces ;
- garder la validation par tests/sc?narios simple ? maintenir.

## 4. UX du mode projet

? faire :

- garder une arborescence simple ;
- mieux s?parer consignes, fichiers et r?sultats ;
- supporter le mode desktop d?abord ;
- pr?voir une d?gradation propre sur ?crans plus petits.

## 5. Calibration XP

? faire :

- ?viter une inflation artificielle ;
- faire correspondre les paliers du crabe au volume r?el de contenu ;
- garder une progression lisible entre Niveau 4 et Niveau 6 ;
- faire du projet un moment fort, sans qu?il d?s?quilibre tout le syst?me.

---

## Ordre d?impl?mentation recommand?

## P8 ? Niveau 4 complet

Objectif : livrer le premier niveau ?structures et m?thodes? de fa?on compl?te.

? faire :

1. structurer le curriculum Niveau 4 ;
2. cr?er les chapitres ;
3. ?crire les exercices ;
4. ajouter les gates ;
5. livrer le projet de synth?se Niveau 4 ;
6. brancher la progression et les ?tats visibles.

## P9 ? Niveau 5 complet

Objectif : introduire les familles d?algorithmes fondamentales sans casser le rythme.

? faire :

1. structurer le curriculum Niveau 5 ;
2. ?crire les chapitres majeurs ;
3. densifier les exercices m?thodologiques ;
4. livrer le projet de synth?se Niveau 5 ;
5. recalibrer les paliers XP interm?diaires.

## P10 ? Niveau 6 complet

Objectif : fermer le parcours long avec le bloc avanc? et l?entra?nement final.

? faire :

1. structurer le curriculum Niveau 6 ;
2. ?crire les chapitres avanc?s ;
3. ajouter le bloc d?entra?nement final ;
4. livrer le projet final ;
5. v?rifier la coh?rence de fin de parcours.

## P11 ? Calibration transverse finale

Objectif : stabiliser le produit complet apr?s ajout des niveaux 4 ? 6.

? faire :

1. v?rifier les d?blocages 4 ? 5 ? 6 ;
2. recalibrer XP, dur?e et difficult? ;
3. v?rifier la lisibilit? map/dashboard ;
4. v?rifier le mode projet sur desktop puis formats plus petits ;
5. finaliser la documentation de pilotage.

---

## Priorit? imm?diate recommand?e

La meilleure suite n?est pas d?ouvrir les trois niveaux d?un coup.

La priorit? recommand?e est :

1. livrer un `Niveau 4` complet et jouable ;
2. valider la charge UX et sandbox de son projet ;
3. seulement ensuite d?rouler `Niveau 5`, puis `Niveau 6`.

Autrement dit :

- `Niveau 4` doit servir de niveau de r?f?rence ;
- `Niveau 5` doit servir de niveau de densification ;
- `Niveau 6` doit servir de cl?ture ambitieuse du parcours.
