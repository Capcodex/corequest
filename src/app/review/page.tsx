import { ReviewBoxesPanel } from "@/components/review/ReviewBoxesPanel";
import { ReviewSessionCard } from "@/components/review/ReviewSessionCard";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getDailyReviewSession } from "@/lib/review/getDailyReviewSession";
import { getReviewBoxesOverview } from "@/lib/review/getReviewBoxesOverview";

export default async function ReviewPage() {
  const user = await requireUser({ nextPath: "/review" });
  const [session, boxesOverview] = await Promise.all([
    getDailyReviewSession(user.id),
    getReviewBoxesOverview(user.id),
  ]);
  const overdueCount = session.items.filter((item) => item.overdueDays > 0).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Révisions</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Session de consolidation</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            Retrouvez les exercices déjà validés au moment où ils méritent d’être rappelés. La sélection reste volontairement courte pour privilégier l’effort de mémoire plutôt que la quantité.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
            {session.dueCount} à revoir
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {overdueCount} en retard
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Limite {session.limit}/jour
          </span>
        </div>
      </Card>

      <ReviewBoxesPanel overview={boxesOverview} />

      <ReviewSessionCard session={session} />
    </div>
  );
}
