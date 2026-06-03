"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type PremiumInterestFormProps = {
  defaultEmail?: string | null;
  isAuthenticated: boolean;
};

export function PremiumInterestForm({
  defaultEmail = null,
  isAuthenticated,
}: PremiumInterestFormProps) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/premium-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: isAuthenticated ? null : email,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok || !data.ok) {
        setErrorMessage(data.error ?? "Impossible d’enregistrer votre intérêt.");
        return;
      }

      setMessage(data.message ?? "Votre intérêt a été enregistré.");
    } catch {
      setErrorMessage("Impossible d’enregistrer votre intérêt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Bientôt disponible</p>
        <h2 className="text-2xl font-semibold text-foreground">Signalez votre intérêt Premium</h2>
        <p className="text-sm leading-7 text-muted">
          On mesure l’intérêt pour débloquer des parcours avancés, plus de niveaux et une progression enrichie.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isAuthenticated ? (
          <label className="block space-y-2">
            <span className="text-sm text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
              placeholder="vous@corequest.dev"
            />
          </label>
        ) : null}

        {message ? <Alert tone="success">{message}</Alert> : null}
        {errorMessage ? <Alert tone="danger">{errorMessage}</Alert> : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Je veux être prévenu"}
        </Button>
      </form>
    </Card>
  );
}
