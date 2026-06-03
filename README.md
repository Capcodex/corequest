# CoreQuest

CoreQuest est un MVP d’apprentissage Rust par niveaux, avec exécution réelle du code dans une sandbox dédiée.

## Statut

Le socle P0 est en cours de mise en place :

- structure Next.js + TypeScript + Tailwind ;
- design system minimal ;
- contenu pédagogique Rust initial ;
- landing page ;
- onboarding ;
- page de niveau statique ;
- éditeur de code préparé ;
- structure dédiée pour la sandbox.

## Démarrage prévu

```bash
npm install
npm run dev
```

## Démarrage avec Docker

```bash
docker compose up --build
```

Services exposés :

- application Next.js : `http://localhost:3000`
- sandbox service : `http://localhost:4000`

Endpoints utiles :

- `GET /health` sur la sandbox
- `POST /execute` sur la sandbox

Note :

- la sandbox Docker est pour l’instant un stub de service séparé ;
- l’implémentation réelle de compilation/exécution Rust reste la suite du P0.

## Références

- `AGENTS.md`
- `TASK.md`
- `docs/PLAN_IMPLEMENTATION.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/MVP_CHECKLIST.md`
