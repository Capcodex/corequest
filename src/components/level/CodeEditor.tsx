"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CodeEditorProps = {
  isRunning: boolean;
  onRun: (code: string) => Promise<void> | void;
};

const EMPTY_EDITOR_VALUE = "";

export function CodeEditor({ isRunning, onRun }: CodeEditorProps) {
  const [code, setCode] = useState(EMPTY_EDITOR_VALUE);
  const helperId = useId();

  const handleRun = async () => {
    await onRun(code);
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Éditeur Rust</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCode(EMPTY_EDITOR_VALUE)}
            disabled={isRunning}
          >
            Réinitialiser
          </Button>
          <Button type="button" size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Exécution..." : "Exécuter"}
          </Button>
        </div>
      </div>
      <div
        id={helperId}
        className="rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-muted"
      >
        Écrivez tout depuis zéro. Gardez l&apos;exemple du cours comme repère, puis retapez le
        programme entièrement dans l’éditeur.
      </div>
      <label className="sr-only" htmlFor="rust-editor">
        Éditeur de code Rust
      </label>
      <textarea
        id="rust-editor"
        aria-describedby={helperId}
        aria-label="Éditeur de code Rust"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder={"fn main() {\n    \n}"}
        spellCheck={false}
        className="min-h-[360px] w-full rounded-3xl border border-border bg-slate-950/80 p-4 font-mono text-sm leading-7 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    </Card>
  );
}
