import { describe, expect, it } from "vitest";
import { getProjectById } from "../src/lib/content/getProjects";
import {
  getEditedProjectFiles,
  getInitialProjectFiles,
  getProjectFilePlaceholder,
} from "../src/lib/projects/projectWorkspaceDraft";

describe("projectWorkspaceDraft", () => {
  it("keeps readonly reference files filled and starts editable files empty", () => {
    const project = getProjectById("project-level-1-core-console");

    if (!project) {
      throw new Error("Missing pilot project");
    }

    const initialFiles = getInitialProjectFiles(project);

    expect(initialFiles["Cargo.toml"]).toContain("[package]");
    expect(initialFiles["src/messages.rs"]).toContain("pub const ALERT_PREFIX");
    expect(initialFiles["src/main.rs"]).toBe("");
    expect(initialFiles["src/status.rs"]).toBe("");
  });

  it("submits every editable file, even when it is still blank", () => {
    const project = getProjectById("project-level-1-core-console");

    if (!project) {
      throw new Error("Missing pilot project");
    }

    const initialFiles = getInitialProjectFiles(project);
    const editedFiles = getEditedProjectFiles(project, {
      ...initialFiles,
      "src/status.rs": "pub fn build_status_line() -> String { String::new() }",
    });

    expect(editedFiles).toEqual([
      { path: "src/main.rs", content: "" },
      {
        path: "src/status.rs",
        content: "pub fn build_status_line() -> String { String::new() }",
      },
    ]);
  });

  it("uses a non-submitted placeholder as a lightweight hint for editable files", () => {
    const project = getProjectById("project-level-1-core-console");

    if (!project) {
      throw new Error("Missing pilot project");
    }

    const editableFile = project.projectConfig.files.find((file) => file.path === "src/status.rs");
    const readonlyFile = project.projectConfig.files.find((file) => file.path === "Cargo.toml");

    if (!editableFile || !readonlyFile) {
      throw new Error("Missing project files");
    }

    const editablePlaceholder = getProjectFilePlaceholder(project, editableFile);
    const mainFile = project.projectConfig.files.find((file) => file.path === "src/main.rs");

    if (!mainFile) {
      throw new Error("Missing main file");
    }

    const mainPlaceholder = getProjectFilePlaceholder(project, mainFile);

    expect(editablePlaceholder).toContain("Fichier à compléter : src/status.rs");
    expect(editablePlaceholder).toContain("Rôle attendu : Logique métier");
    expect(editablePlaceholder).toContain("Ce fichier doit :");
    expect(editablePlaceholder).toContain("pub fn build_status_line(mode: &str, energy: i32) -> String");
    expect(mainPlaceholder).toContain("Exemple d’entrée");
    expect(mainPlaceholder).toContain("normal");
    expect(mainPlaceholder).toContain("42");
    expect(mainPlaceholder).toContain("STATUT | mode=normal | énergie=42");
    expect(getProjectFilePlaceholder(project, readonlyFile)).toBe("");
  });
});
