# Journal de Build IA

## Date
2026-06-04

## Module travaillé
P0 — Modèle de contenu et progression

## Prompt utilisé
Créer le socle technique du nouveau parcours CoreQuest : types `level/theme/chapter/exercise/project/gate`, helpers de lecture, règles de déblocage et adaptation de la progression existante.

## Résultat obtenu
- introduction d’un curriculum hiérarchique pilote au-dessus des exercices existants ;
- ajout des helpers permettant de représenter niveaux, thèmes, chapitres, exercices, projets et gates ;
- conservation d’une compatibilité avec la progression plate déjà utilisée par l’UI.

## Corrections manuelles
- maintien de `currentLevelId` et `completedLevelIds` pour ne pas casser les écrans existants ;
- dérivation du contexte de parcours à la lecture côté progression.

## Décision technique
Introduire le curriculum comme modèle canonique sans migrer toute l’interface d’un seul coup. La transition passe par des helpers qui aplatissent encore les exercices pour les écrans actuels.

## Point à surveiller
La map, le dashboard et le mode projet doivent encore consommer plus directement ce nouveau découpage.

---

## Date
2026-06-04

## Module travaillé
P1 — Moteur d’exercices v2

## Prompt utilisé
Finaliser P1 avec le support de `stdin`, plusieurs modes de validation, un feedback compatible avec les nouveaux formats d’exercice et une base prête pour des problèmes plus algorithmiques.

## Résultat obtenu
- support de `stdin` de bout en bout entre l’éditeur, l’API d’exécution et la sandbox Rust ;
- ajout des modes `stdout_exact`, `stdout_includes` et `exit_success` ;
- adaptation du bloc exercice pour afficher l’entrée standard et la règle de validation ;
- extension des tests pour verrouiller la validation et la sandbox avec `stdin`.

## Corrections manuelles
- mise à jour de la sandbox pour injecter `code` et `stdin` de manière bornée dans un conteneur jetable ;
- nettoyage UTF-8 des fichiers réécrits pour éviter de nouveaux artefacts d’encodage.

## Décision technique
Conserver l’éditeur simple pour les exercices courts et réserver le futur mode IDE aux projets.

## Point à surveiller
Réutiliser ce socle sans duplication lors du branchement du mode projet sur la sandbox avancée.

---

## Date
2026-06-04

## Module travaillé
P2 — Refonte du Niveau 1

## Prompt utilisé
Transformer le Niveau 1 en vrai parcours structuré : plusieurs chapitres, plusieurs exercices par chapitre, progression plus lisible, XP recalibrée et premiers paliers pédagogiques.

## Résultat obtenu
- reconstruction du Niveau 1 en 5 chapitres de 3 exercices ;
- ajout d’exercices progressifs sur affichage, répétitions, variables, `stdin` et conditions ;
- ajout de paliers pédagogiques internes via des contenus `gate` ;
- enrichissement du header de niveau pour rendre visibles niveau, thématique et chapitre.

## Corrections manuelles
- conservation d’une séquence plate de 20 exercices pour ne pas casser la navigation actuelle ;
- maintien des exercices 16 à 20 comme base transitoire du Niveau 2.

## Décision technique
Faire porter P2 principalement par le curriculum et les métadonnées plutôt que par une refonte immédiate de toutes les pages de navigation.

## Point à surveiller
Le Niveau 2 reste provisoire et devra être restructuré dans son lot dédié.

---

## Date
2026-06-04

## Module travaillé
P3 — Mode projet / mini-IDE

## Prompt utilisé
Créer un premier mode projet distinct des exercices, avec structure multi-fichiers, arborescence simple, séparation des fichiers éditables / lecture seule et point d’entrée depuis l’app.

## Résultat obtenu
- ajout du contrat `projectConfig` côté contenu ;
- création d’un projet pilote Rust multi-fichiers ;
- ajout d’une page projet dédiée et d’un mini-IDE v1 ;
- intégration d’un point d’entrée projet depuis le dashboard.

## Corrections manuelles
- aucun correctif métier lourd après implémentation ;
- validation TypeScript et tests passés directement après branchement.

