# Sandbox Service

Ce dossier est réservé au service Rust isolé du backend principal.

Responsabilités attendues :

- recevoir du code Rust mono-fichier ;
- compiler et exécuter dans un environnement temporaire ;
- appliquer timeout et limites de ressources ;
- désactiver le réseau ;
- capturer `stdout` et `stderr` ;
- nettoyer l’environnement ;
- retourner un statut normalisé.

Le code utilisateur ne doit jamais être exécuté dans l’application Next.js principale.
