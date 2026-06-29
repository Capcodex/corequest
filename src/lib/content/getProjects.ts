import { rustPilotProjects } from "@/data/rust-foundations/projects";
import { ProjectContent } from "@/types/content";

export function getProjectEntries(): ProjectContent[] {
  return [...rustPilotProjects].sort((left, right) => left.orderIndex - right.orderIndex);
}

export function getProjectById(projectId: string): ProjectContent | null {
  return getProjectEntries().find((project) => project.id === projectId) ?? null;
}