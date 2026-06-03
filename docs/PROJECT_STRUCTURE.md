# Arborescence Technique Cible — CoreQuest MVP

Ce document décrit la structure cible du projet CoreQuest.

L’objectif est de garder une architecture lisible, modulaire et compatible avec un développement assisté par Claude Code.

---

## Arborescence cible

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

## Responsabilités par dossier

### `src/app`

Contient les pages, layouts et routes API de l’application Next.js.

À utiliser pour :

- pages publiques ;
- pages privées ;
- routes API ;
- layout global ;
- styles globaux.

Ne pas y placer :

- logique métier complexe ;
- accès direct non structuré à la base ;
- logique sandbox détaillée.

---

### `src/components`

Contient les composants React réutilisables.

Sous-dossiers :

- `layout` : structure globale de l’application ;
- `ui` : composants génériques ;
- `home` : composants de landing page ;
- `onboarding` : composants d’onboarding ;
- `dashboard` : composants du dashboard ;
- `progress` : carte de progression ;
- `level` : composants de page de niveau.

Règle : les composants doivent rester aussi purs que possible et déléguer la logique métier à `lib`.

---

### `src/lib`

Contient la logique métier, les services et helpers.

Sous-dossiers :

- `auth` : récupération et protection utilisateur ;
- `supabase` : clients Supabase ;
- `levels` : lecture et validation des niveaux ;
- `progress` : progression et XP ;
- `sandbox` : appel au service sandbox ;
- `analytics` : tracking ;
- `premium` : sauvegarde de l’intérêt Premium.

Règle : éviter de mélanger cette logique dans les composants UI.

---

### `src/data`

Contient le contenu pédagogique MVP.

Au MVP, les niveaux sont stockés dans :

```text
src/data/rust-foundations/levels.json
```

Cela permet de démarrer rapidement avant de migrer le contenu en base ou dans un CMS.

---

### `src/types`

Contient les types TypeScript partagés :

- niveaux ;
- progression ;
- exécution ;
- analytics ;
- utilisateur.

Règle : tout objet métier important doit avoir un type explicite.

---

### `sandbox-service`

Service séparé chargé d’exécuter le code Rust utilisateur.

Il doit rester séparé du backend principal.

Responsabilités :

- recevoir du code Rust ;
- créer un environnement temporaire ;
- compiler ;
- exécuter ;
- limiter ressources ;
- capturer stdout/stderr ;
- nettoyer ;
- retourner un résultat normalisé.

Ce service ne doit jamais exposer de secrets.

---

### `supabase/migrations`

Contient les migrations SQL.

Première migration attendue :

```text
001_initial_schema.sql
```

Tables attendues :

- profiles ;
- learning_paths ;
- levels si migration du JSON vers base plus tard ;
- user_progress ;
- level_completions ;
- submissions ;
- analytics_events ;
- premium_interest.

---

## Règles d’architecture

1. Les composants UI ne doivent pas appeler directement la sandbox.
2. Les routes API orchestrent les appels backend.
3. La logique métier partagée doit être dans `src/lib`.
4. Les types doivent être centralisés dans `src/types`.
5. Le contenu pédagogique ne doit pas être hardcodé dans les composants.
6. La sandbox doit rester dans un service séparé.
7. Les fonctionnalités hors MVP ne doivent pas apparaître dans l’arborescence.
