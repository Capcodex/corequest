# Journal de Build IA

## Date

2026-06-04

## Module travaill?

P4 ? QA finale et cl?ture de livraison

## Prompt utilis?

Effectuer la passe finale de QA, v?rifier les routes cl?s, confirmer l??tat local du produit et mettre la documentation au niveau de l??tat r?el de livraison.

## R?sultat obtenu

- confirmation que les services `app` et `sandbox-service` tournent correctement en local ;
- smoke checks HTTP valid?s sur home, onboarding, niveau 1, login et redirections auth ;
- correction de finition sur la sandbox pour supporter `HEAD /health` en plus de `GET /health` ;
- backlog et README remis en coh?rence avec ce qui est r?ellement valid? automatiquement et ce qui reste manuel.

## Corrections manuelles

- correction du healthcheck sandbox pour que les outils de v?rification HTTP en mode `HEAD` ne retournent plus de faux `404`.

## D?cision technique

- distinguer explicitement la QA automatis?e d?j? couverte et la QA visuelle / session r?elle encore manuelle ;
- ne pas pr?tendre ? une validation UI compl?te sans navigateur de contr?le disponible dans cette session ;
- garder les points restants visibles dans le backlog plut?t que de les fermer artificiellement.

## Point ? surveiller

- terminer la passe manuelle invit? + connect? ;
- v?rifier le rendu r?el mobile / tablet / desktop ;
- confirmer visuellement qu?aucun texte accentu? n?appara?t corrompu dans l?application.

---

## Date

2026-06-03

## Module travaillé

P2 — maturité visuelle des écrans cœur

## Prompt utilisé

Polir la hiérarchie visuelle du dashboard et de la carte de progression pour réduire l’effet “MVP dense”, clarifier la lecture des blocs et renforcer la qualité perçue du produit.

## Résultat obtenu

- réorganisation du dashboard en zones plus lisibles : vue d’ensemble, niveau en cours, métriques et statut du crabe ;
- ajout de barres de progression pour le parcours et pour le prochain palier du crabe ;
- allègement de la carte de progression et meilleur découpage entre résumé, position actuelle et niveaux ;
- clarification des cartes de niveau avec des libellés plus nets et des CTA plus sobres.

## Corrections manuelles

- aucune correction de logique ; le travail a porté sur la hiérarchie, la densité d’information et la lisibilité.

## Décision technique

- ajouter un composant `ProgressBar` minimal plutôt qu’une dépendance visuelle externe ;
- faire remonter l’information principale en tête de chaque carte ;
- réduire les répétitions de texte au profit d’indicateurs plus visuels.

## Point à surveiller

- vérifier visuellement l’équilibre des nouvelles cartes sur mobile ;
- ajuster si nécessaire la densité de la map sur petits écrans ;
- poursuivre avec P3 pour verrouiller responsive, accessibilité et encodage.

---

## Date

2026-06-03

## Module travaillé

P1 — feedbacks et messages utilisateur

## Prompt utilisé

Rendre les messages de réussite, d’erreur, de sauvegarde et d’authentification plus courts, plus actionnables et plus cohérents avec le ton produit défini au P0.

## Résultat obtenu

- réécriture des retours d’exécution pour mieux distinguer compilation, exécution, sortie incorrecte et erreur technique ;
- simplification des messages de validation de niveau et de sauvegarde de progression ;
- harmonisation des messages auth et progression invitée ;
- format de message plus scannable pour l’XP, le niveau suivant et la progression du crabe.

## Corrections manuelles

- aucune correction métier ; le travail a porté sur la qualité du feedback et la clarté de lecture.

## Décision technique

- faire porter chaque message sur trois informations maximum ;
- expliciter l’état avant de suggérer l’action suivante ;
- éviter les phrases longues quand une structure courte séparée par des points médians suffit.

## Point à surveiller

- vérifier en usage réel que les messages restent bien lisibles sur mobile ;
- poursuivre avec une passe P2 sur la hiérarchie visuelle des cartes et alertes ;
- surveiller les derniers textes secondaires encore plus bavards dans les écrans non prioritaires.

