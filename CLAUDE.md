# CLAUDE.md

## Contexte

CoreQuest est une plateforme web d’apprentissage gamifiée dédiée à Rust.

Le MVP doit permettre à un utilisateur de :

- comprendre un concept Rust ;
- modifier du code ;
- exécuter ce code dans une sandbox isolée ;
- lire la sortie ou l’erreur ;
- corriger ;
- réussir un niveau ;
- débloquer le suivant.

## Priorité produit

La sandbox Rust fait partie du MVP et ne doit pas être retirée.

## Contraintes clés

- niveau 1 accessible sans compte ;
- progression linéaire ;
- sortie réelle utilisée pour valider l’exercice ;
- séparation claire entre UI, logique métier, données, analytics et sandbox ;
- pas de multi-langage ;
- pas de paiement complet ;
- pas d’IDE complet ;
- pas de projet Cargo multi-fichiers ;
- pas de crates externes libres.

## Références

- `AGENTS.md`
- `TASK.md`
- `docs/PLAN_IMPLEMENTATION.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/BACKLOG_AI.md`

