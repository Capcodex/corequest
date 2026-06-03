"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAnonymousSessionId } from "@/lib/analytics/client";
import { CodeEditor } from "@/components/level/CodeEditor";
import { ExecutionResult } from "@/components/level/ExecutionResult";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { savePendingLevelCompletion } from "@/lib/progress/guestProgress.client";
import { Level } from "@/types/level";
import { ExecuteCodeRequest, ExecutionResult as ExecutionResultType } from "@/types/execution";
import { CompleteLevelResult } from "@/types/progress";

type LevelPlaygroundProps = {
  level: Level;
  nextLevelId: string | null;
};

export function LevelPlayground({ level, nextLevelId }: LevelPlaygroundProps) {
  const router = useRouter();
  const [result, setResult] = useState<ExecutionResultType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [resolvedNextLevelId, setResolvedNextLevelId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRun = async (code: string) => {
    const anonymousSessionId = getAnonymousSessionId();
    const payload: ExecuteCodeRequest = {
      levelId: level.id,
      code,
      anonymousSessionId,
    };

    try {
      setIsRunning(true);
      setResult(null);
      setCompletionMessage(null);
      setResolvedNextLevelId(null);
      setIsCompleted(false);

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
          stderr: "error" in data ? data.error : "Erreur technique inattendue.",
          durationMs: 0,
          passed: false,
        });
        return;
      }

      setResult(data);

      if (data.passed) {
        setIsCompleted(true);
        await persistLevelCompletion();
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
      <CodeEditor starterCode={level.starterCode} isRunning={isRunning} onRun={handleRun} />
      {isCompleted ? (
        <Alert tone="success">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium">Niveau terminé.</p>
              <p>
                {completionMessage ??
                  "Votre solution est correcte. On prépare la suite du parcours."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {resolvedNextLevelId ? (
                <Button asChild>
                  <Link href={`/levels/${resolvedNextLevelId}`}>Passer au niveau suivant</Link>
                </Button>
              ) : null}
              <Button asChild variant="secondary">
                <Link href="/map">Voir la carte</Link>
              </Button>
            </div>
          </div>
        </Alert>
      ) : null}
      <ExecutionResult result={result} />
    </div>
  );

  async function persistLevelCompletion() {
    try {
      const response = await fetch("/api/progress/complete-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ levelId: level.id }),
      });

      if (response.status === 401) {
        if (level.orderIndex === 1 && nextLevelId) {
          savePendingLevelCompletion({
            levelId: level.id,
            nextPath: `/levels/${nextLevelId}`,
          });
          router.push(`/auth/signup?next=${encodeURIComponent(`/levels/${nextLevelId}`)}`);
          return;
        }

        setCompletionMessage(
          "Exercice réussi. Connectez-vous pour sauvegarder la progression et débloquer la suite durablement.",
        );
        setResolvedNextLevelId(nextLevelId);
        return;
      }

      const data = (await response.json()) as CompleteLevelResult | { error: string };

      if (!response.ok || "error" in data) {
        setCompletionMessage(
          "Exercice réussi, mais la progression n’a pas encore pu être enregistrée.",
        );
        setResolvedNextLevelId(nextLevelId);
        return;
      }

      setResolvedNextLevelId(data.nextLevelId);
      setCompletionMessage(
        data.nextLevelId
          ? data.xpGranted
            ? `Progression sauvegardée. XP total : ${data.xpTotal}. Le niveau suivant est débloqué.`
            : "Niveau déjà validé. Vous pouvez continuer le parcours."
          : data.xpGranted
            ? `Progression sauvegardée. XP total : ${data.xpTotal}. Vous avez terminé le parcours disponible.`
            : "Niveau déjà validé. Le parcours disponible est déjà complété.",
      );
      router.refresh();
    } catch {
      setCompletionMessage(
        "Exercice réussi, mais la sauvegarde de progression a échoué pour cette tentative.",
      );
      setResolvedNextLevelId(nextLevelId);
    }
  }
}
