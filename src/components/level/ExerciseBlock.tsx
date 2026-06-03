import { Card } from "@/components/ui/Card";

type ExerciseBlockProps = {
  instructions: string[];
  expectedOutput: string;
};

export function ExerciseBlock({ instructions, expectedOutput }: ExerciseBlockProps) {
  return (
    <Card className="space-y-5 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Exercice</p>
      <ul className="space-y-3 text-sm leading-7 text-muted">
        {instructions.map((instruction) => (
          <li key={instruction} className="rounded-2xl border border-border bg-panelAlt px-4 py-3">
            {instruction}
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        Sortie attendue : <span className="font-semibold">{expectedOutput}</span>
      </div>
    </Card>
  );
}
