# Backlog d’Implémentation IA — CoreQuest MVP

Ce backlog est conçu pour un développement assisté par Claude Code.

Chaque feature doit être implémentée de manière isolée, validée, puis seulement ensuite intégrée au flux global.

---

## Feature 1 — Initialisation du projet

### Objectif

Créer la base technique de l’application CoreQuest.

### Comportement attendu

- Le projet Next.js est initialisé.
- TypeScript est activé.
- Tailwind CSS est configuré.
- La structure de dossiers cible est créée.
- Un fichier `.env.example` est présent.
- Un README de base est présent.
- Un fichier `CLAUDE.md` est présent.

### Critères d’acceptation

- `npm run dev` démarre l’application.
- La page d’accueil temporaire s’affiche.
- Le projet ne contient pas de fichiers inutiles générés par défaut.
- La structure respecte l’arborescence cible.

### Contraintes techniques

- Utiliser TypeScript.
- Ne pas mélanger logique métier et composants UI.
- Préparer les dossiers `lib`, `components`, `types`, `data`.

---

## Feature 2 — Design system minimal

### Objectif

Créer les composants UI de base.

### Comportement attendu

- Les composants Button, Card, Badge, Alert et Loader existent.
- Les composants Header, Footer et AppShell existent.
- Les composants sont réutilisables.
- Les variantes principales sont prévues.
- Les styles sont cohérents.

### Critères d’acceptation

- Les composants peuvent être importés depuis les pages.
- Les composants sont typés.
- Les composants respectent l’identité sombre et moderne du produit.

### Contraintes techniques

- Utiliser Tailwind CSS.
- Garder les composants simples.
- Ne pas introduire de librairie UI lourde sans justification.

---

## Feature 3 — Données pédagogiques Rust

### Objectif

Créer le contenu pédagogique structuré du parcours Rust.

### Comportement attendu

- Un fichier `levels.json` contient les niveaux Rust.
- Chaque niveau contient :
  - id ;
  - titre ;
  - ordre ;
  - notion ;
  - mission ;
  - cours ;
  - exemple ;
  - consigne ;
  - starter code ;
  - sortie attendue ;
  - indice ;
  - XP.
- Des fonctions permettent de récupérer la liste et le détail d’un niveau.

### Critères d’acceptation

- La liste des niveaux est exploitable par l’interface.
- Le niveau 1 peut être chargé.
- Les niveaux sont ordonnés correctement.
- Le contenu concerne uniquement Rust.

### Contraintes techniques

- Typer les niveaux.
- Prévoir une structure facilement migrable en base de données plus tard.
- Ne pas coder les niveaux directement dans les composants.

---

## Feature 4 — Page d’accueil

### Objectif

Présenter la promesse du produit.

### Comportement attendu

- La page affiche le nom CoreQuest.
- La page explique l’apprentissage de Rust par niveaux.
- La page mentionne l’exécution réelle du code.
- La page contient un CTA principal.
- La page donne un aperçu du fonctionnement.

### Critères d’acceptation

- Le CTA mène à l’onboarding ou au niveau 1.
- Le message est compréhensible en moins d’une minute.
- La page est responsive au minimum sur desktop et tablette.

### Contraintes techniques

- Utiliser les composants UI existants.
- Ne pas intégrer de logique complexe dans cette page.

---

## Feature 5 — Onboarding

### Objectif

Introduire rapidement l’univers et le parcours.

### Comportement attendu

- L’utilisateur découvre l’histoire du noyau à reconstruire.
- Il comprend la boucle : apprendre, coder, exécuter, corriger.
- Il peut démarrer le niveau 1.
- Il peut passer l’onboarding.

### Critères d’acceptation

- L’onboarding est court.
- L’utilisateur peut passer l’onboarding.
- Le bouton final mène au niveau 1.

### Contraintes techniques

- Ne pas stocker de données complexes pour l’onboarding au MVP.
- Tracker le démarrage et le passage de l’onboarding si le tracking est déjà disponible.

