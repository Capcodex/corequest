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
            <Badge>Parcours Rust MVP</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                Apprenez Rust avec une vraie boucle de code, de compilation et de correction.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                CoreQuest transforme l&apos;apprentissage Rust en progression scénarisée :
                vous lisez, vous codez, vous exécutez, vous comprenez l&apos;erreur, puis
                vous débloquez la suite.
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
                <Link href="/onboarding">Commencer l&apos;aventure</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/levels/rust-level-1">Ouvrir le niveau 1</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-panelAlt p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-muted">Boucle cœur MVP</p>
            <ul className="mt-5 space-y-4 text-sm text-foreground">
              <li>1. Comprendre un concept Rust ciblé</li>
              <li>2. Modifier le code dans l&apos;éditeur</li>
              <li>3. Compiler et exécuter en sandbox</li>
              <li>4. Lire `stdout`, `stderr` ou l&apos;erreur</li>
              <li>5. Corriger et réussir</li>
              <li>6. Débloquer le niveau suivant</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
