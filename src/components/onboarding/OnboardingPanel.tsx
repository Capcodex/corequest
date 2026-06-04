import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OnboardingPanel() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Card className="space-y-8 p-8 md:p-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Prise en main</p>
          <h1 className="text-4xl font-semibold text-foreground">
            Commencez le parcours Rust avec une boucle de pratique réelle.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted">
            Chaque niveau combine une notion courte, un exercice, une exécution en sandbox et une
            validation par la sortie. L’objectif est de pratiquer vite, souvent, et avec un retour direct.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StepCard
            title="1. Comprendre"
            description="Un mini-cours vous donne la notion Rust utile pour l’exercice."
          />
          <StepCard
            title="2. Écrire"
            description="Vous produisez la solution depuis zéro pour travailler la mémorisation active."
          />
          <StepCard
            title="3. Exécuter"
            description="Le code est compilé et exécuté dans une sandbox isolée avec un retour immédiat."
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/levels/rust-level-1">Commencer le parcours</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/levels/rust-level-1">Accéder directement au niveau 1</Link>
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
