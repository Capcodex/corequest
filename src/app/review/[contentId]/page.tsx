import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewExperience } from "@/components/review/ReviewExperience";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getContentContextById } from "@/lib/content/getCurriculum";
import { getLevelById } from "@/lib/levels/getLevelById";
import { getUserProgress } from "@/lib/progress/getUserProgress";

type ReviewExercisePageProps = {
  params: Promise<{
    contentId: string;
  }>;
};

export default async function ReviewExercisePage({ params }: ReviewExercisePageProps) {
  const { contentId } = await params;
  const user = await requireUser({ nextPath: `/review/${contentId}` });
  const level = getLevelById(contentId);

  if (!level) {
    notFound();
  }

  const progress = await getUserProgress(user.id);
  const context = getContentContextById(contentId);
  const isCompleted = progress.completedContentIds?.includes(contentId) ?? false;

  if (!isCompleted) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <Card className="space-y-4 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Révision indisponible</p>
          <h1 className="text-3xl font-semibold text-foreground">Exercice non validé</h1>
          <p className="text-sm leading-7 text-muted">
            La révision Leitner est réservée aux exercices déjà réussis. Validez d’abord cet exercice dans le parcours principal, puis il rejoindra automatiquement la mémoire long terme.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/levels/${contentId}`}>Ouvrir l’exercice</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/review">Retour aux révisions</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Révision active</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{level.title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            Travaillez de mémoire, avec l’éditeur vide. Les erreurs pendant l’essai restent neutres ; seule une réussite validée ou un abandon explicite met à jour la box.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
            Niveau {level.levelNumber}
          </span>
          {context ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {context.chapter.title}
            </span>
          ) : null}
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {level.xpReward} XP d’origine
          </span>
        </div>
      </Card>

      <ReviewExperience level={level} />
    </div>
  );
}
