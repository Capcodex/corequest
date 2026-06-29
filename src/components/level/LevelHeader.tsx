import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ContentContext } from "@/types/content";
import { Level } from "@/types/level";

type LevelHeaderProps = {
  level: Level;
  context: ContentContext | null;
};

export function LevelHeader({ level, context }: LevelHeaderProps) {
  const levelNumber = context?.level.levelNumber ?? null;
  const levelTitle = context?.level.title ?? "Parcours Rust";
  const themeTitle = context?.theme.title ?? level.concept;
  const chapterTitle = context?.chapter.title ?? null;
  const chapterProblemCount = context?.chapter.estimatedProblemCount ?? null;

  return (
    <Card className="space-y-5 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{level.pathId}</Badge>
        {levelNumber ? <Badge>Niveau {levelNumber}</Badge> : null}
        <Badge>Exercice {level.orderIndex}</Badge>
        <Badge>{level.xpReward} XP</Badge>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">{levelTitle}</p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{level.title}</h1>
        </div>
        <p className="text-base text-muted">{level.summary}</p>
      </div>
      <div className="grid gap-3 rounded-3xl border border-border bg-panelAlt/60 p-4 md:grid-cols-2">
        <MetaBlock label="Thématique" value={themeTitle} />
        <MetaBlock label="Chapitre" value={chapterTitle ?? "Chapitre en cours"} />
        <MetaBlock label="Concept" value={level.concept} />
        <MetaBlock
          label="Cadence"
          value={chapterProblemCount ? `${chapterProblemCount} exercices dans ce chapitre` : "Parcours progressif"}
        />
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
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}