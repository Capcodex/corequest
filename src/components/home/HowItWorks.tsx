import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Lire juste l’essentiel",
    description: "Chaque niveau se concentre sur une notion Rust claire et immédiatement praticable.",
  },
  {
    title: "Écrire du vrai Rust",
    description: "Vous partez d’un starter code simple, puis vous l’adaptez pour résoudre la mission.",
  },
  {
    title: "Exécuter et corriger",
    description: "Le MVP vise une vraie exécution isolée, pour apprendre avec un feedback concret.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="space-y-3 pb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Comment ça marche</p>
        <h2 className="text-3xl font-semibold text-foreground">Une progression simple, pensée pour garder l’élan.</h2>
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
