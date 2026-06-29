"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CodeEditorProps = {
  isRunning: boolean;
  onRun: (code: string, stdin: string | null) => Promise<void> | void;
  defaultStdin?: string | null;
  helperText?: string;
  placeholder?: string;
  runLabel?: string;
  showStdin?: boolean;
};

const EMPTY_EDITOR_VALUE = "";

export function CodeEditor({
  isRunning,
  onRun,
  defaultStdin = null,
  helperText = "Écrivez tout depuis zéro. Gardez l'exemple du cours comme repère, puis retapez le programme entièrement dans l’éditeur.",
  placeholder = "fn main() {\n    \n}",
  runLabel = "Exécuter",
  showStdin = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(EMPTY_EDITOR_VALUE);
  const [stdin, setStdin] = useState(defaultStdin ?? "");
  const helperId = useId();
  const stdinHelperId = useId();

  useEffect(() => {
    setStdin(defaultStdin ?? "");
  }, [defaultStdin]);

  const handleRun = async () => {
    await onRun(code, showStdin ? stdin : null);
  };

  const handleReset = () => {
    setCode(EMPTY_EDITOR_VALUE);
    setStdin(defaultStdin ?? "");
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
            onClick={handleReset}
            disabled={isRunning}
          >
            Réinitialiser
          </Button>
          <Button type="button" size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Exécution..." : runLabel}
          </Button>
        </div>
      </div>
      <div
        id={helperId}
        className="rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-muted"
      >
        {helperText}
      </div>
      {showStdin ? (
        <div className="space-y-3 rounded-2xl border border-border bg-panelAlt p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Entrée standard</p>
            <p id={stdinHelperId} className="text-sm text-muted">
              Cette zone simule les données lues via `stdin`. Laissez-la telle quelle si l’énoncé fournit déjà une entrée.
            </p>
          </div>
          <textarea
            aria-describedby={stdinHelperId}
            aria-label="Entrée standard"
            value={stdin}
            onChange={(event) => setStdin(event.target.value)}
            spellCheck={false}
            className="min-h-[120px] w-full rounded-2xl border border-border bg-slate-950/70 p-4 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            placeholder={"42\n13\n"}
          />
        </div>
      ) : null}
      <label className="sr-only" htmlFor="rust-editor">
        Éditeur de code Rust
      </label>
      <textarea
        id="rust-editor"
        aria-describedby={helperId}
        aria-label="Éditeur de code Rust"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="min-h-[360px] w-full rounded-3xl border border-border bg-slate-950/80 p-4 font-mono text-sm leading-7 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    </Card>
  );
}
