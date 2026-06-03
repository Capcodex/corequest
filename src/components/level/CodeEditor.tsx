"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CodeEditorProps = {
  starterCode: string;
  isRunning: boolean;
  onRun: (code: string) => Promise<void> | void;
};

export function CodeEditor({ starterCode, isRunning, onRun }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);

  const handleRun = async () => {
    await onRun(code);
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Éditeur Rust</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCode(starterCode)}
            disabled={isRunning}
          >
            Réinitialiser
          </Button>
          <Button type="button" size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Exécution..." : "Exécuter"}
          </Button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        className="min-h-[420px] w-full rounded-3xl border border-border bg-slate-950/80 p-4 font-mono text-sm leading-7 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-accent"
      />
    </Card>
  );
}
