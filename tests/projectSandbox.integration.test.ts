import { describe, expect, it } from "vitest";
import { getProjectById } from "../src/lib/content/getProjects";
import { buildProjectWorkspace } from "../src/lib/projects/buildProjectWorkspace";
import type { SandboxProjectExecutionResult } from "../src/types/projectExecution";

const sandboxUrl = process.env.SANDBOX_TEST_URL_PROJECT ?? "http://sandbox-service:4000/execute-project";

describe("project sandbox integration", () => {
  it(
    "runs a multi-file Cargo project",
    async () => {
      const project = getProjectById("project-level-1-core-console");

      if (!project) {
        throw new Error("Missing pilot project");
      }

      const files = buildProjectWorkspace(project, [
        {
          path: "src/status.rs",
          content:
            'use crate::messages::{ALERT_PREFIX, STATUS_PREFIX};\n\npub fn build_status_line(mode: &str, energy: i32) -> String {\n    let prefix = if mode == "alerte" { ALERT_PREFIX } else { STATUS_PREFIX };\n    format!("{} | mode={} | énergie={}", prefix, mode, energy)\n}\n',
        },
      ]);

      const response = await fetch(sandboxUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files,
          runCommand: project.projectConfig.runCommand,
          stdin: "normal\n42\n",
        }),
      });

      const result = (await response.json()) as SandboxProjectExecutionResult;

      expect(response.ok).toBe(true);
      expect(result.status).toBe("success");
      expect(result.stdout.trim()).toBe("STATUT | mode=normal | énergie=42");
    },
    15_000,
  );
});
