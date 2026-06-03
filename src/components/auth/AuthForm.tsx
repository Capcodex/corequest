"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPendingLevelCompletion, syncPendingLevelCompletion } from "@/lib/progress/guestProgress.client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(
    () => searchParams.get("next") ?? "/dashboard",
    [searchParams],
  );

  const heading =
    mode === "login" ? "Reprendre votre progression" : "Créer votre compte CoreQuest";

  const description =
    mode === "login"
      ? "Connectez-vous pour retrouver vos niveaux terminés, votre XP et votre prochain objectif."
      : "Créez un compte pour sauvegarder votre progression Rust et débloquer la suite du parcours.";

  const buttonLabel = mode === "login" ? "Se connecter" : "Créer le compte";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        const pendingCompletion = getPendingLevelCompletion();

        if (pendingCompletion) {
          try {
            const syncedCompletion = await syncPendingLevelCompletion();
            router.push(syncedCompletion?.nextPath ?? nextPath);
            router.refresh();
            return;
          } catch {
            setErrorMessage(
              "Connexion réussie, mais la réussite invitée n’a pas pu être sauvegardée. Réessayez dans un instant.",
            );
            router.refresh();
            return;
          }
        }

        router.push(nextPath);
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || null,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        "Compte créé. Si la confirmation email est activée dans Supabase, vérifiez votre boîte mail avant de vous connecter.",
      );
      router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl space-y-6 p-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">
          {mode === "login" ? "Connexion" : "Inscription"}
        </p>
        <h1 className="text-3xl font-semibold text-foreground">{heading}</h1>
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label className="block space-y-2">
            <span className="text-sm text-muted">Nom affiché</span>
            <input
              className="w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Votre nom"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm text-muted">Email</span>
          <input
            className="w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="vous@corequest.dev"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-muted">Mot de passe</span>
          <input
            className="w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
          />
        </label>

        {message ? <Alert tone="success">{message}</Alert> : null}
        {errorMessage ? <Alert tone="danger">{errorMessage}</Alert> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : buttonLabel}
        </Button>
      </form>
    </Card>
  );
}