---

## Date

2026-06-03

## Module travaillé

P0 — langage produit et crédibilité éditoriale

## Prompt utilisé

Réaliser une passe QA / UI / UX pour rendre CoreQuest moins “MVP gamifié”, auditer le ton et la sémantique, puis réécrire les microcopies les plus exposées avec un vocabulaire plus mature.

## Résultat obtenu

- définition d’un lexique produit de référence ;
- réécriture des microcopies du hero, de l’onboarding, de l’auth, du tableau de bord, de la carte de progression et des messages de fin de niveau ;
- réduction des formulations trop narratives ou enfantines ;
- harmonisation de termes clés comme `parcours`, `niveau`, `progression` et `tableau de bord`.

## Corrections manuelles

- aucune correction logique nécessaire ; le travail a porté sur le wording, les labels et la hiérarchie éditoriale.

## Décision technique

- traiter le crabe comme un repère visuel de progression, pas comme un narrateur ;
- privilégier un ton plus direct, adulte et informatif ;
- éviter de pousser la gamification dans la microcopy quand la progression produit déjà l’engagement.

## Point à surveiller

- poursuivre avec une passe P1 sur les feedbacks fins et les messages secondaires ;
- vérifier visuellement que les nouveaux textes restent bien équilibrés sur mobile ;
- surveiller les derniers résidus d’encodage ou d’anciens termes dans des écrans moins centraux.

---

## Date

2026-06-03

## Module travaillé

Progression du crabe — niveaux non linéaires basés sur l’XP

## Prompt utilisé

Ajouter un vrai système où le crabe monte de niveau avec des paliers d’XP non linéaires, visibles dans le dashboard, la roadmap et les retours de fin de niveau.

## Résultat obtenu

- ajout d’un calcul de niveau du crabe dérivé de l’XP ;
- mise en place de paliers non linéaires avec niveau 2 atteint après les 3 premiers exercices ;
- affichage du niveau du crabe et du prochain palier sur le dashboard et la map ;
- message de fin de niveau enrichi quand le crabe monte de niveau.

## Corrections manuelles

- aucune migration Supabase nécessaire, car le niveau du crabe est dérivé à la volée de `xp_total` pour éviter les divergences de données.

## Décision technique

- dériver le niveau du crabe depuis l’XP plutôt que le stocker en base ;
- choisir des paliers liés au rythme réel du parcours pour garder une montée de niveau compréhensible ;
- réutiliser le composant visuel du crabe avec un badge de niveau plutôt que créer un second avatar.

## Point à surveiller

- vérifier en usage réel si les paliers intermédiaires sont perçus comme assez motivants ;
- réajuster les seuils si l’XP des niveaux change lors d’un futur équilibrage du contenu.

---

# Journal de Build IA

## Date

2026-06-03

## Module travaill?

Parcours Rust ? extension du contenu ? 20 niveaux progressifs

## Prompt utilis?

Cr?er une vingtaine de niveaux Rust avec une difficult? graduelle, tout en restant coh?rent avec le MVP CoreQuest et l'?diteur d?sormais vide.

## R?sultat obtenu

- extension du parcours `rust-foundations` ? 20 niveaux ;
- progression p?dagogique continue de `println!` jusqu'aux vecteurs, en restant dans le p?rim?tre MVP ;
- suppression de l'hypoth?se implicite qui faisait du niveau 3 le dernier niveau ;
- ajout d'un test qui verrouille la pr?sence d'un parcours de 20 niveaux.

## Corrections manuelles

- r??criture compl?te du fichier `levels.json` en UTF-8 propre sans BOM pour ?viter les erreurs de build et les accents corrompus.

## D?cision technique

- garder chaque exercice autoportant avec une sortie simple et v?rifiable ;
- faire monter la difficult? par concepts Rust de base plut?t que par ?nonc?s trop longs ;
- conserver des niveaux compatibles avec l'apprentissage par r?p?tition et un ?diteur vide.

