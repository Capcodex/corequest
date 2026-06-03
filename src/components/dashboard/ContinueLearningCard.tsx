import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Level } from "@/types/level";

type ContinueLearningCardProps = {
  currentLevel: Level | null;
};

export function ContinueLearningCard({ currentLevel }: ContinueLearningCardProps) {
  return (
    <Card className="space-y-4 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Continuer</p>
      <h2 className="text-2xl font-semibold text-foreground">
        {currentLevel ? currentLevel.title : "Prêt pour votre prochain niveau"}
      </h2>
      <p className="text-sm leading-7 text-muted">
        {currentLevel
          ? currentLevel.summary
          : "Votre progression ne contient pas encore de niveau courant identifiable."}
      </p>
      {currentLevel ? (
        <Button asChild>
          <Link href={`/levels/${currentLevel.id}`}>Reprendre ce niveau</Link>
        </Button>
      ) : null}
    </Card>
  );
}

