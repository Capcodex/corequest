# Plan d’implémentation MVP — CoreQuest

## 1. Objectif du MVP

CoreQuest est une application web d’apprentissage gamifiée dédiée à Rust.

Le MVP doit permettre à un utilisateur de :

- découvrir la promesse du produit ;
- commencer un parcours Rust ;
- lire un cours court ;
- écrire du code Rust ;
- compiler et exécuter ce code dans une sandbox sécurisée ;
- lire la sortie ou l’erreur ;
- corriger son code ;
- valider un exercice ;
- débloquer le niveau suivant ;
- sauvegarder sa progression ;
- mesurer les signaux d’usage et d’intention business.

La boucle cœur à valider est :

> Comprendre → Écrire du Rust → Compiler → Exécuter → Lire le résultat ou l’erreur → Corriger → Réussir → Débloquer → Continuer

La sandbox Rust est une fonctionnalité Must-have du MVP. Elle ne doit pas être repoussée en V1.

---

## 2. Stack technique

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Monaco Editor ou éditeur de code léger équivalent

### Backend applicatif

- Next.js API Routes ou serveur Node.js dédié
- TypeScript
- API internes pour :
  - niveaux ;
  - progression ;
  - exécution de code ;
  - analytics ;
  - intérêt Premium.

### Base de données

- PostgreSQL
- Supabase recommandé pour le MVP

### Authentification

- Supabase Auth ou équivalent

### Sandbox Rust

- Service backend séparé
- Exécution isolée via conteneur
- Image Rust contrôlée
- Timeout strict
- Limites CPU / mémoire
- Réseau désactivé
- Nettoyage après exécution

### Hébergement MVP

- Frontend : Vercel ou équivalent
- Base de données : Supabase ou PostgreSQL managé
- Sandbox : VPS ou serveur cloud séparé capable d’exécuter des conteneurs isolés

---

## 3. Structure cible du projet

```text
corequest/
  CLAUDE.md
  README.md
  package.json
  next.config.ts
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  .env.example
  .gitignore

  src/
    app/
      layout.tsx
      page.tsx
      globals.css

      onboarding/
        page.tsx

      dashboard/
        page.tsx

      map/
        page.tsx

      levels/
        [levelId]/
          page.tsx

      auth/
        login/
          page.tsx
        signup/
          page.tsx

      premium/
        page.tsx

      api/
        levels/
          route.ts
          [levelId]/
            route.ts

        progress/
          route.ts
          complete-level/
            route.ts

        execute/
          route.ts

        analytics/
          event/
            route.ts

        premium-interest/
          route.ts

    components/
      layout/
        Header.tsx
        Footer.tsx
        AppShell.tsx

      ui/
        Button.tsx
        Card.tsx
        Badge.tsx
        Alert.tsx
        Loader.tsx

      home/
        HeroSection.tsx
        HowItWorks.tsx
        ProductPreview.tsx

      onboarding/
        OnboardingPanel.tsx

      dashboard/
        DashboardSummary.tsx
        ContinueLearningCard.tsx

      progress/
        LevelMap.tsx
        LevelNode.tsx
        ProgressSummary.tsx

      level/
        LevelHeader.tsx
        MissionBlock.tsx
        LessonBlock.tsx
        ExerciseBlock.tsx
        CodeEditor.tsx
        ExecutionResult.tsx
        HintBox.tsx
        SuccessPanel.tsx

    lib/
      auth/
        getCurrentUser.ts
        requireUser.ts

      supabase/
        client.ts
        server.ts

      levels/
        getLevels.ts
        getLevelById.ts
        levelValidation.ts

      progress/
        getUserProgress.ts
        completeLevel.ts
        getLevelState.ts

      sandbox/
        executeRustCode.ts
        executionTypes.ts
        normalizeExecutionResult.ts

      analytics/
        trackEvent.ts

      premium/
        savePremiumInterest.ts

    data/
      rust-foundations/
        levels.json

    types/
      level.ts
      progress.ts
      execution.ts
      analytics.ts
      user.ts

  sandbox-service/
    README.md
    Dockerfile
    package.json
    tsconfig.json

    src/
      server.ts
      executeRust.ts
      securityLimits.ts
      cleanup.ts
      types.ts

  supabase/
    migrations/
      001_initial_schema.sql
```

---

## 4. Modules à développer

### Module 1 — Initialisation projet

Objectif : créer la base technique.

Inclus :

