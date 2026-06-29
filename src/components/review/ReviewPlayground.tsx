"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/level/CodeEditor";
import { ExecutionResult } from "@/components/level/ExecutionResult";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { getAnonymousSessionId } from "@/lib/analytics/client";
import { ExecuteCodeRequest, ExecutionResult as ExecutionResultType } from "@/types/execution";
import { Level } from "@/types/level";
import { SubmitReviewResponse } from "@/types/review";

type ReviewPlaygroundProps = {
  level: Level;
};

type ReviewSaveState = "idle" | "saving" | "saved" | "failed";

export function ReviewPlayground({ level }: ReviewPlaygroundProps) {
  const router = useRouter();
  const [result, setResult] = useState<ExecutionResultType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [saveState, setSaveState] = useState<ReviewSaveState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRun = async (code: string, stdin: string | null) => {
    const anonymousSessionId = getAnonymousSessionId();
    const payload: ExecuteCodeRequest = {
      levelId: level.id,
      code,
      stdin,
      anonymousSessionId,
    };

    try {
      setIsRunning(true);
      setResult(null);
      setSaveState("idle");
      setFeedbackMessage(null);

      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ExecutionResultType | { error: string };

      if (!response.ok || "error" in data) {
        setResult({
          status: "sandbox_error",
          stdout: "",
          stderr: "Erreur technique inattendue.",
          durationMs: 0,
          passed: false,
        });
        return;
      }

      setResult(data);

      if (data.passed) {
        await submitReview("success");
      }
    } catch {
      setResult({
        status: "sandbox_error",
        stdout: "",
        stderr: "Impossible de joindre l’API d’exécution.",
        durationMs: 0,
        passed: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        defaultStdin={level.stdin ?? null}
        helperText="Retapez la solution de mémoire. Les erreurs de compilation ou de sortie ne modifient pas votre planning tant que vous ne validez pas ou ne marquez pas l’exercice à retravailler."
        isRunning={isRunning || saveState === "saving"}
        onRun={handleRun}
        placeholder=""
        runLabel="Lancer la révision"
        showStdin={level.stdin !== null && level.stdin !== undefined}
      />

      <div className="rounded-3xl border border-border bg-panel/90 p-5 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Évaluation Leitner</p>
            <p className="text-sm leading-7 text-muted">
              Une réussite est enregistrée automatiquement quand la sortie attendue est validée. Si vous abandonnez ou devez relire le cours, marquez explicitement l’exercice à retravailler.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => submitReview("failure")}
            disabled={isRunning || saveState === "saving"}
          >
            Marquer à retravailler
          </Button>
        </div>
      </div>

      {feedbackMessage ? (
        <Alert tone={saveState === "failed" ? "danger" : "success"}>
          <div className="space-y-3">
            <p>{feedbackMessage}</p>
            {saveState === "saved" ? (
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/review">Retour aux révisions</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </Alert>
      ) : null}

      <ExecutionResult result={result} />
    </div>
  );

  async function submitReview(reviewResult: "success" | "failure") {
    try {
      setSaveState("saving");
      setFeedbackMessage(null);

      const response = await fetch("/api/review/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: level.id,
          result: reviewResult,
        }),
      });
      const data = (await response.json()) as SubmitReviewResponse | { error: string };

      if (!response.ok || "error" in data) {
        setSaveState("failed");
        setFeedbackMessage("La révision n’a pas pu être enregistrée. Réessayez depuis la session du jour.");
        return;
      }

      setSaveState("saved");
      setFeedbackMessage(buildReviewFeedback(data));
      router.refresh();
    } catch {
      setSaveState("failed");
      setFeedbackMessage("La révision n’a pas pu être enregistrée à cause d’un problème réseau.");
    }
  }
}

function buildReviewFeedback(data: SubmitReviewResponse) {
  const nextReviewDate = new Date(data.reviewItem.nextReviewAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (data.attempt.result === "success") {
    return `Révision validée. L’exercice passe en box ${data.reviewItem.leitnerBox}, prochaine échéance le ${nextReviewDate}.`;
  }

  return `Révision marquée à retravailler. L’exercice revient en box ${data.reviewItem.leitnerBox}, prochaine échéance le ${nextReviewDate}.`;
}
