# CLAUDE.md — CoreQuest

## 1. Contexte projet

CoreQuest est une plateforme web d’apprentissage gamifiée dédiée à Rust.

L’utilisateur progresse niveau après niveau dans un parcours scénarisé. Chaque niveau contient un cours court, un exercice pratique, un éditeur de code, une exécution réelle du code Rust dans une sandbox sécurisée, un feedback immédiat et un déblocage du niveau suivant.

Le MVP doit tester la boucle :

> Comprendre → Écrire du Rust → Compiler → Exécuter → Lire le résultat ou l’erreur → Corriger → Réussir → Débloquer → Continuer

---

## 2. Objectif du MVP

Construire une première version web permettant de :

- découvrir le produit ;
- commencer un parcours Rust ;
- lire des cours courts ;
- écrire du code Rust ;
- exécuter ce code dans une sandbox ;
- voir stdout, stderr et erreurs ;
- valider un exercice ;
- débloquer le niveau suivant ;
- sauvegarder la progression ;
- mesurer les événements clés.

---

## 3. Stack technique

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Monaco Editor ou équivalent

### Backend applicatif

- Next.js API Routes ou serveur Node.js dédié
- TypeScript

### Base de données

- PostgreSQL
- Supabase recommandé

### Authentification

- Supabase Auth ou équivalent

### Sandbox

- service séparé
- exécution Rust isolée
- conteneur jetable
- timeout
- mémoire limitée
- CPU limité
- réseau désactivé

---

## 4. Architecture attendue

Le projet doit être organisé en modules clairs :

- `app` : pages et routes
- `components` : composants UI
- `lib` : logique métier et services
- `data` : contenu pédagogique
- `types` : types TypeScript
- `sandbox-service` : service séparé d’exécution Rust

Ne pas mélanger :

- UI ;
- logique métier ;
- accès base de données ;
- appels sandbox ;
- tracking analytics.

---

## 5. Fonctionnalités MVP

Inclure :

- page d’accueil ;
- onboarding ;
- auth simple ;
- dashboard ;
- carte de progression ;
- page de niveau ;
- éditeur de code ;
- sandbox Rust ;
- validation par sortie réelle ;
- feedback pédagogique ;
- indices ;
- XP simple ;
- sauvegarde progression ;
- analytics ;
- Premium bientôt disponible.

---

## 6. Fonctionnalités hors périmètre

Ne pas implémenter dans le MVP :

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

## 7. Règles métier

- Le niveau 1 est accessible sans compte.
- Le niveau suivant est débloqué uniquement après réussite du niveau précédent.
- Un niveau est réussi si le code compile, s’exécute et produit la sortie attendue.
- Chaque exécution crée une tentative.
- L’XP est attribué une seule fois par niveau.
- Les indices ne bloquent pas la réussite.
- Les erreurs sandbox doivent être distinguées des erreurs utilisateur.
- Le paiement est hors périmètre MVP.

---

## 8. Règles de sandbox

La sandbox doit :

- exécuter le code dans un environnement isolé ;
- ne jamais exécuter le code dans le backend principal ;
- limiter le temps ;
- limiter la mémoire ;
- limiter le CPU si possible ;
- désactiver le réseau ;
- supprimer l’environnement après exécution ;
- capturer stdout ;
- capturer stderr ;
- retourner un statut normalisé.

Statuts attendus :

- `success`
- `compile_error`
- `runtime_error`
- `wrong_output`
- `timeout`
- `sandbox_error`

Contraintes MVP :

- code mono-fichier ;
- pas de projets Cargo multi-fichiers ;
- pas de crates externes libres ;
- pas d’accès réseau ;
- pas de terminal interactif ;
- pas de debugger.

---

## 9. Style UI attendu

Style général :

- moderne ;
- sombre ou semi-sombre ;
- clair ;
- motivant ;
- non infantilisant ;
- orienté progression ;
- adapté à un public apprenant Rust.

Composants importants :

- cartes ;
- badges ;
- boutons ;
- éditeur de code ;
- panneau de feedback ;
- carte de niveaux.

---

## 10. Conventions de code

- Utiliser TypeScript strict autant que possible.
- Créer des types explicites pour les niveaux, tentatives, exécutions, progressions.
- Préférer des fonctions courtes.
- Séparer logique métier et UI.
- Éviter les composants trop longs.
- Nommer clairement les fichiers.
- Ne pas ajouter de dépendances lourdes sans justification.
- Ne pas dupliquer les règles métier dans plusieurs endroits.
- Ne pas hardcoder les niveaux dans les composants.
- Ne pas exposer de secrets côté client.

---

## 11. Tests attendus

Prévoir au minimum :

- tests de validation de sortie ;
- tests de déblocage de niveau ;
- tests d’attribution XP ;
- tests API d’exécution ;
- tests sandbox :
  - code valide ;
  - code invalide ;
  - timeout ;
  - stdout ;
  - stderr ;
  - tentative réseau ;
  - nettoyage environnement.

---

## 12. Instructions pour Claude Code

Quand tu implémentes une feature :

1. Lis ce fichier.
2. Respecte la structure cible.
3. Ne modifie pas les fichiers non concernés sans raison.
4. Garde le périmètre MVP.
5. Ajoute ou mets à jour les types nécessaires.
6. Ajoute les critères de validation.
7. Explique brièvement les changements réalisés.
8. Signale les zones d’incertitude au lieu d’inventer une solution lourde.
9. Ne supprime jamais une contrainte de sécurité sans justification explicite.

---

## 13. Priorité absolue

Ne jamais retirer la sandbox Rust du MVP.

La sandbox est une brique cœur du produit.