## Point ? surveiller

- v?rifier en usage r?el que la courbe de difficult? reste fluide entre les niveaux 12 ? 18 ;
- envisager plus tard une deuxi?me piste de contenu plut?t que d'alourdir excessivement cette premi?re route.

---


﻿# Journal de Build IA

## Date

2026-06-03

## Module travaillé

P4 — validation, tests métier et nettoyage de livraison

## Prompt utilisé

Finaliser le lot avec une passe QA, compléter les tests métier manquants, vérifier les routes principales et nettoyer la documentation de livraison.

## Résultat obtenu

- ajout de tests sur `getLevelState` pour couvrir le niveau courant et les états de verrouillage ;
- README remis à jour pour refléter l’état réel du MVP ;
- smoke tests HTTP validés sur home, onboarding, niveau 1, redirects auth et santé sandbox ;
- suite complète validée à `20/20`.

## Corrections manuelles

- correction d’une attente de test sur le premier niveau, qui est bien considéré comme `in_progress` pour un nouvel utilisateur et non `available`.

## Décision technique

- distinguer clairement la QA automatisable (tests, routes, redirections, sandbox) de la QA manuelle visuelle encore à faire ;
- garder les items visuels/mobile et la passe authentifiée comme checkpoints séparés dans le backlog ;
- mettre la documentation de démarrage au niveau de l’état réel du produit pour éviter les faux signaux.

## Point à surveiller

- terminer la vérification manuelle connecté/invité avec une vraie session UI ;
- vérifier visuellement la roadmap et le dashboard sur mobile et desktop ;
- confirmer que les redirections auth restent fluides pendant un usage réel.

---

## Date

2026-06-03

## Module travaillé

P3 — dashboard compagnon et harmonisation avec la roadmap

## Prompt utilisé

Afficher le crabe sur le dashboard, rendre la progression plus visuelle, et aligner les codes UX du dashboard avec ceux de la roadmap interactive.

## Résultat obtenu

- ajout d’un bloc dashboard centré sur le crabe compagnon ;
- amélioration des métriques de progression avec une hiérarchie plus claire ;
- ajout d’un bloc “continuer” cohérent avec la roadmap ;
- harmonisation visuelle entre dashboard et map.

## Corrections manuelles

- aucune correction structurelle nécessaire après implémentation ; validation TypeScript et tests passés directement.

## Décision technique

- réutiliser le composant `CrabAvatar` pour éviter une divergence visuelle entre écrans ;
- transformer le dashboard en point d’ancrage produit, pas seulement en liste de métriques ;
- conserver une structure simple en cartes pour rester légère et responsive.

## Point à surveiller

- vérifier en usage réel que le dashboard guide bien vers l’action principale ;
- confirmer que le crabe reste lisible et utile sur petits écrans ;
- réutiliser la même grammaire visuelle pour les futures cartes Premium ou analytics.

---

## Date

2026-06-03

## Module travaillé

P2 — roadmap interactive et crabe de progression

## Prompt utilisé

Transformer l’onglet map en roadmap interactive inspirée de Duolingo, avec des couleurs d’état claires et un petit crabe qui se déplace sur les niveaux.

## Résultat obtenu

- refonte complète de la map en parcours vertical interactif ;
- ajout d’états visuels plus lisibles pour verrouillé, disponible, en cours et complété ;
- ajout d’un crabe SVG maison positionné sur le niveau courant ;
- amélioration du résumé de progression pour mieux accompagner la lecture de la roadmap.

## Corrections manuelles

- ajustement d’un typage TypeScript sur l’alternance gauche / droite des cartes de la roadmap.

## Décision technique

- rester sur une implémentation React + Tailwind sans dépendance visuelle externe ;
- utiliser un composant SVG local pour le crabe afin de garder le contrôle du style ;
- privilégier une structure verticale lisible sur mobile, enrichie par une alternance latérale sur desktop.

## Point à surveiller

