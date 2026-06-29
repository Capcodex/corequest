import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { ProjectPilotCard } from "@/components/project/ProjectPilotCard";
import { ReviewDashboardCard } from "@/components/review/ReviewSessionCard";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getCurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { getUserProgress } from "@/lib/progress/getUserProgress";
import { getDailyReviewSession } from "@/lib/review/getDailyReviewSession";

export default async function DashboardPage() {
  const user = await requireUser({ nextPath: "/dashboard" });
  const progress = await getUserProgress(user.id);
  const roadmap = getCurriculumRoadmap(progress);
  const reviewSession = await getDailyReviewSession(user.id, { limit: 3 });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Tableau de bord</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            Bon retour{progress.displayName ? `, ${progress.displayName}` : ""}.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            Une vue claire du niveau actif, du chapitre à reprendre, des projets de synthèse ouverts et des prochains jalons du parcours.
          </p>
        </div>
      </Card>

      <DashboardSummary progress={progress} roadmap={roadmap} />
      <ReviewDashboardCard session={reviewSession} />
      <ContinueLearningCard progress={progress} roadmap={roadmap} />
      {roadmap.nextProject ? <ProjectPilotCard project={roadmap.nextProject} /> : null}
    </div>
  );
}
