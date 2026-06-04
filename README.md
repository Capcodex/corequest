# CoreQuest

CoreQuest est un MVP d’apprentissage Rust par niveaux, avec exécution réelle du code dans une sandbox isolée.

## Statut produit

Le MVP couvre désormais :

- landing page ;
- onboarding ;
- page de niveau ;
- éditeur Rust vide par défaut ;
- exécution réelle du code en sandbox ;
- validation par sortie réelle ;
- auth Supabase ;
- progression, XP et déblocage ;
- roadmap interactive ;
- dashboard avec compagnon crabe ;
- tracking analytics minimal ;
- intérêt Premium.

## Démarrage avec Docker

```bash
docker compose up --build
```

Services exposés :

- application Next.js : `http://localhost:3000`
- sandbox service : `http://localhost:4000`

## Commandes utiles

```bash
docker compose exec -T app npm run typecheck
docker compose exec -T app npm run test
```

## Vérifications locales recommandées

- ouvrir `http://localhost:3000` ;
- réussir le niveau 1 en invité ;
- vérifier la redirection vers l’inscription ;
- se connecter puis vérifier la mise à jour de la roadmap et du dashboard ;
- vérifier le rendu de `http://localhost:3000/map` et `http://localhost:3000/dashboard`.


## QA actuelle

Valid? automatiquement dans l?environnement local :

- `docker compose exec -T app npm run typecheck` ;
- `docker compose exec -T app npm run test` ;
- `GET /`, `GET /onboarding`, `GET /levels/rust-level-1`, `GET /auth/login` ? `200` ;
- `GET /dashboard` et `GET /map` sans session ? redirection `307` vers l?auth ;
- `GET /health` et `HEAD /health` sur la sandbox ? `200`.

Reste ? confirmer manuellement :

- parcours complet invit? ? inscription ? reprise ;
- session connect?e r?elle avec mise ? jour du dashboard et de la carte ;
- rendu visuel mobile / tablet / desktop ;
- dernier contr?le visuel des accents directement dans l?application.

## Endpoints utiles

- `POST /api/execute`
- `POST /api/progress/complete-level`
- `POST /api/analytics/event`
- `POST /api/premium-interest`
- `GET /health` sur la sandbox
- `POST /execute` sur la sandbox

## Références

- `AGENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `TASK.md`
- `walkthrough.md`
- `docs/PLAN_IMPLEMENTATION.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/MVP_CHECKLIST.md`
