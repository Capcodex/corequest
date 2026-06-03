# TASK.md — Backlog priorisé

Références de cadrage :

- `AGENTS.md`
- `docs/PLAN_IMPLEMENTATION.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/BACKLOG_AI.md`
- `docs/MVP_CHECKLIST.md`

Ce fichier ne répète pas le contexte produit : il sert uniquement de backlog de travail priorisé.

---

## P0 — Bloquants MVP

- [x] Initialiser le projet `Next.js` + `TypeScript` + `Tailwind`
- [x] Créer l’arborescence cible (`app`, `components`, `lib`, `data`, `types`, `sandbox-service`)
- [x] Ajouter `.env.example`, `README.md` et `CLAUDE.md`
- [x] Créer le design system minimal (`Button`, `Card`, `Badge`, `Alert`, `Loader`, `Header`, `Footer`, `AppShell`)
- [x] Définir les types métier de base (`level`, `execution`, `progress`, `user`, `analytics`)
- [x] Créer le contenu pédagogique Rust initial dans `data/rust-foundations/levels.json` avec au moins 3 niveaux
- [x] Implémenter les helpers `getLevels` et `getLevelById`
- [x] Construire la landing page MVP
- [x] Construire l’onboarding MVP
- [x] Implémenter la page de niveau statique `/levels/[levelId]`
- [x] Implémenter l’éditeur de code avec `onRun(code)` et reset
- [x] Créer le `sandbox-service` Rust séparé
- [x] Implémenter l’endpoint sandbox `POST /execute`
- [x] Implémenter l’API `POST /api/execute`
- [x] Ajouter la validation par sortie réelle
- [x] Afficher le feedback d’exécution (`stdout`, `stderr`, `compile_error`, `wrong_output`, `timeout`, `sandbox_error`)

Critère de sortie P0 :

- un utilisateur peut ouvrir le niveau 1 ;
- lire le cours ;
- modifier le code ;
- exécuter du vrai Rust en sandbox ;
- voir le résultat ;
- corriger ;
- réussir l’exercice.

---

## P1 — Progression et persistance

- [x] Configurer Supabase
- [x] Mettre en place l’authentification (`signup`, `login`, `logout`)
- [x] Créer les migrations initiales (`profiles`, `user_progress`, `level_completions`, `submissions`)
- [x] Implémenter `getCurrentUser` et `requireUser`
- [x] Implémenter `getUserProgress`
- [x] Implémenter `completeLevel`
- [x] Empêcher la double attribution d’XP
- [x] Débloquer le niveau suivant après réussite
- [x] Construire la carte de progression `/map`
- [x] Construire le dashboard `/dashboard`

Critère de sortie P1 :

- un utilisateur peut créer un compte ;
- sauvegarder sa réussite ;
- récupérer sa progression ;
- débloquer le niveau suivant ;
- reprendre depuis le dashboard.

---

## P2 — Mesure et validation MVP

- [x] Implémenter le tracking analytics minimal
- [x] Créer l’API `POST /api/analytics/event`
- [x] Tracker home, onboarding, vue niveau, exécution, erreurs, réussite, intérêt premium
- [x] Implémenter le module `Premium bientôt disponible`
- [x] Sauvegarder l’intérêt Premium
- [ ] Exécuter la checklist MVP complète
- [x] Ajouter les tests minimums métier et sandbox
- [ ] Faire la passe QA finale
- [ ] Nettoyer la documentation de livraison

Critère de sortie P2 :

- les événements clés sont mesurés ;
- l’intérêt Premium est traçable ;
- la boucle MVP est testée de bout en bout.

---

## Dépendances de réalisation

- Le `sandbox-service` est obligatoire avant validation réelle des exercices.
- L’API `/api/execute` dépend du contenu niveau + du service sandbox.
- La progression persistée dépend de l’auth et de la base.
- La carte de progression et le dashboard dépendent de la logique de progression.
- La QA finale ne commence qu’après fermeture de P0 et P1.

---

## Ordre de démarrage recommandé

1. Initialisation projet
2. Design system minimal
3. Types + contenu Rust
4. Landing + onboarding + page niveau statique
5. Éditeur de code
6. Sandbox-service
7. API d’exécution + feedback
8. Auth + progression
9. Map + dashboard
10. Analytics + premium + QA
