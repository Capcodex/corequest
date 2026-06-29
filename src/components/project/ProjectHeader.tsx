import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProjectContent } from "@/types/content";

type ProjectHeaderProps = {
  project: ProjectContent;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <Card className="space-y-5 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Mode projet</Badge>
        <Badge>Niveau {project.levelNumber}</Badge>
        <Badge>{project.xpReward} XP potentiels</Badge>
        <Badge>{project.estimatedDurationMinutes} min estimées</Badge>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Projet de synthèse</p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{project.title}</h1>
        </div>
        <p className="max-w-4xl text-sm leading-7 text-muted md:text-base">{project.summary}</p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-border bg-panelAlt/60 p-4 md:grid-cols-2 xl:grid-cols-4">
        <MetaBlock label="Thématique" value={humanizeId(project.themeId, "theme-")} />
        <MetaBlock label="Chapitre source" value={humanizeId(project.chapterId, "level-")} />
        <MetaBlock label="Fichiers" value={`${project.projectConfig.files.length} fichiers`} />
        <MetaBlock label="Entrée" value={project.projectConfig.entryFile} />
      </div>
    </Card>
  );
}

type MetaBlockProps = {
  label: string;
  value: string;
};

function MetaBlock({ label, value }: MetaBlockProps) {
  return (
    <div className="space-y-1 rounded-2xl bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="text-sm font-medium capitalize text-foreground">{value}</p>
    </div>
  );
}

function humanizeId(value: string, prefix: string) {
  return value.replace(prefix, "").replaceAll("-", " ");
}