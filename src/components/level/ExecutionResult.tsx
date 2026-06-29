import { ExecutionResult as ExecutionResultType } from "@/types/execution";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

type ExecutionResultProps = {
  result: ExecutionResultType | null;
};

const statusLabels: Record<ExecutionResultType["status"], string> = {
  success: "Exécution réussie",
  compile_error: "Compilation échouée",
  runtime_error: "Erreur à l’exécution",
  wrong_output: "Résultat incorrect",
  timeout: "Temps dépassé",
  sandbox_error: "Erreur technique",
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
        Exécutez votre code pour afficher le résultat, la sortie standard et les éventuelles erreurs.
      </Alert>
    );
  }

  return (
    <Card className="space-y-4 p-5">
      <Alert tone={statusTones[result.status]}>
        <span className="font-semibold">{statusLabels[result.status]}</span>
        {getStatusMessage(result)}
      </Alert>

      <div className="grid gap-4">
        <ResultBlock label="Durée d’exécution" content={`${result.durationMs} ms`} />
        <ResultBlock
          label="Sortie standard"
          content={result.stdout.length > 0 ? result.stdout : "Aucune sortie produite."}
          mono
        />
        <ResultBlock
          label="Sortie d’erreur"
          content={result.stderr.length > 0 ? result.stderr : "Aucune erreur produite."}
          mono
        />
        {result.status === "wrong_output" && result.expectedOutput ? (
          <ResultBlock label="Sortie attendue" content={result.expectedOutput} mono />
        ) : null}
      </div>
    </Card>
  );
}

function getStatusMessage(result: ExecutionResultType) {
  if (result.passed) {
    return " — l’exercice est validé.";
  }

  switch (result.status) {
    case "compile_error":
      return " — corrigez les erreurs de compilation puis relancez.";
    case "runtime_error":
      return " — le programme s’est lancé mais a échoué.";
    case "wrong_output":
      return " — la sortie ne correspond pas encore à l’attendu.";
    case "timeout":
      return " — l’exécution a été interrompue avant la fin.";
    case "sandbox_error":
      return " — un problème technique est survenu côté plateforme.";
    default:
      return "";
  }
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