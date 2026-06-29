import { notFound } from "next/navigation";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectWorkspace } from "@/components/project/ProjectWorkspace";
import { getProjectById } from "@/lib/content/getProjects";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <TrackEventOnMount
        eventName="project_viewed"
        properties={{
          projectId: project.id,
          levelId: project.levelId,
          themeId: project.themeId,
          chapterId: project.chapterId,
        }}
      />
      <ProjectHeader project={project} />
      <ProjectWorkspace project={project} />
    </div>
  );
}