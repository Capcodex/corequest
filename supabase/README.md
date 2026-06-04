# Supabase Setup

Si le schéma `public` de votre projet Supabase est vide, appliquez le bootstrap complet suivant :

- fichier à exécuter : `supabase/bootstrap_public_schema.sql`
- chemin SQL Editor : Supabase Dashboard → SQL Editor → New query

## Ordre recommandé

1. ouvrir le projet Supabase lié à CoreQuest ;
2. copier-coller le contenu de `supabase/bootstrap_public_schema.sql` ;
3. exécuter la requête ;
4. vérifier que les objets suivants existent dans `public` :
   - `profiles`
   - `user_progress`
   - `level_completions`
   - `submissions`
   - `analytics_events`
   - `premium_interest`
   - `complete_level(...)`
5. créer un nouvel utilisateur test, puis terminer le niveau 1.

## Symptômes typiques si le schéma manque

- `Exercice réussi, mais la progression n’a pas encore pu être enregistrée.`
- pas d’XP dans le dashboard ;
- pas de niveau débloqué ;
- `public` vide dans Supabase.

## Note

Je peux préparer le SQL et le repo local, mais je ne peux pas exécuter ce SQL sur votre instance Supabase distante sans accès admin / SQL Editor.