## Décision technique
Séparer clairement l’expérience `exercice` et l’expérience `projet`, tout en gardant une interface volontairement sobre et focalisée sur un seul projet pilote pour ce premier passage.

## Point à surveiller
L’exécution réelle multi-fichiers et la validation avancée doivent rester strictement bornées côté sandbox.

---

## Date
2026-06-04

## Module travaillé
P4 — Sandbox projet et validation avancée

## Prompt utilisé
Rendre les projets réellement exécutables et validables : reconstruction de workspace côté serveur, sandbox multi-fichiers, commandes Cargo bornées, validation par scénarios et retour UI exploitable.

## Résultat obtenu
- ajout d’un chemin d’exécution projet dédié entre l’app et `sandbox-service` ;
- reconstruction sécurisée du workspace à partir du projet canonique et des seuls fichiers éditables ;
- support de l’exécution multi-fichiers avec `cargo run --quiet` et `cargo test --quiet` sous whitelist ;
- validation par scénarios côté application avec affichage des cas réussis / échoués ;
- ajout des tests d’intégration projet et validation complète verte.

## Corrections manuelles
- passage de l’image runner à `rust:1.78` ;
- correction du `PATH` dans le shell du runner pour rendre `cargo` disponible pendant l’exécution ;
- redémarrage du service sandbox pour recharger le nouveau moteur.

## Décision technique
Reconstruire le projet côté serveur à partir du contenu canonique plutôt que d’accepter un workspace arbitraire du client. Garder une whitelist stricte des commandes et agréger les validations par scénarios côté app pour préserver un contrat simple côté contenu.

## Point à surveiller
Le prochain lot doit brancher la map et le dashboard sur les projets, gates et chapitres réels pour que cette nouvelle couche soit pleinement visible côté produit.
---

## Date
2026-06-04

## Module travaillé
P5 — Carte de progression et déblocages

## Prompt utilisé
Brancher la map et le dashboard sur le vrai découpage du parcours : chapitres, jalons (`gate`), projets de synthèse, états de progression et recommandation de reprise cohérente.

## Résultat obtenu
- ajout d’un helper unique de roadmap dérivé du curriculum et de la progression utilisateur ;
- refonte de la map pour afficher niveaux, chapitres, jalons et projet de synthèse ;
- refonte du dashboard pour faire remonter niveau actif, chapitre courant, projet ouvert et action recommandée ;
- raccord du projet pilote comme jalon visible à la sortie du Niveau 1 ;
- ajout d’un test métier qui verrouille l’ouverture du projet et le basculement vers le Niveau 2.

## Corrections manuelles
- liaison explicite du thème `Tests et conditions` vers son projet de synthèse via `milestoneProjectId` ;
- réécriture des cartes map/dashboard pour éviter de dupliquer les règles d’état dans plusieurs composants.

## Décision technique
Centraliser l’état visible du parcours dans un helper unique (`getCurriculumRoadmap`) plutôt que recalculer des statuts localement dans la map, le dashboard et la carte projet. Garder le projet comme jalon visible et disponible sans le rendre bloquant pour l’ouverture du Niveau 2 à ce stade.

## Point à surveiller
La prochaine étape logique est de persister les complétions de projets si l’on veut faire passer un projet du statut `disponible` à `validé` dans le produit, puis enrichir la map avec davantage de niveaux et de projets.
---

## Date
2026-06-04

## Module travaillé
P6 — Niveau 2, ouverture du Niveau 3 et extension des niveaux supérieurs

## Prompt utilisé
Structurer le Niveau 2 autour de flottants, tableaux, chaînes et fonctions ; ajouter un projet de synthèse robuste ; préparer les gates vers le Niveau 3 ; intégrer les premières thématiques algorithmiques ; poser la structure extensible pour les Niveaux 4 à 6.

## Résultat obtenu
- refonte complète du Niveau 2 en 4 chapitres cohérents de 3 exercices chacun ;
- ajout d’un projet de synthèse de Niveau 2 (`Analyseur de signaux`) avec scénarios de validation multi-fichiers ;
- ouverture explicite du Niveau 3 avec deux premiers chapitres orientés balayages, coût et chaînes ;
- extension du parcours à 31 exercices au total ;
- ajout des niveaux 4, 5 et 6 comme charpente extensible avec règles de déblocage déjà posées ;
- recalage des paliers XP du crabe pour rester cohérents avec le parcours étendu.

