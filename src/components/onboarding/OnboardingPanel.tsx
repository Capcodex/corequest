import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OnboardingPanel() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Card className="space-y-8 p-8 md:p-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Onboarding</p>
          <h1 className="text-4xl font-semibold text-foreground">Le noyau s’effondre. Votre mission : le reconstruire en Rust.</h1>
          <p className="max-w-3xl text-base leading-8 text-muted">
            Dans CoreQuest, chaque niveau vous aide à réactiver un fragment du système.
            Vous apprenez une notion, vous modifiez le code, vous l&apos;exécutez, puis vous
            corrigez jusqu&apos;à réussir.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StepCard
            title="1. Lire"
            description="Un mini-cours court vous donne la notion Rust utile pour la mission."
          />
          <StepCard
            title="2. Coder"
            description="Vous partez d’un starter code et vous l’adaptez pour produire la bonne sortie."
          />
          <StepCard
            title="3. Exécuter"
            description="La boucle MVP vise une compilation et une exécution réelles dans une sandbox isolée."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/levels/rust-level-1">Commencer</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/levels/rust-level-1">Passer l&apos;onboarding</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

type StepCardProps = {
  title: string;
  description: string;
};

function StepCard({ title, description }: StepCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-panelAlt p-5">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
