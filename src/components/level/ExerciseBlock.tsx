import { Card } from "@/components/ui/Card";
import { ExerciseValidationMode } from "@/types/content";

type ExerciseBlockProps = {
  instructions: string[];
  expectedOutput: string;
  stdin?: string | null;
  validationMode?: ExerciseValidationMode;
};

const validationLabels: Record<ExerciseValidationMode, string> = {
  stdout_exact: "La sortie doit correspondre exactement à l’attendu.",
  stdout_includes: "La sortie doit inclure l’élément attendu.",
  exit_success: "Le programme doit s’exécuter correctement sans erreur.",
};

export function ExerciseBlock({
  instructions,
  expectedOutput,
  stdin = null,
  validationMode = "stdout_exact",
}: ExerciseBlockProps) {
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
      <div className="rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-muted">
        {validationLabels[validationMode]}
      </div>
      {validationMode !== "exit_success" ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Sortie attendue : <span className="font-semibold">{expectedOutput}</span>
        </div>
      ) : null}
      {stdin !== null ? (
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          Une entrée standard est prévue pour cet exercice. Vous pouvez la modifier dans l’éditeur.
        </div>
      ) : null}
    </Card>
  );
}