- initialisation Next.js ;
- TypeScript ;
- Tailwind ;
- structure de dossiers ;
- configuration environnement ;
- README ;
- fichier `CLAUDE.md` ;
- `.env.example`.

Critères de validation :

- l’application démarre localement ;
- la page d’accueil temporaire s’affiche ;
- la structure de dossiers est conforme.

---

### Module 2 — Design system minimal

Objectif : créer les composants UI réutilisables.

Inclus :

- Button ;
- Card ;
- Badge ;
- Alert ;
- Loader ;
- Header ;
- Footer ;
- AppShell.

Critères de validation :

- les composants sont typés ;
- les composants sont réutilisables ;
- l’UI est lisible sur fond sombre ;
- aucun composant UI ne contient de logique métier lourde.

---

### Module 3 — Données pédagogiques Rust

Objectif : créer le format de contenu et les premiers niveaux.

Inclus :

- fichier `levels.json` ;
- typage TypeScript des niveaux ;
- fonction `getLevels` ;
- fonction `getLevelById` ;
- contenu initial de 3 niveaux complets ;
- structure prévue pour 12 à 18 niveaux.

Critères de validation :

- la liste des niveaux est lisible par l’application ;
- chaque niveau contient les champs nécessaires ;
- le niveau 1 peut être affiché ;
- aucun contenu ne concerne un autre langage que Rust.

---

### Module 4 — Page d’accueil

Objectif : présenter la promesse CoreQuest.

Inclus :

- Hero ;
- explication en 3 étapes ;
- mention de la sandbox Rust ;
- CTA “Commencer l’aventure” ;
- preview visuelle de la progression.

Critères de validation :

- un visiteur comprend la promesse ;
- le CTA fonctionne ;
- l’utilisateur peut accéder à l’onboarding ou au niveau 1.

---

### Module 5 — Onboarding

Objectif : introduire l’univers et le parcours.

Inclus :

- texte narratif court ;
- explication de la boucle d’apprentissage ;
- bouton de démarrage ;
- option passer.

Critères de validation :

- l’onboarding est court ;
- l’utilisateur peut démarrer rapidement le niveau 1 ;
- l’utilisateur peut passer l’onboarding.

---

### Module 6 — Page de niveau statique

Objectif : afficher cours, mission, exercice et éditeur sans connecter encore la sandbox.

Inclus :

- titre ;
- mission ;
- objectif ;
- cours ;
- exemple ;
- consigne ;
- éditeur ;
- indice ;
- état niveau introuvable.

Critères de validation :

- `/levels/rust-level-1` affiche le niveau 1 ;
- les données viennent du JSON ;
- le starter code est chargé.

---

### Module 7 — Éditeur de code

Objectif : permettre l’écriture du code Rust.

Inclus :

- éditeur de code ;
- starter code ;
- bouton Exécuter ;
- bouton Réinitialiser ;
- état loading.

Critères de validation :

- l’utilisateur peut modifier le code ;
- le code soumis correspond au contenu de l’éditeur ;
- le reset restaure le starter code ;
- le bouton est désactivé pendant l’exécution.

---

### Module 8 — Service sandbox Rust

Objectif : compiler et exécuter le code Rust dans un environnement sécurisé.

Inclus :

- service sandbox séparé ;
- endpoint d’exécution ;
- compilation Rust ;
- exécution si compilation réussie ;
- capture stdout ;
- capture stderr ;
- timeout ;
- limitation ressources ;
- désactivation réseau ;
- nettoyage environnement.

Critères de validation :

- un code Rust valide compile et s’exécute ;
- une erreur de compilation est retournée ;
- une boucle infinie est stoppée par timeout ;
- stdout et stderr sont correctement renvoyés ;
- le réseau n’est pas accessible ;
- l’environnement est supprimé après exécution.

---

### Module 9 — API `/api/execute`

Objectif : connecter le frontend au service sandbox.

Inclus :

- validation du payload ;
- refus du code vide ;
- refus du code trop long ;
- appel au service sandbox ;
- comparaison stdout / sortie attendue ;
- réponse normalisée.

Critères de validation :

- code correct retourne `passed: true` ;
- code incorrect retourne `wrong_output` ;
- erreur compilation retourne `compile_error` ;
- timeout retourne `timeout` ;
- erreur sandbox retourne `sandbox_error`.

---

### Module 10 — Validation et feedback

Objectif : aider l’utilisateur à comprendre le résultat.

