import { Card } from "@/components/ui/Card";

type MissionBlockProps = {
  concept: string;
  missionText: string;
};

export function MissionBlock({ concept, missionText }: MissionBlockProps) {
  return (
    <Card className="space-y-4 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Concept</p>
      <h2 className="text-2xl font-semibold text-foreground">{concept}</h2>
      <p className="text-sm leading-7 text-muted">{missionText}</p>
    </Card>
  );
}
