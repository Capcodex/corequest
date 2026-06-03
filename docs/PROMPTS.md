# Prompts d’Implémentation par Module — CoreQuest MVP

Ces prompts sont prêts à être utilisés avec Claude Code.

Chaque prompt doit être utilisé séparément, dans l’ordre recommandé.

---

## Prompt 1 — Initialisation projet

```text
Tu vas initialiser le projet CoreQuest.

Contexte :
- CoreQuest est une plateforme web pour apprendre Rust par niveaux.
- Stack : Next.js, React, TypeScript, Tailwind CSS.
- Le projet devra intégrer plus tard Supabase, un éditeur de code et une sandbox Rust.

Objectif :
Créer la structure de base du projet avec l’arborescence cible.

À faire :
- Initialiser Next.js avec TypeScript.
- Configurer Tailwind CSS.
- Créer les dossiers src/app, src/components, src/lib, src/types, src/data.
- Créer README.md.
- Créer CLAUDE.md avec le contexte projet.
- Créer .env.example.
- Créer une page d’accueil temporaire.

Contraintes :
- Ne pas ajouter de dépendances inutiles.
- Garder une structure claire.
- Préparer le projet pour une architecture modulaire.

Critères de validation :
- npm run dev démarre.
- La page d’accueil s’affiche.
- L’arborescence cible est respectée.
```

---

## Prompt 2 — Design system minimal

```text
Tu vas créer le design system minimal de CoreQuest.

Contexte :
- Application web sombre, moderne, claire, non infantilisante.
- Stack : Next.js, React, TypeScript, Tailwind CSS.

Objectif :
Créer les composants UI réutilisables nécessaires au MVP.

À faire :
- Créer Button.tsx.
- Créer Card.tsx.
- Créer Badge.tsx.
- Créer Alert.tsx.
- Créer Loader.tsx.
- Créer Header.tsx.
- Créer Footer.tsx.
- Créer AppShell.tsx.

Contraintes :
- Composants typés.
- Pas de librairie UI lourde.
- Style cohérent avec une plateforme d’apprentissage Rust.
- Ne pas intégrer de logique métier dans les composants UI.

Critères de validation :
- Les composants peuvent être importés.
- Les variantes principales fonctionnent.
- L’interface reste lisible sur fond sombre.
```

---

## Prompt 3 — Données pédagogiques Rust

```text
Tu vas implémenter le système de contenu pédagogique Rust.

Contexte :
- Le MVP contient un parcours unique : Rust — Les fondations du système.
- Les niveaux doivent être stockés dans un fichier JSON.
- Les composants ne doivent pas contenir de contenu hardcodé.

Objectif :
Créer le format de données des niveaux et les fonctions de lecture.

À faire :
- Créer types/level.ts.
- Créer data/rust-foundations/levels.json.
- Ajouter au moins les 3 premiers niveaux complets.
- Prévoir la structure pour 12 à 18 niveaux.
- Créer lib/levels/getLevels.ts.
- Créer lib/levels/getLevelById.ts.

Champs attendus par niveau :
- id
- pathId
- orderIndex
- title
- concept
- missionText
- lesson content
- exampleCode
- instructions
- starterCode
- expectedOutput
- hint
- xpReward

Critères de validation :
- getLevels retourne les niveaux triés.
- getLevelById retourne le bon niveau.
- Un niveau inconnu est géré proprement.
```

---

## Prompt 4 — Page d’accueil

```text
Tu vas implémenter la page d’accueil de CoreQuest.

Contexte :
- CoreQuest apprend Rust à travers des niveaux, des missions et une sandbox d’exécution réelle.
- L’objectif est de convaincre rapidement un visiteur de commencer.

Objectif :
Créer une landing page MVP claire.

À faire :
- Créer HeroSection.
- Créer HowItWorks.
- Créer ProductPreview.
- Intégrer ces sections dans app/page.tsx.
- Ajouter un CTA vers /onboarding.

Message à faire passer :
- Apprendre Rust niveau par niveau.
- Écrire du vrai code.
- Compiler et exécuter dans une sandbox.
- Corriger et débloquer la suite.

Critères de validation :
- La page est compréhensible rapidement.
- Le CTA fonctionne.
- L’UI respecte le style sombre moderne.
```

---

## Prompt 5 — Onboarding

```text
Tu vas implémenter l’onboarding MVP.

Contexte :
- L’onboarding présente l’univers CoreQuest et la boucle d’apprentissage.
- Il doit être court pour ne pas bloquer l’accès au premier niveau.

Objectif :
Créer la page /onboarding.

À faire :
- Créer OnboardingPanel.
- Présenter le scénario du noyau numérique à reconstruire.
- Expliquer la boucle : apprendre, coder, exécuter, corriger, progresser.
- Ajouter bouton Commencer.
- Ajouter option Passer.
- Rediriger vers /levels/rust-level-1.

Critères de validation :
- L’utilisateur peut démarrer le niveau 1.
- L’onboarding est court.
- Le bouton Passer fonctionne.
```

---

## Prompt 6 — Page de niveau statique

