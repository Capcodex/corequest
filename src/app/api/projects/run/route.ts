import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { getProjectById } from "@/lib/content/getProjects";
import { buildProjectWorkspace } from "@/lib/projects/buildProjectWorkspace";
import { executeRustProject } from "@/lib/sandbox/executeRustProject";
import { ExecuteProjectRequest, ProjectExecutionResult } from "@/types/projectExecution";

const MAX_STDIN_LENGTH = 8_000;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ExecuteProjectRequest;

    if (!payload.projectId) {
      return NextResponse.json({ error: "Le projet est requis." }, { status: 400 });
    }

    if ((payload.stdin ?? "").length > MAX_STDIN_LENGTH) {
      return NextResponse.json({ error: "L’entrée standard du projet est trop longue." }, { status: 400 });
    }

    const project = getProjectById(payload.projectId);

    if (!project) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const files = buildProjectWorkspace(project, payload.files ?? []);

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "project_run_started",
      properties: {
        projectId: project.id,
        fileCount: files.length,
        hasStdin: Boolean(payload.stdin),
      },
    });

    const sandboxResult = await executeRustProject({
      files,
      runCommand: project.projectConfig.runCommand,
      stdin: payload.stdin ?? null,
    });

    const result: ProjectExecutionResult = {
      ...sandboxResult,
      passed: sandboxResult.status === "success",
    };

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "project_run_completed",
      properties: {
        projectId: project.id,
        status: result.status,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Impossible d’exécuter le projet.",
      },
      { status: 400 },
    );
  }
}