## Corrections manuelles
- ajustement du helper de roadmap pour faire remonter le projet disponible le plus avancé quand plusieurs projets sont ouverts ;
- mise à jour des tests qui supposaient encore un parcours de 20 exercices et un niveau final `rust-level-20`.

## Décision technique
Conserver les projets comme jalons visibles et disponibles sans les rendre bloquants dans la progression des niveaux à ce stade. Étendre le curriculum par couches : Niveau 2 complet, amorce concrète du Niveau 3, puis niveaux 4 à 6 réservés avec leurs règles de déblocage.

## Point à surveiller
La prochaine étape utile est de brancher la persistance de complétion des projets si l’on veut distinguer clairement `disponible` et `validé` côté dashboard / map, puis de poursuivre la densification réelle du Niveau 3.

---

## Date
2026-06-04

## Module travaill?
P7 ? QA, calibration et documentation

## Prompt utilis?
D?marrer P7 : nettoyer les derniers probl?mes d?encodage, verrouiller les flux exercice/projet et les d?blocages de niveaux, puis recalibrer la progression XP du crabe en fonction du catalogue r?ellement disponible.

## R?sultat obtenu
- nettoyage cibl? des textes corrompus dans le curriculum, la map, le dashboard, les composants projet et la documentation ;
- stabilisation des tests li?s au curriculum et aux projets apr?s remise en UTF-8 propre ;
- ajout d?un test m?tier explicite pour garder le Niveau 3 verrouill? tant que le Niveau 2 n?est pas enti?rement valid? ;
- recalibrage du dernier palier XP du crabe pour que le contenu actuel permette bien d?atteindre le niveau final ;
- mise ? jour du backlog P7 pour refl?ter ce qui est r?ellement v?rifi? et ce qui reste manuel.

## Corrections manuelles
- r??criture directe de `crabProgress.ts` et des tests associ?s pour repartir d?une base saine ;
- r??criture du test `curriculumRoadmap.test.ts` pour clarifier les cas de verrouillage et d?ouverture.

## D?cision technique
Traiter P7 par valeur visible imm?diate : d?abord la qualit? per?ue (UTF-8, microcopy lisible), ensuite le verrouillage m?tier des flux sensibles, sans lancer pour l?instant de refonte lourde de l?UX du mode projet.

## Point ? surveiller
La prochaine passe P7 utile est une vraie v?rification visuelle du mode projet sur desktop puis formats plus petits, id?alement dans le navigateur avec des sc?narios utilisateur complets.

---

## Date
2026-06-05

## Module travaill?
P8 ? Niveau 4 complet

## Prompt utilis?
Structurer un vrai Niveau 4 pour CoreQuest : th?mes, chapitres, exercices, gates et projet de synth?se, sans casser la progression actuelle ni les contrats de contenu existants.

## R?sultat obtenu
- ajout d?un Niveau 4 complet avec 6 th?matiques, 6 chapitres et 12 exercices ;
- ajout de gates internes pour chaque chapitre du Niveau 4 ;
- ajout du projet multi-fichiers `Explorateur de carte` comme projet de synth?se de fin de niveau ;
- extension du parcours plat de 31 ? 43 exercices ;
- mise ? jour des tests curriculum, projets et progression pour verrouiller la nouvelle structure.

## Corrections manuelles
- r??criture du catalogue projets pour repartir d?une base UTF-8 propre ;
- r??criture cibl?e des tests qui supposaient encore que le Niveau 4 ?tait vide.

## D?cision technique
Livrer P8 dans la structure d?j? existante du curriculum plut?t que de lancer une refonte de mod?le suppl?mentaire. Le Niveau 4 s?ins?re donc dans les m?mes helpers que les niveaux pr?c?dents, avec un projet visible mais non bloquant pour l?ouverture du Niveau 5 ? ce stade.