---

## Feature 6 — Page de niveau statique

### Objectif

Afficher un niveau Rust complet sans connecter encore la sandbox.

### Comportement attendu

- La page charge un niveau par son `levelId`.
- Elle affiche mission, objectif, cours, exemple, exercice et starter code.
- L’utilisateur voit l’éditeur de code.

### Critères d’acceptation

- `/levels/rust-level-1` affiche le niveau 1.
- Un niveau inconnu affiche une erreur propre.
- Le contenu vient du fichier de données.

### Contraintes techniques

- Ne pas dupliquer le contenu.
- Utiliser les types existants.

---

## Feature 7 — Éditeur de code

### Objectif

Permettre à l’utilisateur d’écrire du code Rust.

### Comportement attendu

- Le starter code est affiché.
- L’utilisateur peut modifier le code.
- L’utilisateur peut réinitialiser le code.
- Le bouton Exécuter est visible.
- Le composant expose une callback `onRun(code)`.

### Critères d’acceptation

- Le code modifié est conservé dans l’état local.
- Le reset restaure le starter code.
- L’éditeur reste utilisable sur desktop.
- Le bouton Exécuter est désactivé pendant le chargement.

### Contraintes techniques

- Utiliser Monaco Editor si simple.
- Sinon utiliser une textarea stylisée temporaire.
- Ne pas créer d’IDE complet.
- Pas d’autocomplétion avancée au MVP.

---

## Feature 8 — Service sandbox Rust

### Objectif

Créer un service capable de compiler et exécuter du Rust de manière isolée.

### Comportement attendu

- Le service reçoit du code Rust.
- Il compile le code.
- Il exécute le binaire si compilation réussie.
- Il retourne stdout, stderr, statut, durée.
- Il applique timeout et limites de ressources.

### Critères d’acceptation

- Un code valide retourne `success`.
- Un code invalide retourne `compile_error`.
- Une boucle infinie retourne `timeout`.
- Une erreur technique retourne `sandbox_error`.
- Le réseau est désactivé.
- L’environnement est nettoyé.

### Contraintes techniques

- Ne jamais exécuter le code directement dans le backend principal.
- Isoler l’exécution.
- Ne pas exposer de secrets.
- Limiter taille du code, temps et mémoire.
- Pas de crates externes libres.
- Code mono-fichier.

---

## Feature 9 — API d’exécution `/api/execute`

### Objectif

Connecter le frontend au service sandbox.

### Comportement attendu

- Le frontend envoie `levelId` et `code`.
- L’API valide la requête.
- L’API appelle la sandbox.
- L’API applique la validation de sortie.
- L’API retourne un résultat normalisé.

### Critères d’acceptation

- L’API refuse un code vide.
- L’API refuse un code trop long.
- L’API retourne un statut parmi les statuts prévus.
- L’API n’expose pas d’erreurs internes brutes.
- Code correct retourne `passed: true`.
- Code incorrect retourne `wrong_output`.

### Contraintes techniques

- Typer le payload et la réponse.
- Centraliser les statuts d’exécution.
- Journaliser les erreurs techniques.

---

## Feature 10 — Validation et feedback

### Objectif

Afficher un feedback clair après exécution.

### Comportement attendu

- Si le code est correct, afficher succès.
- Si compilation échoue, afficher erreur compilateur.
- Si sortie incorrecte, afficher sortie obtenue et attendue.
- Si timeout, afficher message spécifique.
- Proposer un indice.

### Critères d’acceptation

- L’utilisateur comprend ce qui s’est passé.
- Il peut corriger et relancer.
- Le niveau n’est validé que si la sortie est correcte.

### Contraintes techniques

- Distinguer erreurs utilisateur et erreurs techniques.
- Ne pas noyer l’utilisateur sous trop de texte.

---

## Feature 11 — Authentification

### Objectif

Permettre la sauvegarde de progression.