```text
Tu vas créer la page de niveau CoreQuest sans connecter encore la sandbox.

Contexte :
- Les niveaux viennent du fichier levels.json.
- Chaque niveau contient mission, cours, exemple, exercice et starter code.

Objectif :
Créer /levels/[levelId].

À faire :
- Charger le niveau avec getLevelById.
- Afficher LevelHeader.
- Afficher MissionBlock.
- Afficher LessonBlock.
- Afficher ExerciseBlock.
- Afficher CodeEditor avec starterCode.
- Gérer le cas niveau introuvable.

Critères de validation :
- /levels/rust-level-1 affiche le niveau 1.
- Les données viennent du JSON.
- L’éditeur affiche le starter code.
```

---

## Prompt 7 — Éditeur de code

```text
Tu vas implémenter l’éditeur de code Rust.

Contexte :
- L’utilisateur doit pouvoir écrire du code Rust.
- L’exécution sera connectée ensuite via /api/execute.

Objectif :
Créer un composant CodeEditor fonctionnel.

À faire :
- Afficher le starter code.
- Permettre la modification.
- Ajouter bouton Exécuter.
- Ajouter bouton Réinitialiser.
- Gérer l’état loading.
- Préparer une callback onRun(code).

Contraintes :
- Utiliser Monaco Editor si simple.
- Sinon utiliser une textarea stylisée temporaire.
- Ne pas créer d’IDE complet.

Critères de validation :
- Le code modifié est envoyé à onRun.
- Reset restaure le starter code.
- Le bouton Exécuter est désactivé pendant loading.
```

---

## Prompt 8 — Service sandbox Rust

```text
Tu vas implémenter le service sandbox Rust MVP.

Contexte :
- La sandbox est une brique cœur du MVP.
- Le code utilisateur ne doit jamais être exécuté directement dans le backend principal.
- Le service doit compiler et exécuter du Rust dans un environnement isolé.

Objectif :
Créer un service sandbox séparé dans sandbox-service.

À faire :
- Créer un serveur HTTP minimal.
- Créer un endpoint POST /execute.
- Recevoir un code Rust.
- Vérifier la taille maximale du code.
- Créer un environnement temporaire.
- Compiler le code.
- Exécuter le binaire si compilation réussie.
- Capturer stdout et stderr.
- Appliquer timeout.
- Appliquer limites de ressources si possible.
- Désactiver le réseau.
- Nettoyer l’environnement.
- Retourner un résultat normalisé.

Statuts :
- success
- compile_error
- runtime_error
- timeout
- sandbox_error

Contraintes :
- Pas de crates externes libres.
- Code mono-fichier.
- Pas d’accès réseau.
- Pas de secrets exposés.
- Ne pas conserver les fichiers après exécution.

Critères de validation :
- Code Rust valide retourne success.
- Code invalide retourne compile_error.
- Boucle infinie retourne timeout.
- stdout et stderr sont retournés.
- L’environnement est nettoyé.
```

---

## Prompt 9 — API `/api/execute`

```text
Tu vas connecter l’application Next.js au service sandbox Rust.

Contexte :
- Le frontend envoie levelId et code.
- Le backend doit appeler le service sandbox.
- Le backend doit comparer stdout avec expectedOutput.

Objectif :
Créer l’API POST /api/execute.

À faire :
- Valider le payload.
- Refuser code vide.
- Refuser code trop long.
- Charger le niveau avec levelId.
- Appeler lib/sandbox/executeRustCode.
- Comparer stdout normalisé avec expectedOutput.
- Retourner un résultat normalisé au frontend.
- Préparer la sauvegarde de tentative si la base est disponible.

Critères de validation :
- Code correct retourne passed true.
- Code incorrect retourne wrong_output.
- Erreur compilation retourne compile_error.
- Timeout retourne timeout.
- Erreur sandbox retourne sandbox_error.
```

---

## Prompt 10 — Feedback d’exécution

```text
Tu vas implémenter l’affichage du résultat d’exécution.

Contexte :
- L’utilisateur doit comprendre ce qui s’est passé après avoir exécuté son code.
- Les erreurs Rust doivent être lisibles.

Objectif :
Créer ExecutionResult et intégrer le feedback dans la page de niveau.

À faire :
- Afficher statut.
- Afficher stdout.
- Afficher stderr.
- Afficher sortie attendue si sortie incorrecte.
- Afficher message succès.
- Afficher message erreur compilation.
- Afficher message timeout.
- Afficher indice si demandé.

Critères de validation :
- Succès clairement visible.
- Erreur compilation compréhensible.
- Sortie incorrecte affiche obtenu vs attendu.
- L’utilisateur peut relancer après correction.
```

---

## Prompt 11 — Authentification