- vérifier le confort de navigation réel sur petits écrans ;
- surveiller la perception du crabe comme repère de progression ;
- réutiliser ces codes visuels dans le dashboard P3 pour garder une cohérence produit.

---

## Date

2026-06-03

## Module travaillé

P1 — éditeur Rust vide et suppression du starter code

## Prompt utilisé

Faire en sorte que les exercices Rust démarrent toujours avec un éditeur vide, supprimer l’approche “code à trous” et conserver les exemples pédagogiques en dehors de l’éditeur.

## Résultat obtenu

- suppression du pré-remplissage de l’éditeur ;
- réinitialisation vers un état vide ;
- consignes pédagogiques réécrites pour demander un programme complet ;
- textes d’onboarding et de landing mis à jour pour refléter la mémorisation active.

## Corrections manuelles

- nettoyage des fichiers réécrits en UTF-8 à cause d’un héritage d’encodage incohérent.

## Décision technique

- retirer totalement la dépendance applicative au champ `starterCode` ;
- conserver les exemples uniquement dans le contenu pédagogique ;
- ajouter un repère léger dans l’éditeur via placeholder et message d’aide, sans fournir de solution partielle.

## Point à surveiller

- vérifier en usage réel que partir de zéro reste motivant pour le niveau 1 ;
- surveiller si certains niveaux auront besoin d’indices plus explicites pour compenser l’absence de pré-remplissage ;
- garder cette logique cohérente lors de l’ajout de nouveaux niveaux.

---

## Date

2026-06-03

## Module travaillé

P0 — correction progression, XP et rafraîchissement dashboard

## Prompt utilisé

Corriger le fait qu’un niveau réussi ne semblait pas vraiment terminé, que l’XP ne remontait pas dans le dashboard et que la progression restait incohérente après réussite.

## Résultat obtenu

- ajout d’une invalidation explicite des vues `dashboard`, `map` et `levels/[levelId]` après complétion ;
- ajout d’un fallback applicatif si la fonction RPC `complete_level` n’est pas disponible ;
- ajout de tests ciblés sur la mise à jour d’XP et du niveau courant.

## Corrections manuelles

- relance des validations Docker en mode non interactif `-T` pour éviter le blocage sous Windows.

## Décision technique

- garder la RPC Supabase comme chemin principal ;
- ajouter un fallback direct sur les tables pour rendre la progression plus robuste ;
- invalider explicitement les routes server-side pour éviter les dashboards périmés en navigation cliente.

## Point à surveiller

- vérifier en navigation réelle que le dashboard reflète immédiatement la nouvelle XP après réussite ;
- surveiller si la base distante utilise bien la RPC ou passe par le fallback ;
- réutiliser ce même pattern d’invalidation lors des prochaines évolutions map/dashboard.

---

## Date

2026-06-03

## Module travaillé

Planification du prochain lot UX & progression

## Prompt utilisé

Refonte des priorités autour de :

- éditeur Rust vide ;
- roadmap interactive type Duolingo ;
- correction du bug XP / dashboard ;
- ajout du crabe sur la map et le dashboard ;
- création d’un backlog et d’un journal de build IA.

## Résultat obtenu

- création d’un nouveau plan d’implémentation ;
- création d’un backlog priorisé ;
- création de ce journal de build.

## Corrections manuelles

- aucune pour l’instant.

## Décision technique

- traiter d’abord le bug de progression avant les refontes visuelles ;
- garder l’éditeur vide par défaut pour favoriser la mémorisation active ;
- partager une même identité visuelle “crabe + roadmap” entre la map et le dashboard ;
- éviter une dépendance UI lourde si React + Tailwind suffisent.

## Point à surveiller

- cohérence entre niveau terminé, XP gagné, niveau courant et dashboard ;
- bonne reprise de progression après signup ;
- lisibilité de la roadmap sur petits écrans ;
- risque de surcharger la map avec trop d’animation.

---

## Template pour les prochaines entrées

## Date
## Module travaillé
## Prompt utilisé
## Résultat obtenu
## Corrections manuelles
## Décision technique
## Point à surveiller
