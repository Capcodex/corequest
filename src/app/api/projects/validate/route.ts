import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getProjectById } from "@/lib/content/getProjects";
import { validateExerciseResult } from "@/lib/levels/levelValidation";
import { completeProject } from "@/lib/progress/completeProject";
import { buildProjectWorkspace } from "@/lib/projects/buildProjectWorkspace";
import { executeRustProject } from "@/lib/sandbox/executeRustProject";
import { ExecuteProjectRequest, ProjectValidationCaseResult, ProjectValidationResult } from "@/types/projectExecution";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ExecuteProjectRequest;

    if (!payload.projectId) {
      return NextResponse.json({ error: "Le projet est requis." }, { status: 400 });
    }

    const project = getProjectById(payload.projectId);

    if (!project) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const files = buildProjectWorkspace(project, payload.files ?? []);
    const caseResults: ProjectValidationCaseResult[] = [];
    const startedAt = Date.now();

    for (const scenario of project.projectConfig.validationScenarios) {
      const sandboxResult = await executeRustProject({
        files,
        runCommand: project.projectConfig.runCommand,
        stdin: scenario.stdin ?? null,
      });

      const validationResult =
        sandboxResult.status === "success"
          ? validateExerciseResult(sandboxResult.stdout, scenario.validation)
          : { passed: false, expectedOutput: undefined };

      const status =
        sandboxResult.status === "success" && !validationResult.passed
          ? "wrong_output"
          : sandboxResult.status;

      caseResults.push({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        status,
        passed: status === "success",
        stdout: sandboxResult.stdout,
        stderr: sandboxResult.stderr,
        durationMs: sandboxResult.durationMs,
        expectedOutput: validationResult.expectedOutput,
      });
    }

    const failedCase = caseResults.find((caseResult) => !caseResult.passed) ?? null;
    const result: ProjectValidationResult = {
      status: failedCase?.status ?? "success",
      passed: failedCase === null,
      durationMs: Date.now() - startedAt,
      caseResults,
      completion: null,
      completionError: null,
    };

    if (result.passed) {
      const user = await getCurrentUser();

      if (user) {
        try {
          result.completion = await completeProject(user.id, project.id);
        } catch (error) {
          result.completionError =
            error instanceof Error ? error.message : "Impossible d'enregistrer la progression projet.";
        }
      }
    }

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "project_validation_completed",
      properties: {
        projectId: project.id,
        status: result.status,
        passed: result.passed,
        xpGranted: result.completion?.xpGranted ?? false,
        completionSaved: result.completionError === null && result.completion !== null,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Impossible de valider le projet.",
      },
      { status: 400 },
    );
  }
}
