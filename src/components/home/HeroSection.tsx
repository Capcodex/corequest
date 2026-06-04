"use client";

import Link from "next/link";
import { trackClientEvent } from "@/lib/analytics/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <Card className="overflow-hidden p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <Badge>Parcours Rust</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                Apprenez Rust avec une boucle réelle de code, d’exécution et de correction.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                CoreQuest structure l’apprentissage Rust autour d’exercices courts, d’une exécution
                isolée en sandbox et d’un déblocage progressif niveau par niveau.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                onClick={() =>
                  trackClientEvent({
                    name: "cta_start_clicked",
                    properties: {
                      source: "hero-onboarding",
                    },
                  })
                }
              >
                <Link href="/onboarding">Commencer le parcours</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/levels/rust-level-1">Ouvrir le niveau 1</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-panelAlt p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-muted">Boucle d’apprentissage</p>
            <ul className="mt-5 space-y-4 text-sm text-foreground">
              <li>1. Comprendre une notion Rust ciblée</li>
              <li>2. Écrire la solution dans l’éditeur</li>
              <li>3. Compiler et exécuter en sandbox</li>
              <li>4. Lire la sortie ou l’erreur</li>
              <li>5. Corriger jusqu’à validation</li>
              <li>6. Déverrouiller le niveau suivant</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
