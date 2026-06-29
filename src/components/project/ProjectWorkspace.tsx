"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnonymousSessionId } from "@/lib/analytics/client";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getEditedProjectFiles,
  getInitialProjectFiles,
  getProjectFilePlaceholder,
  isEditableProjectFile,
} from "@/lib/projects/projectWorkspaceDraft";
import { ProjectContent } from "@/types/content";
import { ExecuteProjectRequest, ProjectExecutionResult, ProjectValidationResult } from "@/types/projectExecution";

type ProjectWorkspaceProps = {
  project: ProjectContent;
};

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const router = useRouter();
  const initialFiles = useMemo(
    () => getInitialProjectFiles(project),
    [project],
  );
  const [filesByPath, setFilesByPath] = useState<Record<string, string>>(initialFiles);
  const [activePath, setActivePath] = useState(project.projectConfig.entryFile);
  const [openPaths, setOpenPaths] = useState<string[]>([project.projectConfig.entryFile]);
  const [stdin, setStdin] = useState(project.projectConfig.validationScenarios[0]?.stdin ?? "");
  const [runResult, setRunResult] = useState<ProjectExecutionResult | null>(null);
  const [validationResult, setValidationResult] = useState<ProjectValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const activeFile = project.projectConfig.files.find((file) => file.path === activePath) ?? project.projectConfig.files[0] ?? null;

  return (
    <div className="space-y-6">
      {project.statusNote ? <Alert tone="info">{project.statusNote}</Alert> : null}
      {actionError ? <Alert tone="danger">{actionError}</Alert> : null}

      <div className="space-y-6">
        <ProjectBrief project={project} />

        <Card className="overflow-hidden">
          <div className="border-b border-border bg-panelAlt/80 px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">Espace de travail</p>
                <p className="mt-1 text-sm text-muted">
                  Multi-fichiers, lecture seule et édition locale sont en place. Vous pouvez maintenant exécuter et valider le projet dans une sandbox Cargo encadrée.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => resetActiveFile()}
                  disabled={!activeFile || filesByPath[activeFile.path] === initialFiles[activeFile.path]}
                >
                  Réinitialiser le fichier
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={resetWorkspace}>
                  Réinitialiser le projet
                </Button>
              </div>
            </div>
          </div>

          <div className="grid min-h-[760px] gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="border-b border-border bg-panelAlt/40 lg:border-b-0 lg:border-r">
              <div className="px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Fichiers</p>
              </div>
              <div className="space-y-1 px-2 pb-3">
                {project.projectConfig.files.map((file) => {
                  const isActive = file.path === activePath;
                  const isDirty = filesByPath[file.path] !== initialFiles[file.path];
                  const editable = isEditable(project, file.path);

                  return (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => openFile(file.path)}
                      className={[
                        "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-accent/12 text-foreground"
                          : "text-muted hover:bg-white/5 hover:text-foreground",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{file.path}</p>
                        <p className="mt-1 text-xs text-muted">{editable ? "modifiable" : "lecture seule"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDirty ? <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-label="modifié" /> : null}
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${editable ? "bg-emerald-500/15 text-emerald-200" : "bg-slate-500/15 text-slate-300"}`.trim()}
                        >
                          {editable ? "edit" : "ref"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex min-h-[64px] flex-wrap gap-2 border-b border-border bg-slate-950/35 px-4 py-3">
                {openPaths.map((path) => {
                  const file = project.projectConfig.files.find((entry) => entry.path === path);
                  const isActive = path === activePath;
                  const isDirty = filesByPath[path] !== initialFiles[path];

                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => setActivePath(path)}
                      className={[
                        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "border-accent bg-accent/12 text-foreground"
                          : "border-border bg-panelAlt text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <span className="truncate">{path.split("/").at(-1)}</span>
                      {isDirty ? <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>

              {activeFile ? (
                <div className="flex-1 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <Badge>{activeFile.readonly ? "Lecture seule" : "Modifiable"}</Badge>
                    {activeFile.description ? <p className="text-sm text-muted">{activeFile.description}</p> : null}
                  </div>

                  {isEditable(project, activeFile.path) ? (
                    <textarea
                      aria-label={`Édition du fichier ${activeFile.path}`}
                      value={filesByPath[activeFile.path] ?? ""}
                      placeholder={getProjectFilePlaceholder(project, activeFile)}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFilesByPath((current) => ({
                          ...current,
                          [activeFile.path]: value,
                        }));
                      }}
                      spellCheck={false}
                      className="min-h-[620px] w-full rounded-3xl border border-border bg-slate-950/80 p-5 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    />
                  ) : (
                    <pre className="min-h-[620px] overflow-x-auto rounded-3xl border border-border bg-slate-950/80 p-5 font-mono text-sm leading-7 text-slate-100">
                      <code>{filesByPath[activeFile.path] ?? ""}</code>
                    </pre>
                  )}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted">
                  Aucun fichier disponible dans ce projet.
                </div>
              )}
            </div>
          </div>
        </Card>

        <ProjectRunPanel
          isRunning={isRunning}
          isValidating={isValidating}
          project={project}
          runResult={runResult}
          stdin={stdin}
          validationResult={validationResult}
          onRun={runProject}
          onStdinChange={setStdin}
          onValidate={validateProject}
        />
      </div>
    </div>
  );

  function openFile(path: string) {
    setActivePath(path);
    setOpenPaths((current) => (current.includes(path) ? current : [...current, path]));
  }

  function resetActiveFile() {
    if (!activeFile) {
      return;
    }

    setFilesByPath((current) => ({
      ...current,
      [activeFile.path]: initialFiles[activeFile.path] ?? "",
    }));
  }

  function resetWorkspace() {
    setFilesByPath(initialFiles);
    setActivePath(project.projectConfig.entryFile);
    setOpenPaths([project.projectConfig.entryFile]);
    setStdin(project.projectConfig.validationScenarios[0]?.stdin ?? "");
    setRunResult(null);
    setValidationResult(null);
    setActionError(null);
  }

  async function runProject() {
    try {
      setIsRunning(true);
      setActionError(null);
      setValidationResult(null);

      const payload: ExecuteProjectRequest = {
        projectId: project.id,
        files: getEditedFiles(),
        stdin,
        anonymousSessionId: getAnonymousSessionId(),
      };

      const response = await fetch("/api/projects/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ProjectExecutionResult | { error: string };

      if (!response.ok || "error" in data) {
        setActionError("Impossible d’exécuter le projet dans la sandbox.");
        return;
      }

      setRunResult(data);
    } catch {
      setActionError("Impossible d’exécuter le projet dans la sandbox.");
    } finally {
      setIsRunning(false);
    }
  }

  async function validateProject() {
    try {
      setIsValidating(true);
      setActionError(null);

      const payload: ExecuteProjectRequest = {
        projectId: project.id,
        files: getEditedFiles(),
        anonymousSessionId: getAnonymousSessionId(),
      };

      const response = await fetch("/api/projects/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ProjectValidationResult | { error: string };

      if (!response.ok || "error" in data) {
        setActionError("Impossible de valider le projet pour le moment.");
        return;
      }

      setValidationResult(data);
      if (data.passed && data.completion) {
        router.refresh();
      }
    } catch {
      setActionError("Impossible de valider le projet pour le moment.");
    } finally {
      setIsValidating(false);
    }
  }

  function getEditedFiles() {
    return getEditedProjectFiles(project, filesByPath);
  }
}

type ProjectBriefProps = {
  project: ProjectContent;
};

function ProjectBrief({ project }: ProjectBriefProps) {
  return (
    <Card className="space-y-6 p-5 md:p-6">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Vue d’ensemble</p>
        <p className="text-sm leading-7 text-muted">{project.overview}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Objectifs</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {project.goals.map((goal) => (
              <li key={goal} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {goal}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Critères d’acceptation</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {project.acceptanceCriteria.map((criterion) => (
              <li key={criterion} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {criterion}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

type ProjectRunPanelProps = {
  project: ProjectContent;
  stdin: string;
  onStdinChange: (value: string) => void;
  onRun: () => Promise<void>;
  onValidate: () => Promise<void>;
  runResult: ProjectExecutionResult | null;
  validationResult: ProjectValidationResult | null;
  isRunning: boolean;
  isValidating: boolean;
};

function ProjectRunPanel({
  project,
  stdin,
  onStdinChange,
  onRun,
  onValidate,
  runResult,
  validationResult,
  isRunning,
  isValidating,
}: ProjectRunPanelProps) {
  return (
    <Card className="space-y-5 p-5 md:p-6">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Exécution projet</p>
        <p className="text-sm leading-7 text-muted">
          Le projet s’exécute maintenant dans une sandbox Cargo. Vous pouvez tester une entrée libre puis lancer la validation complète sur les scénarios fournis.
        </p>
      </section>

      <div className="space-y-3 rounded-3xl border border-border bg-panelAlt/70 p-4">
        <MetaRow label="Commande cible" value={project.projectConfig.runCommand} />
        <MetaRow label="Commande de test" value={project.projectConfig.testCommand ?? "Non définie"} />
        <MetaRow label="Scénarios" value={`${project.projectConfig.validationScenarios.length}`} />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground" htmlFor="project-stdin">
          Entrée d’exécution
        </label>
        <textarea
          id="project-stdin"
          value={stdin}
          onChange={(event) => onStdinChange(event.target.value)}
          spellCheck={false}
          className="min-h-[140px] w-full rounded-2xl border border-border bg-slate-950/70 p-4 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={onRun} disabled={isRunning || isValidating}>
          {isRunning ? "Exécution en cours..." : "Exécuter le projet"}
        </Button>
        <Button type="button" variant="secondary" onClick={onValidate} disabled={isRunning || isValidating}>
          {isValidating ? "Validation en cours..." : "Valider le projet"}
        </Button>
      </div>

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Scénarios de validation</p>
        <ul className="space-y-2 text-sm leading-7 text-muted">
          {project.projectConfig.validationScenarios.map((scenario) => (
            <li key={scenario.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-medium text-foreground">{scenario.title}</p>
              <p className="mt-1 text-sm text-muted">{scenario.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {runResult ? <RunResultPanel result={runResult} /> : null}
      {validationResult ? <ValidationResultPanel result={validationResult} /> : null}
    </Card>
  );
}

type MetaRowProps = {
  label: string;
  value: string;
};

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted">{label}</span>
      <code className="rounded-xl bg-slate-950/70 px-3 py-1 text-right text-slate-100">{value}</code>
    </div>
  );
}

function RunResultPanel({ result }: { result: ProjectExecutionResult }) {
  const tone = result.passed ? "success" : result.status === "sandbox_error" ? "danger" : "info";

  return (
    <div className="space-y-3">
      <Alert tone={tone}>
        {result.passed
          ? `Exécution réussie en ${result.durationMs} ms.`
          : `Exécution terminée avec le statut ${result.status}.`}
      </Alert>
      <OutputBlock label="stdout" value={result.stdout || "(vide)"} />
      <OutputBlock label="stderr" value={result.stderr || "(vide)"} />
    </div>
  );
}

function ValidationResultPanel({ result }: { result: ProjectValidationResult }) {
  const completionMessage = result.passed
    ? result.completionError
      ? "Le projet est valide, mais la progression n'a pas encore pu être enregistrée."
      : result.completion
        ? result.completion.xpGranted
          ? `Progression enregistrée. +${result.completion.xpAward} XP${result.completion.leveledUp ? " et nouveau palier du crabe atteint." : "."}`
          : "Projet déjà enregistré. La progression reste cohérente."
        : "Projet validé. Connectez-vous pour enregistrer cette réussite dans votre progression."
    : null;

  return (
    <div className="space-y-3">
      <Alert tone={result.passed ? "success" : "danger"}>
        {result.passed
          ? `Projet validé. ${result.caseResults.length} scénario(x) réussis en ${result.durationMs} ms.`
          : "Validation incomplète. Corrigez le scénario en échec puis relancez la validation."}
      </Alert>
      {completionMessage ? (
        <Alert tone={result.completionError ? "danger" : "info"}>{completionMessage}</Alert>
      ) : null}
      <div className="space-y-3">
        {result.caseResults.map((caseResult) => (
          <div key={caseResult.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{caseResult.title}</p>
                <p className="mt-1 text-sm text-muted">{caseResult.description}</p>
              </div>
              <Badge className={caseResult.passed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-rose-500/30 bg-rose-500/10 text-rose-100"}>
                {caseResult.passed ? "Réussi" : caseResult.status}
              </Badge>
            </div>
            {!caseResult.passed ? (
              <div className="mt-3 space-y-3">
                <OutputBlock label="stdout obtenu" value={caseResult.stdout || "(vide)"} />
                {caseResult.expectedOutput ? <OutputBlock label="attendu" value={caseResult.expectedOutput} /> : null}
                {caseResult.stderr ? <OutputBlock label="stderr" value={caseResult.stderr} /> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function OutputBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-slate-100">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function isEditable(project: ProjectContent, path: string) {
  return isEditableProjectFile(project, path);
}
