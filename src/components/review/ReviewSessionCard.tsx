import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DailyReviewSession, DailyReviewSessionItem } from "@/types/review";

type ReviewSessionCardProps = {
  session: DailyReviewSession;
};

export function ReviewSessionCard({ session }: ReviewSessionCardProps) {
  const overdueCount = session.items.filter((item) => item.overdueDays > 0).length;
  const totalMinutes = session.items.reduce(
    (sum, item) => sum + item.exercise.estimatedDurationMinutes,
    0,
  );

  return (
    <Card className="space-y-6 p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="À revoir" value={`${session.dueCount}`} helper="exercice(s) disponible(s)" />
        <Metric label="En retard" value={`${overdueCount}`} helper="à traiter en priorité" />
        <Metric
          label="Session"
          value={session.items.length > 0 ? `${totalMinutes} min` : "0 min"}
          helper={session.hasMore ? `${session.limit} affiché(s) sur ${session.dueCount}` : "format court"}
        />
      </div>

      {session.items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Session du jour</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Exercices à consolider</h2>
            </div>
            <p className="text-sm text-muted">
              Priorité aux échéances anciennes et aux notions encore fragiles.
            </p>
          </div>

          <div className="grid gap-4">
            {session.items.map((item) => (
              <ReviewExerciseRow key={item.reviewItem.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Aucune échéance ouverte</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">Rien à revoir aujourd’hui.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Les prochains rappels apparaîtront ici après validation d’exercices et selon leur planning de révision.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/map">Continuer le parcours</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Retour au dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

type ReviewDashboardCardProps = {
  session: DailyReviewSession;
};

export function ReviewDashboardCard({ session }: ReviewDashboardCardProps) {
  const overdueCount = session.items.filter((item) => item.overdueDays > 0).length;

  return (
    <Card className="grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:p-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Révisions du jour</p>
        <h2 className="text-2xl font-semibold text-foreground">
          {session.dueCount > 0
            ? `${session.dueCount} exercice(s) à consolider`
            : "Aucune révision due aujourd’hui"}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
          Une session courte basée sur les exercices déjà réussis, pour vérifier que les automatismes restent disponibles sans relire le cours en premier.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-panelAlt/90 p-5 sm:flex-row md:flex-col">
        <div className="flex gap-3">
          <Badge>{session.dueCount} à revoir</Badge>
          {overdueCount > 0 ? <Badge className="border-danger/30 bg-danger/10 text-red-100">{overdueCount} en retard</Badge> : null}
        </div>
        <Button asChild>
          <Link href="/review">Faire ma session</Link>
        </Button>
      </div>
    </Card>
  );
}

function ReviewExerciseRow({ item }: { item: DailyReviewSessionItem }) {
  return (
    <article className="grid gap-4 rounded-[2rem] border border-border bg-panelAlt/80 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>Niveau {item.exercise.levelNumber}</Badge>
          <Badge>Box {item.reviewItem.leitnerBox}</Badge>
          {item.overdueDays > 0 ? (
            <Badge className="border-danger/30 bg-danger/10 text-red-100">
              {item.overdueDays} j de retard
            </Badge>
          ) : (
            <Badge className="border-accent/30 bg-accent/10 text-amber-100">Aujourd’hui</Badge>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground">{item.exercise.title}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{item.exercise.summary}</p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <Info label="Chapitre" value={item.exercise.chapterTitle} />
          <Info label="Difficulté" value={formatDifficulty(item.exercise.difficulty)} />
          <Info label="Durée" value={`${item.exercise.estimatedDurationMinutes} min`} />
        </dl>
      </div>

      <div className="flex flex-col gap-3 md:min-w-44">
        <Button asChild>
          <Link href={`/review/${item.exercise.id}`}>Réviser</Link>
        </Button>
        <p className="text-center text-xs text-muted">{item.exercise.xpReward} XP d’origine</p>
      </div>
    </article>
  );
}

function Metric({ helper, label, value }: { helper: string; label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted">{helper}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.2em] text-muted">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function formatDifficulty(difficulty: string) {
  const labels: Record<string, string> = {
    intro: "Introduction",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return labels[difficulty] ?? difficulty;
}