### Comportement attendu

- L’utilisateur peut créer un compte.
- L’utilisateur peut se connecter.
- L’utilisateur peut se déconnecter.
- Les pages privées sont protégées.

### Critères d’acceptation

- Un utilisateur connecté accède au dashboard.
- Un utilisateur non connecté est redirigé si nécessaire.
- Les erreurs auth sont lisibles.

### Contraintes techniques

- Ne pas stocker les mots de passe en clair.
- Utiliser le fournisseur d’auth choisi.
- Gérer la session proprement.

---

## Feature 12 — Progression et XP

### Objectif

Sauvegarder les niveaux terminés et l’XP.

### Comportement attendu

- Un niveau réussi est marqué comme terminé.
- Le niveau suivant se débloque.
- L’XP est ajouté une seule fois.
- La progression est chargée au retour.

### Critères d’acceptation

- La progression persiste après reconnexion.
- Un niveau déjà terminé ne redonne pas l’XP.
- La carte reflète l’état réel.

### Contraintes techniques

- Éviter les doublons de complétion.
- Utiliser des contraintes côté base si possible.

---

## Feature 13 — Carte de progression

### Objectif

Afficher la progression du parcours Rust.

### Comportement attendu

- Tous les niveaux sont affichés.
- Les états sont visibles.
- Les niveaux verrouillés ne sont pas accessibles.
- Les niveaux terminés peuvent être rejoués.

### Critères d’acceptation

- Le niveau 1 est disponible.
- Le niveau 2 est verrouillé tant que le niveau 1 n’est pas terminé.
- Après réussite, le niveau suivant se débloque.

### Contraintes techniques

- Calculer l’état à partir des données de progression.
- Ne pas hardcoder les états.

---

## Feature 14 — Dashboard

### Objectif

Permettre à l’utilisateur de reprendre rapidement.

### Comportement attendu

- Afficher parcours actif.
- Afficher niveau actuel.
- Afficher XP.
- Afficher bouton Continuer.

### Critères d’acceptation

- Le dashboard est accessible aux utilisateurs connectés.
- Le bouton mène au bon niveau.
- Les informations correspondent à la progression réelle.

### Contraintes techniques

- Page privée.
- Charger les données serveur si possible.

---

## Feature 15 — Analytics

### Objectif

Mesurer les événements clés.

### Comportement attendu

- Tracker activation.
- Tracker niveaux.
- Tracker exécutions.
- Tracker erreurs.
- Tracker complétions.
- Tracker intérêt Premium.

### Critères d’acceptation

- Les événements sont stockés.
- Les propriétés importantes sont présentes.
- Les utilisateurs anonymes et connectés sont supportés.
- Le tracking ne bloque pas l’UX.

### Contraintes techniques

- Minimiser les données collectées.
- Ne pas stocker de secrets ou de données sensibles inutiles.

---

## Feature 16 — Premium bientôt disponible

### Objectif

Tester l’intention business.

### Comportement attendu

- Afficher un bloc ou une page Premium.
- Permettre à l’utilisateur de signaler son intérêt.
- Sauvegarder email ou userId.
- Tracker le clic.

### Critères d’acceptation

- Le clic est enregistré.
- L’email est sauvegardé si fourni.
- L’utilisateur voit une confirmation.

### Contraintes techniques

- Ne pas intégrer de paiement.
- Ne pas promettre une date fixe.

---

## Feature 17 — QA et durcissement MVP

### Objectif

Valider le MVP avant test utilisateur.

### Comportement attendu

- Vérifier le parcours complet.
- Tester erreurs Rust.
- Tester timeout.
- Tester progression.
- Tester analytics.

### Critères d’acceptation

- Le parcours complet fonctionne.
- La sandbox ne bloque pas l’expérience.
- Les erreurs critiques sont corrigées.

### Contraintes techniques

- Ne pas ajouter de nouvelles features pendant la QA.
- Prioriser stabilité et clarté.
