import { describe, expect, it } from "vitest";
import { getProjectById, getProjectEntries } from "../src/lib/content/getProjects";

describe("project catalog", () => {
  it("exposes the six synthesis projects", () => {
    const projects = getProjectEntries();

    expect(projects).toHaveLength(6);
    expect(projects[0]?.id).toBe("project-level-1-core-console");
    expect(projects[1]?.id).toBe("project-level-1-watchtower-briefing");
    expect(projects[2]?.id).toBe("project-level-2-signal-lab");
    expect(projects[3]?.id).toBe("project-level-4-map-explorer");
    expect(projects[4]?.id).toBe("project-level-5-optimizer-engine");
    expect(projects[5]?.id).toBe("project-level-6-advanced-solver");
  });

  it("provides a stable projectConfig contract for the level 1 pilot", () => {
    const project = getProjectById("project-level-1-core-console");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/main.rs", "src/status.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("Cargo.toml");
    expect(project?.projectConfig.files).toHaveLength(5);
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
  });

  it("provides a stable projectConfig contract for the level 2 project", () => {
    const project = getProjectById("project-level-2-signal-lab");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/parser.rs", "src/analysis.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("README.md");
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
    expect(project?.projectConfig.files).toHaveLength(6);
  });

  it("provides a stable projectConfig contract for the level 4 project", () => {
    const project = getProjectById("project-level-4-map-explorer");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/parser.rs", "src/search.rs", "src/grid.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("README.md");
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
    expect(project?.projectConfig.files).toHaveLength(7);
  });

  it("provides a stable projectConfig contract for the level 5 project", () => {
    const project = getProjectById("project-level-5-optimizer-engine");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/parser.rs", "src/optimizer.rs", "src/report.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("README.md");
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
    expect(project?.projectConfig.files).toHaveLength(7);
  });

  it("provides a stable projectConfig contract for the level 6 project", () => {
    const project = getProjectById("project-level-6-advanced-solver");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/parser.rs", "src/pathfinder.rs", "src/report.rs", "src/grid.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("README.md");
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
    expect(project?.projectConfig.files).toHaveLength(8);
  });

  it("provides a stable projectConfig contract for the second level 1 pilot", () => {
    const project = getProjectById("project-level-1-watchtower-briefing");

    expect(project?.projectConfig.entryFile).toBe("src/main.rs");
    expect(project?.projectConfig.editableFiles).toEqual(["src/parser.rs", "src/analysis.rs", "src/report.rs"]);
    expect(project?.projectConfig.readonlyFiles).toContain("README.md");
    expect(project?.projectConfig.validationScenarios).toHaveLength(2);
    expect(project?.projectConfig.files).toHaveLength(7);
  });
});