Inclus :

- message succès ;
- message sortie incorrecte ;
- message erreur compilation ;
- message timeout ;
- indice ;
- explications simples pour erreurs fréquentes.

Critères de validation :

- l’utilisateur comprend ce qui s’est passé ;
- il peut corriger et relancer ;
- le niveau n’est validé que si la sortie est correcte.

---

### Module 11 — Authentification

Objectif : permettre la sauvegarde de progression.

Inclus :

- signup ;
- login ;
- logout ;
- session utilisateur ;
- redirection ;
- gestion des erreurs.

Critères de validation :

- un compte peut être créé ;
- un utilisateur peut se connecter ;
- un utilisateur peut se déconnecter ;
- les pages privées vérifient la session.

---

### Module 12 — Progression utilisateur

Objectif : sauvegarder et afficher la progression.

Inclus :

- tables de progression ;
- chargement du niveau actuel ;
- niveaux terminés ;
- XP total ;
- déblocage niveau suivant.

Critères de validation :

- un niveau terminé est sauvegardé ;
- le niveau suivant se débloque ;
- l’XP est attribué une seule fois ;
- l’utilisateur connecté retrouve sa progression.

---

### Module 13 — Carte de progression

Objectif : afficher tous les niveaux et leurs états.

Inclus :

- niveau verrouillé ;
- niveau disponible ;
- niveau en cours ;
- niveau terminé ;
- progression globale.

Critères de validation :

- les états sont correctement affichés ;
- un niveau verrouillé n’est pas accessible ;
- un niveau terminé peut être relancé.

---

### Module 14 — Dashboard

Objectif : permettre à l’utilisateur de reprendre son apprentissage.

Inclus :

- résumé parcours ;
- niveau actuel ;
- XP ;
- bouton Continuer.

Critères de validation :

- l’utilisateur voit son état d’avancement ;
- le bouton Continuer mène au bon niveau.

---

### Module 15 — Analytics

Objectif : mesurer les événements clés du MVP.

Inclus :

- tracking page vue ;
- clic CTA ;
- niveau commencé ;
- code exécuté ;
- erreur compilation ;
- sortie incorrecte ;
- niveau terminé ;
- clic Premium ;
- retour utilisateur.

Critères de validation :

- chaque événement clé est enregistré ;
- les propriétés importantes sont stockées ;
- les événements anonymes et connectés sont supportés ;
- l’échec du tracking ne bloque pas l’UX.

---

### Module 16 — Premium bientôt disponible

Objectif : tester l’intention business.

Inclus :

- page ou bloc Premium ;
- bouton intérêt ;
- sauvegarde email ;
- tracking événement.

Critères de validation :

- un utilisateur peut signaler son intérêt ;
- l’événement est tracké ;
- l’email est sauvegardé si fourni ;
- aucun paiement n’est intégré.

---

### Module 17 — QA MVP

Objectif : vérifier la boucle cœur de bout en bout.

Inclus :

- tests manuels ;
- tests API ;
- tests sandbox ;
- tests parcours utilisateur ;
- vérification sécurité de base.

Critères de validation :

- un utilisateur peut commencer, coder, exécuter, réussir, sauvegarder et continuer.

---

## 5. Ordre d’implémentation recommandé

1. Initialisation projet
2. Design system minimal
3. Modèle de données et Supabase
4. Données pédagogiques Rust
5. Page d’accueil
6. Onboarding
7. Page de niveau statique
8. Éditeur de code
9. Service sandbox Rust minimal
10. API `/api/execute`
11. Validation par sortie réelle
12. Feedback pédagogique
13. Authentification
14. Progression utilisateur
15. Carte de progression
16. Dashboard
17. Analytics
18. Premium bientôt disponible
19. QA complète
20. Nettoyage documentation

Raison de cet ordre :

- construire rapidement une expérience visible ;
- isoler tôt le risque technique sandbox ;
- éviter de développer toute l’auth avant de valider la boucle code ;
- stabiliser ensuite la progression et les analytics.

---

## 6. Dépendances techniques

### Dépendance 1 — Sandbox

La sandbox est la dépendance critique.

Risque :

- complexité sécurité ;
- temps d’exécution ;
- erreurs de conteneur ;
- limitations hébergement.

Décision :

- prototyper la sandbox tôt ;
- ne pas attendre la fin du frontend ;
- traiter les limites de sécurité dès le départ.

---

