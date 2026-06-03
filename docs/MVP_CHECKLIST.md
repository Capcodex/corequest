# Checklist de Validation MVP — CoreQuest

Cette checklist doit être utilisée avant de considérer le MVP comme prêt pour un test utilisateur.

---

## 1. Setup projet

- [ ] Le projet démarre localement.
- [ ] TypeScript fonctionne.
- [ ] Tailwind fonctionne.
- [ ] La structure de dossiers est conforme.
- [ ] `.env.example` est présent.
- [ ] `CLAUDE.md` est présent.
- [ ] README présent.

---

## 2. UI et navigation

- [ ] Header affiché.
- [ ] Footer affiché.
- [ ] Page d’accueil accessible.
- [ ] CTA Commencer fonctionnel.
- [ ] Onboarding accessible.
- [ ] Navigation vers niveau 1 fonctionnelle.
- [ ] Interface lisible sur desktop.
- [ ] Interface acceptable sur tablette.

---

## 3. Données pédagogiques

- [ ] `levels.json` existe.
- [ ] Le niveau 1 est complet.
- [ ] Au moins 3 niveaux sont complets pour test initial.
- [ ] Les champs obligatoires sont présents.
- [ ] Les niveaux sont triés.
- [ ] Les contenus concernent Rust uniquement.

---

## 4. Page de niveau

- [ ] Le titre s’affiche.
- [ ] La mission s’affiche.
- [ ] L’objectif pédagogique s’affiche.
- [ ] Le cours s’affiche.
- [ ] L’exemple Rust s’affiche.
- [ ] L’exercice s’affiche.
- [ ] Le starter code est chargé.
- [ ] L’indice est disponible.

---

## 5. Éditeur de code

- [ ] L’utilisateur peut modifier le code.
- [ ] Le code peut être réinitialisé.
- [ ] Le bouton Exécuter est visible.
- [ ] Le bouton Exécuter envoie le code actuel.
- [ ] Le bouton est désactivé pendant loading.

---

## 6. Sandbox Rust

- [ ] Code Rust valide compilé.
- [ ] Code Rust valide exécuté.
- [ ] stdout retourné.
- [ ] stderr retourné.
- [ ] Erreur de compilation retournée.
- [ ] Timeout fonctionnel.
- [ ] Réseau désactivé.
- [ ] Limite mémoire configurée.
- [ ] Limite CPU configurée si possible.
- [ ] Environnement nettoyé après exécution.
- [ ] Aucune exécution dans le backend principal.

---

## 7. Validation exercice

- [ ] Sortie correcte valide le niveau.
- [ ] Sortie incorrecte ne valide pas le niveau.
- [ ] Erreur compilation ne valide pas le niveau.
- [ ] Timeout ne valide pas le niveau.
- [ ] Feedback affiché après chaque exécution.
- [ ] L’utilisateur peut relancer après correction.

---

## 8. Authentification

- [ ] Signup fonctionnel.
- [ ] Login fonctionnel.
- [ ] Logout fonctionnel.
- [ ] Erreurs affichées.
- [ ] Session persistante.
- [ ] Dashboard protégé.
- [ ] Progression associée au compte.

---

## 9. Progression

- [ ] Niveau terminé sauvegardé.
- [ ] Niveau suivant débloqué.
- [ ] XP ajouté.
- [ ] XP non ajouté deux fois.
- [ ] Niveau terminé rejouable.
- [ ] Niveau verrouillé inaccessible.
- [ ] Progression restaurée après reconnexion.

---

## 10. Carte de progression

- [ ] Tous les niveaux affichés.
- [ ] États corrects.
- [ ] Progression globale affichée.
- [ ] Clic niveau disponible fonctionnel.
- [ ] Clic niveau verrouillé bloqué.
- [ ] Niveau terminé rejouable.

---

## 11. Dashboard

- [ ] Parcours actif affiché.
- [ ] Niveau actuel affiché.
- [ ] XP affiché.
- [ ] Bouton Continuer fonctionnel.
- [ ] Données cohérentes avec progression.

---

## 12. Analytics

- [ ] Page home view trackée.
- [ ] CTA start tracké.
- [ ] Onboarding tracké.
- [ ] Level viewed tracké.
- [ ] Code execution started tracké.
- [ ] Code execution completed tracké.
- [ ] Compile error trackée.
- [ ] Wrong output trackée.
- [ ] Timeout tracké.
- [ ] Level completed tracké.
- [ ] Premium interest tracké.
- [ ] Tracking non bloquant.

---

## 13. Premium bientôt disponible

- [ ] Page ou bloc visible.
- [ ] Bénéfices futurs affichés.
- [ ] Bouton intérêt fonctionnel.
- [ ] Email sauvegardé si fourni.
- [ ] Confirmation affichée.
- [ ] Aucun paiement intégré.

---

## 14. Sécurité et conformité

- [ ] Pas de secrets exposés côté client.
- [ ] Code utilisateur limité en taille.
- [ ] Sandbox isolée.
- [ ] Pas d’accès réseau sandbox.
- [ ] Politique de confidentialité prévue.
- [ ] Données collectées minimisées.
- [ ] Erreurs techniques non exposées brutes.

---

## 15. Hors périmètre respecté

- [ ] Pas de deuxième langage.
- [ ] Pas de paiement complet.
- [ ] Pas d’IA pédagogique complète.
- [ ] Pas d’IDE complet.
- [ ] Pas de forum.
- [ ] Pas de classement.
- [ ] Pas de crates externes libres.
- [ ] Pas de projets Cargo multi-fichiers.
- [ ] Pas de WebAssembly.
- [ ] Pas de concepts Rust avancés hors parcours MVP.

---

## 16. Validation finale du parcours cœur

Le MVP peut être considéré comme validé si un utilisateur peut faire ce parcours complet :

- [ ] arriver sur la landing page ;
- [ ] comprendre la promesse ;
- [ ] démarrer le niveau 1 sans compte ;
- [ ] lire le cours ;
- [ ] modifier le code Rust ;
- [ ] exécuter le code ;
- [ ] voir stdout ou stderr ;
- [ ] corriger une erreur ;
- [ ] réussir l’exercice ;
- [ ] créer un compte ;
- [ ] sauvegarder sa progression ;
- [ ] débloquer le niveau 2 ;
- [ ] revenir au dashboard ;
- [ ] reprendre son apprentissage.