## Point ? surveiller
Le prochain chantier utile est P9, mais il faudra probablement recalibrer les paliers XP du crabe et v?rifier visuellement la map quand plusieurs niveaux longs et plusieurs projets coexistent.


## Date
2026-06-05

## Module travaillé
P9 — Niveau 5 complet

## Prompt utilisé
Structurer le Niveau 5 dans le curriculum existant avec ses chapitres clés et un projet de synthèse aligné sur la montée en difficulté.

## Résultat obtenu
- ajout de 14 exercices Niveau 5, de `rust-level-44` à `rust-level-57` ;
- ajout de 7 thèmes : gloutons, diviser pour régner, arbres binaires, tris efficaces, plus courts chemins, union-find et programmation dynamique ;
- ajout du projet `project-level-5-optimizer-engine` comme jalon de synthèse ;
- mise à jour des tests de progression, curriculum, roadmap et projets.

## Corrections manuelles
- validation du placement des `orderIndex` pour garder une séquence plate cohérente ;
- vérification explicite de l’ouverture du Niveau 6 une fois le Niveau 5 terminé.

## Décision technique
Le Niveau 5 reste sur un format 2 exercices par thème pour garder une charge lisible tout en couvrant les grandes familles algorithmiques demandées.

## Point à surveiller
Le Niveau 6 devra reprendre ce rythme sans créer un saut de difficulté trop brutal sur les projets avancés.


## Date
2026-06-05

## Module travaillé
P10 — Niveau 6 complet

## Prompt utilisé
Clore le parcours avec un Niveau 6 avancé : graphes implicites, dynamique avancée, balayages, SCC, géométrie, flots, couplages, entraînement final et projet de clôture.

## Résultat obtenu
- ajout de 14 exercices Niveau 6, de `rust-level-58` à `rust-level-71` ;
- ajout de 7 thèmes avancés, dont un bloc d’entraînement final ;
- ajout du projet `project-level-6-advanced-solver` comme projet de clôture ;
- mise à jour des tests de curriculum, roadmap, progression et catalogue projet.

## Corrections manuelles
- vérification du placement des `orderIndex` pour garder un ordre global continu ;
- validation de la visibilité du projet final dans la roadmap une fois tout le niveau terminé.

## Décision technique
Le Niveau 6 reste sur une structure homogène de 2 exercices par thème pour préserver la lisibilité, puis déplace la densité supplémentaire vers le projet final multi-fichiers.

## Point à surveiller
Le prochain lot P11 devra surtout recalibrer l’XP globale, la lisibilité de la map longue et l’UX avec plusieurs projets disponibles simultanément.


## Date
2026-06-05

## Module travaillé
Revue pédagogique — Niveau 1 / Lecture de l’entrée

## Prompt utilisé
Rendre le chapitre `Lecture de l’entrée` plus accessible en introduisant progressivement les imports, la `String` tampon, le découpage en lignes puis la conversion.

## Résultat obtenu
- ajout d’un chapitre d’amorce `Premiers pas avec stdin` ;
- ajout de deux exercices progressifs avant la conversion numérique ;
- simplification de l’exercice multi-lignes pour éviter `map().collect()` trop tôt ;
- mise à jour des tests de progression et de roadmap.

## Corrections manuelles
- conservation des exercices existants `rust-level-10` à `rust-level-12` pour garder une continuité de contenu ;
- insertion de deux nouveaux identifiants intermédiaires `rust-level-9a` et `rust-level-9b`.

## Décision technique
Plutôt que d’ajouter seulement plus de texte théorique, la meilleure amélioration pédagogique est de créer un sas pratique avant la conversion, avec des étapes très explicites et des exemples plus lisibles.

## Point à surveiller
Une passe ultérieure pourrait harmoniser visuellement la roadmap si l’on souhaite rendre visibles les sous-chapitres à l’intérieur du thème `Lecture de l’entrée`.


## Date
2026-06-05

## Module travaillé
Revue pédagogique — Tests et conditions + extension du Niveau 1

## Prompt utilisé
Rendre `Tests et conditions` plus accessible, puis prolonger le Niveau 1 après le premier projet pilote avec trois nouveaux chapitres et un second projet.

