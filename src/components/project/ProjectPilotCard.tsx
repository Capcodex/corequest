import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RoadmapProjectNode } from "@/lib/progress/getCurriculumRoadmap";

type ProjectPilotCardProps = {
  project: RoadmapProjectNode;
};

export function ProjectPilotCard({ project }: ProjectPilotCardProps) {
  const isOpen = project.status !== "locked";

  return (
    <Card className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Projet de synthèse</p>
          <StatusBadge state={project.status} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{project.title}</h2>
          <p className="text-sm leading-7 text-muted md:text-base">{project.summary}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {isOpen ? (
            <Button asChild>
              <Link href={project.href}>{project.status === "completed" ? "Rouvrir le projet" : "Ouvrir le projet"}</Link>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/map">Voir le parcours</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-white/10 bg-panelAlt/90 p-5">
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-muted">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">État du projet</p>
          <p className="mt-2 text-foreground">
            {project.status === "locked"
              ? "Le projet s’ouvrira dès que les chapitres requis seront validés."
              : "Le projet est disponible avec exécution Cargo et validation par scénarios dans la sandbox."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-muted">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Ce que vous y validez</p>
          <ul className="mt-3 space-y-2 leading-7">
            <li>- structure multi-fichiers ;</li>
            <li>- séparation logique métier / point d’entrée ;</li>
            <li>- exécution Cargo bornée ;</li>
            <li>- validation par scénarios.</li>
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <InlineMetric label="Scénarios" value={`${project.validationScenarioCount}`} />
          <InlineMetric label="Tests" value={`${project.testCount}`} />
          <InlineMetric label="Durée" value={`${project.estimatedDurationMinutes} min`} />
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ state }: { state: RoadmapProjectNode["status"] }) {
  const label =
    state === "completed"
      ? "Validé"
      : state === "in_progress"
        ? "En cours"
        : state === "available"
          ? "Disponible"
          : "Verrouillé";

  const className =
    state === "completed"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
      : state === "in_progress"
        ? "border-accent/25 bg-accent/12 text-amber-100"
        : state === "available"
          ? "border-sky-400/25 bg-sky-500/10 text-sky-100"
          : "border-white/10 bg-white/5 text-muted";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`.trim()}>{label}</span>;
}

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}