### Dépendance 2 — Base de données

La progression, les tentatives et les analytics nécessitent une base stable.

Décision :

- définir le schéma rapidement ;
- créer des migrations ;
- éviter les champs inutiles au MVP.

---

### Dépendance 3 — Authentification

L’auth est nécessaire pour la progression long terme, mais pas pour tester le niveau 1.

Décision :

- permettre le niveau 1 en anonyme ;
- connecter ensuite la progression à un compte.

---

### Dépendance 4 — Contenu pédagogique

La qualité des niveaux est essentielle.

Décision :

- commencer avec 3 niveaux très solides ;
- intégrer ensuite les niveaux suivants ;
- ne pas attendre d’avoir 18 niveaux pour tester la boucle.

---

## 7. Règles métier principales

1. Le niveau 1 est accessible sans compte.
2. Les niveaux suivants nécessitent une progression sauvegardée.
3. Le niveau N+1 est débloqué après réussite du niveau N.
4. Un niveau est réussi si :
   - le code compile ;
   - le code s’exécute ;
   - la sortie attendue correspond.
5. Chaque clic sur Exécuter crée une tentative.
6. L’XP est attribué une seule fois par niveau.
7. Les indices ne bloquent pas la validation.
8. La sandbox doit toujours isoler l’exécution.
9. Les erreurs techniques de sandbox ne doivent pas être confondues avec les erreurs utilisateur.
10. Le paiement est hors périmètre MVP.

---

## 8. Critères d’acceptation globaux

Le MVP est validé si :

- la page d’accueil est accessible ;
- le niveau 1 est jouable sans compte ;
- l’utilisateur peut écrire du Rust ;
- le code est réellement compilé ;
- le code est réellement exécuté ;
- les erreurs de compilation sont affichées ;
- la sortie standard est affichée ;
- une sortie correcte valide le niveau ;
- le niveau suivant se débloque ;
- la progression est sauvegardée après connexion ;
- les événements clés sont trackés ;
- la sandbox respecte les limites de sécurité MVP.

---

## 9. Tests à prévoir

### Tests manuels

- parcours visiteur ;
- parcours niveau 1 ;
- erreur de compilation ;
- sortie incorrecte ;
- timeout ;
- réussite exercice ;
- création compte ;
- reprise progression ;
- clic Premium.

### Tests unitaires

- validation sortie attendue ;
- logique de déblocage niveau ;
- attribution XP ;
- parsing des niveaux ;
- helpers analytics.

### Tests API

- `GET /api/levels` ;
- `GET /api/levels/:id` ;
- `POST /api/execute` ;
- `POST /api/progress/complete-level` ;
- `POST /api/analytics/event` ;
- `POST /api/premium-interest`.

### Tests sandbox

- code valide ;
- code invalide ;
- boucle infinie ;
- sortie trop longue ;
- tentative réseau ;
- dépassement mémoire si testable ;
- nettoyage environnement.

---

## 10. Points de vigilance

1. Ne pas retirer la sandbox du MVP.
2. Ne pas développer plusieurs langages.
3. Ne pas intégrer de paiement complet.
4. Ne pas construire un IDE complet.
5. Ne pas ajouter de crates externes libres.
6. Ne pas complexifier la carte de progression.
7. Ne pas multiplier les mécaniques de jeu.
8. Ne pas rendre le scénario trop long.
9. Ne pas confondre erreurs Rust et erreurs techniques.
10. Ne pas stocker inutilement des données sensibles.

---

## 11. Fonctionnalités explicitement hors périmètre

Hors MVP :

- plusieurs langages ;
- paiement complet ;
- application mobile native ;
- espace enseignant ;
- communauté ;
- forum ;
- classement social ;
- IDE complet ;
- projets Cargo multi-fichiers ;
- crates externes libres ;
- debugger ;
- terminal interactif ;
- IA pédagogique complète ;
- certifications ;
- marketplace ;
- WebAssembly ;
- async Rust ;
- traits avancés ;
- generics avancés ;
- lifetimes avancés.

---

## 12. Décision de sortie

Décision recommandée : **Go build IA**, avec priorité absolue à la sandbox Rust.

Le build peut démarrer si :

- le périmètre MVP est accepté ;
- les fonctionnalités hors périmètre sont respectées ;
- la structure projet est validée ;
- le fichier `CLAUDE.md` est placé dans le projet ;
- la checklist MVP est utilisée à chaque étape.