## Résultat obtenu
- refonte pédagogique du chapitre `Tests et conditions` avec une première entrée sans surcharge d’entrée standard ;
- ajout de trois thèmes post-projet : `Structures avancées`, `Conditions avancées, opérateurs booléens`, `Répétitions conditionnées` ;
- ajout du second projet pilote `project-level-1-watchtower-briefing` ;
- mise à jour des tests curriculum, roadmap, progression et catalogue projet.

## Corrections manuelles
- déplacement du premier projet pilote avant les nouveaux thèmes via un `orderIndex` intermédiaire ;
- choix d’identifiants suffixés (`rust-level-15a` à `rust-level-15f`) pour insérer la nouvelle progression sans renuméroter tout le parcours.

## Décision technique
Le premier projet devient un vrai verrou pédagogique pour la deuxième moitié du Niveau 1 grâce à `complete_content`, ce qui correspond mieux à l’intention produit.

## Point à surveiller
Une passe de calibration P11 devra vérifier si le passage du premier au second projet du Niveau 1 reste assez visible dans la carte de progression.

## Date
2026-06-05

## Module travaillé
P11 — Calibration transverse et persistance projet

## Prompt utilisé
Continuer P11 en sécurisant la progression longue : déblocages N4→N6, paliers XP du crabe, et enregistrement réel des projets validés.

## Résultat obtenu
- ajout de la persistance `project_completions` côté progression ;
- ajout du helper `completeProject(...)` et branchement à `/api/projects/validate` ;
- rafraîchissement du dashboard/progression après validation d’un projet ;
- recalage des paliers du crabe sur un parcours long jusqu’au niveau 12 ;
- ajout d’une migration Supabase `003_project_completions.sql` et mise à jour du bootstrap public ;
- validation ciblée des tests roadmap, projets, crab XP et sandbox.

## Corrections manuelles
- reprise du patch UI projet après interruption de l’outil d’édition ;
- correction d’un détail de typage sur le composant `Alert` ;
- durcissement de la fonction SQL `complete_project(...)` pour respecter le schéma actuel de `user_progress`.

## Décision technique
Le niveau du crabe reste dérivé de l’XP totale, mais l’XP projet devient enfin persistée comme une vraie composante de progression plutôt qu’un simple signal analytique.

## Point à surveiller
Il reste une vérification visuelle manuelle à faire sur le dashboard multi-projets et sur le mode projet en responsive avant de considérer P11 totalement fermé.

## Date
2026-06-05

## Module travaillé
Revue pédagogique — Première lecture avec `stdin`

## Prompt utilisé
Rendre le chapitre `Premier pas avec stdin` plus accessible en retirant les sauts de complexité trop abrupts pour un débutant.

## Résultat obtenu
- remplacement de `read_to_string()` par `read_line()` dans les premiers exercices ;
- introduction explicite de `String::new()`, `&mut`, `unwrap()` et `trim()` ;
- progression plus douce : lire une ligne → nettoyer → convertir → lire deux lignes ;
- exemples et consignes réécrits pour éviter de montrer trop tôt des chaînes d’opérations compactes.

## Corrections manuelles
- conservation du même nombre d’exercices et du même ordre global pour ne pas casser la roadmap ;
- remplacement de l’exemple multi-lignes précoce par deux tampons séparés plus lisibles.

## Décision technique
Le vrai problème n’était pas seulement le manque d’explications textuelles, mais surtout le fait d’introduire trop tôt `Read`, `read_to_string()`, `lines()`, `next()` et `unwrap_or()` dans le même bloc. Le chapitre utilise désormais `read_line()` comme première porte d’entrée.

## Point à surveiller
Les exemples d’entrée standard plus avancés plus loin dans le parcours pourront eux aussi être harmonisés si l’on veut garder la même philosophie de montée en complexité.

## Date
2026-06-05

## Module travaillé
Revue pédagogique — Lire, convertir et réutiliser l’entrée