```text
Tu vas implémenter l’authentification utilisateur.

Contexte :
- L’utilisateur peut tester le niveau 1 sans compte.
- Le compte sert à sauvegarder la progression.
- Stack recommandée : Supabase Auth.

Objectif :
Créer signup, login, logout et gestion de session.

À faire :
- Configurer le client Supabase.
- Créer /auth/signup.
- Créer /auth/login.
- Ajouter logout dans Header.
- Créer getCurrentUser.
- Protéger dashboard et map si nécessaire.

Critères de validation :
- Un utilisateur peut créer un compte.
- Un utilisateur peut se connecter.
- Un utilisateur peut se déconnecter.
- Les erreurs sont affichées clairement.
```

---

## Prompt 12 — Progression utilisateur

```text
Tu vas implémenter la progression utilisateur.

Contexte :
- Un niveau réussi débloque le niveau suivant.
- L’XP est attribué une seule fois.
- La progression doit persister.

Objectif :
Créer les tables, services et logique de progression.

À faire :
- Créer migrations Supabase pour profiles, user_progress, level_completions, submissions.
- Créer getUserProgress.
- Créer completeLevel.
- Ajouter attribution XP.
- Empêcher double attribution XP.
- Mettre à jour le niveau actuel.

Critères de validation :
- Niveau réussi sauvegardé.
- Niveau suivant débloqué.
- XP ajouté une seule fois.
- Progression retrouvée après reconnexion.
```

---

## Prompt 13 — Carte de progression

```text
Tu vas implémenter la carte de progression.

Contexte :
- Le parcours Rust est linéaire.
- Chaque niveau a un état : verrouillé, disponible, en cours, terminé.

Objectif :
Créer /map et les composants LevelMap, LevelNode, ProgressSummary.

À faire :
- Charger les niveaux.
- Charger la progression utilisateur.
- Calculer l’état de chaque niveau.
- Afficher la progression globale.
- Bloquer l’accès aux niveaux verrouillés.
- Permettre de rejouer les niveaux terminés.

Critères de validation :
- Niveau 1 disponible.
- Niveau 2 verrouillé si niveau 1 non terminé.
- Niveau suivant débloqué après réussite.
- États visuels clairs.
```

---

## Prompt 14 — Dashboard

```text
Tu vas créer le dashboard utilisateur.

Contexte :
- L’utilisateur connecté doit reprendre rapidement son parcours.

Objectif :
Créer /dashboard.

À faire :
- Charger l’utilisateur.
- Charger sa progression.
- Afficher parcours actif.
- Afficher niveau actuel.
- Afficher XP.
- Ajouter bouton Continuer.

Critères de validation :
- Dashboard accessible aux utilisateurs connectés.
- Le bouton Continuer mène au bon niveau.
- Les données affichées sont correctes.
```

---

## Prompt 15 — Analytics

```text
Tu vas implémenter le tracking analytics MVP.

Contexte :
- Le MVP doit mesurer activation, usage, exécution, erreurs, complétion, rétention et intention Premium.

Objectif :
Créer un système simple de tracking interne.

À faire :
- Créer table analytics_events.
- Créer trackEvent.
- Créer API /api/analytics/event.
- Tracker :
  - page_home_viewed
  - cta_start_clicked
  - onboarding_started
  - level_viewed
  - code_execution_started
  - code_execution_completed
  - code_compile_error
  - code_wrong_output
  - code_timeout
  - level_completed
  - premium_interest_clicked

Critères de validation :
- Les événements sont bien enregistrés.
- Les événements supportent user_id nullable.
- Les événements supportent anonymous_session_id.
- Le tracking ne bloque pas l’UX.
```

---

## Prompt 16 — Premium bientôt disponible

```text
Tu vas implémenter le module Premium bientôt disponible.

Contexte :
- Le MVP ne doit pas intégrer de paiement.
- On veut mesurer l’intérêt utilisateur.

Objectif :
Créer une page ou un bloc Premium.

À faire :
- Créer /premium.
- Présenter les bénéfices futurs.
- Ajouter bouton Je veux être prévenu.
- Ajouter champ email si utilisateur non connecté.
- Sauvegarder l’intérêt dans premium_interest.
- Tracker premium_interest_clicked.

Critères de validation :
- L’utilisateur peut signaler son intérêt.
- L’email est sauvegardé si fourni.
- Un message de confirmation s’affiche.
```

---

## Prompt 17 — QA finale MVP

```text
Tu vas faire une passe de QA et durcissement MVP.

Contexte :
- Les fonctionnalités principales sont implémentées.
- Il faut vérifier la boucle complète.

Objectif :
Tester et corriger les bugs critiques.

À vérifier :
- Page d’accueil.
- Onboarding.
- Niveau 1 sans compte.
- Exécution code Rust valide.
- Erreur compilation.
- Sortie incorrecte.
- Timeout.
- Réussite niveau.
- Création compte.
- Sauvegarde progression.
- Déblocage niveau suivant.
- Carte de progression.
- Dashboard.
- Analytics.
- Premium interest.

Contraintes :
- Ne pas ajouter de nouvelles fonctionnalités.
- Corriger uniquement les bugs ou incohérences MVP.
- Documenter les limites restantes.

Critères de validation :
- Un utilisateur peut compléter le parcours MVP de bout en bout.
- La sandbox fonctionne de manière fiable.
- Les erreurs sont compréhensibles.
```
