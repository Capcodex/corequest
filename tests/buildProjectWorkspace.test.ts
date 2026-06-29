import { describe, expect, it } from "vitest";
import { getProjectById } from "../src/lib/content/getProjects";
import { buildProjectWorkspace } from "../src/lib/projects/buildProjectWorkspace";

describe("buildProjectWorkspace", () => {
  it("merges editable files over the canonical project", () => {
    const project = getProjectById("project-level-1-core-console");

    if (!project) {
      throw new Error("Missing pilot project");
    }

    const files = buildProjectWorkspace(project, [
      {
        path: "src/status.rs",
        content: "pub fn build_status_line(mode: &str, energy: i32) -> String { format!(\"STATUT | mode={} | énergie={}\", mode, energy) }",
      },
    ]);

    expect(files.find((file) => file.path === "src/status.rs")?.content).toContain("STATUT | mode=");
    expect(files.find((file) => file.path === "src/messages.rs")?.readonly).toBe(true);
  });

  it("rejects edits to readonly files", () => {
    const project = getProjectById("project-level-1-core-console");

    if (!project) {
      throw new Error("Missing pilot project");
    }

    expect(() =>
      buildProjectWorkspace(project, [
        {
          path: "Cargo.toml",
          content: "[package]",
        },
      ]),
    ).toThrow(/ne peut pas être modifié/i);
  });
});