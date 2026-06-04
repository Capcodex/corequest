import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Comprendre l’objectif",
    description: "Chaque niveau introduit une notion Rust courte et immédiatement exploitable.",
  },
  {
    title: "Écrire la solution",
    description: "Vous retapez le code depuis zéro pour ancrer les automatismes et produire la sortie attendue.",
  },
  {
    title: "Exécuter et corriger",
    description: "Le code tourne dans une sandbox isolée, avec un retour concret sur la compilation et l’exécution.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="space-y-3 pb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Méthode</p>
        <h2 className="text-3xl font-semibold text-foreground">
          Une progression simple, pensée pour pratiquer régulièrement.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title} className="p-6">
            <p className="text-sm font-semibold text-accent">Étape {index + 1}</p>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
