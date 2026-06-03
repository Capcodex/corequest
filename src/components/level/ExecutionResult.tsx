import { ExecutionResult as ExecutionResultType } from "@/types/execution";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

type ExecutionResultProps = {
  result: ExecutionResultType | null;
};

const statusLabels: Record<ExecutionResultType["status"], string> = {
  success: "Succès",
  compile_error: "Erreur de compilation",
  runtime_error: "Erreur d’exécution",
  wrong_output: "Sortie incorrecte",
  timeout: "Timeout",
  sandbox_error: "Erreur sandbox",
};

const statusTones: Record<ExecutionResultType["status"], "info" | "success" | "danger"> = {
  success: "success",
  compile_error: "danger",
  runtime_error: "danger",
  wrong_output: "info",
  timeout: "danger",
  sandbox_error: "danger",
};

export function ExecutionResult({ result }: ExecutionResultProps) {
  if (!result) {
    return (
      <Alert tone="info">
        Lancez une exécution pour voir le résultat de compilation, `stdout` et `stderr`.
      </Alert>
    );
  }

  return (
    <Card className="space-y-4 p-5">
      <Alert tone={statusTones[result.status]}>
        <span className="font-semibold">{statusLabels[result.status]}</span>
        {result.passed ? " — le niveau est validé." : " — vous pouvez corriger puis relancer."}
      </Alert>

      <div className="grid gap-4">
        <ResultBlock label="Durée" content={`${result.durationMs} ms`} />
        <ResultBlock
          label="stdout"
          content={result.stdout.length > 0 ? result.stdout : "Aucune sortie standard."}
          mono
        />
        <ResultBlock
          label="stderr"
          content={result.stderr.length > 0 ? result.stderr : "Aucune erreur standard."}
          mono
        />
        {result.status === "wrong_output" && result.expectedOutput ? (
          <ResultBlock label="Sortie attendue" content={result.expectedOutput} mono />
        ) : null}
      </div>
    </Card>
  );
}

type ResultBlockProps = {
  label: string;
  content: string;
  mono?: boolean;
};

function ResultBlock({ label, content, mono = false }: ResultBlockProps) {
  return (
    <div className="rounded-2xl border border-border bg-panelAlt p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <pre
        className={`mt-3 whitespace-pre-wrap break-words text-sm text-foreground ${
          mono ? "font-mono leading-7" : ""
        }`.trim()}
      >
        {content}
      </pre>
    </div>
  );
}