## Prompt utilisé
Poursuivre la passe pédagogique sur le sous-chapitre `Lire et convertir l’entrée`, en explicitant `i32`, `parse()`, `unwrap()` et le fait qu’une valeur n’a pas toujours besoin d’être convertie.

## Résultat obtenu
- clarification du titre et de l’intention du chapitre ;
- enrichissement de l’exercice de conversion avec des explications sur `i32`, `parse()` et `unwrap()` ;
- exercice à deux lignes recentré sur la répétition d’un schéma déjà connu ;
- exercice `Bonjour, <prénom>` repositionné comme contre-exemple utile : ici, on lit du texte sans convertir.

## Corrections manuelles
- conservation des identifiants et de l’ordre global du chapitre ;
- ajustement seulement des sections de cours, exemples, consignes et indices pour rester compatible avec la roadmap existante.

## Décision technique
Le chapitre ne doit pas seulement apprendre “comment convertir”, mais aussi “quand convertir” et “quand s’abstenir”. Cette distinction réduit beaucoup la charge cognitive chez un débutant.

## Point à surveiller
Une passe future pourra harmoniser la même philosophie sur les premiers exercices de tableaux et de chaînes, où plusieurs transformations apparaissent encore assez tôt.

## Date
2026-06-05

## Module travaillé
Refonte pédagogique — Parcours `stdin` ultra progressif

## Prompt utilisé
Diviser le chapitre `Première lecture avec stdin` en plusieurs chapitres courts, avec une notion dominante par étape et davantage de répétition pour l’ancrage.

## Résultat obtenu
- le thème `Lecture de l’entrée` passe à une progression très granulaire ;
- les notions sont maintenant séparées en chapitres courts : import, tampon `String`, lecture brute, nettoyage, conversion, lecture de deux lignes, réutilisation texte ;
- ajout de nouveaux exercices intermédiaires `rust-level-9c` et `rust-level-9d` ;
- les anciens exercices `10`, `11` et `12` restent présents mais sont repositionnés dans une progression plus lisible.

## Corrections manuelles
- conservation des grands jalons du parcours Niveau 1 ;
- mise à jour des tests de curriculum, roadmap et progression pour refléter le nouveau volume d’exercices.

## Décision technique
Même si certains exercices deviennent plus petits, ce découpage sert mieux l’objectif produit : faire apprendre par répétition et limiter la charge cognitive quand une notion d’entrée standard apparaît pour la première fois.

## Point à surveiller
Il faudra vérifier visuellement que la roadmap ne donne pas une impression de fragmentation excessive sur le thème `Lecture de l’entrée`, maintenant beaucoup plus détaillé.

## Date
2026-06-05

## Module travaillé
Revue pédagogique — `Tests et conditions`

## Prompt utilisé
Vérifier que les notions apprises dans `Lecture de l'entrée` sont bien reprises intelligemment dans `Tests et conditions`, avec de la répétition inter-chapitres plutôt qu'une rupture brutale.

## Résultat obtenu
- le thème `Tests et conditions` est maintenant découpé en trois micro-chapitres ;
- le premier chapitre isole le premier `if / else` sans réintroduire l'entrée standard ;
- le deuxième réactive explicitement le schéma `use std::io` + `String::new()` + `read_line()` + `trim()` + `parse()` ;
- le troisième reprend la même routine sur un cas de calcul (`pair / impair`) pour renforcer l'automatisation ;
- le projet `project-level-1-core-console` ne s'ouvre plus qu'après cette troisième étape.

## Corrections manuelles
- conservation des identifiants d'exercices `rust-level-13`, `rust-level-14` et `rust-level-15` pour ne pas casser la progression existante ;
- mise à jour des tests de curriculum et de roadmap pour refléter le nouveau chapitre final de conditions.

## Décision technique
La répétition utile doit se faire non seulement à l'intérieur d'un chapitre, mais aussi entre chapitres voisins. Ici, l'entrée standard n'est plus un prérequis oublié : elle redevient un geste connu, réutilisé dans un nouveau contexte logique.

## Point à surveiller
Une prochaine passe pourra appliquer la même logique de réactivation douce entre `Structures avancées`, `Conditions avancées` et `Répétitions conditionnées`.
